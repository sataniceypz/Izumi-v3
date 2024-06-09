const { izumi,mode, getJson } = require("../lib/");
const config = require("../config");
izumi ({
    pattern: "naruto",
    fromMe: mode,
    desc: "random Naruto anime videos",
    type: "AnimeVideo",
}, async (message, match) => {
const { result } = await getJson('https://api.maskser.me/api/anime/naruto?apikey=izumi-v3')
message.sendFromUrl(result.url,{caption: `${config.CAPTION}`})
});

izumi ({
    pattern: "anime",
    fromMe: mode,
    desc: "random  anime videos",
    type: "AnimeVideo",
}, async (message, match) => {
const { result } = await getJson('https://api.maskser.me/api/anime/anivideo?apikey=izumi-v3')
message.sendFromUrl(result.url,{caption: `${config.CAPTION}`})
});
 izumi ({
    pattern: "mstatus",
    fromMe: mode,
    desc: "random Malayalam status videos",
    type: "media",
}, async (message, match) => {
const { result } = await getJson('https://api.maskser.me/api/randomvideo/msts?apikey=izumi-v3')
message.sendFromUrl(result.video,{caption: `${config.CAPTION}`})
});
