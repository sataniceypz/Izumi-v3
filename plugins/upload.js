const { izumi, mode, parsedUrl} = require("../lib/");

izumi(
  {
    pattern: "upload ?(.*)",
    fromMe: mode,
    desc: "send files from multiple URLs",
    type: "downloader",
  },
  async (message, match) => {
    match = match || message.quoted?.text;
    if (!match) {
      return await message.send("_reply to a url_");
    }
        await message.sendFromUrl(parsedUrl(match));
      
  }
);