const joinedAt = require("../../../Papaz-Main/src/schemas/voiceJoinedAt");
const voiceUser = require("../../../Papaz-Main/src/schemas/voiceUser");
const voiceGuild = require("../../../Papaz-Main/src/schemas/voiceGuild");
const guildChannel = require("../../../Papaz-Main/src/schemas/voiceGuildChannel");
const userChannel = require("../../../Papaz-Main/src/schemas/voiceUserChannel");
const userParent = require("../../../Papaz-Main/src/schemas/voiceUserParent");
const { MessageEmbed } = require("discord.js");
const coin = require("../../../Papaz-Main/src/schemas/coin");
const conf = require("../../../Papaz-Main/src/configs/setup.json");
const dolar = require("../../../Papaz-Main/src/schemas/dolar")
const ayar = require("../../../../config.json");
const client = global.bot;

module.exports = async (oldState, newState) => {
  if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;
  
  if (!oldState.channelId && newState.channelId) await joinedAt.findOneAndUpdate({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });

  let joinedAtData = await joinedAt.findOne({ userID: oldState.id });

  if (!joinedAtData) await joinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
  joinedAtData = await joinedAt.findOne({ userID: oldState.id });
  const data = Date.now() - joinedAtData.date;

  if (oldState.channelId && !newState.channelId) {
    await saveDatas(oldState, oldState.channel, data);
    await joinedAt.deleteOne({ userID: oldState.id });
  } else if (oldState.channelId && newState.channelId) {
    await saveDatas(oldState, oldState.channel, data);
    await joinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
  }
};

async function saveDatas(user, channel, data) {
  if (conf.staffs.some(x => user.member.roles.cache.has(x))) {
    if (channel.parent && conf.publicParents.includes(channel.parentId)) {
      if (data >= (1000 * 60) * ayar.Main.voiceCount) await coin.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { coin: Math.floor(parseInt(data/1000/60) / ayar.Main.voiceCount) * ayar.Main.publicCoin } }, { upsert: true });
    } else if (data >= (1000 * 60) * ayar.Main.voiceCount) await coin.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { coin: Math.floor(parseInt(data/1000/60) / ayar.Main.voiceCount) * ayar.Main.voiceCoin } }, { upsert: true });
    const coinData = await coin.findOne({ guildID: user.guild.id, userID: user.id });
    if (coinData && client.ranks.some(x => x.coin >= coinData.coin)) {
      let newRank = client.ranks.filter(x => coinData.coin >= x.coin);
      newRank = newRank[newRank.length-1];
      if (newRank && Array.isArray(newRank.role) && !newRank.role.some(x => user.member.roles.cache.has(x)) || newRank && !Array.isArray(newRank.role) && !user.member.roles.cache.has(newRank.role)) {
        const oldRank = client.ranks[client.ranks.indexOf(newRank)-1];
        user.member.roles.add(newRank.role);
        if (oldRank && Array.isArray(oldRank.role) && oldRank.role.some(x => user.member.roles.cache.has(x)) || oldRank && !Array.isArray(oldRank.role) && user.member.roles.cache.has(oldRank.role)) user.member.roles.remove(oldRank.role);
        const embed = new MessageEmbed().setColor("GREEN");
        client.channels.cache.find(x => x.name == "rank_log").send({ content:`${user.member.toString()} üyesi **${coinData.coin}** coin hedefine ulaştı ve **${Array.isArray(newRank.role) ? newRank.role.map(x => `${user.guild.roles.cache.get(x).name}`).join(", ") : `${user.guild.roles.cache.get(newRank.role).name}`}** rolü verildi! :tada: :tada:`});
      }
    }
  }
  if (channel.parent && conf.publicParents.includes(channel.parentId)) {
    if (data >= (1000 * 60) * ayar.Main.voiceCount) await dolar.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { dolar: ayar.Main.voiceDolar * parseInt(data/1000/60) } }, { upsert: true });
  } else if (data >= (1000 * 60) * ayar.Main.voiceCount) await dolar.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { dolar: ayar.Main.voiceDolar * parseInt(data/1000/60) } }, { upsert: true });

  await voiceUser.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data, twoWeeklyStat: data } }, { upsert: true });
  await voiceGuild.findOneAndUpdate({ guildID: user.guild.id }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data, twoWeeklyStat: data } }, { upsert: true });
  await guildChannel.findOneAndUpdate({ guildID: user.guild.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
  await userChannel.findOneAndUpdate({ guildID: user.guild.id, userID: user.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
  if (channel.parent) await userParent.findOneAndUpdate({ guildID: user.guild.id, userID: user.id, parentID: channel.parentId }, { $inc: { parentData: data } }, { upsert: true });

}

module.exports.conf = {
  name: "voiceStateUpdate",
};