🎵 YouTube to MP3 Converter

This project is a simple full-stack app that allows users to search for a YouTube video, convert it to MP3 using yt-dlp, and download the audio file through a user-friendly interface.

Made mainly for myself to host at home to educate myself on how this works.
🧩 Features
🔗 Frontend (Client-Side)

    Accepts YouTube URLs or search queries

    Supports format switching (MP3/MP4 toggle)

    Extracts and displays video titles

    Shows conversion progress: extracting, loading, converting

    Handles errors (e.g., long videos, blacklisted, unsupported formats)

    Offers fallback app suggestions for unsupported devices

    Optionally triggered via window.location.hash for direct links

⚙️ Backend (server.js)

    Search: Uses yt-search to fetch the top video result for a query

    Download: Uses yt-dlp to download and convert the video to MP3

    Streaming: Streams the generated MP3 file directly to the user

    Headers: Sets appropriate Content-Type and Content-Disposition with encoded and sanitized filenames

    Cleanup: Deletes the temporary MP3 file after the stream ends or if the client disconnects

📁 server.js Overview
```js
const express = require('express');
const youtubedl = require('yt-dlp-exec');
const ytsr = require('yt-search');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('.'));

app.post('/download', async (req, res) => {
  const query = req.body.query;
  try {
    const searchResult = await ytsr(query);
    const video = searchResult.videos[0];
    if (!video) return res.status(404).send('No video found');

    const filepath = path.join(__dirname, `tmp-${Date.now()}.mp3`);
    await youtubedl(video.url, {
      output: filepath,
      extractAudio: true,
      audioFormat: 'mp3',
      audioQuality: 0,
    });

    const { title } = video;
    const safeTitle = title.replace(/[\/\\:*?"<>|]/g, '_');
    const encodedTitle = encodeURIComponent(safeTitle);

    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedTitle}.mp3`);
    res.setHeader('Content-Type', 'audio/mpeg');

    const readStream = fs.createReadStream(filepath);
    readStream.pipe(res);

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
    res.status(500).send(err.stderr || 'Download error');
  }
});
```
app.listen(3000, () => console.log('Server running on http://localhost:3000'));

💿 Requirements

    Node.js

    yt-dlp (should be installed and accessible in your system's PATH)

    NPM packages: express, yt-dlp-exec, yt-search

Install with:

npm install express yt-dlp-exec yt-search

🚀 Run the App

node server.js

Then open http://localhost:3000 in your browser.
