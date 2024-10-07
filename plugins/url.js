const { izumi, mode, blackVideo } = require("../lib/");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

izumi({
    pattern: 'url ?(.*)',
    fromMe: mode,
    desc: 'Upload files to Catbox.moe .',
    type: 'generator'
}, async (m, text) => {
    if (!m.quoted) return m.reply("Please reply to an image, video, or audio message.");

    try {
        let media;

        if (m.quoted.image || m.quoted.video || m.quoted.audio) {
            media = await m.quoted.download("buffer");

            if (m.quoted.audio) {
                
                const audioPath = await m.quoted.download();
                const videoBuffer = await blackVideo(audioPath);

                
                const outputVideoPath = 'temp.mp4';
                fs.writeFileSync(outputVideoPath, videoBuffer);

                
                const formData = new FormData();
                formData.append('reqtype', 'fileupload');
                formData.append('fileToUpload', fs.createReadStream(outputVideoPath), {
                    filename: 'temp.mp4', 
                    contentType: 'video/mp4'
                });

                const response = await axios.post('https://catbox.moe/user/api.php', formData, {
                    headers: formData.getHeaders()
                });

                const fileUrl = response.data.trim();
                await m.reply(fileUrl);

                
                fs.unlinkSync(outputVideoPath);
            } else if (m.quoted.video) {
                
                const formData = new FormData();
                formData.append('reqtype', 'fileupload');
                formData.append('fileToUpload', media, {
                    filename: 'temp.mp4',  
                    contentType: 'video/mp4'  
                });

                const response = await axios.post('https://catbox.moe/user/api.php', formData, {
                    headers: formData.getHeaders()
                });

                const fileUrl = response.data.trim();
                await m.reply(fileUrl);
            } else if (m.quoted.image) {
                
                const formData = new FormData();
                formData.append('reqtype', 'fileupload');
                formData.append('fileToUpload', media, {
                    filename: 'upload.png', 
                    contentType: 'image/png'
                });

                const response = await axios.post('https://catbox.moe/user/api.php', formData, {
                    headers: formData.getHeaders()
                });

                const fileUrl = response.data.trim();
                await m.reply(fileUrl);
            }
        } else {
            return m.reply("Please reply to a valid media file (image, video, or audio).");
        }
    } catch (error) {
        console.error('Error:', error);
        await m.reply(`Error: ${error.message}`);
    }
});
