const { izumi, mode, getUrl } = require("../lib/");
const config = require("../config");

izumi(
    {
        pattern: "fullss ?(.*)",
        fromMe: mode,
        desc: "capture website screenshot",
        type: "download",
    },
    async (message, match, m) => {
        try {
            match = match || message.reply_message.text;
            if (!match) return await message.reply(`*_Need a link_*\n*eg:- .fullss https://github.com/sataniceypz/Izumi-v3*`);
            let url = await getUrl(match);
            let res = apiUrl + `api/screenshot?url=${url}&type=phone&full=true&apikey=maskser`;
            await message.sendFromUrl(res);
        } catch (error) {
            await message.reply('Failed to capture screenshot.');
        }
    }
);

izumi(
    {
        pattern: "ss ?(.*)",
        fromMe: mode,
        desc: "capture website screenshot",
        type: "downloader",
    },
    async (message, match, m) => {
        try {
            match = match || message.reply_message.text;
            if (!match) return await message.reply(`*_Need a link_*\n*eg:- .ss https://github.com/sataniceypz/Izumi-v3*`);
            let url = await getUrl(match);
            let res = apiUrl + `api/screenshot?url=${url}&type=desktop&full&apikey=maskser`;
            await message.sendFromUrl(res);
        } catch (error) {
            await message.reply('Failed to capture screenshot.');
        }
    }
);