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
const axios = require('axios');
const config = require('../config');
const yts = require("yt-search");
izumi({
    pattern: 'song ?(.*)',
    fromMe: mode,
    desc: 'Search and download audio from YouTube.',
    type: 'info'
}, async (message, match, client) => {
    if (!match) {
        return await message.reply('Please provide a search query.');
    }

    const query = match;
    try {
        const { videos } = await yts(query);
        if (videos.length === 0) {
            return await message.reply('No results found.');
        }

        const firstVideo = videos[0];
        const videoUrl = firstVideo.url;

        const response = await axios.get(`https://api.eypz.c0m.in/ytdl?url=${videoUrl}`);
        const { download_links, title } = response.data;
        const mp4 = download_links.mp4;
        await message.reply(`_Downloading ${title}_`);
        await message.client.sendMessage(
            message.jid,
            { audio: { url: mp4 }, mimetype: 'audio/mpeg', fileName: `${title}.mp3` },
            { quoted: message.data }
        );
    } catch (error) {
        console.error('Error fetching audio:', error);
        await message.reply('Failed to download audio. Please try again later.');
    }
});
izumi({
    pattern: 'video?(.*)',
    fromMe: mode,
    desc: 'Search and download video from YouTube.',
    type: 'info'
}, async (message, match, client) => {
    if (!match) {
        return await message.reply('Please provide a search query.');
    }

    const query = match;
    try {
        const { videos } = await yts(query);
        if (videos.length === 0) {
            return await message.reply('No results found.');
        }

        const firstVideo = videos[0];
        const videoUrl = firstVideo.url;

        const response = await axios.get(`https://api.eypz.c0m.in/ytdl?url=${videoUrl}`);
        const { download_links, title } = response.data;
        const mp4 = download_links.mp4;
        await message.reply(`_Downloading ${title}_`);
        await message.client.sendMessage(
            message.jid,
            { video: { url: mp4 }, mimetype: 'video/mp4', fileName: `${title}.mp4` },
            { quoted: message.data }
        );
    } catch (error) {
        console.error('Error fetching video:', error);
        await message.reply('Failed to download video. Please try again later.');
    }
});
izumi({
    pattern: 'yta ?(.*)',
    fromMe: mode,
    desc: 'Download audio from YouTube.',
    type: 'info'
}, async (message, match, client) => {
    if (!match) {
        return await message.reply('Please provide a YouTube video URL.');
    }

    const videoUrl = match;
    try {
        const response = await axios.get(`https://api.eypz.c0m.in/ytdl?url=${videoUrl}`);
        const { download_links, title } = response.data;
        const mp4 = download_links.mp4;
        await message.reply(`_Downloading ${title}_`);
        await message.client.sendMessage(
            message.jid,
            { audio: { url: mp4 }, mimetype: 'audio/mpeg', fileName: `${title}.mp3` },
            { quoted: message.data }
        );
    } catch (error) {
        console.error('Error fetching audio:', error);
        await message.reply('Failed to download audio. Please try again later.');
    }
});

izumi({
    pattern: 'ytv ?(.*)',
    fromMe: mode,
    desc: 'Download video from YouTube.',
    type: 'info'
}, async (message, match, client) => {
    if (!match) {
        return await message.reply('Please provide a YouTube video URL.');
    }

    const videoUrl = match;
    try {
        const response = await axios.get(`https://api.eypz.c0m.in/ytdl?url=${videoUrl}`);
        const { download_links, title } = response.data;
        const mp4 = download_links.mp4;
        await message.reply(`_Downloading ${title}_`);
        await message.client.sendMessage(
            message.jid,
            { video: { url: mp4 }, mimetype: 'video/mp4', fileName: `${title}.mp4` },
            { quoted: message.data }
        );
    } catch (error) {
        console.error('Error fetching video:', error);
        await message.reply('Failed to download video. Please try again later.');
    }
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
