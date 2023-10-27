const { GuildMember, GuildAuditLogsEntry, WebhookClient, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Discord  = require("discord.js");

const { getVoiceConnection, joinVoiceChannel } = require("@discordjs/voice");
const RoleModel = require("../src/Models/Role");
const SafeMember = require("../src/Models/Safe");


const CategoryChannels = require("../src/Models/CategoryChannels");
const TextChannels = require("../src/Models/TextChannels");
const VoiceChannels = require("../src/Models/VoiceChannels"); 

const request = require("request");
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")
const setup = require('../../Papaz-Main/src/configs/setup.json');
const allah = require('../../../config.json');

const ChannelGuard = new Discord.Client({ fetchAllMembers: true, intents: 32767 });

ChannelGuard.on("ready", () => {
    const guild = ChannelGuard.guilds.cache.first();
    const connection = getVoiceConnection(guild.id);
    if (connection) return;

    joinVoiceChannel({
        channelId: allah.botSes,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: true
    });

    setInterval(() => {
        const oynuyor = allah.botDurum;
        const index = Math.floor(Math.random() * (oynuyor.length));
  
        ChannelGuard.user.setActivity(`${oynuyor[index]}`, {
          type: "WATCHING",});
  
      }, 10000);
    console.log("Kanal koruma botu aktif.");
});
ChannelGuard.login(allah.Guard.ChannelGuard);

const Bots = global.Bots = [];

ChannelGuard.on("channelDelete", async (channel) => {

    let logs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: "CHANNEL_DELETE"
    });
    let entry = logs.entries.first();

    if (!entry || entry.executor.bot || await checkPermission(ChannelGuard, entry.executor.id, "full") || await checkPermission(ChannelGuard, entry.executor.id, "channel") || await checkPermission(ChannelGuard, entry.executor.id, "roleandchannel")) {

if ((channel.type === 'GUILD_TEXT') || (channel.type === 'GUILD_NEWS') || (channel.type === 'GUILD_VOICE')) {

    const papaz = new MessageEmbed()
    .setColor("000001")
    .setThumbnail(entry.executor.avatarURL({ dynamic: true }))
    .setDescription(`
${entry.executor} üyesi kanal sildi, güvenli listede olduğu için işlem yapmadım.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
Silinen Kanal: ${channel.name} - \`${channel.id}\`
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)

return sendLog({ embeds: [papaz] });
} else if (channel.type === 'GUILD_CATEGORY') {

    const papaz = new MessageEmbed()
    .setColor("000001")
    .setThumbnail(entry.executor.avatarURL({ dynamic: true }))
    .setDescription(`
${entry.executor} üyesi kategori sildi, güvenli listede olduğu için işlem yapmadım.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
Silinen Kategori: ${channel.name} - \`${channel.id}\`
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)

return sendLog({ embeds: [papaz] });

}
    }

let member = await channel.guild.members.fetch(entry.executor.id).then(m => m).catch(() => undefined);
await cezaVer(ChannelGuard, member.id, "ban");

if ((channel.type === 'GUILD_TEXT') || (channel.type === 'GUILD_NEWS')) {

        const papaz = new MessageEmbed()
        .setColor("000001")
        .setThumbnail(entry.executor.avatarURL({ dynamic: true }))
        .setDescription(`
${entry.executor} üyesi kanal sildi, sunucudan yasaklayıp, silinen kanalı izinleriyle birlikte yeniden oluşturdum.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
Silinen Kanal: ${channel.name} - \`${channel.id}\`
Kanal Türü: \` Yazı Kanalı \`
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)

sendLog({ embeds: [papaz] });
} else if (channel.type === 'GUILD_VOICE') {

    const papaz = new MessageEmbed()
    .setColor("000001")
    .setThumbnail(entry.executor.avatarURL({ dynamic: true }))
    .setDescription(`
${entry.executor} üyesi kanal sildi, sunucudan yasaklayıp, silinen kanalı izinleriyle birlikte yeniden oluşturdum.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
Silinen Kanal: ${channel.name} - \`${channel.id}\`
Kanal Türü: \` Ses Kanalı \`
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)

sendLog({ embeds: [papaz] });
} else if (channel.type === 'GUILD_CATEGORY') {

    const papaz = new MessageEmbed()
    .setColor("000001")
    .setThumbnail(entry.executor.avatarURL({ dynamic: true }))
    .setDescription(`
${entry.executor} üyesi kategori sildi, sunucudan yasaklayıp, silinen kategoriyi izinleriyle birlikte yeniden oluşturup kanallarını içine taşıdım.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
Silinen Kategori: ${channel.name} - \`${channel.id}\`
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)

sendLog({ embeds: [papaz] });
}

const tdata = await TextChannels.findOne({ channelID: channel.id });
const vdata = await VoiceChannels.findOne({ channelID: channel.id });
const cdata = await CategoryChannels.findOne({ channelID: channel.id });

let newChannel;
if ((channel.type === 'GUILD_TEXT') || (channel.type === 'GUILD_NEWS')) {
    newChannel = await channel.guild.channels.create(channel.name, {
    type: channel.type,
    topic: channel.topic,
    nsfw: channel.nsfw,
    parent: channel.parent,
    position: tdata.position + 1,
    rateLimitPerUser: channel.rateLimitPerUser
  });
  await TextChannels.updateMany({ channelID: channel.id }, { channelID: newChannel.id });
}
if (channel.type === 'GUILD_VOICE') {
  newChannel = await channel.guild.channels.create(channel.name, {
    type: channel.type,
    bitrate: channel.bitrate,
    userLimit: channel.userLimit,
    parent: channel.parent,
    position: vdata.position
  });
  await VoiceChannels.updateMany({ channelID: channel.id }, { channelID: newChannel.id });
}
if (channel.type === 'GUILD_CATEGORY') {
    if (!channel.id) return;
     if (!cdata) return;
        const newChannel2 = await channel.guild.channels.create(cdata.name, {
          type: 'GUILD_CATEGORY',
          position: cdata.position + 1,
        });
        const textChannels = await TextChannels.find({ parentID: channel.id });
        await TextChannels.updateMany({ parentID: channel.id }, { parentID: newChannel2.id });
        textChannels.forEach(c => {
          const textChannel = channel.guild.channels.cache.get(c.channelID);
          if (textChannel) textChannel.setParent(newChannel2, { lockPermissions: false });
        });
        const voiceChannels = await VoiceChannels.find({ parentID: channel.id });
        await VoiceChannels.updateMany({ parentID: channel.id }, { parentID: newChannel2.id });
        voiceChannels.forEach(c => {
          const voiceChannel = channel.guild.channels.cache.get(c.channelID);
          if (voiceChannel) voiceChannel.setParent(newChannel2, { lockPermissions: false });
        });
        const newOverwrite = [];
        for (let index = 0; index < cdata.overwrites.length; index++) {
          const veri = cdata.overwrites[index];
          newOverwrite.push({
            id: veri.id,
            allow: new Permissions(veri.allow).toArray(),
            deny: new Permissions(veri.deny).toArray()
          });
        }
        await newChannel2.permissionOverwrites.set(newOverwrite);
        await VoiceChannels.updateMany({ channelID: channel.id }, { channelID: newChannel.id });

    return };

channel.permissionOverwrites.cache.forEach(perm => {
    let thisPermOverwrites = {};
    perm.allow.toArray().forEach(p => {
      thisPermOverwrites[p] = true;
    });
    perm.deny.toArray().forEach(p => {
      thisPermOverwrites[p] = false;
    });
    newChannel.permissionOverwrites.create(perm.id, thisPermOverwrites);
  });

});


ChannelGuard.on("channelUpdate", async (oldChannel, newChannel) => {
let entry = await newChannel.guild.fetchAuditLogs({ type: 'CHANNEL_OVERWRITE_UPDATE' }).then(audit => audit.entries.first());
if (entry.executor.bot) return;

if (!entry || !entry.executor || !newChannel.guild.channels.cache.has(newChannel.id) || await checkPermission(ChannelGuard, entry.executor.id, "full") || await checkPermission(ChannelGuard, entry.executor.id, "channel")) return;

await newChannel.permissionOverwrites.set([...oldChannel.permissionOverwrites.cache.values()]);
cezaVer(ChannelGuard, entry.executor.id, "jail");

});


let channelCreateLimit = {};
ChannelGuard.on("channelCreate", async (channel) => {
    let logs = await channel.guild.fetchAuditLogs({
        type: "CHANNEL_CREATE"
    });
    let entry = logs.entries.first();
    if (!entry || entry.executor.bot || await checkPermission(ChannelGuard, entry.executor.id, "full") || await checkPermission(ChannelGuard, entry.executor.id, "channel") || await checkPermission(ChannelGuard, entry.executor.id, "roleandchannel")) return;
    if (!channelCreateLimit[entry.executor.id]) channelCreateLimit[entry.executor.id] = 0;
    if (channelCreateLimit[entry.executor.id] >= allah.Guard.Limit.ChannelCreate) {
        cezaVer(ChannelGuard, entry.executor.id, "jail");
        channelCreateLimit[entry.executor.id] = 0;

        const papaz = new MessageEmbed()
        .setColor("000001")
        .setThumbnail(entry.executor.avatarURL({ dynamic: true }))
        .setDescription(`
${entry.executor} üyesi **${allah.Guard.Limit.ChannelCreate}** limitinden fazla kanal açmayı denediği için jaile attım.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)

return sendLog({ embeds: [papaz] });

    }
    channelCreateLimit[entry.executor.id] += 1;
    setTimeout(() => {
        channelCreateLimit[entry.executor.id] = 0;
    }, 1000 * 60 * 3);

    const papaz = new MessageEmbed()
    .setColor("000001")
    .setThumbnail(entry.executor.avatarURL({ dynamic: true }))
    .setDescription(`
${entry.executor} üyesinin geriye kalan kanal açma limiti: **${channelCreateLimit[entry.executor.id]}/${allah.Guard.Limit.ChannelCreate}**.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)

return sendLog({ embeds: [papaz] });
});

//#end

/**
 * 
 * @param {Client} client 
 * @param {String} channelName 
 * @param {String} message 
 */

 const webHook = new WebhookClient({ id: allah.Guard.Logs.WebHookID, token: allah.Guard.Logs.WebHookToken });
 async function sendLog(message) {
     webHook.send(message)
 }
 /**
  * @param {string} id 
  * @param {("role"|"channel"|"banandkick"|"bot"|"chatguard"|"roleandchannel"|"full")} type 
  * @returns {boolean}
  */
 async function checkPermission(bots, id, type) {
     let member = bots.guilds.cache.first().members.cache.get(id);
     let res = await SafeMember.findOne({
         guildID: allah.GuildID
     });
 
     if (!res) {
         res = {
             "Full": [],
             "RoleAndChannel": [],
             "Role": [],
             "Channel": [],
             "Bot": [],
             "BanAndKick": [],
             "ChatG": [],
             "SekmeG": []
         }
         await SafeMember.updateOne({
             guildID: allah.GuildID
         }, {}, {
             upsert: true,
             setDefaultsOnInsert: true
         }).exec()
     } else {
 
         if (allah.owners.some(uye => uye == member?member.id:false) || res.Full.some(uye => uye == member?member.id:false  || member ? member.roles.cache.has(uye) : false) || Bots.some(guard => guard.user.id == member?member.id:false ) || ChannelGuard.user.id == member?member.id:false ) {
             return true;
         }
         if (type == "full") {
             if (res.Full.some(uye => uye == member?member.id:false || member ? member.roles.cache.has(uye) : false)) return true;
         } else if (type == "role") {
             if (res.Role.some(uye => uye == member?member.id:false || member ? member.roles.cache.has(uye) : false)) return true;
         } else if (type == "roleandchannel") {
             if (res.RoleAndChannel.some(uye => uye == member?member.id:false || member ? member.roles.cache.has(uye) : false)) return true;
         } else if (type == "channel") {
             if (res.Channel.some(uye => uye == member?member.id:false || member ? member.roles.cache.has(uye) : false || member ? member.voice ? member.voice.channel.id == uye : false : false)) return true;
         } else if (type == "banandkick") {
             if (res.BanAndKick.some(uye => uye == member?member.id:false || member ? member.roles.cache.has(uye) : false) || res.RoleAndChannel.some(uye => uye == member?member.id:false  || member ? member.roles.cache.has(uye) : false)) return true;
         } else if (type == "bot") {
             if (res.Bot.some(uye => uye == member?member.id:false || member ? member.roles.cache.has(uye) : false)) return true;
         } else if (type == "chatguard") {
             if (res.ChatG.some(uye => uye == member?member.id:false || member ? member.roles.cache.has(uye) : false)) return true;
         } else if (type == "sekmeguard") {
             if (res.SekmeG.some(uye => uye == member?member.id:false || member ? member.roles.cache.has(uye) : false)) return true;
         } return false;
     }
 }
 
 /**
  * 
  * @param {Number} count 
  * @returns {Client[]}
  */
  function giveBot(length) {
     if (length > global.Bots.length) length = global.Bots.length;
     let availableBots = global.Bots.filter(e => !e.Busy);
     if (availableBots.length <= 0) availableBots = global.Bots.sort((x, y) => x.Uj - y.Uj).slice(0, length);
 
     return availableBots;
 }
 
 function processBot(bot, busy, job, equal = false) {
     bot.Busy = busy;
     if (equal) bot.Uj = job;
     else bot.Uj += job;
 
     let index = global.Bots.findIndex(e => e.user.id == bot.user.id);
     global.Bots[index] = bot;
 }
 
 function getClients(count) {
     return Bots.slice(0, count);
 }
 
 function sleep(ms) {
     return new Promise(resolve => setTimeout(resolve, ms));
 }
 
 
 async function cezaVer(test, kisiID, tur) {
 let MEMBER = test.guilds.cache.get(allah.GuildID).members.cache.get(kisiID)
 if (!MEMBER) return;
 if (tur == "jail") return MEMBER.roles.cache.has(setup.boosterRolu) ? MEMBER.roles.set([setup.boosterRolu, setup.jailRole[0]]) : MEMBER.roles.set(setup.jailRole).catch(() => {if (allah.Guard.TaçHesapToken.length > 0) {taccezaVer(MEMBER.user.id, "tjail")}})
 if (tur == "ban") return MEMBER.ban({ reason: "Guard Sistem Koruma" }).catch(() => {if (allah.Guard.TaçHesapToken.length > 0) {taccezaVer(MEMBER.user.id, "tban")}})
 if (tur == "kick") return MEMBER.kick().catch(() => {if (allah.Guard.TaçHesapToken.length > 0) {taccezaVer(MEMBER.user.id, "tkick")}})
 };
 
 async function taccezaVer(kisiID, tur) {
 tacuser.guilds.cache.get(allah.GuildID).members.fetch().then(async (x) => {
 let MEMBER = tacuser.guilds.cache.get(allah.GuildID).members.cache.get(kisiID)
 if (!MEMBER) return;
 if (tur == "tjail") return MEMBER.roles.cache.has(setup.boosterRolu) ? MEMBER.roles.set([setup.boosterRolu, setup.jailRole[0]]) : MEMBER.roles.set(setup.jailRole);
 if (tur == "tban") return MEMBER.ban({ reason: "Taç Guard Sistem Koruma" });
 if (tur == "tkick") return MEMBER.kick();
 })
 };
 
 async function rolbackup() {    
     const guild = OtherGuard.guilds.cache.get(allah.GuildID);
       let members = await guild.members.fetch();
       guild.roles.cache.forEach(async role => {
           let roleChannelOverwrites = [];
           await guild.channels.cache.filter(c => c.permissionOverwrites.cache.has(role.id)).forEach(c => {
               let channelPerm = c.permissionOverwrites.cache.get(role.id);
               let pushlanacak = {
                   id: c.id,
                   allow: channelPerm.allow.toArray(),
                   deny: channelPerm.deny.toArray()
               };
               roleChannelOverwrites.push(pushlanacak);
           });
     
           await RoleModel.updateOne({
               roleID: role.id
           }, {
               $set: {
                   guildID: guild.id,
                   roleID: role.id,
                   name: role.name,
                   color: role.hexColor,
                   hoist: role.hoist,
                   position: role.position,
                   permissions: role.permissions.bitfield,
                   mentionable: role.mentionable,
                   time: Date.now(),
                   members: role.members.map(m => m.id),
                   channelOverwrites: roleChannelOverwrites
               }
           }, {
               upsert: true
           });
       });
     
     console.log("Bütün Rol verileri başarı ile kayıt edildi.")
     };
 
 
 async function kanalbackup() {
     const guild = ChannelGuard.guilds.cache.get(allah.GuildID);
       if (guild) {
           const channels = [...guild.channels.cache.values()];
           for (let index = 0; index < channels.length; index++) {
               const channel = channels[index];
               let ChannelPermissions = []
               channel.permissionOverwrites.cache.forEach(perm => {
                   ChannelPermissions.push({ id: perm.id, type: perm.type, allow: "" + perm.allow, deny: "" + perm.deny })
               });
             
               if ((channel.type === 'GUILD_TEXT') || (channel.type === 'GUILD_NEWS')) {
                 await TextChannels.updateOne({
                     channelID: channel.id,
                 }, {
                     $set: {
                         channelID: channel.id,
                         name: channel.name,
                         nsfw: channel.nsfw,
                         parentID: channel.parentId,
                         position: channel.position,
                         rateLimit: channel.rateLimitPerUser,
                         overwrites: ChannelPermissions,
                     }
                 }, {
                     upsert: true
                 });
               }
               if (channel.type === 'GUILD_VOICE') {
                 await VoiceChannels.updateOne({
                     channelID: channel.id,
                 }, {
                     $set: {
                         channelID: channel.id,
                         name: channel.name,
                         bitrate: channel.bitrate,
                         userLimit: channel.userLimit,
                         parentID: channel.parentId,
                         position: channel.position,
                         overwrites: ChannelPermissions,
                     }
                 }, {
                     upsert: true
                 });
               }
               if (channel.type === 'GUILD_CATEGORY') {
                 await CategoryChannels.updateOne({
                     channelID: channel.id,
                 }, {
                     $set: {
                         channelID: channel.id,
                         name: channel.name,
                         position: channel.position,
                         overwrites: ChannelPermissions,
                     }
                 }, {
                     upsert: true
                 });
               }
           }
           console.log("Bütün Kanal verileri başarı ile kayıt edildi.")
       }}
 
 async function papazımmmm(vanity, token) {
 let random = allah.Guard.Guards.forEach(async x => { x })
         
 const spammer = {
   url: `https://discord.com/api/v8/guilds/${allah.GuildID}/vanity-url`,
   body: {
     code: `${vanity}`},
     json: true,
     method: 'PATCH',
     headers: {
     "Authorization": `Bot ${random}`
     }};
         
 request(spammer, (err, res, body) => {if (err) {return console.log(err)}})}
 
 //#endjaylen