const { Client, GatewayIntentBits, Collection } = require("discord.js");
require("dotenv").config(); // Load environment variables from .env file
const fs = require("fs").promises;
const path = require("path");

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Collection to hold commands
client.commands = new Collection();

// Load commands asynchronously
async function loadCommands() {
  try {
    const commandDir = path.join(__dirname, "./commands");
    const files = await fs.readdir(commandDir);

    // Filter for JavaScript files
    const commandFiles = files.filter((file) => file.endsWith(".js"));

    // Load each command file
    for (const file of commandFiles) {
      const command = require(path.join(commandDir, file));
      client.commands.set(command.name, command);
    }

    console.log("Commands successfully loaded.");
  } catch (error) {
    console.error("Error loading commands:", error);
  }
}

// Load commands and log in the bot
loadCommands().then(() => {
  client.login(process.env.DISCORD_TOKEN);
});

// Handle incoming messages (for message-based commands)
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const prefix = "!";
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (command) {
    try {
      command.execute(message, args, client);
    } catch (error) {
      console.error(error);
      message.reply("There was an error executing that command.");
    }
  }
});

// Handle interactions (for slash commands)
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (command) {
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error executing that command.",
        ephemeral: true,
      });
    }
  }
});
