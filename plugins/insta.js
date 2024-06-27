const { izumi, getUrl, igdl, isIgUrl, mode } = require("../lib/");
izumi(
  {
    pattern: "insta ?(.*)",
    fromMe: mode,
    desc: "To download Instagram media",
    type: "downloader",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.sendMessage(message.jid, "Give me a link");

    const url = getUrl(match.trim());
    if (!url) return await message.sendMessage(message.jid, "Invalid link");

    try {
      const data = await igdl(url);
      if (data.length == 0) {
        return await message.sendMessage(message.jid, "No media found on the link");
      }
      for (const mediaUrl of data) {
        await message.sendFile(mediaUrl);
      }
    } catch (e) {
      await message.sendMessage(message.jid, "Download failed, private account or invalid link!");
      console.log(e);
    }
  }
);