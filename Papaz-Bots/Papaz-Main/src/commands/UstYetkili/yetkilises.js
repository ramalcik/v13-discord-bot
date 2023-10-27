const conf = require("../../configs/setup.json");
const moment = require("moment");
moment.locale("tr");
const { red } = require("../../configs/emojis.json")
let table = require("string-table");

module.exports = {
  conf: {
    aliases: ["ysay","yetkilises","sesteolmayan"],
    name: "ysay",
    help: "ysay",
    category: "yönetim"
  },

  run: async (client, message, args, embed, durum) => {
    
  if (!message.guild) return;
  if (!message.member.permissions.has(8n)) return message.react(red)

    const sec = args[0]
    if (!sec) {

      var ToplamYetkili = message.guild.members.cache.filter(yetkili => yetkili.roles.cache.has(conf.teyitciRolleri)).size
      var SesteOlanYetkili = message.guild.members.cache.filter(yetkili => yetkili.roles.cache.has(conf.teyitciRolleri)).filter(yetkilises => yetkilises.voice.channel).size
      var AktifYetkili = message.guild.members.cache.filter(yetkili => yetkili.roles.cache.has(conf.teyitciRolleri) && yetkili.presence && yetkili.presence.status !== "offline").size
      let SesteOlmayanYetkili = message.guild.members.cache.filter(yetkili => yetkili.roles.cache.has(conf.teyitciRolleri)).filter(yetkilises => !yetkilises.voice.channel && yetkilises.presence && yetkilises.presence.status != "offline").size

      let papaz = message.guild.members.cache.filter(yetkili => yetkili.roles.cache.has(conf.teyitciRolleri)).filter(yetkilises => !yetkilises.voice.channel  && yetkilises.presence && yetkilises.presence.status != "offline")

      let tablo = [{
        "TOPLAM": ToplamYetkili + " kişi",
        "AKTİF": AktifYetkili + " kişi",
        "SESTE": SesteOlanYetkili + " kişi",
        "SESTE OLMAYAN": SesteOlmayanYetkili + " kişi"
      }]

      message.channel.send({ content: `\`\`\`js\n${table.create(tablo)}\`\`\`\n\`\`\`\n${papaz.map(yetkili => `${yetkili}`).join(', ')}\n\`\`\``})
    }

    
}}