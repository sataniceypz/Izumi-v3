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