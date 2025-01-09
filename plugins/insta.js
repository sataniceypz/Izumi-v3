const { izumi, mode } = require("../lib");
const fetch = require("node-fetch");

izumi({
    pattern: 'insta ?(.*)',
    fromMe: mode,
    desc: 'Download Instagram media (images/videos)',
    type: 'download',
}, async (message, match, client) => {
    try {
        const url = match;
        if (!url) {
            return await message.reply("Please provide a valid Instagram URL.");
        }

        const api = `https://api.siputzx.my.id/api/d/igdl?url=${url}`;
        const res = await fetch(api);
        if (!res.ok) {
            return await message.reply("Failed to fetch media. Please try again.");
        }

        const data = await res.json();
        const mediad = data.data;

        if (mediad && mediad.length > 0) {
            let counter = 0;
            for (const media of mediad) {
                if (counter >= 10) break;
                const mediaUrl = media.url;
                await message.sendFile(mediaUrl);
                counter++;
            }
        } else {
            await message.reply("No media found for the provided URL.");
        }
    } catch (error) {
        console.error(error);
        await message.reply("An error occurred while processing the request.");
    }
});
