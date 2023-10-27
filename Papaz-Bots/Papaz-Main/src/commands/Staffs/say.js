const { red, green } = require("../../configs/emojis.json")
const conf = require("../../configs/setup.json");
const moment = require("moment");
moment.locale("tr");

module.exports = {
  conf: {
    aliases: ["say"],
    name: "say",
    help: "say",
    category: "yetkili"
  },

  run: async (client, message, args, embed) => {
    
    if(!conf.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !conf.sahipRolu.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) 
    {
      message.react(red)
      return
    }
    let Tag = conf.tag 

    var takviye = (message.guild.premiumSubscriptionCount)
    var TotalMember = (message.guild.memberCount)
    var AktifMember = (message.guild.members.cache.filter(m => m.presence && m.presence.status !== "offline").size)
    let tag = `${(message.guild.members.cache.filter(u => u.user.username.includes(Tag)).size)}`
    var sesli = (message.guild.members.cache.filter((x) => x.voice.channel).size)
    var boostlevel = message.guild.premiumTier;
    var botses = message.guild.members.cache.filter(x => x.voice.channel && x.user.bot).size
    
  const papaz = message.channel.send({ embeds: [embed
.setColor('RANDOM')
.setDescription(`
\`❯\` Şu anda toplam **${sesli - botses}** (**+${botses || "0"} bot**) kişi ses kanallarında aktif.
\`❯\` Sunucuda şuan da **${TotalMember}** adet üye var (**${AktifMember}** Aktif)
\`❯\` Toplamda **${tag}** kişi tagımızı alarak bizi desteklemiş!
\`❯\` Sunucumuz şuan da ${boostlevel} seviye ve **${takviye}** adet boost basılmış!
`)
]})
message.react(green)
 },
 };
