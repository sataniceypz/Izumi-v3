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

function cleanUrl(url) {
  return url.split('?')[0];
}

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
          url = url;

          const search = await yts(url);
          const data = search.videos[0];
          if (data) title = data.title;

          await message.reply(`_Downloading ${title || "your video"}..._`);
        } else {
          const search = await yts(match);
          const data = search.videos[0];

          if (!data) return await message.reply("No results found.");

          url = data.url;
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
    pattern: "play ?(.*)",
    fromMe: mode,
    desc: "Download YouTube videos by a query",
    type: "downloader",
  },
  async (message, match) => {
    const query = match;

    if (!query) {
      return await message.reply('Please provide a search query!');
    }

    try {
      const searchResults = await yts(query);

      if (searchResults.all.length === 0) {
        return await message.reply(`No results found for "${query}".`);
      }

      const firstVideo = searchResults.videos[0];
      const videoId = firstVideo.videoId;
      const link = `https://convert-s0ij.onrender.com/convert-thumbnail/${videoId}.png`;

      const url = await message.ParseButtonMedia(link);

      const buttonData = {
        jid: message.jid,
        button: [],
        header: {
          title: "Downloader",
          subtitle: "WhatsApp Bot",
          hasMediaAttachment: true, 
        },
        footer: {
          text: "Choose a download option",
        },
        body: {
          text: `*Top 5 results for "${query}":*`,
        },
      };

      buttonData.header.videoMessage = link.endsWith(".mp4") ? url : undefined;
      buttonData.header.imageMessage = link.endsWith(".png") ? url : undefined;

      for (let i = 0; i < Math.min(searchResults.videos.length, 5); i++) {
        const video = searchResults.videos[i];

        buttonData.button.push(
          {
            type: "reply",
            params: {
              display_text: `mp3- ${video.title}`,
              id: `.yta ${video.url}`,
            },
          },
          {
            type: "reply",
            params: {
              display_text: `mp4- ${video.title}`,
              id: `.ytv ${video.url}`,
            },
          }
        );
      }

      await message.sendMessage(message.jid, buttonData, {}, "interactive");
    } catch (error) {
      console.error(error);
      await message.reply('An error occurred while searching. Please try again later.');
    }
  }
);
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
        await message.reply("Please provide a search query to find YouTube videos.\nExample: `.yts Naruto AMV`");
        return;
      }

      const response = await getJson(eypzApi + `ytdl/search?query=${encodeURIComponent(match)}`);

      if (!response || response.results.length === 0) {
        await message.reply("Sorry, no YouTube videos found for your search query.");
        return;
      }

      const formattedMessage = formatYouTubeMessage(response.results);

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
    message += `${index + 1}. *Title:* ${video.title}\n   *Duration:* ${video.duration}\n   *Link:* ${video.url}\n\n`;
  });

  return message;
}
