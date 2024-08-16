const { izumi, getJson, getUrl, mode } = require("../lib/");
izumi({
    pattern: 'insta (.*)',
    fromMe: mode,
    desc: 'insta downloader.',
    type: 'downloader'
}, async (message, match, client) => {
    const eypz = await getJson(`https://api.shannmoderz.xyz/downloader/instagram?url=${match}`);
    const file = eypz.result.videoLink;
    await message.sendFile(file, {mimeType: 'application/octet-stream', quoted: message.data});
});
