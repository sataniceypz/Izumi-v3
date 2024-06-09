 const { izumi,mode, serialize } = require("../lib/");
const { loadMessage } = require("../lib/database/store");

izumi(
  {
    pattern: "quoted$",
    fromMe: mode,
    desc: "quoted message",
    type:"user",
  },
  async (message, match) => {
    if (!message.reply_message)
      return await message.reply("*Reply to a message*");
    let key = message.reply_message.data.key;
    let msg = await loadMessage(key.id);
    if (!msg)
      return await message.reply(
        "_Message not found maybe bot might not be running at that time_"
      );
    msg = await serialize(
      JSON.parse(JSON.stringify(msg.message)),
      message.client
    );
    if (!msg.quoted) return await message.reply("No quoted message found");
    await message.forward(message.jid, msg.quoted.message);
  }
);