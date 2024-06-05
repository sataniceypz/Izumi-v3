const {
	izumi,
	commands,
	mode
} = require("../lib/");
izumi({
	pattern: 'list$',
	fromMe: mode,
	dontAddCommandList: true
}, async (message, match) => {
	let msg = ''
	let no = 1
	commands.map(async (command) => {
		if (command.dontAddCommandList === false && command.pattern !== undefined) {
			msg += `${no++}. ${command.pattern.toString().match(/(\W*)([A-Za-z0-9_ğüşiö ç]*)/)[2].trim()}\n${command.desc}\n\n`
		}
	})
	await message.reply(msg.trim())
})