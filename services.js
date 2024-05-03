const ytdl = require('ytdl-core');
const playlistInfo = require('youtube-playlist-info');
const fs = require('fs/promises');
const dotenv = require('dotenv')

dotenv.config()

async function downloadVideo(videoUrl, outputDirectory) {
    try {
        // Video information
        const videoInfo = await ytdl.getInfo(videoUrl);
        const videoTitle = videoInfo.videoDetails.title;
        const sanitizedTitle = videoTitle.replace(/[\/\\:|""]/g, '-');
        const outputFilePath = `${outputDirectory}/${sanitizedTitle.replace(/\//g, '-')}.mp3`;

        // Download video and save to file
        const video = ytdl(videoUrl, { filter: 'audioonly' });
        const fileData = await ytdl.downloadFromInfo(videoInfo, { filter: 'audioonly' });
        await fs.writeFile(outputFilePath, fileData);

        console.log('Downloaded:', outputFilePath);
    } catch (error) {
        console.error('Error downloading video:', error);
        throw error;
    }
}

async function downloadPlaylist(playlistUrl, outputDirectory){
    const playlistId = playlistUrl.split('list=')[1];
    const playlist = await playlistInfo(process.env.API_KEY, playlistId);
    for (const video of playlist) {
        const videoUrl = `https://www.youtube.com/watch?v=${video.resourceId.videoId}`;
        console.log("Downloading: ", videoUrl)
        await downloadVideo(videoUrl, outputDirectory);
    }
}

module.exports = {
    downloadPlaylist,
    downloadVideo
}