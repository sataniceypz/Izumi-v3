const { izumi, mode, isUrl, getJson, parsedUrl } = require("../lib");

const config = require("../config");

izumi({

    pattern: 'insta ?(.*)',

    fromMe: mode,

    desc: 'Send all media from Instagram URL.',

    type: 'downloader'

}, async (message, match, client) => {

    const instaUrl = match;

    if (!instaUrl) {

        return await message.reply('Please provide an Instagram URL.');

    }

    try {

      

        const mediaUrl = `https://api.eypz.c0m.in/aio?url=${encodeURIComponent(instaUrl)}`;

        const mediaData = await getJson(mediaUrl);

        console.log('Media Data:', mediaData);

        if (!mediaData || !mediaData.medias || mediaData.medias.length === 0) {

            return await message.reply('No media found for the provided URL.');

        }

        for (const media of mediaData.medias) {

            console.log('Sending Media:', media.url);

            await message.sendFromUrl(media.url);

        }

    } catch (error) {

        console.error('Error fetching media:', error);

        await message.reply('An error occurred while fetching media.');

    }

});
