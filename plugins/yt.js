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

izumi(
  {
    pattern: "yts ?(.*)",
    fromMe: mode,
    desc: "Search YouTube videos",
    type: "downloader",
  },
  async (message, match, m) => {
    try {
      match = match || message.reply_message.text;

      if (!match) {
        await message.reply("Please provide a search query to find YouTube videos.\nExample: `.youtube Naruto AMV`");
        return;
      }

      const response = await getJson(eypzApi + `youtube?search=${encodeURIComponent(match)}`);

      if (!response || response.length === 0) {
        await message.reply("Sorry, no YouTube videos found for your search query.");
        return;
      }

      
      const formattedMessage = formatYouTubeMessage(response);

      
      const contextInfoMessage = {
        text: formattedMessage,
        contextInfo: {
          mentionedJid: [message.sender],
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363298577467093@newsletter',
            newsletterName: "Iᴢᴜᴍɪ-ᴠ3",
            serverMessageId: -1
          }
        }
      };

      
      await message.client.sendMessage(message.jid, contextInfoMessage);

    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
      await message.reply("Error fetching YouTube videos. Please try again later.");
    }
  }
);

function formatYouTubeMessage(videos) {
  let message = "*YouTube Search Results:*\n\n";

  videos.forEach((video, index) => {
    message += `${index + 1}. *Title:* ${video.title}\n   *Duration:* ${video.duration}\n   *Link:* ${video.link}\n\n`;
  });

  return message;
}

