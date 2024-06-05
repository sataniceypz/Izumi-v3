const { izumi, mode, qrcode, readQr } = require('../lib/');

izumi(
  {
    pattern: "qr ?(.*)",
    fromMe: mode,
    desc: "Write Qr.",
    type: "generator",
  },
  async (message, match) => {
    match = match || (message.reply_message && message.reply_message.text);

    if (match) {
      let buff = await qrcode(match);
      return await message.sendMessage(message.jid, buff, {}, "image");
    } else if (message.reply_message && message.reply_message.image) {
      const buffer = await message.reply_message.download();
      readQr(buffer)
        .then(async (data) => {
          return await message.sendMessage(message.jid, data);
        })
      .catch(async (error) => {
          console.error("Error:", error.message);
          return await message.sendMessage(message.jid, error.message);
        });
    } else {
      return await message.sendMessage(
        message.jid,
        "*Example : qr test*\n*Reply to a qr image.*"
      );
    }
  }
);