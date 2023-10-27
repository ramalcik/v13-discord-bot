const { Client, Collection } = require("discord.js");
const allah = require("../../../config.json");

const client = (global.bot = new Client({
  fetchAllMembers: true,
  intents: 32767,
}));
const mongoose = require("mongoose");

client.commands = new Collection();

mongoose
.connect(allah.Guard.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
client.login(allah.Guard.OtherGuard);
require("../Papaz-Guard-I/src/Handlers/CommandHandler");
require("../Papaz-Guard-I/src/Handlers/EventHandler");
require("./bot.js");
console.log("Database bağlantısı tamamlandı!")
})