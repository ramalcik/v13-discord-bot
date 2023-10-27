const nameData = require("../../schemas/names")
const {red, green } = require("../../configs/emojis.json")
const conf = require("../../configs/setup.json");
const moment = require("moment")
moment.locale("tr")
module.exports = {
  conf: {
    aliases: [],
    name: "isimler",
    help: "isimler [kullanıcı]",
    category: "kayıt"
  },
  run: async (client, message, args, embed, prefix) => { 
        if(!conf.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !conf.sahipRolu.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) 
    {
    message.react(red)
    message.reply({ content:`Yeterli yetkin yok!`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const data = await nameData.findOne({ guildID: message.guild.id, userID: member.user.id });
   

    const papaz = embed
    .setThumbnail(uye.user.displayAvatarURL({ dynamic: true, size: 2048 }))
    .setAuthor({ name: `❗ ${member.user.username} adlı kullanıcının isim geçmişi;` })
    .setFooter(`Toplamda ${data ? `${data.names.length}` : "0"} kere ismi değiştirilmiş.`)
    .setDescription(`
    ${green} ${data ? `**${data.names.length}**` : "0"} isim geçmişi bulundu.

    ${data ? data.names.splice(0, 20).map((x, i) => `\` ${i + 1} \` [<t:${Math.floor(x.date / 1000)}:R>] - \` ${x.name} \`  - (${x.rol}) - (<@${x.yetkili}>)`).join("\n") : "Bu kullanıcının isim geçmişi bulunmuyor!"}
    `)
    message.channel.send({ embeds: [papaz], ephemeral: false });//data ? data.names.splice(0, 10).map((x, i) => `\`${i + 1}.\` [<t:${Math.floor(x.date / 1000)}:R>] \`${x.name} \` (${x.rol})
  }
};
