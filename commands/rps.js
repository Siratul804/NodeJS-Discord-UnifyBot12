module.exports = {
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
  async execute(interaction) {
    const userChoice = interaction.options.getString("choice");
    const choices = ["rock", "paper", "scissors"];
    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    let outcome;
    if (userChoice === botChoice) {
      outcome = "It's a draw!";
    } else if (
      (userChoice === "rock" && botChoice === "scissors") ||
      (userChoice === "paper" && botChoice === "rock") ||
      (userChoice === "scissors" && botChoice === "paper")
    ) {
      outcome = "You win!";
    } else {
      outcome = "You lose!";
    }

    await interaction.reply(`Bot chose ${botChoice}. ${outcome}`);
  },
};
