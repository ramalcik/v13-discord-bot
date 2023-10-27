const { MessageEmbed, Client, Message, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const { red, green } = require("../../configs/emojis.json")
const conf = require("../../configs/setup.json");
const moment = require("moment");
require("moment-duration-format");
const client = global.bot;

module.exports = {
    conf: {
      aliases: ["vip"],
      name: "vip",
      help: "vip"
    },
  
    run: async (client, message, args, embed) => {
        if(!conf.rolverici.some(oku => message.member.roles.cache.has(oku)) && !conf.sahipRolu.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) 
        {
            message.reply({ embeds: [new MessageEmbed()
          .setAuthor({name:message.member.displayName , iconURL:message.member.displayAvatarURL()})
          .setThumbnail()
          .setDescription(`${red} Malesef yetkin bulunmamakta dostum`)
          ] })
        return }

let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!uye) return message.reply({ embeds: [new MessageEmbed()
    .setAuthor({name:message.member.displayName , iconURL:message.member.displayAvatarURL()})
    .setThumbnail()
    .setDescription(`Vip rolü vermek için birin etiketle ve butona bas`)
    ] }).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
if(message.author.id === uye.id) return message.reply({ embeds: [new MessageEmbed()
    .setAuthor({name:message.member.displayName , iconURL:message.member.displayAvatarURL()})
    .setThumbnail()
    .setDescription(`Kendine Rol Veremezsin dostum`)
    ] }).then((e) => setTimeout(() => { e.delete(); }, 5000)); 


const row = new MessageActionRow()
.addComponents(

new MessageButton()
.setCustomId("vip")
.setLabel("vip")
.setEmoji("970343074150621215")
.setStyle("SECONDARY")
);

let papaz = new MessageEmbed()
.setDescription(`${uye.toString()} __Başarıyla isimli kişiye__ \`Vip\` __rolü verildi__`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
.setColor("BLUE")

 let msg = await message.channel.send({ embeds: [papaz], components : [row] })
 message.react(green)
 
 var filter = (button) => button.user.id === message.author.id;
 let collector = await msg.createMessageComponentCollector({ filter, time: 10000 })

 collector.on("collect", async (button) => {

    if(button.customId === "vip") {
        uye.roles.cache.has(conf.vipRole) ? uye.roles.remove(conf.vipRole) : uye.roles.add(conf.vipRole);
        if(!uye.roles.cache.has(conf.vipRole)) {
          client.channels.cache.find(x => x.name == "vip_log").send({ embeds: [embed.setDescription(`${uye} isimli kişiye **${moment(Date.now()).format("LLL")}** tarihinde ${message.author} tarafından **Vip** adlı rol verildi.`)]})
let papaze = new MessageEmbed()
  .setDescription(`${uye.toString()} __Başarıyla__ __isimli kişiye__ **Vip** __rolü verildi__`)
  .setAuthor({name:message.member.displayName , iconURL:message.member.displayAvatarURL()})
  .setThumbnail()
  if(msg) msg.delete();
  button.reply({ embeds: [papaze], components: [], ephemeral: true});
        } else {
          client.channels.cache.find(x => x.name == "vip_log").send({ embeds: [embed.setDescription(`${uye} isimli kişiye **${moment(Date.now()).format("LLL")}** tarihinde ${message.author} tarafından **Vip** adlı rol geri alındı.`)]})
          let papaze = new MessageEmbed()
          .setDescription(`${uye.toString()} __Başarıyla__  __isimli kişinin__ **Vip** __rolü geri alındı__`)
          .setAuthor({name:message.member.displayName , iconURL:message.member.displayAvatarURL()})
          .setThumbnail()
          if(msg) msg.delete();
          button.reply({ embeds: [papaze], components: [], ephemeral: true});

        };
     }
    })

}
}