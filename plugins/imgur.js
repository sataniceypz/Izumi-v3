 const {
	izumi,
	Imgur,
	mode
} = require("../lib/");
const ffmpeg = require('fluent-ffmpeg');
izumi({
	pattern: 'url ?(.*)',
	fromMe: mode,
	desc: 'upload files to imgur.com',
	type: 'generator'
}, async (m, text, client) => {
	if(!m.quoted) return m.reply("reply to a image/audio/video message")
if(m.quoted.image){
const media = await m.quoted.download()
		const res = await Imgur(media)
		await m.reply(res.link)
	} else if(m.quoted.video){

		const media = await m.reply_message.download()
		const res = await Imgur(media)
		await m.reply(res.link)
	} else if(m.quoted.audio){

		try {
			const media = await m.reply_message.download()
			ffmpeg(media)
				.outputOptions(["-y", "-filter_complex", "[0:a]showvolume=f=1:b=4:w=720:h=68,format=yuv420p[vid]", "-map", "[vid]", "-map 0:a"])
				.save('output.mp4')
				.on('end', async () => {
					var res = await Imgur('output.mp4');
					await m.reply(res.link)
				})
		} catch (e) {
			await m.reply(e.message)
		}
	} else {
		return m.reply("_Reply to a video/image/audio!_")
	}

})