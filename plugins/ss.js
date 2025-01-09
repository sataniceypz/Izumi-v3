const { izumi, mode } = require("../lib");
izumi({
  pattern: 'ss ?(.*)',
  fromMe: mode,
  desc: 'Download Instagram media (images/videos)',
  type: 'download',
}, async (message, match, client) => {
  try {
    const imgUrl = (`https://api.siputzx.my.id/api/tools/ssweb?url=${match}&theme=dark&device=desktop`);
    await message.sendFile(imgUrl);
  } catch (error) {
    console.error(error);
    await message.reply('Error: ' + error.message);
  }
});
