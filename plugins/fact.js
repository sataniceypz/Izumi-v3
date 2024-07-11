const { izumi, getJson } = require("../lib/");
const config = require("../config");
izumi(
    {
        pattern: "cat-fact",
        fromMe: mode,
        desc: "facts about cat",
        type: "fact",
    },
    async (message) => {
        try {
            let response = await getJson(`https://api-eypz.onrender.com/cat-fact`);
            
            let fact = response.fact;
            
            const eypz = {
                text: fact,
                contextInfo: {
                    externalAdReply: {
                        title: "Cat Fact",
                        body: config.BOT_NAME,
                        sourceUrl: "https://github.com/sataniceypz/Izumi-v3",
                        mediaUrl: "https://github.com/sataniceypz/Izumi-v3",
                        mediaType: 1,
                        showAdAttribution: true,
                        renderLargerThumbnail: true,
                        thumbnailUrl: "https://api-eypz.onrender.com/cat"
                    }
                }
            };
            
            await message.client.sendMessage(message.jid, eypz);
        } catch (error) {
            console.error("Error fetching cat fact:", error);
        }
    }
);
