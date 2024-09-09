const {
  izumi,
  mode,
  isUrl,
  getJson,
  PREFIX,
  AddMp3Meta,
  getBuffer,
  toAudio,
  yta,
  ytv,
  ytsdl,
  parsedUrl,
  parsedUrl
} = require("../lib");
const yts = require('yt-search');
const fg = require('api-dylux');
const config = require('../config');


function cleanUrl(url) {
  return url.split('?')[0];
}

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
      fromMe: mode,
      desc: desc,
      type: type
    },
    async (message, match) => {
      try {
        
        match = match || message.reply_message.text;

        if (!match) return await message.reply("Please provide a YouTube link or search query.");

        let url = match.trim();
        let title = "";

        
        if (isUrl(url)) {
          url = cleanUrl(url); 

          
          const search = await yts(url);
          const data = search.videos[0];
          if (data) title = data.title;

          await message.reply(`_Downloading ${title || "your video"}..._`);
        } else {
          const search = await yts(match);
          const data = search.videos[0];

          if (!data) return await message.reply("No results found.");

          url = cleanUrl(data.url);
          title = data.title;
          await message.reply(`_Downloading ${title}_`);
        }

        if (pattern === "song ?(.*)" || pattern === "yta ?(.*)") {
          let down = await fg.yta(url);
          let downloadUrl = down.dl_url;

          await message.client.sendMessage(
            message.jid,
            { audio: { url: downloadUrl }, mimetype: 'audio/mp4' },
            { quoted: message.data }
          );
          await message.client.sendMessage(
            message.jid,
            { document: { url: downloadUrl }, mimetype: 'audio/mpeg', fileName: `${down.title}.mp3`, caption: `_${down.title}_` },
            { quoted: message.data }
          );
        } else if (pattern === "video ?(.*)" || pattern === "ytv ?(.*)") {
          let videoDown = await fg.ytv(url);
          let videoUrl = videoDown.dl_url;

          await message.client.sendMessage(
            message.jid,
            { video: { url: videoUrl }, mimetype: 'video/mp4', fileName: `${videoDown.title}.mp4` },
            { quoted: message.data }
          );
        }
      } catch (e) {
        console.log(e);
        await message.reply(`Error: ${e.message}`);
      }
    }
  );
});
