const { izumi, getJson, mode } = require("../lib/");
const config = require("../config");

izumi(
    {
        pattern: "lyrics ?(.*)",
        fromMe: mode,
        desc: "Get song lyrics",
        type: "downloader",
    },
    async (message, match, m) => {
        try {
            match = match || message.reply_message.text;

            if (!match) {
                await message.reply("I need a query to search for lyrics.\nExample: `.lyrics wanna be yours`");
                return;
            }

            const response = await getJson(eypzApi +`lyrics?q=${encodeURIComponent(match)}`);

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

izumi(
    {
        pattern: "weather ?(.*)",
        fromMe: mode,
        desc: "Get weather information for a city",
        type: "info",
    },
    async (message, match, m) => {
        try {
            match = match || message.reply_message.text;

            if (!match) {
                await message.reply("Please provide a city name to get weather information.\nExample: `.weather London`");
                return;
            }

            const response = await getJson(eypzApi + `info/weather?city=${encodeURIComponent(match)}`);

            if (!response || Object.keys(response).length === 0) {
                await message.reply("Sorry, weather information not found for that city.");
                return;
            }

            const formattedMessage = formatWeatherMessage(response);

            await message.client.sendMessage(message.jid, { text: formattedMessage });
        } catch (error) {
            console.error("Error fetching weather:", error);
            await message.reply("Error fetching weather information. Please try again later.");
        }
    }
);

function extractLyricsAndArtist(response) {
    let lyrics = response.lyrics || '';
    let artist = response.artist || 'Unknown';

    // Filter out unwanted lines
    const lines = lyrics.split('\n').filter(line => (
        line && !line.includes('Contributors') && !line.includes('Embed')
    ));

    lyrics = lines.join('\n').trim();

    return { lyrics, artist };
}

function formatLyricsMessage(lyrics, artist) {
    return `*Lyrics:*\n${lyrics}\n\n*Artist:* ${artist}`;
}

function formatWeatherMessage(weatherData) {
    const { city, description, temperature, humidity, wind_speed } = weatherData;

    // Emoji mapping for weather conditions
    let weatherEmoji = '';
    if (description.toLowerCase().includes('clear')) {
        weatherEmoji = '☀️'; // Sun emoji for clear skies
    } else if (description.toLowerCase().includes('rain')) {
        weatherEmoji = '🌧️'; // Rain cloud emoji for rain
    } else if (description.toLowerCase().includes('cloud')) {
        weatherEmoji = '☁️'; // Cloud emoji for cloudy weather
    } else if (description.toLowerCase().includes('snow')) {
        weatherEmoji = '❄️'; // Snowflake emoji for snow
    } else {
        weatherEmoji = '🌍'; // Globe emoji as fallback
    }

    // Format the message with emojis
    return `*Weather Information for ${city} ${weatherEmoji}:*\n\n*Description:* ${description}\n*Temperature:* ${temperature} °C\n*Humidity:* ${humidity}%\n*Wind Speed:* ${wind_speed} m/s`;
}
