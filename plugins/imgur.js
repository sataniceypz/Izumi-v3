const { izumi, mode, uploadToImageKit } = require("../lib/");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const util = require("util");
izumi({
    pattern: 'url ?(.*)',
    fromMe: mode,
    desc: 'Upload files to ImageKit (images) or Telegraph (videos)',
    type: 'generator'
}, async (m, text) => {
    if (!m.quoted) return m.reply("Reply to an image/video message");
    try {
        let media;
        if (m.quoted.image) {
            // Handle image upload to ImageKit
            media = await m.quoted.download("buffer");
            const uploadResponse = await uploadToImageKit(media, 'image');
            if (uploadResponse && uploadResponse.url) {
                await m.reply(uploadResponse.url);
            } else {
                await m.reply("Failed to upload image.");
            }
        } else if (m.quoted.video) {
            // Handle video upload to Telegraph
            media = await m.quoted.download("buffer");
            const filePath = 'video.mp4'; // Temporary file path for video
            fs.writeFileSync(filePath, media); // Save the buffer as a file
            const url = await TelegraphUpload(filePath);
            if (url) {
                await m.reply(`${util.format(url)}`);
            } else {
                await m.reply("Failed to upload video.");
            }
            fs.unlinkSync(filePath); // Clean up
        } else if (m.quoted.audio) {
            // Handle audio file upload (assuming you want to handle it similarly)
            media = await m.quoted.download("buffer");
            const uploadResponse = await uploadToImageKit(media, 'audio');
            if (uploadResponse && uploadResponse.url) {
                await m.reply(uploadResponse.url);
            } else {
                await m.reply("Failed to upload audio.");
            }
        } else {
            return m.reply("_Reply to a video/image/audio!_");
        }
    } catch (error) {
        console.log('Error:', error);
        await m.reply(`Error: ${error.message}`);
    }
});
async function TelegraphUpload(file) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", fs.createReadStream(file));
        axios({
            url: "https://telegra.ph/upload",
            method: "POST",
            headers: { ...formData.getHeaders() },
            data: formData
        }).then(response => {
            resolve(`https://telegra.ph${response.data[0].src}`);
        }).catch(err => {
            reject(new Error(String(err)));
        });
    });
}
