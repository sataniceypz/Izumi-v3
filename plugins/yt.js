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
    desc: "Download audio from youtube",
     type: "downloader",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("Give me a youtube link");
    if (!isUrl(match)) return await message.reply("Give me a youtube link");
let link = await parsedUrl(match)
    let { dlink, title } = await yta(link[0]);
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
izumi({
  pattern: "play ?(.*)",
  fromMe: true,
  desc: "Play YouTube video or audio",
  type: "user",
}, async (message, match) => {
  match = match || message.reply_message.text;
  if (!match) {
    await message.reply("🎵 *Give me a query to search* 🎵");
    return;
  }

  try {
    let { dlink, title, vid } = await ytsdl(match);
    let buff = await getBuffer(dlink);

    let data = {
      jid: message.jid,
      button: [
        {
          type: "reply",
          params: {
            display_text: "📹 VIDEO",
            id: `${PREFIX}video${match}`,
          },
        },
        {
          type: "reply",
          params: {
            display_text: "🎵 AUDIO",
            id: `${PREFIX}song${match}`,
          },
        },
        {
          type: "url",
          params: {
            display_text: "🔗 YouTube",
            url: `https://youtu.be/${vid}`,
            merchant_url: `https://youtu.be/${vid}`,
          },
        },
      ],
      header: {
        title: `${config.BOT_NAME}`,
        subtitle: "Enjoy your media",
        hasMediaAttachment: false,
      },
      footer: {
        text: `Powered by ${config.OWNER_NAME}`,
      },
      body: {
        text: `*${title}*\nChoose an option below to proceed:`,
      },
    };

    await message.sendMessage(message.jid, data, {}, "interactive");
  } catch (error) {
    console.error("Error handling:", error);
    await message.reply(" _Error processing your request. Please try again later._ ");
  }
});
