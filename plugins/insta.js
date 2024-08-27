const { izumi, mode, getJson } = require("../lib");

izumi({
    pattern: 'insta ?(.*)', 
    fromMe: mode,
    desc: 'Send all media from Instagram URL.',
    type: 'downloader'
}, async (message, match) => {
    
    
    match = match || message.reply_message.text;

   
    if (!match) {
        return await message.reply('Please provide an Instagram URL.');
    }

   
    const instaUrl = match.trim();

    try {
        
        const mediaUrl = `https://api.eypz.c0m.in/aio?url=${encodeURIComponent(instaUrl)}`;
        
        const mediaData = await getJson(mediaUrl);

        
        if (!mediaData || !mediaData.medias || mediaData.medias.length === 0) {
            return await message.reply('No media found for the provided URL.');
        }

        
        for (const media of mediaData.medias) {
            await message.sendFromUrl(media.url);
        }

    } catch (error) {
        console.error('Error fetching media:', error);
        await message.reply('An error occurred while fetching media.');
    }
});
