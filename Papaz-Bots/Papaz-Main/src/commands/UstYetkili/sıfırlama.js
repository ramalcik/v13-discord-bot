const moment = require("moment");
const cezapuans = require("../../schemas/cezapuan");
const ceza = require("../../schemas/ceza")
const name = require("../../schemas/names");
const penals = require("../../schemas/penals");
const messageUserChannel = require("../../schemas/messageUserChannel");
const voiceUserChannel = require("../../schemas/voiceUserChannel");
const messageUser = require("../../schemas/messageUser");
const conf = require("../../configs/setup.json");
const voiceUser = require("../../schemas/voiceUser");
const regstats = require("../../schemas/registerStats");
const voiceUserParent = require("../../schemas/voiceUserParent");
const inviterSchema = require("../../schemas/inviter");
require("moment-duration-format");
const { kirmiziok, green, red, star } = require("../../configs/emojis.json");
const { TeamMember, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  conf: {
    aliases: ["sf", "sıfırla"],
    name: "sıfırla",
    help: "sıfırla",
    category: "yönetim"
  },

  run: async (client, message, args, embed) => {
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      message.reply({ content: "Bu işlemi yapamazsın dostum!" }).then((e) => setTimeout(() => { e.delete(); }, 5000));
      message.react(red)
      return;
    }
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    var DeleteName = new MessageButton()
      .setLabel("Kayıt")
      .setCustomId("isim_sıfırla")
      .setStyle("SECONDARY")

    var DeletePenalty = new MessageButton()
      .setLabel("Cezalar")
      .setCustomId("cezapuan_sıfırla")
      .setStyle("PRIMARY")

    var DeletePenal = new MessageButton()
      .setLabel("Sicil")
      .setCustomId("sicil_sıfırla")
      .setStyle("SUCCESS")

    var DeleteStat = new MessageButton()
      .setLabel("Stat")
      .setCustomId("stat_sıfırla")
      .setStyle("DANGER")

    var Iptal = new MessageButton()
      .setLabel("İptal")
      .setCustomId("iptal_button")
      .setStyle("SECONDARY")

    const row = new MessageActionRow()
      .addComponents([DeleteName, DeletePenalty, DeletePenal, DeleteStat, Iptal])
      
    embed.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) }).setTimestamp().setColor(message.author.displayHexColor).setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true }) }).setThumbnail(message.guild.iconURL({ dynamic: true }))
    embed.addField(`VERİ SIFIRLAMA PANELİ`, `
\` ❯ \` İsim Sıfırlama
\` ❯ \` Ceza Puan Sıfırlama
\` ❯ \` Sicil Sıfırlama
\` ❯ \` Stat Sıfırlama

${member.toString()} üyesine ait sıfırlamak istediğin veriyi aşağıdaki butonlar yardımıyla sıfırlayabilirsiniz.
`)

    let msg = await message.channel.send({ embeds: [embed], components: [row] });
    var filter = (button) => button.user.id === message.author.id;

    let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })
    collector.on("collect", async (button) => {

      if (button.customId === "isim_sıfırla") {
        await button.deferUpdate();
        await name.deleteMany({ userID: member.user.id, guildID: message.guild.id })
        const isim = new MessageEmbed()
          .setDescription(`${green} ${member.toString()} üyesinin isim geçmişi ${message.author} tarafından \`${moment(Date.now()).format("LLL")}\` tarihinde temizlendi!`)

        msg.edit({
          embeds: [isim],
          components: []
        })

      }

      if (button.customId === "cezapuan_sıfırla") {
        await button.deferUpdate();
        await cezapuans.deleteMany({ userID: member.user.id, guildID: message.guild.id })
        await ceza.deleteMany({ userID: member.user.id, guildID: message.guild.id })
        const cezapuan = new MessageEmbed()
          .setDescription(`${green}  ${member.toString()} üyesinin ceza puanı ${message.author} tarafından \`${moment(Date.now()).format("LLL")}\` tarihinde temizlendi!`)


        msg.edit({
          embeds: [cezapuan],
          components: []
        })
      }
      if (button.customId === "sicil_sıfırla") {
        await button.deferUpdate();
        await penals.deleteMany({ userID: member.user.id, guildID: message.guild.id })
        const sicil = new MessageEmbed()
          .setDescription(`${green}  ${member.toString()} üyesinin sicili ${message.author} tarafından \`${moment(Date.now()).format("LLL")}\` tarihinde temizlendi!`)

        msg.edit({
          embeds: [sicil],
          components: []
        })
      }

      if (button.customId === "stat_sıfırla") {
        await button.deferUpdate();
        await messageUserChannel.deleteMany({ userID: member.user.id, guildID: message.guild.id })
        await voiceUserChannel.deleteMany({ userID: member.user.id, guildID: message.guild.id })
        await voiceUser.deleteMany({ userID: member.user.id, guildID: message.guild.id })
        await regstats.deleteMany({ userID: member.user.id, guildID: message.guild.id })
        await messageUser.deleteMany({ userID: member.user.id, guildID: message.guild.id })
        await voiceUserParent.deleteMany({ userID: member.user.id, guildID: message.guild.id })
        await inviterSchema.deleteMany({ userID: member.user.id, guildID: message.guild.id })

        const stat = new MessageEmbed()
          .setDescription(`${green}  ${member.toString()} üyesinin istatistiği ${message.author} tarafından \`${moment(Date.now()).format("LLL")}\` tarihinde temizlendi!`)

        msg.edit({
          embeds: [stat],
          components: []
        })
      }

      if (button.customId === "iptal_button") {
        await button.deferUpdate();
        const iptal = new MessageEmbed()
          .setDescription(`${green} Sıfırlama işlemi iptal edildi`)

        msg.edit({
          embeds: [iptal],
          components: []
        })
      }


    })
  }
};
