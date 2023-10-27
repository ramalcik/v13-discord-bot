const client = global.bot;
const { Collection, codeBlock } = require("discord.js");
const inviterSchema = require("../../../Papaz-Main/src/schemas/inviter");
const inviteMemberSchema = require("../../../Papaz-Main/src/schemas/inviteMember");
const coin = require("../../../Papaz-Main/src/schemas/coin");
const gorev = require("../../../Papaz-Main/src/schemas/invite");
const otokayit = require("../../../Papaz-Main/src/schemas/otokayit");
const bannedTag = require("../../../Papaz-Main/src/schemas/bannedTag");
const papaz = require("../../../Papaz-Main/src/configs/setup.json")
const regstats = require("../../../Papaz-Main/src/schemas/registerStats");
const conf = require("../../../Papaz-Main/src/configs/sunucuayar.json");
const ayar = require("../../../Papaz-Main/src/configs/sunucuayar.json")
const settings = require("../../../Papaz-Main/src/configs/setup.json")
const settings2 = require("../../../../config.json")
const moment = require("moment");
const { green,red } = require("../../../Papaz-Main/src/configs/emojis.json")
const emoji = require("../../../Papaz-Main/src/configs/emojis.json")
const forceBans = require("../../../Papaz-Main/src/schemas/forceBans");

/**
 * @param {GuildMember} member 
 * @param {Message} message 
 */


module.exports = async (member) => {
  let fakeDay = Date.now() - member.user.createdTimestamp < 1000 * 60 * 60 * 24 * 3 

  let welChannel = client.channels.resolve(papaz.welcomeChannel)
  let genChannel = client.channels.resolve(papaz.chatChannel)
  let invChannel = client.channels.resolve(papaz.invLogChannel)

  if(member.user.username.includes(papaz.tag)) {

    client.channels.cache.find(x => x.name === "taglı_log").wsend({
      content: `
      ${member} kullanıcısı aramıza taglı bir şekilde katıldı!`
    }) 

  }
  const fakeControl = Date.now()-member.user.createdTimestamp < 1000*60*60*24*settings2.Main.fakeDay
  const cachedInvites = client.invites.get(member.guild.id)
  const newInvites = await member.guild.invites.fetch();
  const invite = await newInvites.find(inv => cachedInvites.get(inv.code) < inv.uses) || member.guild.vanityURLCode;
  newInvites.each(inv => cachedInvites.set(inv.code, inv.uses));
  client.invites.set(member.guild.id, cachedInvites);

  if(fakeDay) {

    await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: usedInvite.inviter.id }, { $inc: { total: 1, fake: 1 } }, { upsert: true });
    const inviterData = await inviterSchema.findOne({ guildID: member.guild.id, userID: usedInvite.inviter.id });
    const total = inviterData ? inviterData.total : 0;
    await member.roles.set([fakeAccRole], { reason: `Hesabı yeni olduğu için şüpheli olarak işaretlendi!` })
    welChannel.wsend({ content: `${member} kullanıcısı sunucuya yeni katıldı fakat hesabı <t:${Math.floor(member.user.createdTimestamp / 1000)}:R> açıldığı için şüpheli olarak işaretlendi!` })
    invChannel.wsend({ content:`${green} ${member}, ${usedInvite.inviter.tag} davetiyle katıldı! (**${total}**) Sunucumuz **${üyesayısı2}** üye sayısına ulaştı!`})
  
  }

  let otoreg = await otokayit.findOne({ userID: member.id })
 const tagModedata = await regstats.findOne({ guildID: settings.guildID })
  if (tagModedata && tagModedata.tagMode === false) {
    if (otoreg) {
      if (member.manageable) await member.roles.set(otoreg.roleID)
      member.setNickname(`${papaz.tag} ${otoreg.name} | ${otoreg.age}`);
     if(papaz.chatChannel && client.channels.cache.has(papaz.chatChannel)) client.channels.cache.get(papaz.chatChannel).send({ content:`Aramıza hoşgeldin **${member}**! Sunucumuzda daha önceden kayıtın bulunduğu için direkt içeriye alındınız. Kuralları okumayı unutma!`}).then((e) => setTimeout(() => { e.delete(); }, 10000));
    }
  }

  member.user.username.includes(papaz.tag) ? member.roles.add([papaz.ekipRolu, papaz.unregRoles]) : member.roles.add(papaz.unregRoles)
  member.setNickname(`${member.user.username.includes(papaz.tag) ? papaz.tag : papaz.ikinciTag} İsim | Yaş`) // ikinci tagı sen ayarlarsın ben şuanda kafama göre gidiyorum tmmmm
 
  if (invite) {
await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: member.id }, { $set: { inviterID: member.guild.id } }, { upsert: true });

    welChannel.wsend({
      content: `
      ${member}, ${member.guild.name} sunucumuza hoş geldin.
      Seninle beraber sunucumuz (\`${member.guild.memberCount}\`) üye sayısına ulaştı. 
      
Hesabın <t:${Math.floor(member.user.createdTimestamp / 1000)}> (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) tarihinde oluşturulmuş!

Kayıt işleminden sonra <#1124811161465008130> kanalına göz atmayı unutmayın. <@&1124795965476442142> Rolündeki Yetkililerimiz Sizinle İlgileneceklerdir
Solda Bulunan <#1124803858812649532> Odasında Yetkililerimize "İsim | Yaş" vererek kayıt olabilirsiniz`
    })
    invChannel.wsend({ content:`${green} ${member}, sunucuya katıldı! Davet Eden: **Sunucu Özel URL** Sunucumuz **${member.guild.memberCount}** Uye sayisina ulaştı.`})

  } else {
    await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: member.id }, { $set: { inviterID: invite.inviter.id } }, { upsert: true });
    const inviterData = await inviterSchema.findOne({ guildID: member.guild.id, userID: invite.inviter.id });
    const total = inviterData ? inviterData.total : 0;
    const inviter = await client.users.fetch(invite.inviter.id)


    const data = await inviterSchema.findOne({ guildID: member.guild.id, userID: invite.inviter.id })


    welChannel.wsend({
      content: `
${member}, ${member.guild.name} sunucumuza hoş geldin.
 Seninle beraber sunucumuz (\`${member.guild.memberCount}\`) üye sayısına ulaştı. 
            
      Hesabın <t:${Math.floor(member.user.createdTimestamp / 1000)}> (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) tarihinde oluşturulmuş!
      
      Kayıt işleminden sonra <#1124811161465008130> kanalına göz atmayı unutmayın. <@&1124795965476442142> Rolündeki Yetkililerimiz Sizinle İlgileneceklerdir
      Solda Bulunan <#1124803858812649532> Odasında Yetkililerimize "İsim | Yaş" vererek kayıt olabilirsiniz`
    })
    invChannel.wsend({ content:`${green} ${member}, **${!inviter ? "Deleted User#0000" : inviter.tag}** (**${data.total}**) davetiyle katıldı! Uyenin Davet Sayısı (**${total}**) Sunucumuz **${member.guild.memberCount}** üye sayısına ulaştı!`})

  }

  await coin.findOneAndUpdate({ guildID: member.guild.id, userID: invite.inviter.id }, { $inc: { coin: 1 } }, { upsert: true });
  const gorevData = await gorev.findOne({ guildID: member.guild.id, userID: invite.inviter.id });
  if (gorevData) { await gorev.findOneAndUpdate({ guildID: member.guild.id, userID: invite.inviter.id }, { $inc: { invite: 1 } }, { upsert: true });}

}

module.exports.conf = {
  name: "guildMemberAdd",
};