const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const Bot = global.bot;
const allah = require("../../../../../config.json");
var commands = [];

fs.readdirSync("./src/Commands/").forEach((file) => {
  const command = require(`../Commands/${file}`);
  Bot.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
});


Bot.on("ready", () => {

  const rest = new REST({ version: '9' }).setToken(allah.Guard.OtherGuard);

  (async () => {
    try {
      console.log('[KOMUT] Komutlar yükleniyor...');

      await rest.put(
        Routes.applicationCommands(allah.Guard.OtherGuardBotClientID),
        { body: commands },
      );

      console.log('[KOMUT] Komutlar başarıyla yüklendi.');
    } catch (error) {
      console.error(error);
    }
  })();
});
