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
const fetch = require('node-fetch');
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

        const response = await axios.get(`https://combative-sarine-eypz-god-d4cce0fc.koyeb.app/ytdl?url=${videoUrl}`);
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

        const response = await axios.get(`https://combative-sarine-eypz-god-d4cce0fc.koyeb.app/ytdl?url=${videoUrl}`);
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
        const response = await axios.get(`https://combative-sarine-eypz-god-d4cce0fc.koyeb.app/ytdl?url=${videoUrl}`);
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
        const response = await axios.get(`https://combative-sarine-eypz-god-d4cce0fc.koyeb.app/ytdl?url=${videoUrl}`);
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
    pattern: 'play ?(.*)',
    fromMe: true,
    desc: 'Search and download audio or video from YouTube',
    type: 'media'
}, async (message, match, client) => {
    if (!match) {
        await client.sendMessage(message.jid, { text: "Please provide a YouTube URL or search query after the command. Example: .play <search query>" });
        return;
    }

   
    let videoUrl = match;

    if (!match.startsWith('http')) {
      
        try {
            const results = await yts(match);
            if (!results || results.videos.length === 0) {
                await client.sendMessage(message.jid, { text: "No results found for your search." });
                return;
            }

            videoUrl = results.videos[0].url;
        } catch (error) {
            await client.sendMessage(message.jid, { text: "Error occurred while searching. Please try again." });
            return;
        }
    }

    
    const apiUrl = `https://combative-sarine-eypz-god-d4cce0fc.koyeb.app/ytdl?url=${videoUrl}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        
        const optionsText = `*_${data.title}_*\n\n\`\`\`1.\`\`\` *audio*\n\`\`\`2.\`\`\` *video*\n\n_*Send a number as a reply to download*_`;

        const sentMsg = await client.sendMessage(message.jid, { text: optionsText }, { quoted: message.data });

        client.ev.on('messages.upsert', async (msg) => {
            const newMessage = msg.messages[0];

            
            if (
                newMessage.key.remoteJid === message.jid &&
                newMessage.message?.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id
            ) {
                const userReply = newMessage.message?.conversation || newMessage.message?.extendedTextMessage?.text;

                if (userReply === '1') {
                    const externalAdReply = {
                        title: data.title,
                        body: "Izumi",
                        sourceUrl: data.source_url,
                        mediaUrl: data.source_url,
                        mediaType: 1,
                        showAdAttribution: true,
                        renderLargerThumbnail: false,
                        thumbnailUrl: data.thumbnail
                    };
                    await client.sendMessage(
                        message.jid,
                        {
                            audio: { url: data.download_links.mp4 },
                            mimetype: 'audio/mpeg',
                            fileName: `eypz.mp3`,
                            contextInfo: { externalAdReply: externalAdReply }
                        },
                        { quoted: message.data }
                    );
                } else if (userReply === '2') {
                 
                    await client.sendMessage(
                        message.jid,
                        {
                            video: { url: data.download_links.mp4 },
                            mimetype: 'video/mp4',
                            caption: `*Title:* ${data.title}\n*Duration:* ${data.duration} seconds`
                        },
                        { quoted: message.data }
                    );
                } else {
                    await client.sendMessage(message.jid, { text: "Invalid option. Please reply with 1 or 2." });
                }
            }
        });
    } catch (error) {
        await client.sendMessage(message.jid, { text: "An error occurred while fetching media. Please try again." });
    }
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
