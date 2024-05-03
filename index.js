const ytdl = require('ytdl-core');
const playlistInfo = require('youtube-playlist-info');
const fs = require('fs/promises')

async function downloadVideo(videoUrl, outputDirectory) {
    // Video information
    const videoInfo = await ytdl.getInfo(videoUrl);
    console.log(videoInfo)
    const videoTitle = videoInfo.videoDetails.title;
    const outputFilePath = `${outputDirectory}/${videoTitle.replace(/\//g, '-')}.mp3`;


    const video = ytdl(videoUrl, { filter: 'audioonly' });
    console.log(video)
    try{
        const file = await fs.open(outputFilePath, 'w');
        video.pipe(file);
    } catch(error) {
        console.log(error)
    }
    return new Promise((resolve, reject) => {
        video.on('end', () => {
            console.log('Downloaded:');
            file.close()
            resolve();
        });
        video.on('error', reject);
    });
}

const videoUrl = "https://www.youtube.com/watch?v=I_818q1nMp8&ab_channel=NoTeVaGustar"
const outputDirectory = "./youtube"

downloadVideo(videoUrl, outputDirectory)
