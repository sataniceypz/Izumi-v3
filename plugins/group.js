const { izumi,mode,isAdmin,sleep } = require("../lib/");
 izumi(
  {
    pattern: "promote ?(.*)",
    fromMe: true,
    desc: "promote to admin",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");

    match = match || message.reply_message.sender;
    if (!match) return await message.reply("_Mention user to promote_");

    const isadmin = await message.isAdmin(message.user);

    if (!isadmin) return await message.reply("_I'm not admin_");
    const jid = parsedJid(match);

    await message.promote(jid);

    return await message.send(`_@${jid[0].split("@")[0]} promoted as admin_`, {
      mentions: [jid],
    });
  }
);
izumi(
  {
    pattern: "demote ?(.*)",
    fromMe: true,
    desc: "demote from admin",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");

    match = match || message.reply_message.sender;
    if (!match) return await message.reply("_Mention user to demote_");

    const isadmin = await message.isAdmin(message.user);

    if (!isadmin) return await message.reply("_I'm not admin_");
    const jid = parsedJid(match);

    await message.demote(jid);

    return await message.send(
      `_@${jid[0].split("@")[0]} demoted from admin_`,
      {
        mentions: [jid],
      }
    );
  }
);
izumi(
  {
    pattern: "mute ?(.*)",
    fromMe: true,
    desc: "mute group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("_I'm not admin_");
    await message.reply("_Muting_");
    if (!match || isNaN(match)) {
      await message.mute(message.jid);
      await message.send('*Group Muted.*');
      return;
    }
    await message.mute(message.jid);
    await message.send('_Group muted for ' + match + ' mins_');
    await sleep(1000 * 60 * match);
    await message.unmute(message.jid);
    await message.send('*Group unmuted.*');   
  }
);
izumi(
  {
    pattern: "unmute ?(.*)",
    fromMe: true,
    desc: "unmute group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("_I'm not admin_");
    await message.reply("_Unmuting_");
    if (!match || isNaN(match)) {
      await message.unmute(message.jid);
      await message.send('*Group opened.*');
      return;
    }
    await message.unmute(message.jid);
    await message.send('_Group unmuted for ' + match + ' mins_');
    await sleep(1000 * 60 * match);
    await message.mute(message.jid);
    await message.send('*Group closed.*');   
  }
);
izumi(
  {
    pattern: "getjids",
    fromMe: true,
    desc: "gets jid of all group members",
    type: "group",
  },
  async (message, match,client) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    let { participants } = await client.groupMetadata(message.jid);
    let participant = participants.map((u) => u.id);
    let str = "╭──〔 *Group Jids* 〕\n";
    participant.forEach((result) => {
      str += `├ *${result}*\n`;
    });
    str += `╰──────────────`;
    message.send(str);
  }
);
izumi(
  {
    pattern: "tagall",
    fromMe: true,
    desc: "mention all users in group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return;
    const { participants } = await message.client.groupMetadata(message.jid);
    let teks = "";
    for (let mem of participants) {
      teks += ` @${mem.id.split("@")[0]}\n`;
    }
    message.sendMessage(message.jid,teks.trim(), {
      mentions: participants.map((a) => a.id),
    });
  }
);
 izumi(
  {
    pattern: "tag ?(.*)",
    fromMe: true,
    desc: "mention all users in group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return;  
var target = message.jid
if (match && /[0-9]+(-[0-9]+|)(@g.us|@s.whatsapp.net)/g.test(match)) target = [...match.match(/[0-9]+(-[0-9]+|)(@g.us|@s.whatsapp.net)/g)][0];
var group = await message.client.groupMetadata(target)
var jids = [];
if (match.includes('admin')){
        var admins = group.participants.filter(v => v.admin !== null).map(x => x.id);
        admins.map(async (user) => {
            jids.push(user.replace('c.us', 's.whatsapp.net'));
        });   
} else {
group.participants.map(async(user) => {
jids.push(user.id.replace('c.us', 's.whatsapp.net'));});
}
await message.forwardMessage(target,message.quoted.data,{detectLinks: true,contextInfo: {mentions: jids}});
})