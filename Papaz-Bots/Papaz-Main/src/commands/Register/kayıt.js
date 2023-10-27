const { MessageEmbed, Client, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const coin = require("../../schemas/coin");
const toplams = require("../../schemas/toplams");
const conf = require("../../configs/setup.json");
const kayitg = require("../../schemas/kayitgorev");
const settings = require("../../../../../config.json")
const { red, green, kadin,erkek } = require("../../configs/emojis.json")
const isimler = require("../../schemas/names");
const regstats = require("../../schemas/registerStats");
const otokayit = require("../../schemas/otokayit");
const moment = require("moment")
moment.locale("tr")

const client = global.bot;

module.exports = {
  conf: {
    aliases: ["kayit", "kayıt", "kadın", "Kadın", "k", "kadin", "Kadin", "Woman", "kız", "Kız", "erkek", "Erkek", "e", "ERKEK", "Man", "man"],
    name: "kayıt",
    help: "kayıt [üye] [isim] [yaş]",
    category: "kayıt"
  },
  run: async (client, message, args, embed, prefix) => {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])


    if (!conf.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !conf.sahipRolu.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) {
      message.react(red)
      message.reply({ content: `Yeterli yetkin yok!` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
      return
    }
    if (!uye) {
      message.react(red)
      message.reply({ content: `Bir kullanıcı etiketlemelisin ya da ID'sini girmelisin.\nÖrn: .k @Papaz 17` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
      return
    }
    if (conf.erkekRolleri.some(x => member.roles.cache.has(x)) && !papaz.kizRolleri.some(x => member.roles.cache.has(x))) {
      message.channel.send({ content: "Bu üye zaten kayıtlı durumda yanlış kayıt ettiyseniz eğer kayıtsız atarak tekrar kayıt edebilirsiniz." }).then((e) => setTimeout(() => { e.delete(); }, 5000));
      message.react(red)
      return
    }
    if (message.author.id === uye.id) {
      message.react(red)
      message.reply({ content: `Kendini kaydedemezsin!` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
      return
    }
    if (!uye.manageable) {
      message.react(red)
      message.reply({ content: `Böyle birisini kayıt edemiyorum!` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
      return
    }
    if (message.member.roles.highest.position <= uye.roles.highest.position) {
      message.react(red)
      message.reply({ content: `Belirttiğin kişinin yetkisi senden yüksek!` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
      return
    }
    const data = await isimler.findOne({ guildID: message.guild.id, userID: uye.user.id });
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase() + arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || "";
    if (!isim && !yaş) {
      message.react(red)
      message.reply({ content: `\`${prefix}kayıt <@Papaz/ID> <Isim> <Yas> \`` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
      return
    }

    const tagModedata = await regstats.findOne({ guildID: message.guild.id })
    if (tagModedata && tagModedata.tagMode === true) {
      if (!uye.user.username.includes(papaz.tag) && !uye.roles.cache.has(papaz.vipRole) && !uye.roles.cache.has(papaz.boosterRolu)) return message.reply({ embeds: [embed.setDescription(`${uye.toString()} isimli üyenin kullanıcı adında tagımız (\` ${papaz.tag} \`) olmadığı, <@&${papaz.boosterRolu}>, <@&${papaz.vipRole}> Rolü olmadığı için isim değiştirmekden başka kayıt işlemi yapamazsınız.`)] });
    }

    if (!yaş) {
      setName = `${conf.ikinciTag} ${isim} Satho`;
    } else {
      setName = `${conf.ikinciTag} ${isim} | ${yaş} `;
    }

    uye.setNickname(`${setName}`).catch(err => message.reply({ content: `İsim çok uzun.` }))
    const datas = await regstats.findOne({ guildID: message.guild.id, userID: message.member.id });

    if (!uye.roles.cache.has(conf.erkekRolleri) && !uye.roles.cache.has(conf.kizRolleri)) {

      const row = new MessageActionRow()
        .addComponents(

          new MessageButton()
            .setCustomId("MAN")
            .setLabel("Erkek")
            .setStyle("SECONDARY")
            .setEmoji("916010225289560074"),

          new MessageButton()
            .setCustomId("WOMAN")
            .setLabel("Kadın")
            .setStyle("SECONDARY")
            .setEmoji("916010235200679996"),


        );

      const row2 = new MessageActionRow()
        .addComponents(

          new MessageButton()
            .setCustomId("MAN")
            .setLabel("Erkek")
            .setStyle("SECONDARY")
            .setEmoji("916010225289560074")
            .setDisabled(true),

          new MessageButton()
            .setCustomId("WOMAN")
            .setLabel("Kadın")
            .setStyle("SECONDARY")
            .setEmoji("916010235200679996")
            .setDisabled(true),
        );

      const row3 = new MessageActionRow()
        .addComponents(

          new MessageButton()
            .setCustomId("MAN")
            .setLabel("Erkek")
            .setStyle("SECONDARY")
            .setEmoji("916010225289560074")
            .setDisabled(true),

          new MessageButton()
            .setCustomId("WOMAN")
            .setLabel("Kadın")
            .setStyle("SECONDARY")
            .setEmoji("916010235200679996")
            .setDisabled(true),
        );
      const row4 = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('kayit')
            .setPlaceholder('Kullanıcının Geçmiş İsimleri:')
            .addOptions([
              {
                label: `İsimler`,
                description: `Kullanıcının Geçmiş İsimleri:`,
                emoji: "1081531806710497340",
                value: "papaz-kayit",
              },
            ]),
        );

      let erkekRolleri = conf.erkekRolleri;
      let kizRolleri = conf.kizRolleri;

      const data = await isimler.findOne({ guildID: message.guild.id, userID: uye.user.id });

      message.react(green)
      let papaz = new MessageEmbed()
        .setDescription(`
${green} ${uye.toString()} üyesinin ismi \`\`${setName}\`\` olarak değiştirildi.

 Lütfen kullanıcının cinsiyetini belirlemek için aşağıdaki butonlara basınız
`)

      let msg = await message.channel.send({ embeds: [papaz], components: [row4, row], })
      const filter = i => i.user.id == message.author.id
      let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })

      const data2 = await isimler.findOne({ guildID: message.guild.id, userID: uye.user.id });


      collector.on("collect", async (menu) => {
        if (menu.customId === "kayit") {
          if (menu.values[0] === "papaz-kayit") {
            await menu.deferUpdate();
            const embeds = new MessageEmbed()
              .setDescription(`${data ? data.names.splice(0, 10).map((x, i) => `\` ${i + 1} \` [<t:${Math.floor(x.date / 1000)}:R>] - \` ${x.name} \`  - (${x.rol})`).join("\n") : "Bu kullanıcının isim geçmişi bulunmuyor!"}`)
            menu.followUp({ embeds: [embeds], ephemeral: true })
          }
        }
      })

      collector.on("collect", async (button) => {
        if (button.customId === "MAN") {

          let papaz = new MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription(`
  ${uye.toString()} üyesinin ismi \`\`${setName}\`\` olarak değiştirildi.

  **ERKEK** olarak kayıt edildi!
  `)

          if (msg) msg.delete();
          button.channel.send({ embeds: [papaz], components: [row2], ephemeral: false });

          await uye.roles.add(conf.erkekRolleri)
          await uye.roles.remove(conf.unregRoles)
          await toplams.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $push: { toplams: uye.user.id } }, { upsert: true });
          await regstats.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { top: 1, topGuild24: 1, topGuild7: 1, top24: 1, top7: 1, top14: 1, erkek: 1, erkek24: 1, erkek7: 1, erkek14: 1, }, }, { upsert: true });
          await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: uye.user.id }, { $push: { names: { name: uye.displayName, yetkili: message.author.id, rol: conf.erkekRolleri.map(x => `<@&${x}>`).join(" , "), date: Date.now() } } }, { upsert: true });
          const kayitgData = await kayitg.findOne({ guildID: message.guild.id, userID: message.author.id });
          if (kayitgData) {
            await kayitg.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { kayit: 1 } }, { upsert: true });
          }

          if (conf.chatChannel && client.channels.cache.has(conf.chatChannel)) client.channels.cache.get(conf.chatChannel).send({ content: `${erkek} **${uye}** Sunucuya giriş yapdı hoşgeldin seni görmek güzel` }).then((e) => setTimeout(() => { e.delete(); }, 20000));

          await otokayit.updateOne({
            userID: uye.user.id
          }, {
            $set: {
              userID: uye.user.id,
              roleID: erkekRolleri,
              name: isim,
              age: yaş
            }
          }, {
            upsert: true
          }).exec();

        }
        if (button.customId === "WOMAN") {

          let papaz = new MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription(`
${uye.toString()} üyesinin ismi \`\`${setName}\`\` olarak değiştirildi.

**KADIN** olarak kayıt edildi!
`)

          if (msg) msg.delete();
          button.channel.send({ embeds: [papaz], components: [row3], ephemeral: false });

          await uye.roles.add(conf.kizRolleri)
          await uye.roles.remove(conf.unregRoles)
          await toplams.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $push: { toplams: uye.user.id } }, { upsert: true });
          await regstats.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { top: 1, topGuild24: 1, topGuild7: 1, top24: 1, top7: 1, top14: 1, kız: 1, kız24: 1, kız7: 1, kız14: 1, }, }, { upsert: true });
          await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: uye.user.id }, { $push: { names: { name: uye.displayName, yetkili: message.author.id, rol: conf.kizRolleri.map(x => `<@&${x}>`).join(" , "), date: Date.now() } } }, { upsert: true });
          const kayitgData = await kayitg.findOne({ guildID: message.guild.id, userID: message.author.id });
          if (kayitgData) {
            await kayitg.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { kayit: 1 } }, { upsert: true });
          }

          if (conf.chatChannel && client.channels.cache.has(conf.chatChannel)) client.channels.cache.get(conf.chatChannel).send({ content: `${kadin} **${uye}** Sunucuya giriş yapdı hoşgeldin seni görmek güzel` }).then((e) => setTimeout(() => { e.delete(); }, 20000));

          await otokayit.updateOne({
            userID: uye.user.id
          }, {
            $set: {
              userID: uye.user.id,
              roleID: kizRolleri,
              name: isim,
              age: yaş
            }
          }, {
            upsert: true
          }).exec();
        }
      });
    }
  }
}
