const { izumi, mode } = require("../lib");
const yts = require("yt-search");
const fetch = require("node-fetch");

izumi({
  pattern: "song ?(.*)",
  fromMe: mode,
  desc: "Search and download audio from YouTube.",
  type: "download",
}, async (message, match, client) => {
  if (!match) {
    return await message.reply("Please provide a search query or YouTube URL.");
  }

  try {
    const { videos } = await yts(match);
    const firstVideo = videos[0];
    const url = firstVideo.url;
    const api = `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`;

    const response = await fetch(api);
    const result = await response.json();
    const data = result.data;
    const dl = data.dl;
    const title = data.title;

    await message.reply(`_Downloading ${title}_`);
    await client.sendMessage(message.jid, {
      audio: { url: dl },
      caption: title,
      mimetype: "audio/mpeg",
    }, { quoted: message.data });
  } catch (error) {
    console.error("Error:", error);
    await message.reply("An error occurred while processing your request. Please try again later.");
  }
});

izumi({
  pattern: "video ?(.*)",
  fromMe: mode,
  desc: "Search and download video from YouTube.",
  type: "download",
}, async (message, match, client) => {
  if (!match) {
    return await message.reply("Please provide a search query or YouTube URL.");
  }

  try {
    const { videos } = await yts(match);
    const firstVideo = videos[0];
    const url = firstVideo.url;
    const api = `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`;

    const response = await fetch(api);
    const result = await response.json();
    const data = result.data;
    const dl = data.dl;
    const title = data.title;

    await message.reply(`_Downloading ${title}_`);
    await client.sendMessage(message.jid, {
      video: { url: dl },
      caption: title,
    }, { quoted: message.data });
  } catch (error) {
    console.error("Error:", error);
    await message.reply("An error occurred while processing your request. Please try again later.");
  }
});

izumi({
  pattern: "yta ?(.*)",
  fromMe: mode,
  desc: "Download audio from YouTube.",
  type: "download",
}, async (message, match, client) => {
  if (!match) {
    return await message.reply("Please provide a YouTube URL.");
  }

  try {
    const api = `https://api.siputzx.my.id/api/d/ytmp4?url=${match}`;
    const response = await fetch(api);
    const result = await response.json();
    const data = result.data;
    const dl = data.dl;
    const title = data.title;

    await message.reply(`_Downloading ${title}_`);
    await client.sendMessage(message.jid, {
      audio: { url: dl },
      caption: title,
      mimetype: "audio/mpeg",
    }, { quoted: message.data });
  } catch (error) {
    console.error("Error:", error);
    await message.reply("An error occurred while processing your request. Please try again later.");
  }
});

izumi({
  pattern: "ytv ?(.*)",
  fromMe: mode,
  desc: "Download video from YouTube.",
  type: "download",
}, async (message, match, client) => {
  if (!match) {
    return await message.reply("Please provide a YouTube URL.");
  }

  try {
    const api = `https://api.siputzx.my.id/api/d/ytmp4?url=${match}`;
    const response = await fetch(api);
    const result = await response.json();
    const data = result.data;
    const dl = data.dl;
    const title = data.title;

    await message.reply(`_Downloading ${title}_`);
    await client.sendMessage(message.jid, {
      video: { url: dl },
      caption: title,
    }, { quoted: message.data });
  } catch (error) {
    console.error("Error:", error);
    await message.reply("An error occurred while processing your request. Please try again later.");
  }
});
izumi({
  pattern: 'yts ?(.*)', 
  fromMe: mode,
  desc: 'Search for videos on YouTube.',
  type: 'downloader'
}, async (message, match, client) => {
  const query = match;
  if (!query) {
    return await message.reply('*Please provide a search query.*');
  }

  yts(query, async (err, result) => {
    if (err) {
      return message.reply('*Error occurred while searching YouTube.*');
    }

    if (result && result.videos.length > 0) {
      let formattedMessage = '*Here are the top 10 search results for your query:*\n\n';
      
      result.videos.slice(0, 10).forEach((video, index) => {
        formattedMessage += `*${index + 1}. ${video.title}*\nChannel: ${video.author.name}\nURL: ${video.url}\n\n`;
      });

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
    } else {
      await message.reply('*No results found for that query.*');
    }
  });
});