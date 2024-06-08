const { izumi,mode,convertTextToSound } = require('../lib/');
const config = require('../config');
izumi({
    pattern: 'tts ?(.*)',
    fromMe: mode,
    desc: 'It converts text to sound.',
    type: 'generator'
}, async (message, match) => {
match = match || message.quoted.text
    if (!match) return await message.reply('_Need Text!_\n_Example: tts Hello_\n_tts Hello {en}_');
   let LANG = config.LANG.toLowerCase();
    const lang = match.match("\\{([a-z]+)\\}");
    if (lang) {
      match = match.replace(lang[0], '');
      LANG = lang[1];
   }
    const audioData = await convertTextToSound(match, LANG);
    await message.client.sendMessage(message.chat, { audio: audioData, mimetype: 'audio/ogg; codecs=opus', ptt: true }, { quoted: message.data });
});
