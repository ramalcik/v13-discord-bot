const coin = require("../../schemas/coin");
const moment = require("moment");
const ceza = require("../../schemas/ceza");
const cezapuan = require("../../schemas/cezapuan")
const papaz = require("../../configs/setup.json");
const banLimit = new Map();
moment.locale("tr");
const conf = require("../../configs/sunucuayar.json")
const settings = require("../../../../../config.json")
const { red, green, Cezaa, Revuu, kirmiziok } = require("../../configs/emojis.json")

module.exports = {
  conf: {
    aliases: ["ban","yargı"],
    name: "ban",
    help: "ban",
    category: "cezalandırma"
  },

  run: async (client, message, args, embed) => {
        if (!message.member.permissions.has("BAN_MEMBERS") &&  !conf.banHammer.some(x => message.member.roles.cache.has(x))) { message.channel.send({ content:"Yeterli yetkin yok!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    message.react(red)
    return }
    if (!args[0]) { message.channel.send({ content:"Bir üye belirtmeyi unuttun!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    message.react(red)
    return }
    const user = message.mentions.users.first() || await client.fetchUser(args[0]);
    if (!user) { message.channel.send({ content:"Böyle bir Kullanıcı bulamadım!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    message.react(red)
    return }
    const ban = await client.fetchBan(message.guild, args[0]);
    if (ban) { message.channel.send({ content:"Bu üye zaten banlıymış!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    message.react(red)
    return }
    const reason = args.slice(1).join(" ") || "Belirtilmedi!";
    const member = message.guild.members.cache.get(user.id);

    if (message.guild.members.cache.has(user.id) && message.guild.members.cache.get(user.id).permissions.has("VIEW_AUDIT_LOG")) return message.channel.send({ content:"Üst yetkiye sahip kişileri yasaklayamazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    if (message.guild.members.cache.has(user.id) && message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) return message.channel.send({ content:"Belirttiğin kişinin yetkisi ya senden yüksek yada aynı yetkidesiniz!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    if (member && !member.bannable) return message.channel.send({ content:"Bu üyeyi banlayamıyorum!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    if (settings.banlimit > 0 && banLimit.has(message.author.id) && banLimit.get(message.author.id) == settings.banlimit) return message.channel.send({ content:"Saatlik ban sınırına ulaştın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    message.react(green)
    if (settings.dmMessages) user.send({ content:`**${message.guild.name}** sunucusundan, **${message.author.tag}** tarafından, **${reason}** sebebiyle banlandın!`}).catch(() => {});
    message.guild.members.ban(user.id, { reason: `${reason} | Yetkili: ${message.author.tag}` , days:1}).catch(() => {});
    const penal = await client.penalize(message.guild.id, user.id, "BAN", true, message.author.id, reason);

    const messageEmbed = embed
    .setColor("RANDOM")
    .setImage("https://media.tenor.com/hYlB2OiIRvQAAAAC/ban.gif")
    .setDescription(`**•** **${member ? member.toString() : user.username}** adlı kullanıcı başarıyla ${message.author} Tarafından banlandı! \n\n **•** Sebebi: **${reason}**`)

    message.react(green)
    message.reply({ embeds: [messageEmbed]});

    const log = embed
      .setDescription(`
      **${member ? member.toString() : user.username}** adlı kullanıcıya ${message.author} tarafından ban atıldı.`)
      .addFields(
        {
name: "Banlanan", value: `
${member ? member.toString() : user.username}
`, inline: true
        },
        {
name: "Banlayan", value: `
${message.author}
`, inline: true
        },
        {
name: "Sebep", value: `
 ${reason}
`, inline: true
        },
      )
      .setFooter({ text:`${moment(Date.now()).format("LLL")}    (Ceza ID: #${penal.id})` })
      message.guild.channels.cache.get(conf.banLogChannel).send({ embeds: [log]});

    await coin.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { coin: -100 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { BanAmount: 1 } }, {upsert: true});
    await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 100 } }, { upsert: true });

    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
    if(conf.cezapuanlog) message.guild.channels.cache.get(conf.cezapuanlog).send({ content:`\`${member}\` üyesi ban cezası alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`});

    if (settings.banlimit > 0) {
      if (!banLimit.has(message.author.id)) banLimit.set(message.author.id, 1);
      else banLimit.set(message.author.id, banLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (banLimit.has(message.author.id)) banLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
  },
};

