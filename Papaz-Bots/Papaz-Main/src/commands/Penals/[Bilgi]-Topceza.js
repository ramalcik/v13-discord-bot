
const { green , red } = require("../../configs/emojis.json")
const { MessageEmbed } = require("discord.js");
const ceza = require("../../schemas/ceza");
const moment = require("moment")
moment.locale("tr");

module.exports = {
  conf: {
    aliases: ["topceza","tc"],
    name: "topceza",
    help: "topceza",
    category: "cezalandırma"
  },

  run: async (client, message, args, embed) => {
    let cezaTop = await ceza.find({ guildID: message.guild.id }).sort({ top: -1 });
    if (!cezaTop.length) 
    {
    message.react(red)
    message.channel.send({ content:"Herhangi bir ceza verisi bulunamadı!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    cezaTop = cezaTop.filter((x) => message.guild.members.cache.has(x.userID)).splice(0, 10);
    message.react(green)
  let papaz = new MessageEmbed()
.setAuthor("TOP CEZA LİSTESİ")
 .setDescription(cezaTop.map((x, i) => `\` ${i + 1} \` <@${x.userID}> Toplam **${x.top}**`).join("\n"))
 let msg = await message.channel.send({ embeds: [papaz]});
}};
