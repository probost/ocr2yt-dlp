🎵 YouTube to MP3 Converter

This project is a simple full-stack app that allows users to search for a YouTube video, convert it to MP3 using yt-dlp, and download the audio file through a user-friendly interface.

Made mainly for myself to host at home to educate myself on how this works.
🧩 Features

⚙️ Backend (server.js)

    Search: Uses yt-search to fetch the top video result for a query

    Download: Uses yt-dlp to download and convert the video to MP3

    Streaming: Streams the generated MP3 file directly to the user

    Headers: Sets appropriate Content-Type and Content-Disposition with encoded and sanitized filenames

    Cleanup: Deletes the temporary MP3 file after the stream ends or if the client disconnects


💿 Requirements
    apt packages: nodejs, yt-dlp, ffmpeg
    
    NPM packages: express, yt-dlp-exec, yt-search

Install with:

apt install nodejs yt-dlp ffmpeg

npm update

npm install express yt-dlp-exec yt-search

Run the App:

node server.js

Then open http://localhost:3000 in your browser.
