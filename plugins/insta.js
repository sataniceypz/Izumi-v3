const { izumi, getUrl, igdl, isIgUrl, mode, getJson } = require("../lib/");

izumi(
    {
        pattern: "insta ?(.*)",
        fromMe: mode,
        desc: "To download Instagram media",
        type: "downloader",
    },
    async (message, match) => {
        match = match || message.reply_message.text;
        if (!match) return await message.sendMessage(message.jid, "Give me a link");

        const url = getUrl(match.trim());
        if (!url) return await message.sendMessage(message.jid, "Invalid link");

        try {
            const data = await igdl(url);
            if (data.length == 0) {
                return await message.sendMessage(message.jid, "No media found on the link");
            }
            for (const mediaUrl of data) {
                await message.sendFile(mediaUrl);
            }
        } catch (e) {
            await message.sendMessage(message.jid, "Download failed, private account or invalid link!");
            console.log(e);
        }
    }
);

izumi(
    {
        pattern: "iginfo ?(.*)",
        fromMe: mode,
        desc: "Get Instagram user information",
        type: "downloader",
    },
    async (message, match) => {
        try {
            match = match || message.reply_message.text;

            if (!match) {
                await message.reply("Please provide an Instagram username.\nExample: `.iginfo instagram`");
                return;
            }

            const response = await getJson(eypzApi + `insta?username=${encodeURIComponent(match)}`);

            if (!response) {
                await message.reply("Sorry, no information found for the provided Instagram username.");
                return;
            }

            // Format the user information into a caption
            const caption = formatInstagramCaption(response);

            // Construct context info message
            const contextInfoMessage = {
                image: { url: response.profile_pic_url },
                caption: caption,
                contextInfo: {
                    mentionedJid: [message.sender],
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363298577467093@newsletter',
                        newsletterName: "Iᴢᴜᴍɪ-ᴠ3",
                        serverMessageId: -1
                    }
                }
            };

            // Send the profile picture with the caption and context info
            await message.client.sendMessage(message.jid, contextInfoMessage);

        } catch (error) {
            console.error("Error fetching Instagram information:", error);
            await message.reply("Error fetching Instagram information. Please try again later.");
        }
    }
);

function formatInstagramCaption(data) {
    return `*Instagram User Information:*\n\n` +
           `*Username:* ${data.username}\n` +
           `*Full Name:* ${data.full_name}\n` +
           `*Biography:* ${data.biography || 'N/A'}\n` +
           `*Followers:* ${data.followers_count}\n` +
           `*Following:* ${data.following_count}\n` +
           `*Posts:* ${data.post_count}`;
}
