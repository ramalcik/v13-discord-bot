const client = global.bot;
const inviterSchema = require("../../../Papaz-Main/src/schemas/inviter");
const inviteMemberSchema = require("../../../Papaz-Main/src/schemas/inviteMember");
const coin = require("../../../Papaz-Main/src/schemas/coin");
const { star, green, red } = require("../../../Papaz-Main/src/configs/emojis.json")
const gorev = require("../../../Papaz-Main/src/schemas/invite");
const conf = require("../../../Papaz-Main/src/configs/setup.json")
module.exports = async (member) => {
  const channel = member.guild.channels.cache.get(conf.invLogChannel);
  if (!channel) return;
  if (member.user.bot) return;

  const inviteMemberData = await inviteMemberSchema.findOne({ guildID: member.guild.id, userID: member.user.id });
  if (!inviteMemberData) {
    channel.wsend({ content: `${red} \`${member.user.tag}\` adlı üye sunucudan çıktı ama kim tarafından davet edildiğini bulamadım. Sunucumuz ise **${member.guild.memberCount}** üye kaldı!`});
  } else {
    const inviter = await client.users.fetch(inviteMemberData.inviter);
    await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { leave: 1, total: -1 } }, { upsert: true });
    const inviterData = await inviterSchema.findOne({ guildID: member.guild.id, userID: inviter.id, });
    const total = inviterData ? inviterData.total : 0;
    const gorevData = await gorev.findOne({ guildID: member.guild.id, userID: inviter.id });
    channel.wsend({ content:`${red} \`${member.user.tag}\` adlı üye sunucudan çıktı. ${inviter.tag} kişinin daveti **${total}** sunucumuz ise** ${member.guild.memberCount}** üye kaldı! `});
    await coin.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { coin: -15 } }, { upsert: true });
    if (gorevData)
    await gorev.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { invite: -1 } }, { upsert: true });
  }
};

module.exports.conf = {
  name: "guildMemberRemove",
};
