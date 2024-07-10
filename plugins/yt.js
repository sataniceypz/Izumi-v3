const config = require("../config");
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
            retailerId: config.OWNER_NAME,
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
    desc: "Download audio from youtube",
     type: "downloader",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("Give me a youtube link");
    if (!isUrl(match)) return await message.reply("Give me a youtube link");
    let link = await parsedUrl(match)
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
    desc: "Download audio from youtube",
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
