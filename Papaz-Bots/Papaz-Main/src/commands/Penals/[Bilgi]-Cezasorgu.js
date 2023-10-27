const moment = require("moment");
const emojis = require("../../configs/emojis.json")
const settings = require("../../../../../config.json")
const penals = require("../../schemas/penals")
moment.locale("tr");
module.exports = {
  conf: {
    aliases: ["cezasorgu","ceza","ceza-sorgu"],
    name: "cezasorgu",
    help: "cezasorgu",
    category: "cezalandırma"
  },

  run: async (client, message, args, embed) => {
    if (isNaN(args[0])) return message.channel.send({ content:"Ceza ID'si bir sayı olmalıdır!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    const data = await penals.findOne({ guildID: message.guild.id, id: args[0] });
    if (!data) return message.channel.send({ content:`${args[0]} ID'li bir ceza bulunamadı!`}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    message.channel.send({ embeds: [embed.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) }).setDescription(`
    Bot Test sunucusunda <@${data.userID}> kullanıcısının ID'si verilen ceza bilgisi aşağıda listelenmiştir.

**Ceza-i İşlemi**
    \`\`\`cs
ID => ${data.id}
Ceza Durumu: ${data.active ? `🔴 (Bitti)` : `🟢 (Aktif)`}
Yetkili => ${client.users.cache.get(data.staff).tag}
Ceza Türü => ${data.type}
Sebep => ${data.reason}
Bitiş Tarihi => ${data.finishDate ? `${moment(data.finishDate).format("LLL")}` : "Bulunmamaktadır."}
\`\`\` 
    `)] });
  },
}