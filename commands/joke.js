const axios = require("axios");

module.exports = {
  name: "joke",
  description: "Tells a random joke",
  async execute(message) {
    try {
      const response = await axios.get(
        "https://official-joke-api.appspot.com/jokes/random"
      );
      const data = response.data;

      message.reply(`${data.setup} - ${data.punchline}`);
    } catch (error) {
      console.error(error);
      message.reply("Sorry, I couldn't fetch a joke at the moment.");
    }
  },
};
