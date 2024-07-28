const { izumi, mode,uploadToImageKit } = require("../lib/");
izumi({
    pattern: 'url ?(.*)',
    fromMe: mode,
    desc: 'upload files to imagekit.io',
    type: 'generator'
}, async (m, text) => {
    if (!m.quoted) return m.reply("Reply to an image/audio/video message");

    try {
        let media;
        if (m.quoted.image) {
            media = await m.quoted.download("buffer");
            const uploadResponse = await uploadToImageKit(media, 'image');
            if (uploadResponse && uploadResponse.url) {
                await m.reply(uploadResponse.url);
            } else {
                await m.reply("Failed to upload image.");
            }
        } else if (m.quoted.video) {
            media = await m.quoted.download("buffer");
            const uploadResponse = await uploadToImageKit(media, 'video');
            if (uploadResponse && uploadResponse.url) {
                await m.reply(uploadResponse.url);
            } else {
                await m.reply("Failed to upload video.");
            }
        } else if (m.quoted.audio) {
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