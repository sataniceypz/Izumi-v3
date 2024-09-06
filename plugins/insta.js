const fetch = require('node-fetch'); 
const { izumi, mode, getJson } = require("../lib");

izumi({
    pattern: 'insta ?(.*)',
    fromMe: mode,
    desc: 'Download Instagram Media.',
    type: 'downloader'
}, async (message, match, client) => {
    const insta = match.trim();

    if (!insta) { 
        await message.reply("Where is the URL?");
        return;
    }

    const url = `https://api.eypz.c0m.in/aio?url=${insta}`;
    const myr = await getJson(url);
    const medias = myr.medias;

    if (Array.isArray(medias) && medias.length > 0) {
        for (let fek of medias) {
            await message.sendFile(fek);
        }
    } else {
        await message.reply("No media found or an error occurred.");
    }
});
