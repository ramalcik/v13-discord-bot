const { MessageEmbed } = require('discord.js');
const regstats = require("../../schemas/registerStats");
const conf = require("../../configs/setup.json");
const { red, green, erkek, kadin, star, kirmiziok } = require("../../configs/emojis.json")
module.exports = {
  conf: {
    aliases: [],
    name: "teyitler",
    help: "teyitler",
    category: "kayıt"
  },
  run: async (client, message, args, embed, prefix) => { 
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if(!conf.teyitciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has('ADMINISTRATOR')) 
    {
    message.react(red)
    message.reply({ content: `Yeterli yetkin yok!`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if (args[0] === "top") {
      let registerTop = await regstats.find({ guildID: message.guild.id }).sort({ top: -1 });

      if (!registerTop.length) 
      {
      message.react(red)
      message.reply({ content:"Kayıt verisi bulunamadı!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
      return }
      registerTop = registerTop.filter((x) => message.guild.members.cache.has(x.userID)).splice(0, 30);
      message.react(green)

      

      message.reply({ embeds: [embed.setDescription((registerTop.map((x, i) => `\` ${i + 1} \` <@${x.userID}> - Erkek __${x.erkek}__ Kadın __${x.kız}__`)).join("\n"))] });

    } else if (!args[0]) {
      const data = await regstats.findOne({ guildID: message.guild.id, userID: member.id });
      message.react(green)
      message.channel.send({ embeds: [embed.setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 })).setDescription(`
${kirmiziok} İsim: ${message.author}
${kirmiziok} Discord ID: (\`${message.author.id}\`)
${kirmiziok} Sunucu İsim: **${message.guild.name}**
**▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂**

${green} Toplam \`${data ? data.top : 0}\` kayıdın mevcut. 
${erkek} Toplam \`${data ? data.erkek : 0}\` **erkek** kayıdın mevcut. 
${kadin} Toplam \`${data ? data.kız : 0}\` **kız** kayıdın mevcut.
	`)] });
    }
  },
};
