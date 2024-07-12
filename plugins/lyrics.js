const { izumi, getJson, mode } = require("../lib/");

izumi(
    {
        pattern: "lyrics ?(.*)",
        fromMe: mode,
        desc: "Get song lyrics",
        type: "user",
    },
    async (message, match, m) => {
        try {
            match = match || message.reply_message.text;

            if (!match) {
                await message.reply("I need a query to search for lyrics.\nExample: `.lyrics wanna be yours`");
                return;
            }

            const response = await getJson(`https://api-eypz.onrender.com/lyrics?q=${encodeURIComponent(match)}`);

            if (!response || !response.lyrics) {
                await message.reply("Sorry, lyrics not found for that query.");
                return;
            }

            const { lyrics, artist } = extractLyricsAndArtist(response);
            const formattedMessage = formatLyricsMessage(lyrics, artist);

            await message.client.sendMessage(message.jid, { text: formattedMessage });
        } catch (error) {
            console.error("Error fetching lyrics:", error);
            await message.reply("Error fetching lyrics. Please try again later.");
        }
    }
);

function extractLyricsAndArtist(response) {
    let lyrics = response.lyrics || '';
    let artist = response.artist || 'Unknown';

    const lines = lyrics.split('\n').filter(line => (
        line && !line.includes('Contributors') && !line.includes('Embed')
    ));

    lyrics = lines.join('\n').trim();

    return { lyrics, artist };
}

function formatLyricsMessage(lyrics, artist) {
    return `*Lyrics:*\n${lyrics}\n\n*Artist:* ${artist}`;
}
