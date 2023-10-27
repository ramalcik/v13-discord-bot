const { GuildMember, GuildAuditLogsEntry, WebhookClient, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Discord  = require("discord.js");

const { getVoiceConnection, joinVoiceChannel } = require("@discordjs/voice");
const RoleModel = require("../src/Models/Role");
const SafeMember = require("../src/Models/Safe");



const request = require("request");
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")
const setup = require('../../Papaz-Main/src/configs/setup.json');
const allah = require('../../../config.json');

const RoleGuard = new Discord.Client({ fetchAllMembers: true, intents: 32767 }); 

///////

RoleGuard.on("ready", async () => {
    const guild = RoleGuard.guilds.cache.first();
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

      RoleGuard.user.setActivity(`${oynuyor[index]}`, {
        type: "WATCHING",});

    }, 10000);
    console.log("Rol koruma botu aktif.");
});
RoleGuard.login(allah.Guard.RolGuard);

const Bots = global.Bots = [];


RoleGuard.on("guildMemberUpdate", async (oldMember, newMember) => {
    if (oldMember.roles.cache.size != newMember.roles.cache.size) {
        let diffRoles = newMember.roles.cache.filter(o => !oldMember.roles.cache.has(o.id));
        let perms = allah.Guard.StaffPerm
        if (!diffRoles.some(e => perms.some(perm => e.permissions.has(perm)))) {
            return;
        }
        let logs = await oldMember.guild.fetchAuditLogs({
            limit: 1,
            type: "MEMBER_ROLE_UPDATE"
        });
        let entry = logs.entries.first();
        if (!entry || entry.executor.bot || await checkPermission(RoleGuard, entry.executor.id, "full") || await checkPermission(RoleGuard, entry.executor.id, "role") || await checkPermission(RoleGuard, entry.executor.id, "roleandchannel")) return;
        let member = await oldMember.guild.members.fetch(entry.executor.id).then(m => m).catch(() => undefined);
        if (member) {
         await cezaVer(RoleGuard, member.id, "jail")
        }
        newMember.roles.set(oldMember.roles.cache.map(r => r.id));

        const papaz = new MessageEmbed()
        .setColor("000001")
        .setThumbnail(entry.executor.avatarURL({ dynamic: true }))
        .setDescription(`
${entry.executor} üyesi izinsiz yönetici rolü verdi ve üyeden rolü alıp, rolü veren kişiyi banladım.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
Kullanıcı: ${newMember.user} - \`${newMember.id}\`
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)

return sendLog({ embeds: [papaz] })
    }
});

let roleCreateLimit = {};
RoleGuard.on("roleCreate", async (role) => {
    let logs = await role.guild.fetchAuditLogs({
        type: "ROLE_CREATE"
    });
    let entry = logs.entries.first();
    if (!entry || entry.executor.bot || await checkPermission(RoleGuard, entry.executor.id, "full") || await checkPermission(RoleGuard, entry.executor.id, "role") || await checkPermission(RoleGuard, entry.executor.id, "roleandchannel")) return;
    if (!roleCreateLimit[entry.executor.id]) roleCreateLimit[entry.executor.id] = 0;
    if (roleCreateLimit[entry.executor.id] && roleCreateLimit[entry.executor.id] >= allah.Guard.Limit.RoleCreate) {
        roleCreateLimit[entry.executor.id] = 0;
        cezaVer(RoleGuard, entry.executor.id, "jail");
        role.delete({
            reason: "Role Guard"
        })

        const papaz = new MessageEmbed()
        .setColor("000001")
        .setThumbnail(entry.executor.avatarURL({ dynamic: true }))
        .setDescription(`
${entry.executor} üyesi **${allah.Guard.Limit.RoleCreate}** limitinden fazla rol açmayı denediği için jaile attım.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)

return sendLog({ embeds: [papaz] });
    };
    roleCreateLimit[entry.executor.id] += 1;
    setTimeout(() => {
        roleCreateLimit[entry.executor.id] = 0;
    }, 1000 * 60 * 3);

    const papaz = new MessageEmbed()
    .setColor("000001")
    .setThumbnail(entry.executor.avatarURL({ dynamic: true }))
    .setDescription(`
${entry.executor} üyesinin geriye kalan rol açma limiti: **${roleCreateLimit[entry.executor.id]}/${allah.Guard.Limit.RoleCreate}**.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)

return sendLog({ embeds: [papaz] });
});


RoleGuard.on("roleUpdate", async (oldRole, newRole) => {
let entry = await newRole.guild.fetchAuditLogs({ type: 'ROLE_UPDATE' }).then(audit => audit.entries.first());

if (entry.executor.bot) return;
if (!entry || !entry.executor || await checkPermission(RoleGuard, entry.executor.id, "full") || await checkPermission(RoleGuard, entry.executor.id, "role") || await checkPermission(RoleGuard, entry.executor.id, "roleandchannel")) return;

newRole.edit(oldRole)
cezaVer(RoleGuard, entry.executor.id, "jail");

});

RoleGuard.on("roleDelete", async (role) => {
        let veri = await SafeMember.findOne({
        guildID: role.guild.id
    }) || {
        "Full": [],
        "RoleAndChannel": [],
        "Role": [],
        "Channel": [],
        "Bot": [],
        "BanAndKick": [],
        "ChatG": [],
        "Permissions": [],
        "SafeRole": []
    };
    let logs = await role.guild.fetchAuditLogs({
        limit: 1,
        type: "ROLE_DELETE"
    });
    let entry = logs.entries.first();

   if (entry.executor.bot) return;
    if ((!entry || await checkPermission(RoleGuard, entry.executor.id, "full") || await checkPermission(RoleGuard, entry.executor.id, "role") || await checkPermission(RoleGuard, entry.executor.id, "roleandchannel")) && !veri.SafeRole.includes(role.id)) {

        const papaz = new MessageEmbed()
        .setColor("000001")
        .setThumbnail(entry.executor.avatarURL({ dynamic: true }))
        .setDescription(`
${entry.executor} üyesi rol sildi, güvenli listede bulunduğu için işlem yapmadım.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
Silinen Rol: ${role.name} - \`${role.id}\`
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)

return sendLog({ embeds: [papaz] });
    }

    let member = await role.guild.members.fetch(entry.executor.id).then(m => m).catch(() => undefined);

       cezaVer(RoleGuard, member.id, "ban")

let data = await RoleModel.findOne({ guildID: role.guild.id, roleID: role.id })

    const newRole = await role.guild.roles.create({
        name: data.name,
        color: data.color,
        hoist: data.hoist,
        permissions: data.permissions,
        position: data.position,
        mentionable: data.mentionable,
        reason: "Rol Silindiği İçin Tekrar Oluşturuldu!"
      });

      let kanalPermVeri = data.channelOverwrites.filter(e => RoleGuard.guilds.cache.get(allah.GuildID).channels.cache.get(e.id))
      if (kanalPermVeri) kanalPermVeri.forEach((perm, index) => {
        let kanal = role.guild.channels.cache.get(perm.id);
        if (!kanal) return;
        setTimeout(() => {
          let yeniKanalPermVeri = {};
          perm.allow.forEach(p => {
            yeniKanalPermVeri[p] = true;
          });
          perm.deny.forEach(p => {
            yeniKanalPermVeri[p] = false;
          });
          kanal.permissionOverwrites.create(newRole, yeniKanalPermVeri).catch(console.error);
        }, index * 5000);
      });

     await RoleModel.updateOne({ guildID: role.guild.id, roleID: role.id }, { $set: { roleID: newRole.id }})

     let length = data.members.length;
     let clientsCount = Bots.length
     let clients = getClients(clientsCount);

     if (!data || length <= 0) {
        const papaz = new MessageEmbed()
        .setColor("000001")
        .setThumbnail(entry.executor.avatarURL({ dynamic: true }))
        .setDescription(`
${entry.executor} üyesi rol sildi, sunucudan yasakladım ancak silinen rol için bir veri olmadığı için hiçbir şey yapamadım.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
Silinen Rol: ${role.name} - \`${role.id}\`
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)

return sendLog({ embeds: [papaz] });
    }
    

    let availableBots = global.Bots.filter(e => !e.Busy);
    if (availableBots.length <= 0) availableBots = global.Bots.sort((x, y) => y.Uj - x.Uj).slice(0, Math.round(length / global.Bots.length));
    let perAnyBotMembers = Math.floor(length / availableBots.length);
    if (perAnyBotMembers < 1) perAnyBotMembers = 1;
    for (let index = 0; index < availableBots.length; index++) {
        const bot = availableBots[index];
        let ids = data.members.slice(index * perAnyBotMembers, (index + 1) * perAnyBotMembers);
        if (ids.length <= 0) { processBot(bot, false, -perAnyBotMembers); break; }
        let guild = bot.guilds.cache.get(allah.GuildID); 
        ids.every(async id => {
        let member = guild.members.cache.get(id);
        if(!member){
        console.log(`Oto Silinen Rol Kurulumundan sonra ${bot.user.username} - ${id} adlı üyeyi sunucuda bulamadım.`);
        return true;}
        await member.roles.add(newRole.id).then(e => {console.log(`Oto Silinen Rol kurulumundan sonra ${bot.user.tag} - ${member.user.username} adlı üye ${newRole.name} rolünü aldı.`);}).catch(e => {console.log(`[${newRole.id}] Olayından sonra ${bot.user.username} - ${member.user.username} adlı üyeye rol veremedim.`);});});
         processBot(bot, false, -perAnyBotMembers); }

            const papaz = new MessageEmbed()
            .setColor("000001")
            .setThumbnail(entry.executor.avatarURL({ dynamic: true }))
            .setDescription(`
${entry.executor} üyesi rol sildi, sunucudan yasakladım.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
Silinen Rol: ${role.name} - \`${role.id}\`
**Aktif İşlem;**
\`\`\`cs
Role sahip ${data.members.length} üye ${clients.length}'ı bot üye olmak üzere rolü destekçiler ile birlikte dağıtmaya başlıyorum
İşlemin biteceği tahmini süre: ${(length>1000 ? parseInt((length*(allah.Guard.Guard.GiveRoleDelay/1000)) / 60)+" dakika" : parseInt(length*(allah.Guard.Guard.GiveRoleDelay/1000))+" saniye")}
\`\`\`
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)
    
    sendLog({ embeds: [papaz] });
   
});

//#end

//#jaylen Fonksiyonlar

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
 
         if (allah.owners.some(uye => uye == member?member.id:false) || res.Full.some(uye => uye == member?member.id:false  || member ? member.roles.cache.has(uye) : false) || Bots.some(guard => guard.user.id == member?member.id:false ) || RoleGuard.user.id == member?member.id:false) {
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
     const guild = ChannelGuard.guilds.cache.get(allah.GuildID);
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
     const guild = OtherGuard.guilds.cache.get(allah.GuildID);
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
 