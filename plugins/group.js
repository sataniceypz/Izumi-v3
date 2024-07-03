const {
    izumi,
    mode,
    isAdmin,
    sleep,
    parsedJid
} = require("../lib/");
izumi({
        pattern: "promote ?(.*)",
        fromMe: true,
        onlyGroup: true,
        desc: "promote to admin",
        type: "group",
    },
    async (message, match) => {
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
izumi({
        pattern: "demote ?(.*)",
        fromMe: true,
        onlyGroup: true,
        desc: "demote from admin",
        type: "group",
    },
    async (message, match) => {
        match = match || message.reply_message.sender;
        if (!match) return await message.reply("_Mention user to demote_");

        const isadmin = await message.isAdmin(message.user);

        if (!isadmin) return await message.reply("_I'm not admin_");
        const jid = parsedJid(match);

        await message.demote(jid);

        return await message.send(
            `_@${jid[0].split("@")[0]} demoted from admin_`, {
                mentions: [jid],
            }
        );
    }
);
izumi({
        pattern: "mute ?(.*)",
        fromMe: true,
        onlyGroup: true,
        desc: "mute group",
        type: "group",
    },
    async (message, match) => {
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
izumi({
        pattern: "unmute ?(.*)",
        fromMe: true,
        onlyGroup: true,
        desc: "unmute group",
        type: "group",
    },
    async (message, match) => {
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
izumi({
        pattern: "getjids",
        fromMe: true,
        onlyGroup: true,
        desc: "gets jid of all group members",
        type: "group",
    },
    async (message, match, client) => {         
        let {
            participants
        } = await client.groupMetadata(message.jid);
        let participant = participants.map((u) => u.id);
        let str = "╭──〔 *Group Jids* 〕\n";
        participant.forEach((result) => {
            str += `├ *${result}*\n`;
        });
        str += `╰──────────────`;
        message.send(str);
    }
);
izumi({
        pattern: "tag ?(.*)",
        fromMe: true,
        onlyGroup: true,
        desc: "mention all users in group",
        type: "group",
    },
    async (message, match) => {
        const {
            participants
        } = await message.client.groupMetadata(message.jid);
        let teks = "";
        let mentions = [];

        if (match === "admin" || match === "admins") {
            let admins = participants.filter(v => v.admin !== null).map(v => v.id);
            for (let admin of admins) {
                teks += `@${admin.split('@')[0]}\n`;
            }
            mentions = admins;
            await message.sendMessage(message.jid, teks.trim(), {
                mentions: mentions
            });
            return;
        } else if (match === "all") {
            for (let mem of participants) {
                teks += `@${mem.id.split("@")[0]}\n`;
            }
            mentions = participants.map(a => a.id);
            await message.sendMessage(message.jid, teks.trim(), {
                mentions: mentions
            });
            return;
        }

        if (match.trim()) {
            for (let mem of participants) {
                teks += `@${mem.id.split("@")[0]}\n`;
            }
            mentions = participants.map(a => a.id);
            await message.sendMessage(message.jid, match.trim() + "\n" + teks.trim(), {
                mentions: mentions
            });
        }

        var target = message.jid;
        if (match && /[0-9]+(-[0-9]+|)(@g.us|@s.whatsapp.net)/g.test(match)) {
            target = [...match.match(/[0-9]+(-[0-9]+|)(@g.us|@s.whatsapp.net)/g)][0];
        }

        var group = await message.client.groupMetadata(target);
        var jids = [];
        group.participants.map(user => {
            jids.push(user.id.replace('c.us', 's.whatsapp.net'));
        });

        if (message.quoted) {
            await message.forwardMessage(target, message.quoted.data, {
                detectLinks: true,
                contextInfo: {
                    mentionedJid: jids
                }
            });
        }
    }
);
izumi({
        pattern: "hidetag ?(.*)",
        fromMe: true,
        onlyGroup: true,
        desc: "send given text with mention",
        type: "group",
    },
    async (message, match) => {
        if (!match) {
            return await message.reply("_Eg .hidetag Hello_")
        };
        var group = await message.client.groupMetadata(message.jid);
        var jids = [];
        group.participants.map(user => {
            jids.push(user.id.replace('c.us', 's.whatsapp.net'));
        });
        await message.send(match, {
            mentions: jids
        });

    }); 
    izumi(
  {
    pattern: 'invite ?(.*)',
    fromMe: true,
    desc: 'Get Group invite',
    type: 'group',
    onlyGroup: true,
  },
  async (message, match) => {
    const participants = await message.groupMetadata(message.jid)
    const isImAdmin = await message.isAdmin(message.user)
    if (!isImAdmin) return await message.reply(`_I'm not admin._`)
    return await message.reply(await message.invite(message.jid))
  }
);
izumi(
  {
    pattern: 'join ?(.*)',
    fromMe: true,
    type: 'group',
    desc: 'Join invite link.',
  },
  async (message, match) => {
    match = match || message.reply_message.text
    if (!match)
      return await message.reply(`_Give me a Group invite link._`)
    const wa = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/
    const [_, code] = match.match(wa) || []
    if (!code)
      return await message.sendMessage(`_Give me a Group invite link._`)
    await message.accept(code)
    return await message.reply(`_Joined_`)
  }
);
izumi(
  {
    pattern: 'revoke',
    fromMe: true,
    onlyGroup: true,
    type: 'group',
    desc: 'Revoke Group invite link.',
  },
  async (message, match) => {
  const isadmin = message.isAdmin(message.user);
    if (!isadmin) return await message.reply(`_I'm not admin._`)
    await message.revoke(message.jid)
  }
)
 izumi(
  {
    pattern: 'left ?(.*)',
    fromMe: true,
    dec: 'To leave from group',
    type: 'user',
    onlyGroup: true,
  },
  async (message, match) => {
    if (match) await message.send(match)
    return await message.left(message.jid)
  }
);
izumi({
    pattern: "mee",
    fromMe: mode,
    onlyGroup: false,
    desc: "self tag",
    type: "group",
},
async (message, match) => {
    const {
        participants
    } = await message.groupMetadata(message.jid);
    const senderId = message.sender.split('@')[0];
    let teks = `@${senderId}\n`;
    await message.sendMessage(message.jid, teks.trim(), {
        mentions: [message.sender]
    });
});
izumi(
  {
    pattern: "add ?(.*)",
    fromMe: true,
    desc: "Add a person to the group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) {
      return await message.reply("*_This command only works in group chats_*");
    }

    let num;

    if (message.quoted) {
      num = message.quoted.sender;
    } else {
      num = match;
    }

    if (!num) {
      return await message.reply("*_Need a number/reply to a message!_*");
    }

    let user = num.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    let admin = await isAdmin(message.jid, message.user, message.client);

    if (!admin) {
      return await message.reply("*_I'm not admin_*");
    }

    try {
      await message.client.groupParticipantsUpdate(message.jid, [user], "add");
      return await message.client.sendMessage(message.jid, {
        text: `*_@${user.split("@")[0]}, Added to the Group!_*`,
        mentions: [user],
      });
    } catch (error) {
      return await message.reply("*_Failed to add the person to the group. Please check the number and try again._*");
    }
  }
);
izumi(
  {
    pattern: "kick ?(.*)",
    fromMe: true,
    desc: "Kick a person from the group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) {
      return await message.reply("*_This command only works in group chats_*");
    }

    let num = match || (message.quoted ? message.quoted.sender : null);

    if (!num) {
      return await message.reply("*_Need a number/reply/mention!_*");
    }

    num = num.replace(/[^0-9]/g, "") + "@s.whatsapp.net"; // Ensure num is in the correct format

    let admin = await isAdmin(message.jid, message.user, message.client);

    if (!admin) {
      return await message.reply("*_I'm not admin_*");
    }

    try {
      await message.client.groupParticipantsUpdate(message.jid, [num], "remove");
      let userMention = `@${num.split("@")[0]}`;
      return await message.client.sendMessage(message.jid, {
        text: `*_ ${userMention}, Kicked from The Group!_*`,
        mentions: [num],
      });
    } catch (error) {
      console.error("Error kicking user:", error);
      return await message.reply("*_Failed to kick the user_*");
    }
  }
);
