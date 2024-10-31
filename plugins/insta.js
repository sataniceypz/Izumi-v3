const fetch = require('node-fetch'); 
const { izumi, mode, getJson } = require("../lib");
const axios = require('axios');

izumi({
    pattern: 'insta ?(.*)',
    fromMe: mode,
    desc: 'Download Instagram Reels',
    type: 'info'
}, async (message, match, client) => {
    const url = match;
    const apiUrl = eypzApi + `igdl?url=${encodeURIComponent(url)}`;
    
    try {
        const response = await axios.get(apiUrl);
        if (response.data && response.data.medias && response.data.medias.length > 0) {
            const mediaLimit = Math.min(response.data.medias.length, 10);
            for (let i = 0; i < mediaLimit; i++) {
                await message.sendFile(response.data.medias[i]);
            }
        } else {
            await message.reply('No media found for the provided Instagram URL.');
        }
    } catch (error) {
        console.error('Error fetching Instagram media:', error);
        await message.reply('An error occurred while fetching the media. Please try again later.');
    }
});
