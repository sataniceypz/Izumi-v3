 const { izumi, getUrl, igdl, isIgUrl,mode } = require("../lib/");
izumi(
  {
    pattern: "insta ?(.*)",
    fromMe: mode,
    desc: "To download instagram media",
    type: "downloader",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.sendMessage(message.jid, "Give me a link");
    const url = getUrl(match.trim())[0];
    try {
      const data = await igdl(getUrl(match.trim())[0]);
      if (data.length == 0)
        return await message.sendMessage(
          message.jid,
          "No media found on the link"
        );
      data.forEach(async (url) => {
        await message.sendFile(url);
      });
    } catch (e) {
      await message.sendMessage(message.jid, "Error: " + e);
    }
  }
);