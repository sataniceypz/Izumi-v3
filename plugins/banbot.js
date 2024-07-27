const { izumi,PREFIX,updateBan, getBanStatus } = require("../lib");
const config = require("../config");
izumi(
  {
    pattern: "bot ?(.*)",
    fromMe: true,
    desc: "bot on or off in specific group",
    type: "user",
  },
  async (message, match) => {
    const status = await getBanStatus(message.jid);
    let link = `${config.MENU_URL}`;
    let url = await message.ParseButtonMedia(link);
    
    let data = {
      jid: message.jid,
      button: [
        {
          type: "reply",
          params: {
            display_text: "ON",
            id: `${PREFIX}bot on`,
          },
        },
        {
          type: "reply",
          params: {
            display_text: "OFF",
            id: `${PREFIX}bot off`,
          },
        },
      ],
      header: {
        title: `${config.BOT_NAME}`,
        subtitle: "",
        hasMediaAttachment: true,
      },
      footer: {
        text: "STATUS: " + status,
      },
      body: {
        text: "",
      },
    };

    if (link.endsWith(".mp4")) {
      data.header.videoMessage = url;
    } else {
      data.header.imageMessage = url;
    }
   
    if (!match || match.trim() === '') {
      await message.sendMessage(message.jid, data, {}, "interactive");
      return;
    }
    if (match.trim() === 'on') {
      await updateBan(message.jid, 'remove');
      return await message.send('> Bot activated in this chat');
    } else if (match.trim() === 'off') {
      await updateBan(message.jid, 'add');
      return await message.send('> Bot deactivated in this chat');
    }
  }
);