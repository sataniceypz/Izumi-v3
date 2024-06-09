 const config = require("../config");
const { izumi, mode, toAudio,webp2mp4,addExif } = require("../lib/");
izumi(
  {
    pattern: "sticker",
    fromMe: mode,
    desc: "Converts Photo/video/text to sticker",
    type: "converter",
  },
  async (message, match, client) => {
    if (
      !(
        message.reply_message.video ||
        message.reply_message.image ||
        message.reply_message.text
      )
    )
      return await message.reply("Reply to photo/video/text");

    let buff = await message.quoted.download("buffer");
    message.sendMessage(
      message.jid,
      buff,
      { packname: config.PACKNAME, author: config.AUTHOR },
      "sticker"
    );
  }
);
izumi(
  { pattern: 'take ?(.*)', fromMe: mode, desc: 'change sticker/audio pack name', type: 'generator' },
  async (message, match) => {
    if (!message.reply_message.sticker || !message.reply_message)
      return await message.reply('*Reply to sticker*')
    return await message.sendMsg(
      await addExif(
        await message.reply_message.download(),
        match
      ),
      {},
      'sticker'
    )
  }
)