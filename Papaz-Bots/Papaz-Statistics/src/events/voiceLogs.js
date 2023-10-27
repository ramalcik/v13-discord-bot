const client = global.bot;
const settings = require("../../../../config.json");
const papaz = require("../../../Papaz-Main/src/configs/setup.json")
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const {Mute} = require("../../../Papaz-Main/src/configs/emojis.json")

module.exports = async (oldState, newState) => {
  client.on('voiceStateUpdate', async (oldState, newState) => {
    if (!oldState.channelId && newState.channelId) { 
     //  let users = newState.guild.members.cache.get(newState.id)
    let member = newState.guild.members.cache.get(newState.id)
    let microphone = member.voice.selfMute ? "kapalı" : "açık";
    let headphones = member.voice.selfDeaf ? "kapalı" : "açık";
    let Embed = new MessageEmbed().setColor("GREEN")
    .setAuthor(oldState.member.user.username, oldState.member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
    .setThumbnail(oldState.member.user.displayAvatarURL({ dynamic: true}))
    .setDescription(`kulanma zaman <t:${Math.floor(Date.now() / 1000)}:R> Göstermekde

    <@${newState.member.user.id}> __üyesi__ <#${newState.channel.id}> __kanalına giriş yaptı.__ \n\n __Kanala girdiği anda:__ \n\`•\` __Mikrofon durumu:__ \`${microphone}\`.\n\`•\` __Kulaklık durumu:__ \`${headphones}\`.\n\`\`\` __Giridiği kanal:__ ${newState.channel.name} (${newState.channelId})\n __Kullanıcı:__ ${newState.member.user.tag} (${newState.member.user.id})\n __Eylem Gerçekleşme:__ ${moment(newState.createdAt).locale("tr").format('LLL')}\n\n\n\`\`\`\n __Girdiği kanalda bulunan üyeler:__ \n ${newState.channel.members.map(x => `${x.user} - \`${x.user.id}\``).join("\n")}`)   
    return client.channels.cache.find(a => a.name === "voice_log").send({ embeds: [Embed]})}});
  
    client.on('voiceStateUpdate', async (oldState, newState) => {
      if(oldState.channelId && !newState.channelId){
      let member = newState.guild.members.cache.get(newState.id);
      let microphone = member.voice.selfMute ? "kapalı" : "açık";
      let headphones = member.voice.selfDeaf ? "kapalı" : "açık";
      if(oldState.channel.members.map(x => x)[0]){
      var makro = oldState.channel.members.map(x => `${x.user} - \`${x.user.id}\``).join("\n")} else { var makro = "Maalesef bu kanalda üye bulunmamaktadır."; }
      let SesMicEmbed = new MessageEmbed()
      .setAuthor(oldState.member.user.username, oldState.member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setThumbnail(oldState.member.user.displayAvatarURL({ dynamic: true}))
      .setDescription(`kulanma zaman <t:${Math.floor(Date.now() / 1000)}:R> Göstermekde
      
      <@${oldState.member.user.id}> __üyesi__ <#${oldState.channel.id}> __kanalından ayrıldı.__\n\n__**Kanaldan Çıktığı anda:**__\n\`•\` __Mikrofon durumu:__ \`${microphone}\`.\n\n\`•\` __Kulaklık durumu:__ \`${headphones}\`.\n\n\`\`\`__Çıktığı kanal:__ ${oldState.channel.name} (${oldState.channelId})\n__Kullanıcı:__ ${oldState.member.user.tag} (${oldState.member.user.id})\n__Eylem Gerçekleşme:__ ${moment(oldState.createdAt).locale("tr").format('LLL')}\`\`\`\n__Çıktığı kanalda bulunan üyeler:__\n${makro}`)   
      return client.channels.cache.find(a => a.name === "voice_log").send({ embeds: [SesMicEmbed]})}});
    
      client.on('voiceStateUpdate', async (oldState, newState) => {
      if (oldState.channelId && newState.channelId && oldState.channel && newState.channel) {
      if (oldState.channelId !== newState.channelId) {
      let member = newState.guild.members.cache.get(newState.id);
      let microphone = member.voice.selfMute ? "kapalı" : "açık";
      let headphones = member.voice.selfDeaf ? "kapalı" : "açık";
      if(oldState.channel.members.map(x => x)[0]){
      var makro = oldState.channel.members.map(x => `${x.user} - \`${x.user.id}\``).join("\n")} else {
      var makro = "Maalesef bu kanalda üye bulunmamaktadır.";}
      let SesMicEmbed1 = new MessageEmbed()
      .setAuthor(oldState.member.user.username, oldState.member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setThumbnail(oldState.member.user.displayAvatarURL({ dynamic: true}))
      .setDescription(`kulanma zaman <t:${Math.floor(Date.now() / 1000)}:R> Göstermekde

      <@${oldState.member.user.id}> __üyesi__ <#${oldState.channel.id}> __kanalından__ <#${newState.channel.id}> __kanalına geçiş yaptı.__\n\n__**Kanal Değiştirdiği Anda:**__\n\`•\` __Mikrofon durumu:__ \`${microphone}\`.\n\`•\` __Kulaklık durumu:__ \`${headphones}\`.\n\n\`\`\`__Çıktığı kanal:__ ${oldState.channel.name} (${oldState.channelId})\n__Kullanıcı:__ ${oldState.member.user.tag} (${oldState.member.user.id})\n__Eylem Gerçekleşme:__ ${moment(oldState.createdAt).locale("tr").format('LLL')}\`\`\`\n\n__Eski Kanalında Bulunan Üyeler:__\n${makro}\n\n__Yeni Kanalında Bulunan Üyeler:__\n${newState.channel.members.map(x => `${x.user} - \`${x.user.id}\``).join("\n")}`)   
      return client.channels.cache.find(a => a.name === "voice_log").send({embeds: [SesMicEmbed1]})}}});   

const channel2 = oldState.guild.channels.cache.get(papaz.vmuteLogChannel);
if (!channel2) return;
let logs = await oldState.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_UPDATE" });
let entry = logs.entries.first();
if (!oldState.serverMute && newState.serverMute) return channel2.wsend({ embeds: [new MessageEmbed().setAuthor({ name: client.guilds.cache.get(cfg.GuildID).name, iconURL: client.guilds.cache.get(cfg.GuildID).iconURL({dynamic:true})}).setFooter({ text: `${moment(Date.now()).format("LLL")}`}).setDescription(`
${newState.member} Adlı Kişiye Sağ-tık susturma işlemi yapıldı.

${Mute} Mute Atılan Kişi : ${newState.member} (\`${newState.member.id}\`)
Mute Atan Yetkili : ${entry.executor} (\`${entry.executor.id}\`)
Mute Atılan Ses Kanal: <#${newState.channel.id}>`)]});
};

module.exports.conf = {
  name: "voiceStateUpdate",
};