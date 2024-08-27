const axios = require("axios");

module.exports = {
  name: "meme",
  description: "Sends a random meme",
  async execute(message) {
    try {
      // Make a GET request to the meme API
      const response = await axios.get("https://meme-api.com/gimme");
      const data = response.data;

      // Check if the response contains a meme URL
      if (data && data.url) {
        message.reply(data.url);
      } else {
        message.reply("Couldn't fetch a meme at the moment. Try again later!");
      }
    } catch (error) {
      console.error("Error fetching meme:", error);
      message.reply("Sorry, I couldn't fetch a meme right now.");
    }
  },
};
