const { izumi, mode, getJson } = require("../lib");
const config = require("../config");
const { getApiConfig } = require('../lib/api.js');
izumi({
  pattern: "waifu",
  fromMe: mode,
  desc: "Random anime images",
  type: "AnimeImage",
}, async (message, match) => {
  var { url } = await getJson('https://api.waifu.pics/sfw/waifu');
  await message.sendFromUrl(url,{caption: `${config.CAPTION}`});
});
izumi({
  pattern: "tsunade",
  fromMe: mode,
  desc: "Random anime images",
  type: "AnimeImage",
}, async (message, match) => {
  await message.sendFromUrl(eypzApi + 'tsunade',{caption: `${config.CAPTION}`});
});
izumi({
  pattern: "neko",
  fromMe: mode,
  desc: "Random anime images",
  type: "AnimeImage",
}, async (message, match) => {
  var { url } = await getJson('https://api.waifu.pics/sfw/neko');
  await message.sendFromUrl(url,{caption: `${config.CAPTION}`});
});
izumi({
  pattern: "loli",
  fromMe: mode,
  desc: "Random anime images",
  type: "AnimeImage",
}, async (message, match) => {
  var { url } = await getJson('https://api.waifu.pics/sfw/neko');
  await message.sendFromUrl(url,{caption: `${config.CAPTION}`});
});


izumi({
  pattern: "shinobu",
  fromMe: true,
  desc: "Random anime images",
  type: "AnimeImage",
}, async (message, match) => {
  await message.sendFromUrl(apiUrl + 'api/anime/loli?apikey=izumi-v3',{caption: `${config.CAPTION}`});
});
const animeEndpoints = [
    { pattern: 'emilia', endpoint: 'emilia' },
    { pattern: 'hestia', endpoint: 'hestia' },
    { pattern: 'inori', endpoint: 'inori' },
    { pattern: 'ana', endpoint: 'ana' },
    { pattern: 'miku', endpoint: 'miku' },
    { pattern: 'kaori', endpoint: 'kaori' },
    { pattern: 'shizuka', endpoint: 'shizuka' },
    { pattern: 'doraemon', endpoint: 'doraemon' },
    { pattern: 'pokemon', endpoint: 'pokemon' },
    { pattern: 'kaga', endpoint: 'kaga' },
    { pattern: 'koturi', endpoint: 'koturi' },
    { pattern: 'mikasa', endpoint: 'mikasa' },
    { pattern: 'akiyama', endpoint: 'akiyama' },
    { pattern: 'gremory', endpoint: 'gremory' },
    { pattern: 'isuzu', endpoint: 'isuzu' },
    { pattern: 'shina', endpoint: 'shina' },
    { pattern: 'kagura', endpoint: 'kagura' },
    { pattern: 'shinka', endpoint: 'shinka' },
    { pattern: 'tsunade', endpoint: 'tsunade' },
    { pattern: 'sasuke', endpoint: 'sasuke' },
    { pattern: 'sakura', endpoint: 'sakura' },
    { pattern: 'rize', endpoint: 'rize' },
    { pattern: 'one-piece', endpoint: 'one-piece' },
    { pattern: 'nezuko', endpoint: 'nezuko' },
    { pattern: 'boruto', endpoint: 'boruto' },
    { pattern: 'naruto', endpoint: 'naruto' },
    { pattern: 'erza', endpoint: 'erza' },
    { pattern: 'kakasih', endpoint: 'kakasih' },
    { pattern: 'minato', endpoint: 'minato' },
    { pattern: 'elaina', endpoint: 'elaina' },
    { pattern: 'yuri', endpoint: 'yuri' },
    { pattern: 'shota', endpoint: 'shota' },
    { pattern: 'waifu', endpoint: 'waifu' },
    { pattern: 'waifu-2', endpoint: 'waifu-2' },
    { pattern: 'hinata', endpoint: 'hinata' }
];

  
animeEndpoints.forEach(({ pattern, endpoint }) => {
    izumi({
        pattern: pattern,
        fromMe: true,
        desc: `Sends an anime image of ${pattern}`,
        type: 'AnimeImage'
    }, async (message, match, client) => {
        const { baseUrl, apiKey } = getApiConfig();
        const img = `${baseUrl}api/anime/${endpoint}?apikey=${apiKey}`;
        await client.sendMessage(
            message.jid,
            { image: { url: img }, mimetype: 'image/png', fileName: 'eypz.png' },
            { quoted: message.data }
        );
    });
});
