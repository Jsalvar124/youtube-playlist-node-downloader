const express = require('express')
const dotenv = require('dotenv')
const { downloadPlaylist, downloadVideo } = require('./services');
const path = require('path');

dotenv.config()
const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/download', async (req, res) => {
    const { url, outputFolder } = req.query;
    console.log("url: ", url)
    console.log("output folder: ", outputFolder)


    try {
        if (!url || !outputFolder) {
            throw new Error('URL and output folder are required');
        }

        // Check if it's a playlist URL or a video URL
        if (url.includes('list')) {
            await downloadPlaylist(url, outputFolder);
        } else {
            await downloadVideo(url, outputFolder);
        }
        res.send('Download completed successfully!');
    } catch (error) {
        console.error('Error downloading:', error);
        res.status(500).send('Error downloading: ' + error.message);
    }
});

app.get('/health', (req, res)=> {
    res.json({"message": "Running!"})
})

app.listen(3000, ()=>{
    console.log(`Running on port ${process.env.PORT}`, `http://localhost:${process.env.PORT}`)
})



