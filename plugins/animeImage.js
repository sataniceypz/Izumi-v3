const { izumi, mode, getJson } = require("../lib");
const config = require("../config");
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
