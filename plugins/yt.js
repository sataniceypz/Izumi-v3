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
  Play
} = require("../lib");
const config = require("../config");

izumi(
  {
    pattern: "play ?(.*)",
    fromMe: mode,
    desc: "Play YouTube video or audio",
    type: "downloader",
  },
  async (message, match) => {
await Play(message,match);
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
    if (!isUrl(match)) return await message.reply("Give me a YouTube link");

    let link = await parsedUrl(match);
    let { dlink, title, vid } = await yta(link[0]);
    await message.reply(`_Downloading ${title}_`);
    let buff = await getBuffer(dlink);

    let thumbnailUrl = `https://i.ytimg.com/vi/${vid}/0.jpg`;

    let eypz = {
      key: {
        participant: "0@s.whatsapp.net",
        remoteJid: "120363280001854361@g.us"
      },
      message: {
        productMessage: {
          product: {
            productImage: {
              mimetype: "image/jpeg",
              jpegThumbnail: Buffer.alloc(0)
            },
            title: `${title}`, 
            description: config.BOT_NAME, 
            currencyCode: "USD",
            priceAmount1000: "100000000//000", 
            retailerId: "Eypz",
            productImageCount: 1
          },
          businessOwnerJid: "917994489493@s.whatsapp.net"
        }
      }
    };

    return await message.sendMessage(
      message.jid,
      buff,
      {
        mimetype: "audio/mpeg",
        waveform: [90, 20, 90, 20, 90, 20, 90],
        fileLength: "1000000",
        ptt: false,
        quoted: eypz,
        contextInfo: {
          externalAdReply: {
            title: config.BOT_NAME,
            body: title,
            sourceUrl: "https://github.com/sataniceypz/Izumi-v3",
            mediaUrl: "https://github.com/sataniceypz/Izumi-v3",
            mediaType: 1,
            showAdAttribution: true,
            renderLargerThumbnail: true,
            thumbnailUrl: thumbnailUrl
          }
        }
      },
      "audio"
    );
  }
);

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
    if (!isUrl(match)) return await message.reply("Give me a YouTube link");

    let link = await parsedUrl(match);
    let { dlink, title } = await ytv(link[0], "360p");
    await message.reply(`_Downloading ${title}_`);
    return await message.sendMessage(
      message.jid,
      dlink,
      {
        mimetype: "video/mp4",
        filename: title + ".mp4",
      },
      "video"
    );
  }
);

izumi(
  {
    pattern: "song ?(.*)",
    fromMe: mode,
    desc: "Download audio from YouTube",
    type: "downloader",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("Give me a query");
    let { dlink, title } = await ytsdl(match);
    await message.reply(`_Downloading ${title}_`);
    let buff = await getBuffer(dlink);
    return await message.sendMessage(
      message.jid,
      buff,
      {
        mimetype: "audio/mpeg",
        filename: title + ".mp3",
      },
      "audio"
    );
  }
);

 izumi(
  {
    pattern: "video ?(.*)",
    fromMe: mode,
    desc: "Download video from youtube",
     type: "downloader",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("Give me a query");
    let { dlink, title } = await ytsdl(match, "video");
    await message.reply(`_Downloading ${title}_`);
    return await message.sendMessage(
      message.jid,
      dlink,
      {
        mimetype: "video/mp4",
        filename: title + ".mp4",
      },
      "video"
    );
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
