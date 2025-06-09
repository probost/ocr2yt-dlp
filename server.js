const express = require('express');
const youtubedl = require('yt-dlp-exec');
const ytsr = require('yt-search');
const fs = require('fs');
const path = require('path');
const app = express();
var filepath = '';

app.use(express.json());
app.use(express.static('.'));
// /download is the route that frontend has to fetch
app.post('/download', async (req, res) => {
  const query = req.body.query;
  try {
    // 1. Search for video on YouTube
    const searchResult = await ytsr(query);
    const video = searchResult.videos[0];
    if (!video) return res.status(404).send('No video found');
    // 2. Set up file path for temporary MP3 file
    filepath = path.join(__dirname, `tmp-${Date.now()}.mp3`);
    // 3. Download and extract audio
    const result = await youtubedl(video.url, {
      output: filepath,
      extractAudio: true,
      audioFormat: 'mp3',
      audioQuality: 0,
      verbose: true,
    });
    console.log('Result:', result);
    //encode title
    const { title } = searchResult.videos[0]; // get real video title
    const safeTitle = title.replace(/[\/\\:*?"<>|]/g, '_'); // for filesystem
    const encodedTitle = encodeURIComponent(safeTitle); // for HTTP heade
    // 4. Set response headers
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedTitle}.mp3`);
    res.setHeader('Content-Type', 'audio/mpeg');
    // 5. Stream file for download
    const readStream = fs.createReadStream(filepath);
    readStream.pipe(res);
    // 6. delete after stream finished
    readStream.on('close', () => {
      fs.unlink(filepath, (err) => {
        if (err) console.error('File cleanup failed:', err);
        else console.log('File deleted:', filepath);
      });
    });
    res.on('close', () => {
      if (!res.writableEnded) {
        readStream.destroy();
        fs.unlink(filepath, () => { });
      }
    });

  } catch (err) {
    console.error(err);

    // 🧹 Clean up partial/broken file if it exists
    if (filepath && fs.existsSync(filepath)) {
      fs.unlink(filepath, (unlinkErr) => {
        if (unlinkErr) console.error('Cleanup after failure failed:', unlinkErr);
        else console.log('File deleted after failed download:', filepath);
      });
    }

    res.status(500).send(err.stderr || 'Download error');

  }


});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
