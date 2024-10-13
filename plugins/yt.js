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
const ytSearch = require('yt-search');
const config = require('../config');

const patterns = [
    { pattern: "song ?(.*)", desc: "YouTube audio downloader", type: "downloader" },
    { pattern: "video ?(.*)", desc: "YouTube video downloader", type: "downloader" },
    { pattern: "yta ?(.*)", desc: "YouTube audio downloader", type: "downloader" },
    { pattern: "ytv ?(.*)", desc: "YouTube video downloader", type: "downloader" }
];

const handleDownload = async (message, match, type) => {
    if (!match) return await message.reply('Please provide a YouTube link or search query.');

    let apiUrl;
    if (match.includes('youtube.com') || match.includes('youtu.be')) {
        
        apiUrl = eypzApi + `ytdl?url=${encodeURIComponent(match)}`;
    } else {
       
        try {
            const searchResults = await ytSearch(match);
            if (searchResults.videos.length === 0) {
                return await message.reply('No results found.');
            }
            const firstResult = searchResults.videos[0]; 
            apiUrl = eypzApi + `ytdl?url=${encodeURIComponent(firstResult.url)}`;
            await message.reply(`Found: ${firstResult.title} (${firstResult.timestamp})`);
        } catch (error) {
            return await message.reply('Error occurred while searching for video.');
        }
    }

    try {
        const response = await axios.get(apiUrl);
        const videoInfo = response.data.result;
        const Title = videoInfo.title;
        const Duration = videoInfo.duration;
        const downloadLink = videoInfo.mp4_link;

        if (type === "audio") {
            await message.reply(`Downloading Audio: ${Title} (${Duration})`);
            await client.sendMessage(message.jid, { 
                audio: { url: downloadLink },
                mimetype: 'audio/mpeg' 
            }, { quoted: message.data });
        } else if (type === "video") {
            await message.reply(`Downloading Video: ${Title} (${Duration})`);
            await client.sendMessage(message.jid, { 
                video: { url: downloadLink }
            }, { quoted: message.data });
        }
    } catch (error) {
        await message.reply(`Error occurred while fetching ${type}.`);
    }
};

patterns.forEach(({ pattern, desc, type }) => {
    izumi({
        pattern: pattern,
        fromMe: true,
        desc: desc,
        type: type
    }, async (message, match) => {
        if (pattern.includes('yta') || pattern.includes('song')) {
            
            await handleDownload(message, match, 'audio');
        } else if (pattern.includes('ytv') || pattern.includes('video')) {
            
            await handleDownload(message, match, 'video');
        }
    });
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
