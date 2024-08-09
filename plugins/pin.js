const { izumi, mode, isUrl, getJson, parsedUrl } = require("../lib");
const config = require("../config");
izumi(
  {
    pattern: "pinterest ?(.*)",
    fromMe: mode,
    desc: "Download pinterest videos",
    type: "downloader",
  },
  async (message, match) => {
    try {
      match = match || message.reply_message.text;

      if (!match) {
        await message.reply("Please provide a URL");
        return;
      }

      const result = await getJson(eypzApi + `pin?url=${match}`);
      if (!result || !result.media_urls) {
        await message.reply("Invalid response from the API");
        return;
      }
      const urlMp4 = Object.values(result.media_urls).find(url => url.endsWith('.mp4'));
      
      if (!urlMp4) {
        await message.reply("No  media found");
        return;
      }
      await message.sendFromUrl(urlMp4);

    } catch (error) {
      console.error(error);
      await message.reply("An error occurred while processing your request.");
    }
  }
);
