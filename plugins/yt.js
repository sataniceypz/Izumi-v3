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
} = require("../lib");
const config = require("../config");
izumi(
  {
    pattern: "ytv ?(.*)",
    fromMe: mode,
    desc: "Download video from YouTube",
    type: "downloader",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("Give me a YouTube link");
    if (!isUrl(match)) return await message.reply("Give me a valid YouTube link");

    try {
      // Make a request to the API
      let response = await fetch(`https://api.shannmoderz.xyz/downloader/yt-video?url=${encodeURIComponent(match)}`);
      let data = await response.json(); // Parse the JSON directly

      if (!data.status) throw new Error("Download failed");

      let { title, download_url } = data.result;
      await message.reply(`_Downloading ${title}_`);

      // Send the video using the download_url
      return await message.sendMessage(
        message.jid,
        download_url,
        {
          mimetype: "video/mp4",
          filename: `${title}.mp4`,
          quoted: message.data
        },
        "video"
      );
    } catch (error) {
      return await message.reply(`Failed to download video: ${error.message}`);
    }
  }
);

izumi(
  {
    pattern: "yta ?(.*)",
    fromMe: mode,
    desc: "Download audio from YouTube",
    type: "downloader",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("Give me a YouTube link");
    if (!isUrl(match)) return await message.reply("Give me a valid YouTube link");

    try {
      // Make a request to the API
      let response = await fetch(`https://api.shannmoderz.xyz/downloader/yt-audio?url=${encodeURIComponent(match)}`);
      let data = await response.json(); // Parse the JSON directly

      if (!data.status) throw new Error("Download failed");

      let { title, download_url } = data.result;
      await message.reply(`_Downloading ${title}_`);

      // Send the video using the download_url
      return await message.sendMessage(
        message.jid,
        download_url,
        {
          mimetype: "audio/mpeg",
          filename: `${title}.mp3`,
          quoted: message.data
        },
        "audio"
      );
    } catch (error) {
      return await message.reply(`Failed to download video: ${error.message}`);
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
        await message.reply("Please provide a search query to find YouTube videos.\nExample: `.youtube Naruto AMV`");
        return;
      }

      const response = await getJson(eypzApi + `youtube?search=${encodeURIComponent(match)}`);

      if (!response || response.length === 0) {
        await message.reply("Sorry, no YouTube videos found for your search query.");
        return;
      }

      // Format the response into a readable message
      const formattedMessage = formatYouTubeMessage(response);

      // Construct context info message
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

      // Send the formatted message with context info
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
