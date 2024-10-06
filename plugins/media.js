const config = require("../config");
const { izumi, mode, toAudio,blackVideo,getFfmpegBuffer,audioCut,videoTrim } = require("../lib/");
const fs = require('fs');
izumi(
  {
    pattern: "photo",
    fromMe: mode,
    desc: "Converts sticker to photo",
    type: "media",
  },
  async (message, match, client) => {
    if (!message.reply_message || !message.reply_message.sticker) {
      return await message.reply("Reply to a sticker");
    }
    const buff = await message.quoted.download("buffer");
    return await message.sendMessage(message.jid, buff, {}, "image");
  }
);
 izumi({
  pattern: "mp3",
  fromMe: mode,
  desc: "converts video/voice to mp3",
  type: "media",
}, async (message, match) => {
  try {
    let buff = await message.quoted.download("buffer");
    console.log(typeof buff);
    buff = await toAudio(buff, "mp3");
    console.log(typeof buff);
    return await message.sendMessage(
      message.jid,
      buff,
      { mimetype: "audio/mpeg" },
      "audio"
    );
  } catch (error) {
    console.error("Error:", error);
    return await message.sendMessage("An error occurred while processing your request.");
  }
});
izumi(
  { pattern: 'black', fromMe: mode, desc: 'Audio to black screen video.', type: 'media' },
  async (message, match) => {
    
    if (!message.reply_message || !message.reply_message.audio) {
      return await message.reply('*Reply to an audio!*');
    }

    try {
      const audioPath = await message.quoted.download();
      const videoBuffer = await blackVideo(audioPath);
      await message.sendFile(videoBuffer,{ quoted: message.data});
    } catch (error) {
      console.error('Error processing black video:', error);
      await message.reply(`Failed to create black video. Error: ${error.message}`);
    }
  }
);
izumi({ pattern: 'avec', fromMe: mode, desc: 'audio editor',type:"media" }, async (message, match) => {
  if (!message.reply_message || !message.reply_message.audio)
    return await message.send('*Reply to a audio.*')
  return await message.sendFile(
    await getFfmpegBuffer(
      await message.reply_message.download(),
      'avec.mp4',
      'avec'
    ),
    {quoted: message.data },
   )
})
 izumi({ pattern: 'pitch', fromMe: mode, desc: 'audio editor',type: "media"}, async (message, match) => {
  if (!message.reply_message || !message.reply_message.audio)
    return await message.send('*Reply to a audio.*')
  return await message.sendMsg(
    await getFfmpegBuffer(
      await message.reply_message.download(),
      'lowmp3.mp3',
      'lowmp3'
    ),
    { filename: 'lowmp3.mp3', mimetype: 'audio/mpeg', quoted: message.data },'audio'  )
})
izumi({ pattern: 'low', fromMe: mode, desc: 'audio editor',type: "media"}, async (message, match) => {
  if (!message.reply_message || !message.reply_message.audio)
    return await message.send('*Reply to a audio.*')
  return await message.sendMsg(
    await getFfmpegBuffer(
      await message.reply_message.download(),
      'lowmp3.mp3',
      'pitch'
    ),
    { filename: 'lowmp3.mp3', mimetype: 'audio/mpeg', quoted: message.data },
    'audio'
  )
})
izumi({ pattern: 'vector', fromMe: mode, desc: 'video editor',type: "media"}, async (message, match) => {
  if (!message.reply_message || !message.reply_message.audio)
    return await message.send('*Reply to a audio.*')
  return await message.sendMsg(
    await getFfmpegBuffer(
      await message.reply_message.download(),
      'vector.mp4',
      'vector'
    ),
    { mimetype: 'video/mp4', quoted: message.data },
    'video'
  )
})
izumi(
  { pattern: 'compress ?(.*)', fromMe: mode, desc: 'video compressor',type: "media" },
  async (message, match) => {
    if (!message.reply_message || !message.reply_message.video)
      return await message.send('*Reply to a video*')
    return await message.sendMsg(
      await getFfmpegBuffer(
        await message.reply_message.download(),
        'ocompress.mp4',
        'compress'
      ),
      { quoted: message.data },
      'video'
    )
  }
)

izumi(
  { pattern: 'bass ?(.*)', fromMe: mode, desc: 'audio editor',type: "media"},
  async (message, match) => {
    if (!message.reply_message || !message.reply_message.audio)
      return await message.send('*Reply to a audio.*')
    return await message.sendMsg(
      await getFfmpegBuffer(
        await message.reply_message.download(),
        'bass.mp3',
        `bass,${match == '' ? 10 : match}`
      ),
      { mimetype: 'audio/mpeg', quoted: message.data },
      'audio'
    )
  }
)

izumi(
  { pattern: 'treble ?(.*)', fromMe: mode, desc: 'audio editor', type: "media"},
  async (message, match) => {
    if (!message.reply_message || !message.reply_message.audio)
      return await message.send('*Reply to a audio.*')
    return await message.sendMsg(
      await getFfmpegBuffer(
        await message.reply_message.download(),
        'treble.mp3',
        `treble,${match == '' ? 10 : match}`
      ),
      { mimetype: 'audio/mpeg', quoted: message.data },
      'audio'
    )
  }
);

izumi({ pattern: 'histo', fromMe: mode, desc: 'audio editor',type: "media" }, async (message, match) => {
  if (!message.reply_message || !message.reply_message.audio)
    return await message.send('*Reply to a audio.*')
  return await message.sendMsg(
    await getFfmpegBuffer(
      await message.reply_message.download(),
      'histo.mp4',
      'histo'
    ),
    { mimetype: 'video/mp4', quoted: message.data },
    'video'
  )
});
izumi({ pattern: 'reverse', fromMe: mode, desc: 'reverse video or audio', type: "media"}, async (message, match) => {
  if (
    !message.reply_message.audio &&
    !message.reply_message.video &&
    !message.reply_message
  )
    return await message.send('*Reply to video/audio*')
  const location = await message.reply_message.download()
  if (message.reply_message.video == true) {
    return await message.sendMsg(
      await getFfmpegBuffer(location, 'revered.mp4', 'videor'),
      { mimetype: 'video/mp4', quoted: message.data },
      'video'
    )
  } else if (message.reply_message.audio == true) {
    return await message.sendMsg(
      await getFfmpegBuffer(location, 'revered.mp3', 'audior'),
      {
        filename: 'revered.mp3',
        mimetype: 'audio/mpeg',
        ptt: false,
        quoted: message.data,
      },
      'audio'
    )
  }
})

izumi({ pattern: 'cut ?(.*)', fromMe: mode, desc: 'cut audio',type: "media"}, async (message, match) => {
  if (!message.reply_message || !message.reply_message.audio)
    return await message.send('*Reply to a audio.*')
  if (!match) return await message.send('*Example : cut 0;30*')
  const [start, duration] = match.split(';')
  if (!start || !duration || isNaN(start) || isNaN(duration))
    return await message.send('*Example : cut 10;30*')
  return await message.sendMsg(
    await audioCut(
      await message.reply_message.download(),
      start.trim(),
      duration.trim()
    ),
    {
      filename: 'cut.mp3',
      mimetype: 'audio/mpeg',
      ptt: false,
      quoted: message.data,
    },
    'audio'
  )
})

izumi({ pattern: 'trim ?(.*)', fromMe: mode, desc: 'trim videos',type: "media"}, async (message, match) => {
  if (!message.reply_message || !message.reply_message.video)
    return await message.send('*Reply to a video*')
  if (!match) return await message.reply('*Example : trim 10;30*')
  const [start, duration] = match.split(';')
  if (!start || !duration || isNaN(start) || isNaN(duration))
    return await message.reply('*Example : trim 60;30*')
  return await message.sendMsg(
    await videoTrim(
      await message.reply_message.download(),
      start,
      duration
    ),
    { mimetype: 'video/mp4', quoted: message.data },
    'video'
  )
})
