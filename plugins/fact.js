const { izumi, mode, getJson } = require("../lib/");
const config = require("../config");

izumi(
    {
        pattern: "fact",
        fromMe: mode,
        desc: "fact commands",
        type: "info",
    },
    async (message) => {
        try {
            let factCommands = "*HERE ARE THE AVAILABLE COMMANDS:*\n\n";
            factCommands += "╭─────────────┈⚆\n";
            factCommands += "│  *1. サ Animal Fact: `.animal-fact`*\n";
            factCommands += "│─╖\n";
            factCommands += "│ Fetches a random animal fact.\n";
            factCommands += "╰─────────────┈⚆\n";
            factCommands += "│  *2. サ Tech Fact: `.tech-fact`*\n";
            factCommands += "│─╖\n";
            factCommands += "│ Fetches a random technology fact.\n";
            factCommands += "╰─────────────┈⚆\n";
            factCommands += "│  *3. サ Space Fact: `.space-fact`*\n";
            factCommands += "│─╖\n";
            factCommands += "│ Fetches a random space fact.\n";
            factCommands += "╰─────────────┈⚆\n";
            factCommands += "│  *4. サ History Fact: `.history-fact`*\n";
            factCommands += "│─╖\n";
            factCommands += "│ Fetches a random history fact.\n";
            factCommands += "╰─────────────┈⚆\n";
            factCommands += "│  *5. サ Cat Fact: `.cat-fact`*\n";
            factCommands += "│─╖\n";
            factCommands += "│ Fetches a random cat fact.\n";
            factCommands += "╰─────────────┈⚆";

            const contextInfoMessage = {
                text: factCommands,
                contextInfo: {
                    mentionedJid: [message.sender],
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363298577467093@newsletter',
                        newsletterName: config.BOT_NAME,
                        serverMessageId: -1
                    }
                }
            };

            await message.client.sendMessage(message.jid, contextInfoMessage);
        } catch (error) {
            console.error("Error fetching fact commands:", error);
        }
    }
);

const fetchFact = async (url, formattedMessage, message) => {
    try {
        let response = await getJson(url);
        let fact = response.fact;
        formattedMessage = `🐾 **Here is your Fact** 🐾\n\n${fact}`;

        const contextInfoMessage = {
            text: formattedMessage,
            contextInfo: {
                mentionedJid: [message.sender],
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363298577467093@newsletter',
                    newsletterName: config.BOT_NAME,
                    serverMessageId: -1
                }
            }
        };

        await message.client.sendMessage(message.jid, contextInfoMessage);
    } catch (error) {
        console.error(`Error fetching ${formattedMessage.toLowerCase()}:`, error);
    }
};

izumi(
    {
        pattern: "animal-fact",
        fromMe: mode,
        desc: "Fact about animals",
        type: "info",
    },
    async (message) => {
        await fetchFact(
            eypzApi + "details/animals",
            "🐾 **Here is your Animal Fact** 🐾",
            message
        );
    }
);

izumi(
    {
        pattern: "tech-fact",
        fromMe: mode,
        desc: "Fact about technology",
        type: "info",
    },
    async (message) => {
        await fetchFact(
            eypzApi + "details/technology",
            "💻 **Here is your Technology Fact** 💻",
            message
        );
    }
);

izumi(
    {
        pattern: "space-fact",
        fromMe: mode,
        desc: "Fact about space",
        type: "info",
    },
    async (message) => {
        await fetchFact(
            eypzApi + "details/space",
            "🛰️ **Here is your Space Fact** ☄️",
            message
        );
    }
);

izumi(
    {
        pattern: "history-fact",
        fromMe: mode,
        desc: "Fact about history",
        type: "info",
    },
    async (message) => {
        await fetchFact(
            eypzApi + "details/history",
            "📖 **Here is your History Fact** 📖",
            message
        );
    }
);

izumi(
    {
        pattern: "cat-fact",
        fromMe: mode,
        desc: "Fact about cats",
        type: "info",
    },
    async (message) => {
        await fetchFact(
            eypzApi + "cat-fact",
            "🐱 **Here is your Cat Fact** 🐱",
            message
        );
    }
);
