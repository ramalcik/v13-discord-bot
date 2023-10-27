const conf = require("../../../Papaz-Main/src/configs/sunucuayar.json")
const client = global.bot;
const settings = require("../../../Papaz-Main/src/configs/setup.json")
const { green } = require("../../../Papaz-Main/src/configs/emojis.json");
const papaz = require("../../../Papaz-Main/src/configs/setup.json")
/**
 * @param {GuildMember} member 
 * @param {Message} message 

 */
module.exports = async (message) => {
  if (message.content.toLowerCase() === "tag" || message.content.toLowerCase() === "!tag" || message.content.toLowerCase() === ".tag") {
    message.react(green);
    message.reply({ content: `\`\`\`${papaz.tag}\`\`\``});
  }
};
module.exports.conf = {
  name: "messageCreate"
};