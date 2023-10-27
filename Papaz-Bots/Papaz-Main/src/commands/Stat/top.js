const moment = require("moment");
require("moment-duration-format");
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const messageGuild = require("../../schemas/messageGuild");
const dolar = require("../../schemas/dolar");
const conf = require("../../configs/setup.json");
const voiceGuild = require("../../schemas/voiceGuild");
const regstats = require("../../schemas/registerStats");
const inviter = require("../../schemas/inviter");
const { rewards, miniicon, mesaj2, staff, galp, Muhabbet, star, fill, empty, fillStart, emptyEnd, fillEnd, red, } = require("../../configs/emojis.json");
const { TeamMember, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");

moment.locale("tr");

module.exports = {
  conf: {
    aliases: ["top"],
    name: "top",
    help: "top",
    category: "stat"
  },

  run: async (client, message, args, embed) => {

    const messageUsersData = await messageUser
      .find({ guildID: message.guild.id })
      .sort({ topStat: -1 });

    const voiceUsersData = await voiceUser
      .find({ guildID: message.guild.id })
      .sort({ topStat: -1 });

    const messageGuildData = await messageGuild.findOne({
      guildID: message.guild.id,
    });

    const voiceGuildData = await voiceGuild.findOne({
      guildID: message.guild.id,
    });
    const messageUsers = messageUsersData
      .splice(0, 20)
      .map(
        (x, index) =>
          `\` ${index == 0 ? `<:emote_true:1125343149947113592> ` : `${index + 1}`} \` <@${x.userID
          }>: \`${Number(x.topStat).toLocaleString()} mesaj\``
      )
      .join(`\n`);
    const voiceUsers = voiceUsersData
      .splice(0, 20)
      .map((x, index) => `\` ${index == 0 ? `<:emote_true:1125343149947113592> ` : `${index + 1}`} \` <@${x.userID}>: \`${moment.duration(x.topStat).format("H [saat], m [dakika] s [saniye]")}\``)
      .join(`\n`);

    const mesaj = `Toplam üye mesajları: \`${Number(
      messageGuildData ? messageGuildData.topStat : 0
    ).toLocaleString()} mesaj\`\n\n${messageUsers.length > 0 ? messageUsers : "Veri Bulunmuyor."
      }`;
    const ses = `Toplam ses verileri: \`${moment
      .duration(voiceGuildData ? voiceGuildData.topStat : "Veri Bulunmuyor.")
      .format("H [saat], m [dakika]")}\`\n\n${voiceUsers.length > 0 ? voiceUsers : "Veri Bulunmuyor."
      }`;



    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('detay')
          .setPlaceholder('Sıralama kategorisi seçimi yapın!')
          .addOptions([
            { label: 'Sunucunun En İyileri', description: 'En iyi istatistiğe sahip sahip üyeleri görmek için tıklayınız.', value: 'eniyi' },
            { label: 'Mesaj Sıralaması', description: 'Sunucudaki mesaj sıralamasını görmek için tıklayınız.', value: 'mesaj' },
            { label: 'Ses Sıralaması', description: 'Sunucudaki ses sıralamasını görmek için tıklayınız.', value: 'ses' },
            { label: 'Kayıt Sıralaması', description: 'Sunucudaki kayıt sıralamasını görmek için tıklayınız.', value: 'register' },
            { label: 'Davet Sıralaması', description: 'Sunucudaki davet sıralamasını görmek için tıklayınız.', value: 'davet'},
            { label: 'Dolar Sıralaması', description: 'Sunucudaki dolar sıralamasını görmek için tıklayınız.', value: 'zengin' },
          ]),
      );

    let msg = await message.channel.send({
      content: " ",
      embeds: [
        embed
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
          .setDescription(
            `Aşağıdaki menüden **${message.guild.name
            }** Sunucusunun <t:${Math.floor(
              Date.now() / 1000
            )}:R>  tarihli Tüm zamanlar ve haftalık istatistik verilerini listeleyebilirsiniz.`
          ),
      ],
      components: [
        row
      ]
    });
    var filter = (xd) => xd.user.id === message.author.id;
    let collector = msg.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU', time: 99999999 })


    collector.on("collect", async (interaction) => {

      if (interaction.values[0] === "eniyi") {
        await interaction.deferUpdate();

        const messageUsersData1 = await messageUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
        const voiceUsersData1 = await voiceUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
        const mesajeniyi = messageUsersData1.splice(0, 1).map((x, index) => `<@${x.userID}>`);
        const seseniyi = voiceUsersData1.splice(0, 1).map((x, index) => `<@${x.userID}>`);
        ///
        const messageUsersData2 = await messageUser.find({ guildID: message.guild.id }).sort({ weeklyStat: -1 });
        const voiceUsersData2 = await voiceUser.find({ guildID: message.guild.id }).sort({ weeklyStat: -1 });
        const mesajhaftanıneniyisi = messageUsersData2.splice(0, 1).map((x, index) => `<@${x.userID}>`);
        const seshaftanıneniyisi = voiceUsersData2.splice(0, 1).map((x, index) => `<@${x.userID}>`);

        const embeds = new MessageEmbed()
          .setDescription(`
        🎉 Aşağıda **${message.guild.name}** sunucusunun en iyileri sıralanmaktadır.
        
        \` <:emote_true:1125343149947113592>  En İyi Ses \` ${seseniyi.length > 0 ? seseniyi : "Veri Bulunmuyor."}
        \` <:emote_true:1125343149947113592>  En İyi Mesaj \` ${mesajeniyi.length > 0 ? mesajeniyi : "Veri Bulunmuyor."}
        **---------------------------**
        \` <:emote_true:1125343149947113592>  Haftalık Ses Sıralama \` ${seshaftanıneniyisi.length > 0 ? seshaftanıneniyisi : "Veri Bulunmuyor."}
        \` <:emote_true:1125343149947113592>  Haftalık Mesaj Sıralama \` ${mesajhaftanıneniyisi.length > 0 ? mesajhaftanıneniyisi : "Veri Bulunmuyor."}
        
        En iyiler <t:${Math.floor(Date.now() / 1000)}:R> tarihinde otomatik olarak güncellenmiştir.`)
          .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));

        msg.edit({ embeds: [embeds], components: [row] })
      }

      if (interaction.values[0] === "mesaj") {
        await interaction.deferUpdate();

        const puan = new MessageEmbed()
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))

          .setDescription(`🎉 Aşağıda ${msg.guild.name} sunucusunun genel sohbet(\` mesaj \`) sıralaması listelenmektedir. \n\n${mesaj} \n\nGenel sohbet(\` mesaj \`) sıralaması <t:${Math.floor(Date.now() / 1000)}:R> tarihinde otomatik olarak güncellenmiştir.`, false)
        //sa

        msg.edit({
          embeds: [puan], components: [row],
        });
      }

      if (interaction.values[0] === "ses") {
        await interaction.deferUpdate();

        const puan = new MessageEmbed()
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))

          .setDescription(`🎉 Aşağıda ${msg.guild.name} sunucusunun genel sohbet(\` ses \`) sıralaması listelenmektedir. \n\n${ses} \n\nGenel sohbet(\` ses \`) sıralaması <t:${Math.floor(Date.now() / 1000)}:R> tarihinde otomatik olarak güncellenmiştir.`, false)


        msg.edit({
          embeds: [puan], components: [row],
        });
      }

      if (interaction.values[0] === "register") {
        await interaction.deferUpdate();

        let data = await regstats.find({ guildID: message.guild.id }).sort({ top: -1 });

        let kayit = data.filter((x) => message.guild.members.cache.has(x.userID))
          .splice(0, 20)
          .map((x, i) => `${x.userID === message.author.id ? `\` \` ${i == 0 ? `👑` : `${i + 1}`} \` \` **<@${x.userID}> - Erkek __${x.erkek}__ Kadın __${x.kız}__ (Sen)**` : `\` \`${i == 0 ? `👑` : `${i + 1}.`}\` \` <@${x.userID}> - Erkek __${x.erkek}__ Kadın __${x.kız}__`}`)
          .join("\n");


        const puan = new MessageEmbed()
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))

          .setDescription(`🎉 Aşağıda ${msg.guild.name} sunucusunun genel sohbet(\` Kayıt \`) sıralaması listelenmektedir. \n\n${kayit} \n\nGenel sohbet(\` Kayıt \`) sıralaması <t:${Math.floor(Date.now() / 1000)}:R> tarihinde otomatik olarak güncellenmiştir.`, false)


        msg.edit({
          embeds: [puan], components: [row],
        });
      }

      if (interaction.values[0] === "register") {
        await interaction.deferUpdate();

        let data = await regstats.find({ guildID: message.guild.id }).sort({ top: -1 });

        let kayit = data.filter((x) => message.guild.members.cache.has(x.userID))
          .splice(0, 20)
          .map((x, i) => `${x.userID === message.author.id ? `\` \` ${i == 0 ? `👑` : `${i + 1}`} \` \` **<@${x.userID}> - Erkek __${x.erkek}__ Kadın __${x.kız}__ (Sen)**` : `\` \`${i == 0 ? `👑` : `${i + 1}.`}\` \` <@${x.userID}> - Erkek __${x.erkek}__ Kadın __${x.kız}__`}`)
          .join("\n");


        const puan = new MessageEmbed()
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))

          .setDescription(`🎉 Aşağıda ${msg.guild.name} sunucusunun genel sohbet(\` Kayıt \`) sıralaması listelenmektedir. \n\n${kayit} \n\nGenel sohbet(\` Kayıt \`) sıralaması <t:${Math.floor(Date.now() / 1000)}:R> tarihinde otomatik olarak güncellenmiştir.`, false)


        msg.edit({
          embeds: [puan], components: [row],
        });
      }

      if (interaction.values[0] === "davet") {
        await interaction.deferUpdate();

        let data = await inviter.find({ guildID: message.guild.id }).sort({ top: -1 });

        let davet = data.filter((x) => message.guild.members.cache.has(x.userID))
          .splice(0, 20)
          .map((x, i) => `${x.userID === message.author.id ? `\` \` ${i == 0 ? `👑` : `${i + 1}`} \` \` **<@${x.userID}> - ${x.total} Davet (Sen)**` : `\` \`${i == 0 ? `👑` : `${i + 1}.`}\` \` <@${x.userID}> - **${x.total}** Davet`}`)
          .join("\n");


        const puan = new MessageEmbed()
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))

          .setDescription(`🎉 Aşağıda ${msg.guild.name} sunucusunun genel sohbet(\` Davet \`) sıralaması listelenmektedir. \n\n${davet} \n\nGenel sohbet(\` Davet \`) sıralaması <t:${Math.floor(Date.now() / 1000)}:R> tarihinde otomatik olarak güncellenmiştir.`, false)


        msg.edit({
          embeds: [puan], components: [row],
        });
      }
      if (interaction.values[0] === "zengin") {
        await interaction.deferUpdate();

        const dolarData = await dolar.find({ guildID: message.guild.id }).sort({ dolar: -1 });
        let list = dolarData
          .filter((x) => message.guild.members.cache.has(x.userID))
          .splice(0, 20)
          .map((x, index) => `${x.userID === message.author.id ? `\` ${index + 1} \` <@${x.userID}> \`${Number(x.dolar).toLocaleString()} Dolar\` **(Sen)**` : `\` ${index + 1} \` <@${x.userID}> \`${Number(x.dolar).toLocaleString()} Dolar\``}`)
          .join("\n");

        const embeds = new MessageEmbed()
          .setDescription(`
      🎉 Aşağıda **${message.guild.name}** sunucusunun genel (\` Dolar \`) sıralaması listelenmektedir.
                      
      ${list.length > 0 ? list : "Veri Bulunmuyor."}
                      
      Genel (\` Dolar \`) sıralaması <t:${Math.floor(Date.now() / 1000)}:R> tarihinde otomatik olarak güncellenmiştir.`)
          .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));

        msg.edit({ embeds: [embeds], components: [row] })
      }


    });
  },
};
