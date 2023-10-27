const moment = require("moment");
moment.locale("tr");
const penals = require("../../schemas/penals");
const conf = require("../../configs/setup.json");
const settings = require("../../../../../config.json")
const { red, green, Cezaa, Revuu, kirmiziok } = require("../../configs/emojis.json")
module.exports = {
  conf: {
    aliases: ["unban"],
    name: "unban",
    help: "unban",
    category: "cezalandırma"
  },

  run: async (client, message, args, embed) => {
        if (!message.member.permissions.has("BAN_MEMBERS") && !conf.banHammer.some(x => message.member.roles.cache.has(x))) 
    {
    message.react(red)
    message.channel.send({ content:"Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if (!args[0]) 
    {
    message.react(red)
    message.channel.send({ content:"Bir üye belirtmelisin!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    const ban = await client.fetchBan(message.guild, args[0]);
    if (!ban) 
    {
    message.react(red)
    message.channel.send({ content:"Bu üye banlı değil!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    return }
    message.guild.members.unban(args[0], `${message.author.username} tarafından kaldırıldı!`).catch(() => {});
    const data = await penals.findOne({ userID: ban.user.id, guildID: message.guild.id, type: "BAN", active: true });
    if (data) {
      data.active = false;
      await data.save();
    }
    message.react(green)
    message.reply({ content:`${green} \`(${ban.user.username.replace(/\`/g, "")} - ${ban.user.id})\` adlı üyenin banı ${message.author} tarafından kaldırıldı!`}).then((e) => setTimeout(() => { e.delete(); }, 50000));
    if (settings.dmMessages) ban.user.send({ content:`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından banınız kaldırıldı!`}).catch(() => {});

  const log = embed
  .setTimeout()
  .setDescription(`
${ban.user.username.replace(/\`/g, "")} adlı kullanıcının ${message.author} tarafından ban cezası kaldırıldı.
      `)
      .addFields(
        {
name: "Affedilen", value: `
${ban.user.username.replace(/\`/g, "")}
`, inline: true
        },
        {
name: "Affeden", value: `
${message.author}
`, inline: true
        },
        {
name: "Ceza Bitiş:", value: `
<t:${Math.floor(Date.now() / 1000)}:R>
`, inline: true
        },
      )

    message.guild.channels.cache.get(conf.banLogChannel).wsend({ embeds: [log]});
  },
};