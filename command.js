const { REST, Routes } = require("discord.js");
require("dotenv").config(); // Load .env file

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  {
    name: "joke",
    description: "Tells a random joke",
  },
  {
    name: "meme",
    description: "Sends a random meme",
  },
  {
    name: "rps",
    description: "Play Rock, Paper, Scissors",
    options: [
      {
        name: "choice",
        type: 3, // Correct type for STRING
        description: "Your choice: rock, paper, or scissors",
        required: true,
        choices: [
          { name: "Rock", value: "rock" },
          { name: "Paper", value: "paper" },
          { name: "Scissors", value: "scissors" },
        ],
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

async function refreshCommands() {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

// Call the async function
refreshCommands();
