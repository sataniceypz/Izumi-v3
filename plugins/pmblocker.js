const { izumi,pmBlock,pmb} = require('../lib/');
izumi({
    pattern: "pmblocker ?(.*)",
    fromMe: true,
    desc: "personal message controller",
    type: "user",
}, async (message, match) => {
 await pmb(message, match)
});
izumi(
  {
    on: 'message',
    fromMe: false,
  },
  async (message) => {
    await pmBlock(message);
  }
);