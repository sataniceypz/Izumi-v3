const { izumi,mode } = require('../lib/');
const fs = require('fs');
const got = require("got");
const Db = require('../lib/database/plugin');
izumi({
	pattern: 'reboot$',
	fromMe: true,
	desc: 'Bot restart',
	type: 'user'
}, async (message, match, client) => {
await message.send("_rebooting_");
return require('pm2').restart('index.js');
});
const value = ["99000","88000","77000","660000","55000","44000","33000","22000","11000","9999","999","99"];
izumi({
    pattern: "script$",
    fromMe: mode,
    desc: "Izumi",
    type: "info",
}, async (message, match, client) => {
    var amount = value[Math.floor(Math.random() * value.length)];
    const amountInPaise = parseInt(amount, 10) * 1000;
    const cap = "Iᴢᴜᴍɪ-ᴠ3\n\nRᴇᴘᴏ:*https://github.com/sataniceypz/IZUMI-V3*\n\nOᴡɴᴇʀ:*https://wa.me/message/IU2AC4VHJADIF1*";

    await message.client.relayMessage(message.jid, {
        requestPaymentMessage: {
            currencyCodeIso4217: 'INR',
            amount1000: amountInPaise,
            requestFrom: message.sender,
            noteMessage: {
                extendedTextMessage: {
                    text: cap,
                    contextInfo: {
                        externalAdReply: {
                            showAdAttribution: true
                        }
                    }
                }
            }
        }
    }, { quoted: message.quoted });
});
izumi({
  pattern: 'plugin ?(.*)',
  fromMe: true,
  desc: 'new plugin installer',
  type: 'user'
}, async (message, match) => {
  let text = match || (message.quoted ? message.quoted.text : '');
  if (match == "list") {
    let mesaj = "";
    let plugins = await Db.PluginDB.findAll();
    if (plugins.length < 1) {
      return await message.reply("_No external plugins installed_");
    } else {
      plugins.map((plugin) => {
        mesaj +=
          "```" +
          plugin.dataValues.name +
          "```: " +
          plugin.dataValues.url +
          "\n";
      });
      return await message.reply(mesaj);
    }
  } else {
    if (!text) return await message.reply("_Send a plugin url_");
    try {
      var url = new URL(text);
    } catch (e) {
      console.log(e);
      return await message.reply("_Invalid Url_");
    }

    if (url.host === "gist.github.com") {
      url.host = "gist.githubusercontent.com";
      url = url.toString() + "/raw";
    } else {
      url = url.toString();
    }

    var plugin_name;
    var { body, statusCode } = await got(url);
    if (statusCode == 200) {
      var comand = body.match(/(?<=pattern:) ["'](.*?)["']/);
      if (comand) {
        plugin_name = comand[0].replace(/["']/g, "").trim().split(" ")[0];
      }
      if (!plugin_name) {
        plugin_name = "__" + Math.random().toString(36).substring(8);
      }
      fs.writeFileSync(__dirname + "/" + plugin_name + ".js", body);
      try {
        require("./" + plugin_name);
      } catch (e) {
        fs.unlinkSync(__dirname + "/" + plugin_name + ".js");
        return await message.reply("Invalid Plugin\n ```" + e + "```");
      }

      await Db.installPlugin(url, plugin_name);

      await message.reply(`_New plugin installed : ${plugin_name}_`);
    }
  }
});
izumi({
	pattern: "remove(?: |$)(.*)",
	fromMe: true,
	desc: 'remove plugin',
	type: 'user'
}, async (message, match) => {
	    if (!match) return await message.reply("_Need a plugin name_");

    var plugin = await Db.PluginDB.findAll({ where: { name: match } });

    if (plugin.length < 1) {
      return await message.reply("_Plugin not found_");
    } else {
      await plugin[0].destroy();
      delete require.cache[require.resolve("./" + match + ".js")];
      fs.unlinkSync(__dirname + "/" + match + ".js");
      await message.reply(`Plugin ${match} deleted`);
    }
  }
);

