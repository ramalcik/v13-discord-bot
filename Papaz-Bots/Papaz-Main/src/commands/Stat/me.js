const { voice, mesaj2, star, miniicon, kirmiziok } = require("../../configs/emojis.json");
const messageUserChannel = require("../../schemas/messageUserChannel");
const voiceUserChannel = require("../../schemas/voiceUserChannel");
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const inviteMemberSchema = require("../../schemas/inviteMember");
const regstats = require("../../schemas/registerStats");
const conf = require("../../configs/setup.json");
const voiceUserParent = require("../../schemas/voiceUserParent");
const moment = require("moment");
const axios = require('axios');
const isimler = require("../../schemas/names");
const register = require("../../schemas/registerStats");
const inviterSchema = require("../../schemas/inviter");
require("moment-duration-format");
const { nokta } = require("../../configs/emojis.json");
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");

module.exports = {
  conf: {
    aliases: ["me", "stat"],
    name: "me",
    help: "me",
    category: "stat"
  },

  run: async (client, message, args, embed, prefix) => {

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const inviterData = await inviterSchema.findOne({ guildID: message.guild.id, userID: member.user.id });
    const total = inviterData ? inviterData.total : 0;
    const regular = inviterData ? inviterData.regular : 0;
    const bonus = inviterData ? inviterData.bonus : 0;
    const leave = inviterData ? inviterData.leave : 0;
    const fake = inviterData ? inviterData.fake : 0;
    const invMember = await inviteMemberSchema.find({ guildID: message.guild.id, inviter: member.user.id });
    const daily = invMember ? message.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24).size : 0;
    const weekly = invMember ? message.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24 * 7).size : 0;
    let tagged;
    if (conf.tag && conf.tag.length > 0) tagged = invMember ? message.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && m.user.username.includes(conf.tag)).size : 0;
    else tagged = 0;
    const data = await regstats.findOne({ guildID: message.guild.id, userID: member.id });
    let üye2 = args.length > 0 ? message.mentions.users.first() || await client.users.fetch(args[0]) || message.author : message.author




    const category = async (parentsArray) => {
      const data = await voiceUserParent.find({ guildID: message.guild.id, userID: member.id });
      const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
      let voiceStat = 0;
      for (var i = 0; i <= voiceUserParentData.length; i++) {
        voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
      }
      return moment.duration(voiceStat).format("H [saat], m [dakika] s [saniye]");
    };

    const Active1 = await messageUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });
    const Active2 = await voiceUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });
    let messageTop;
    Active1.length > 0 ? messageTop = Active1.splice(0, 5).map(x => `${nokta} <#${x.channelID}>: \`${Number(x.channelData).toLocaleString()} mesaj\``).join("\n") : messageTop = "Veri bulunmuyor."
    let voiceTop;
    Active2.length > 0 ? voiceTop = Active2.splice(0, 5).map(x => `${nokta} <#${x.channelID}>: \`${moment.duration(x.channelData).format("H [saat], m [dakika]")}\` `).join("\n") : voiceTop = "Veri bulunmuyor."



    const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: member.id });
    const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: member.id });
    const messageWeekly = messageData ? messageData.weeklyStat : 0;
    const voiceWeekly = moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [saat], m [dakika]");
    const messageDaily = messageData ? messageData.dailyStat : 0;
    const voiceDaily = moment.duration(voiceData ? voiceData.dailyStat : 0).format("H [saat], m [dakika]");

    if (member.user.bot) return;


    let nameData = await isimler.findOne({ guildID: message.guild.id, userID: member.id });
    let registerData = await register.findOne({ guildID: message.guild.id, userID: member.id });

    const roles = member.roles.cache.filter(role => role.id !== message.guild.id).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`);
    const rolleri = []
    if (roles.length > 6) {
      const lent = roles.length - 6
      let itemler = roles.slice(0, 6)
      itemler.map(x => rolleri.push(x))
      rolleri.push(`${lent} daha...`)
    } else {
      roles.map(x => rolleri.push(x))
    }
    const members = [...message.guild.members.cache.filter(x => !x.user.bot).values()].sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
    const joinPos = members.map((u) => u.id).indexOf(member.id);
    const previous = members[joinPos - 1] ? members[joinPos - 1].user : null;
    const next = members[joinPos + 1] ? members[joinPos + 1].user : null;
    const bilgi = `${previous ? `**${previous.tag}** > ` : ""}<@${member.id}>${next ? ` > **${next.tag}**` : ""}`
    let üye = message.guild.members.cache.get(member.id)
    let nickname = üye.displayName == member.username ? "" + member.username + " [Yok] " : member.displayName

    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('detay31')
          .setPlaceholder(`${member.user.tag.toString()}'n detaylarını görüntüle! `)
          .addOptions([
            { label: 'Ses İstatistik', description: 'Ses istatistiğininin bilgilerini görüntülemektedir.', value: 'ses' },
            { label: 'Mesaj İstatistik', description: 'Mesaj istatistiğinin bilgilerini görüntülemektedir.', value: 'mesaj' },
            { label: 'Davet İstatistiği', description: 'Davet istatistiğini görüntülemektedir.', value: 'davet' },
            { label: 'Kullanıcı Bilgi', description: 'Kullanıcının bilgilerini görüntülemektedir.', value: 'bilgi' },
            { label: 'Profil Fotoğrafın', description: 'Kullanıcının avatarını görüntülemektedir.', value: 'avatar' },
            { label: 'Bannerin', description: 'Kullanıcının bannerını görüntülemektedir.', value: 'banner' },
            { label: `Menüyü Kapat`, value: 'iptal' },

          ]),
      );


    let papaz = new MessageEmbed()
      .setAuthor({ name: member.displayName, iconURL: member.user.avatarURL({ dynamic: true }) })
      .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
      .setDescription(`
  ${member.toString()} üyesinin <t:${Math.floor(Date.now() / 1000)}:R> tarihinden  itibaren \`${message.guild.name}\` sunucusunda toplam ses ve mesaj bilgilerini menüden seçerek görebilirsiniz.`)

    let msg = await message.channel.send({ embeds: [papaz], components: [row], })
    var filter = (xd) => xd.user.id === message.author.id;
    let collector = msg.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU', time: 99999999 })

    collector.on("collect", async (interaction) => {
      if (interaction.values[0] === "ses") {
        await interaction.deferUpdate();
        const embeds = new MessageEmbed()
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
          .setDescription(`${member.toString()} üyesinin aşağıda **Ses** istatistikleri belirtilmiştir.`)
          .addFields(
            {
              name: " __**Toplam Ses**__", value: `
 \`\`\`fix\n${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\n\`\`\`
  `, inline: true
            },
            {
              name: "__**Haftalık Ses**__", value: `
  \`\`\`fix\n${moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [saat], m [dakika]")}\n\`\`\`
  `, inline: true
            },
            {
              name: "__**Günlük Ses**__", value: `
 \`\`\`fix\n${moment.duration(voiceData ? voiceData.dailyStat : 0).format("H [saat], m [dakika]")}\n\`\`\`
  `, inline: true
            },
          )

        embeds.addField(`**• Sesli Kategori İstatiği:**`, `
        <:emote_true:1125343149947113592> Sohbet Kanalları: \`${await category(papaz.publicParents)}\`
        <:emote_true:1125343149947113592> Kayıt Kanalları: \`${await category(papaz.registerParents)}\`
        <:emote_true:1125343149947113592> Private Kanalları: \`${await category(papaz.privateParents)}\`
        <:emote_true:1125343149947113592> Toplantı Kanalları: \`${await category(papaz.funParents)}\`
        <:emote_true:1125343149947113592> Eğlence Kanalları: \`${await category(papaz.funParents)}\`
        <:emote_true:1125343149947113592> Yayın Kanalları:\`${await category(papaz.funParents)}\`
        <:emote_true:1125343149947113592> Diğer Kanallar: \`${await category(papaz.funParents)}\`
    `, false);
        embeds.addField(`**• Sesli Kanal İstatistiği:**`,
          `${voiceTop} `
          , false);

        msg.edit({
          embeds: [embeds],
          components: [row]
        })
      }
      if (interaction.values[0] === "davet") {
        await interaction.deferUpdate();
        const embeds = new MessageEmbed()
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
          .setDescription(`Aşağıda ${member.toString()} üyesinin detaylı **Davet** istatistikleri görüntülenmektedir.

**❯ Detaylı Davet Bilgisi:**(Toplam **${total}** davet)
 [\`${regular} gerçek, ${bonus} ekstra, ${leave} ayrılmış, ${fake} sahte\`]
`)

        msg.edit({
          embeds: [embeds],
          components: [row]

        })
      }

      if (interaction.values[0] === "mesaj") {
        await interaction.deferUpdate();

        const embeds = new MessageEmbed()
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
          .setDescription(`${member.toString()} üyesinin aşağıda **Mesaj** istatistikleri belirtilmiştir.`)

          .addFields(
            {
              name: "__**Toplam Mesaj**__", value: `
\`\`\`fix
${messageData ? messageData.topStat : 0} mesaj
\`\`\`
`, inline: true
            },
            {
              name: "__**Haftalık Mesaj**__", value: `
\`\`\`fix
${Number(messageWeekly).toLocaleString()} mesaj
\`\`\`
`, inline: true
            },
            {
              name: "__**Günlük Mesaj**__", value: `
\`\`\`fix
${Number(messageDaily).toLocaleString()} mesaj
\`\`\`
`, inline: true
            },
          )

        embeds.addField(`**• Toplam Mesaj İstatistiği;**`, `    

${messageTop}
`, false);


        msg.edit({
          embeds: [embeds],
          components: [row]

        })
      }
      if (interaction.values[0] === "avatar") {
        await interaction.deferUpdate();
        interaction.followUp({ content: `${üye2.displayAvatarURL({ dynamic: true, size: 4096 })}`, ephemeral: true });
      }

      if (interaction.values[0] === "banner") {
        await interaction.deferUpdate();
        async function bannerXd(user, client) {
          const response = await axios.get(`https://discord.com/api/v9/users/${user}`, { headers: { 'Authorization': `Bot ${client.token}` } });
          if (!response.data.banner) return `https://media.discordapp.net/attachments/938786568175513660/972982817359274024/Banner_bulunmamakta.png`
          if (response.data.banner.startsWith('a_')) return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.gif?size=512`
          else return (`https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.png?size=512`)

        }
        let banner = await bannerXd(üye.id, client)
        interaction.followUp({ content: `${banner}`, ephemeral: true });
      }

      if (interaction.values[0] === "bilgi") {
        await interaction.deferUpdate();

        const embeds = new MessageEmbed()
          .setDescription(`🎉 Aşağıda ${member} kullanıcısının kullanıcı bilgisi görüntülenmektedir.`)
          .addField(`❯ Kullanıcı Bilgisi`, `
  \` • \` Hesap: ${member}
  \` • \` Kullanıcı ID: ${member.id}
  \` • \` Kuruluş Tarihi: <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>
  `)
          .addField(`❯ Sunucu Bilgisi`, `
  \` • \` Sunucu İsmi: ${nickname}
  \` • \` Katılım Tarihi: <t:${Math.floor(member.joinedAt / 1000)}:R>
  \` • \` Katılım Sırası: ${(message.guild.members.cache.filter(a => a.joinedTimestamp <= member.joinedTimestamp).size).toLocaleString()}/${(message.guild.memberCount).toLocaleString()}
  \` • \` Katılım Bilgisi: ${bilgi}
  
  \` • \` Bazı Rolleri: (${rolleri.length}): ${rolleri.join(", ")}
  \` • \` İsim geçmişi:  **${nameData ? `${nameData.names.length}` : "0"}** 
  ${nameData ? nameData.names.splice(0, 1).map((x, i) => `\` ${x.name} \` ${x.sebep ? `(${x.sebep})` : ""} ${x.rol ? `(${x.rol})` : ""}`).join("\n") : ""}
  `)
        if (member.permissions.has("ADMINISTRATOR") || papaz.teyitciRolleri.some(x => member.roles.cache.has(x)))
          embeds.addField(`❯ Yetkili Bilgisi`,
            `• Toplam kayıt: ${registerData ? registerData.top : 0} • Erkek kayıt : ${registerData ? registerData.erkek : 0} • Kadın kayıt : ${registerData ? registerData.kız : 0}`)
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
            .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));

        msg.edit({ embeds: [embeds], components: [row] })
        message.react(green)
      }
      if (interaction.values[0] === "iptal") {
        await interaction.deferUpdate();
        if (msg) msg.delete();
      }

    })
  }

};

