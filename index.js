const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config(); // Load environment variables from .env file

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  message.reply({ content: "Hi I am UnifyBot12" });
});

client.login(process.env.DISCORD_TOKEN);

client.on("interactionCreate", (interaction) => {
  if (interaction.isCommand()) {
    if (interaction.commandName === "ping") {
      interaction.reply("Pong!");
    }
  }
});
