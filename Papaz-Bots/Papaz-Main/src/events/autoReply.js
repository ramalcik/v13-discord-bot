const conf = require("../configs/sunucuayar.json")
const client = global.bot;
const { green } = require("../configs/emojis.json");
/**
 * @param {GuildMember} member 
 * @param {Message} message 

 */
module.exports = async (message) => {
  if (message.content.toLowerCase() === "sa" || message.content.toLowerCase() === "selam" || message.content.toLowerCase() === "slm"|| message.content.toLowerCase() === "selamın aleyküm") {
    message.reply({ content: `Aleyküm Selam Hoşgeldin`});
  }
  if (message.content.toLowerCase() === "hb" || message.content.toLowerCase() === "hosbuldum"|| message.content.toLowerCase() === "hoşbuldum") {
    message.reply({ content: `Naberrr?`});
  }
};
module.exports.conf = {
  name: "messageCreate"
};