const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { star, kirmiziok } = require("../../configs/emojis.json")
let ayar = require("../../configs/sunucuayar.json");
const conf = require("../../configs/setup.json");
let sunucu = require("../../../../../config.json");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  conf: {
    aliases: ["control", "kontrol"],
    name: "kontrol",
    help: "kontrol",
    category: "yönetim"
  },

  run: async (client, message, args, durum, kanal) => {

    if (!conf.sahipRolu.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) {
      message.reply({ content: `Yetkin bulunmamakta dostum.` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
      return
    }
    const etkinlik = await client.guilds.cache.get(sunucu.GuildID).roles.cache.find(x => x.name.includes(ayar.etkinlik)).id
    const cekilis = await client.guilds.cache.get(sunucu.GuildID).roles.cache.find(x => x.name.includes(ayar.cekilis)).id

    let taglilar = message.guild.members.cache.filter(s => s.user.username.includes(papaz.tag) && !s.roles.cache.get(papaz.ekipRolu))
    let et = message.guild.members.cache.filter(member => !member.roles.cache.has(cekilis) || !member.roles.cache.has(etkinlik)).size;
    let papazcim = message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guild.id).size == 0)

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton().setStyle('PRIMARY').setLabel('1').setCustomId('kayıtsızdagit'),
        new MessageButton().setStyle('PRIMARY').setLabel('2').setCustomId('tagrol'),
        new MessageButton().setStyle('PRIMARY').setLabel('3').setCustomId('ecdagit'),
      );

    let papaz = new MessageEmbed()
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setDescription(`
${message.member.toString()}, ${message.guild.name} Sunucusunda rolü olmayan üyelerin rol dağıtım menüsü aşağıda verilmiştir.

\` 1 \` Kayıtsız Rol: (**${papazcim.size}** kişi)
\` 2 \` Taglı Rol: (**${taglilar.size}** kişi)
\` 3 \` Etkinlik/Çekiliş Rol: (**${et}** kişi)
`)
    let msg = await message.channel.send({ embeds: [papaz], components: [row] })

    var filter = (button) => button.user.id === message.author.id;

    let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })

    collector.on("collect", async (button) => {

      if (button.customId === 'ecdagit') {

        let papaz = message.guild.members.cache.filter(member => !member.roles.cache.has(etkinlik) || !member.roles.cache.has(cekilis))
        button.reply({
          content: `
Etkinlik/Çekiliş rolü olmayan ${papaz.size} kullanıcıya etkinlik, çekiliş rolleri verildi !`
        })
        message.guild.members.cache.filter(member => !member.roles.cache.has(etkinlik) || !member.roles.cache.has(cekilis)).map(x => x.roles.add([etkinlik, cekilis]));
      }
      if (button.customId === 'tagrol') {

        let taglilar = message.guild.members.cache.filter(s => s.user.username.includes(papaz.tag) && !s.roles.cache.has(papaz.ekipRolu))

        button.reply({
          content: `
Tagı olup rolü olmayan ${taglilar.size} kullanıcıya rol verildi.

Tag Rolü verilen kullanıcılar;
${taglilar.map(x => x || "Rolü olmayan Kullanıcı bulunmamaktadır.")}`
        })

        message.guild.members.cache.filter(s => s.user.username.includes(papaz.tag) && !s.roles.cache.has(papaz.ekipRolu)).map(x => x.roles.add(papaz.ekipRolu))
      }
      if (button.customId === 'kayıtsızdagit') {

        let papazcim = message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guild.id).size == 0)

        button.reply({
          content: `
Kayıtsız rolü olmayan ${papazcim.size} kullanıcıya kayıtsız rolü verildi !

Kayıtsız Rolü verilen kullanıcılar;
${papazcim.map(x => x || "Rolü olmayan Kullanıcı bulunmamaktadır.")} `
        })

        message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guild.id).size == 0).map(x => x.roles.add(papaz.unregRoles))

      }
    });
  }
}
