const { izumi, mode ,sendMenu, sendSegMenu} = require("../lib/");
izumi({
    pattern: "menu ?(.*)",
    desc: "izumi-v3 user manual",
    fromMe: mode,
    type: "user",
}, async (message, match) => {
    await sendMenu(message, match);
});

const pluginTypes = ['AnimeImage', 'downloader', 'info', 'whatsapp', 'group', 'media', 'AnimeVideo', 'user', 'generator'];

pluginTypes.forEach((type) => {
    izumi({
        pattern: `.${type}$`,
        fromMe: mode,
        dontAddCommandList: true,
    }, async (message, match) => {
        await sendSegMenu(message, match,type);
    });
});