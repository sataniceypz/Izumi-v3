const { izumi,mode, isAdmin ,parsedJid} = require("../lib");
izumi(
  {
    pattern: 'block ?(.*)',
    fromMe: true,
    desc: "Block a person",
    type: "user",
  },
  async (message, match) => {
    if (message.isGroup) {
      let jid = message.mention[0] || message.reply_message.jid;
      if (!jid) return await message.reply("_Reply to a person or mention_");
      await message.block(jid);
      return await message.sendMessage(
        `_@${jid.split("@")[0]} Blocked_`,
        {
          mentions: [jid],
        }
      );
    } else {
      await message.block(message.jid);
      return await message.reply("_User blocked_");
    }
  }
);

izumi(
  {
    pattern: "unblock",
    fromMe: true,
    desc: "Unblock a person",
    type: "user",
  },
  async (message, match) => {
    if (message.isGroup) {
      let jid = message.mention[0] || message.reply_message.jid;
      if (!jid) return await message.reply("_Reply to a person or mention_");
      await message.unblock(jid);
      return await message.sendMessage(
        message.jid,
        `_@${jid.split("@")[0]} unblocked_`,
        {
          mentions: [jid],
        }
      );
    } else {
      await message.unblock(message.jid);
      return await message.reply("_User unblocked_");
    }
  }
);
izumi(
  {
    pattern: "forward ?(.*)",
    fromMe: true,
    desc: "Forwards the replied Message",
    type: "user",
  },
  async (message, match) => {
    if (!message.quoted) return message.reply('Reply to something');
    
    let jids = parsedJid(match);
    for (let i of jids) {
      const eypz = {
        text: message.quoted ? message.quoted.message : "Replied message",
        contextInfo: {
          isForwarded: false
        }
      };
      
      await message.forwardMessage(i, message.reply_message.data, eypz);
    }
  }
);