const {
  izumi,
  mode,
  isUrl,
  AddMp3Meta,
  getBuffer,
  toAudio,
  yta,
 ytv, 
ytsdl,
parsedUrl 
} = require("../lib");
const yts = require('yt-search');
const fg = require('api-dylux');
const config = require('../config');
const patterns = [
  { pattern: "song ?(.*)", desc: "YouTube downloader", type: "downloader" },
  { pattern: "video ?(.*)", desc: "YouTube downloader", type: "downloader" },
  { pattern: "yta ?(.*)", desc: "YouTube downloader", type: "downloader" },
  { pattern: "ytv ?(.*)", desc: "YouTube downloader", type: "downloader" }
];

patterns.forEach(({ pattern, desc, type }) => {
  izumi(
    {
      pattern: pattern,
      fromMe: true,
      desc: desc,
      type: type
    },
    async (message, match) => {
      try {
        const search = await yts(match);
        const data = search.videos[0];

        if (!data) return await message.reply("No results found.");

        const url = data.url;

        if (pattern === "song ?(.*)" || pattern === "yta ?(.*)") {
          let down = await fg.yta(url);
          let downloadUrl = down.dl_url;

          await message.reply(`_Downloading ${data.title}_`);

          await client.sendMessage(message.jid, { audio: { url: downloadUrl }, mimetype: 'audio/mp4' }, { quoted: message.data });
          await client.sendMessage(
            message.jid,
            { document: { url: downloadUrl }, mimetype: 'audio/mpeg', fileName: `${data.title}.mp3`, caption:  `_${data.title}_`},
            { quoted: message.data }
          );
        } else if (pattern === "video ?(.*)" || pattern === "ytv ?(.*)") {
          let videoDown = await fg.ytv(url);
          let videoUrl = videoDown.dl_url;

          await message.reply(`_Downloading ${data.title}_`);

          await client.sendMessage(message.jid, { video: { url: videoUrl }, mimetype: 'video/mp4', fileName: `${data.title}.mp4` }, { quoted: message.data });
        }
      } catch (e) {
        console.log(e);
        await message.reply(`Error: ${e.message}`);
      }
    }
  );
});
