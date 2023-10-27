const conf = require("../../../Papaz-Main/src/configs/sunucuayar.json");
const settings = require("../../../../config.json")
const messageUser = require("../../../Papaz-Main/src/schemas/messageUser");
const messageGuild = require("../../../Papaz-Main/src/schemas/messageGuild");
const guildChannel = require("../../../Papaz-Main/src/schemas/messageGuildChannel");
const userChannel = require("../../../Papaz-Main/src/schemas/messageUserChannel");
const coin = require("../../../Papaz-Main/src/schemas/coin");
const client = global.bot;
const nums = new Map();
const mesaj = require("../../../Papaz-Main/src/schemas/mesajgorev");
const dolar = require("../../../Papaz-Main/src/schemas/dolar")
const papaz = require("../../../Papaz-Main/src/configs/setup.json")
const ayar = require("../../../../config.json");


module.exports = async (message) => {
  if (message.author.bot || !message.guild || message.content.startsWith(settings.prefix)) return;
  if (papaz.staffs.some(x => message.member.roles.cache.has(x))) {
    const num = nums.get(message.author.id);
    if (num && (num % ayar.Main.messageCount) === 0) {
      nums.set(message.author.id, num + 1);
      await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: ayar.Main.messageCoin } }, { upsert: true });
      const coinData = await coin.findOne({ guildID: message.guild.id, userID: message.author.id });
      if (coinData && client.ranks.some(x => coinData.coin === x.coin)) {
        let newRank = client.ranks.filter(x => coinData.coin >= x.coin);
        newRank = newRank[newRank.length-1];
        const oldRank = client.ranks[client.ranks.indexOf(newRank)-1];
        message.member.roles.add(newRank.role); 
        if (oldRank && Array.isArray(oldRank.role) && oldRank.role.some(x => message.member.roles.cache.has(x)) || oldRank && !Array.isArray(oldRank.role) && message.member.roles.cache.has(oldRank.role)) message.member.roles.remove(oldRank.role);
        client.channels.cache.find(x => x.name == "rank_log").send({ content: `${message.member.toString()} üyesi **${coinData.coin}** coin hedefine ulaştı ve **${Array.isArray(newRank.role) ? newRank.role.map(x => `${message.guild.roles.cache.get(x).name}`).join(", ") : `${message.guild.roles.cache.get(newRank.role).name}`}** rolü verildi! :tada: :tada:`});
      }
    } else nums.set(message.author.id, num ? num + 1 : 1);
  }

  await messageUser.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1 } }, { upsert: true });
  await messageGuild.findOneAndUpdate({ guildID: message.guild.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1 } }, { upsert: true });
  await guildChannel.findOneAndUpdate({ guildID: message.guild.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
  await userChannel.findOneAndUpdate({ guildID: message.guild.id,  userID: message.author.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
  if(dolar) {
  if(message.channel.id !== papaz.chatChannel) return;
  await dolar.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { dolar: ayar.Main.messageDolar } }, { upsert: true });
  }
const mesajData = await mesaj.findOne({ guildID: message.guild.id, userID: message.author.id });
if(mesajData){
if(message.channel.id !== conf.chatChannel ) return;
await mesaj.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { mesaj: 1 } }, { upsert: true });
}
};

module.exports.conf = {
  name: "messageCreate",
};
