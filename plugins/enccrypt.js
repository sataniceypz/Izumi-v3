const {
 	izumi,mode
 } = require("../lib/");
 izumi({
 	pattern: 'minify ?(.*)',
 	fromMe: mode,
 	desc: 'code minifier',
 	type: 'generator'
 }, async (message, match, client) => {
 	match = match || message.reply_message.text
 	try {
 		var UglifyJS = require("uglify-js");
 		var result = await UglifyJS.minify(match)
 		if (!result.error) return await message.reply(result.code)
 		await message.reply(result.error)
 		console.log(result)
 	} catch (e) {
 		message.reply(`${result.error}`)
 	};
 });