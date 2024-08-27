const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

const words = ["python", "java", "javascript", "swift", "ruby"];

module.exports = {
  name: "hangman",
  description: "Play a game of Hangman!",
  async execute(interaction) {
    const word = words[Math.floor(Math.random() * words.length)].toUpperCase();
    const wordArray = word.split("");
    const guessedLetters = new Set();
    const maxAttempts = 6;
    let attempts = 0;
    let displayWord = wordArray
      .map((letter) => (guessedLetters.has(letter) ? letter : "_"))
      .join(" ");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("guess_letter")
        .setLabel("Guess Letter")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("reveal_word")
        .setLabel("Reveal Word")
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({
      content: `**Hangman Game Started! \nGuess A Programming Language **\n\n**Word:** \`${displayWord}\`\n**Attempts Left:** \`${
        maxAttempts - attempts
      }\``,
      components: [row],
    });

    const filter = (i) =>
      i.customId === "guess_letter" || i.customId === "reveal_word";
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 300000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "guess_letter") {
        await i.reply("Please send your guessed letter.");

        const msgFilter = (m) =>
          m.author.id === interaction.user.id &&
          m.content.length === 1 &&
          /^[A-Z]$/i.test(m.content);
        const msgCollector = interaction.channel.createMessageCollector({
          filter: msgFilter,
          time: 30000,
        });

        msgCollector.on("collect", async (msg) => {
          const guess = msg.content.toUpperCase();

          guessedLetters.add(guess);

          if (wordArray.includes(guess)) {
            displayWord = wordArray
              .map((letter) => (guessedLetters.has(letter) ? letter : "_"))
              .join(" ");
            if (!displayWord.includes("_")) {
              await interaction.followUp(
                `**Congratulations!** You've guessed the word: \`${displayWord}\``
              );
              collector.stop();
              return;
            }
          } else {
            attempts++;
          }

          if (attempts >= maxAttempts) {
            await interaction.followUp(
              `**Game Over!** The word was: \`${word}\``
            );
            collector.stop();
            return;
          }

          await interaction.followUp(
            `**Word:** \`${displayWord}\`\n**Attempts Left:** \`${
              maxAttempts - attempts
            }\``
          );
        });

        msgCollector.on("end", async (collected) => {
          if (collected.size === 0) {
            await i.followUp("You took too long to guess. The game has ended.");
            collector.stop();
          }
        });
      } else if (i.customId === "reveal_word") {
        await i.reply(`The word was: \`${word}\``);
        collector.stop();
      }
    });
  },
};
