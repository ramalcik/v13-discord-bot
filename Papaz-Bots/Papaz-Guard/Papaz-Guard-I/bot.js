const { GuildMember, GuildAuditLogsEntry, WebhookClient, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Discord  = require("discord.js");

const { getVoiceConnection, joinVoiceChannel } = require("@discordjs/voice");
const RoleModel = require("../src/Models/Role");
const SafeMember = require("../src/Models/Safe");

const CategoryChannels = require("../src/Models/CategoryChannels");
const TextChannels = require("../src/Models/TextChannels");
const VoiceChannels = require("../src/Models/VoiceChannels"); 

const QueryManager = require("./src/query");
const request = require("request");
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")
const setup = require('../../Papaz-Main/src/configs/setup.json');
const allah = require('../../../config.json');


const OtherGuard = new Discord.Client({ fetchAllMembers: true, intents: 32767 });

/////
const { Client } = require('discord.js-selfbot-v13');
const tacuser = new Client({ checkUpdate: false });

if (allah.Guard.TaçHesapToken.length > 0) {
    tacuser.on('ready', async () => {
      console.log(`${tacuser.user.username} isimli Taç Guard Aktif!`);
    });
    tacuser.login(allah.Guard.TaçHesapToken)  
}

OtherGuard.on("ready", () => {
    
    const guild = OtherGuard.guilds.cache.first();
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
  
        OtherGuard.user.setActivity(`${oynuyor[index]}`, {
          type: "WATCHING",});
  
      }, 10000);
      
    console.log("Harici koruma botu aktif.");
    rolbackup();
    kanalbackup();
    setInterval(async () => {
        await rolbackup();
        await kanalbackup();
    }, 1000 * 60 * 60 * 3)
});
OtherGuard.login(allah.Guard.OtherGuard);

const Bots = global.Bots = [];

allah.Guard.Guards.forEach(async token => {
const guardClient = global.client = new Discord.Client({ fetchAllMembers: true, intents: 32767 });

guardClient.on("ready", () => {
  console.log(`(${guardClient.user.username}) adlı destekçi hesapta [${guardClient.guilds.cache.get(allah.GuildID).name}] adlı sunucuda giriş yapıldı.`);
  guardClient.user.setPresence({ status: "invisible" });
  guardClient.Busy = false;
  guardClient.Uj = 0;
  Bots.push(guardClient);

  guardClient.queryManager = new QueryManager();
  guardClient.queryManager.init(allah.Guard.Guard.TaskDelay); 
});

await guardClient.login(token).then(e => {}).catch(e => {console.error(`${token.substring(Math.floor(token.length / 2))} adlı bota giriş yapılırken başarısız olundu!.`)})
});





let BanLimit = {};

OtherGuard.on("guildBanAdd", async (orospu) => {
    const logs = await orospu.guild.fetchAuditLogs({
        type: "MEMBER_BAN_ADD"
    });
    /**
     * @type {GuildAuditLogsEntry}
     */
    let entry = logs.entries.first();

    if (!logs || !entry || entry.executor.bot || await checkPermission(OtherGuard, entry.executor.id, "full") || await checkPermission(OtherGuard, entry.executor.id, "banandkick") || await checkPermission(OtherGuard, entry.executor.id, "roleandchannel")) return;
    if (entry.executor.id === orospu.user.id) return;

    let victimMember = await orospu.guild.members.fetch(entry.executor.id).then(m => m).catch(() => undefined);
    if (BanLimit[entry.executor.id] && BanLimit[entry.executor.id].Now + 1 > allah.Guard.Limit.Ban) {
        orospu.guild.members.unban(orospu.user.id);
        if (victimMember) {
            BanLimit[entry.executor.id] = {
                Now: 1,
                Last: Date.now()
            }
            await cezaVer(OtherGuard, victimMember.id, "ban")
        }
        BanLimit[entry.executor.id].Now += 1;

        const papaz = new MessageEmbed()
        .setColor("000001")
        .setThumbnail(entry.executor.avatarURL({ dynamic: true }))
        .setDescription(`
${entry.executor} yetkilisi **${allah.Guard.Limit.Ban}** Ban limitini geçtiği için kendisi banlandı ve banlanan üyenin banı kaldırıldı.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
Kullanıcı: \`${orospu.user.tag}\` - \`${orospu.user.id}\`
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)

return sendLog({ embeds: [papaz] });
    } else if (!BanLimit[entry.executor.id]) {
        BanLimit[entry.executor.id] = {
            Now: 1,
            Last: Date.now()
        };

        const papaz = new MessageEmbed()
        .setColor("000001")
        .setThumbnail(entry.executor.avatarURL({ dynamic: true }))
        .setDescription(`
${entry.executor} yetkilisi kalan Ban Limit: **${1}/${allah.Guard.Limit.Ban}**.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
Kullanıcı: \`${orospu.user.tag}\` - \`${orospu.user.id}\`
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)

return sendLog({ embeds: [papaz] });
    } else {
        BanLimit[entry.executor.id].Now += 1;
        setTimeout(() => {
            BanLimit[entry.executor.id] = {
                Now: 1,
                Last: Date.now()
            }
        }, 1000 * 60 * 3);

        const papaz = new MessageEmbed()
        .setColor("000001")
        .setThumbnail(entry.executor.avatarURL({ dynamic: true }))
        .setDescription(`
${entry.executor} yetkilisi kalan Ban Limit: **${BanLimit[entry.executor.id].Now}/${allah.Guard.Limit.Ban}**.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
Kullanıcı: \`${orospu.user.tag}\` - \`${orospu.user.id}\`
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)

return sendLog({ embeds: [papaz] });
    }
});

let KickLimit = {};

OtherGuard.on("guildMemberRemove", async (member) => {

    let entry = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK'}).then(audit => audit.entries.first());
    if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || entry.executor.bot || await checkPermission(OtherGuard, entry.executor.id, "full") || await checkPermission(OtherGuard, entry.executor.id, "banandkick") || await checkPermission(OtherGuard, entry.executor.id, "roleandchannel")) return;
    if (entry.executor.id === member.id) return;

    let victimMember = await member.guild.members.fetch(entry.executor.id).then(m => m).catch(() => undefined);
    if (KickLimit[entry.executor.id] && KickLimit[entry.executor.id].Now + 1 > allah.Guard.Limit.Kick) {
        if (victimMember) {
            KickLimit[entry.executor.id] = {
                Now: 1,
                Last: Date.now()
            }
            await cezaVer(OtherGuard, victimMember.id, "ban")
        }
        KickLimit[entry.executor.id].Now += 1;
        const papaz = new MessageEmbed()
        .setColor("000001")
        .setThumbnail(entry.executor.avatarURL({ dynamic: true }))
        .setDescription(`
${entry.executor} yetkilisi **${allah.Guard.Limit.Kick}** Kick limitini geçtiği için sunucudan banlandı.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
Kullanıcı: \`${member.user.tag}\` - \`${member.user.id}\`
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)

return sendLog({ embeds: [papaz] });
    } else if (!KickLimit[entry.executor.id]) {
        KickLimit[entry.executor.id] = {
            Now: 1,
            Last: Date.now()
        };
        const papaz = new MessageEmbed()
        .setColor("000001")
        .setThumbnail(entry.executor.avatarURL({ dynamic: true }))
        .setDescription(`
${entry.executor} yetkilisi kalan Kick Limit: **${1}/${allah.Guard.Limit.Kick}**.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
Kullanıcı: \`${member.user.tag}\` - \`${member.user.id}\`
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)

return sendLog({ embeds: [papaz] });
    } else {
        KickLimit[entry.executor.id].Now += 1;
        setTimeout(() => {
            KickLimit[entry.executor.id] = {
                Now: 1,
                Last: Date.now()
            }
        }, 1000 * 60 * 3);
        const papaz = new MessageEmbed()
        .setColor("000001")
        .setThumbnail(entry.executor.avatarURL({ dynamic: true }))
        .setDescription(`
${entry.executor} yetkilisi kalan Kick Limit: **${KickLimit[entry.executor.id].Now}/${allah.Guard.Limit.Kick}**.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
Kullanıcı: \`${member.user.tag}\` - \`${member.user.id}\`
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)

return sendLog({ embeds: [papaz] });
    }
});


OtherGuard.on("guildMemberAdd", async (member) => {
    if (!member.user.bot) return;

    let logs = await member.guild.fetchAuditLogs({
        type: "BOT_ADD"
    });
    /**
     * @type {GuildAuditLogsEntry}
     */
    let entry = logs.entries.first();

    if (!entry || await checkPermission(OtherGuard, entry.executor.id, "bot")) return;
    
    await cezaVer(OtherGuard, member.id, "ban")

    let victimMember = await member.guild.members.fetch(entry.executor.id).then(m => m).catch(() => undefined);
    if (victimMember) {
        await cezaVer(OtherGuard, victimMember.id, "ban")
    }

    const papaz = new MessageEmbed()
    .setColor("000001")
    .setThumbnail(entry.executor.avatarURL({ dynamic: true }))   
    .setDescription(`
${entry.executor} üyesi izinsiz sunucuya bot ekledi ve yetkiliyi banlayıp, eklenen botu banladım.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
Bot: ${member.user} - \`${member.id}\`
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)
    
return sendLog({ embeds: [papaz] });
});

const logs = require('discord-logs');
logs(OtherGuard);

let susturmaLimit = {};

OtherGuard.on("voiceStateUpdate", async (oldState, newState) => {
    let logs = await oldState.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_UPDATE" });
    let entry = logs.entries.first();
    if (!logs || !entry.executor || await checkPermission(OtherGuard, entry.executor.id, "full") || await checkPermission(OtherGuard, entry.executor.id, "roleandchannel") || entry.executor.bot) return;
    if (newState.member.id == entry.executor.id) return;

    if (!oldState.serverMute && newState.serverMute) {
    if (!susturmaLimit[entry.executor.id]) susturmaLimit[entry.executor.id] = 0;
    if (susturmaLimit[entry.executor.id] && susturmaLimit[entry.executor.id] >= allah.Guard.Limit.Susturma) {
        susturmaLimit[entry.executor.id] = 0;
        cezaVer(OtherGuard, entry.executor.id, "jail");
        const papaz = new MessageEmbed()
        .setColor("000001")
        .setThumbnail(entry.executor.avatarURL({ dynamic: true }))   
        .setDescription(`
${entry.executor} adlı yetkili sağ-tık susturma sınırını aştığı için jail'e gönderildi.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)
        
    return sendLog({ embeds: [papaz] });
    }};
    susturmaLimit[entry.executor.id] += 1;
    setTimeout(() => {
        susturmaLimit[entry.executor.id] = 0;
    }, 1000 * 60 * 3);
});

OtherGuard.on("guildUpdate", async (oldGuild, newGuild) => {
    let entry = await newGuild.fetchAuditLogs({
        type: 'GUILD_UPDATE',
        limit: 1
    }).then(audit => audit.entries.first());
    if(oldGuild.vanityURLCode === newGuild.vanityURLCode) return;   

    if (newGuild.vanityURLCode !== setup.serverUrl) {
        let random = allah.Guard.Guards[Math.floor(Math.random() * allah.Guard.Guards.length)];
        request({
            url: `https://discord.com/api/v6/guilds/${allah.GuildID}/vanity-url`,
            body: {
                code: setup.serverUrl
            },
            json: true,
            method: 'PATCH',
            headers: {
                "Authorization": `Bot ${random}`
            }
        });
        cezaVer(OtherGuard, entry.executor.id, "ban");
    }
    if (!entry || entry.executor.bot) return;
    const papaz = new MessageEmbed()
    .setColor("000001")
    .setThumbnail(entry.executor.avatarURL({ dynamic: true }))   
    .setDescription(`
${entry.executor} adlı yetkili URL'yi Elledi ve sunucudan banlayıp urlyi spamladım.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)
    
return sendLog({ content: `@here`, embeds: [papaz] });

});

OtherGuard.on("ready", () => {
const guild = OtherGuard.guilds.cache.get(allah.GuildID)
let random = allah.Guard.Guards[Math.floor(Math.random() * allah.Guard.Guards.length)];

setInterval(async () => {
if(guild.vanityURLCode == setup.serverUrl) {
return } else {
papazımmmm(setup.serverUrl, allah.GuildID, `${random}`)
}}, 1 * 500)})


OtherGuard.on("guildUpdate", async (oldGuild, newGuild) => {
    let entry = await newGuild.fetchAuditLogs({
        type: 'GUILD_UPDATE',
        limit: 1
    }).then(audit => audit.entries.first());

    if (!entry || entry.executor.bot || await checkPermission(OtherGuard, entry.executor.id, "full") || await checkPermission(OtherGuard, entry.executor.id, "roleandchannel")) return;
    cezaVer(OtherGuard, entry.executor.id, "jail");

    if (newGuild.name !== oldGuild.name) await newGuild.setName(oldGuild.name);
    if (newGuild.iconURL({dynamic: true, size: 2048}) !== oldGuild.iconURL({dynamic: true, size: 2048})) await newGuild.setIcon(oldGuild.iconURL({dynamic: true, size: 2048}));
    if (oldGuild.banner !== newGuild.banner) await newGuild.setBanner(oldGuild.bannerURL({ size: 4096 }));

    const papaz = new MessageEmbed()
    .setColor("000001")
    .setThumbnail(entry.executor.avatarURL({ dynamic: true }))   
    .setDescription(`
${entry.executor} adlı yetkili Sunucu Ayarlarını Elledi, sunucuyu eski haline getirdim ve kullanıcıyı jail attım.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)
    
return sendLog({ embeds: [papaz] });

});

OtherGuard.on("guildUnavailable", async (guild) => {

const yetkiPermleri = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_EMOJIS_AND_STICKERS", "MANAGE_WEBHOOKS"]
OtherGuard.guilds.cache.get(allah.GuildID).roles.cache.filter(rol => rol.editable).filter(rol => yetkiPermleri.some(yetki => rol.permissions.has(yetki))).forEach(async (rol) => rol.setPermissions(0n));

const papaz = new MessageEmbed()
.setColor("000001")
.setThumbnail(entry.executor.avatarURL({ dynamic: true }))   
.setDescription(`
Sunucu kullanılmaz hale getirildiği için otomatik olarak sunucu içerisindeki tüm yönetici, rol yönet, kanal yönet ve diğer izinleri tamamiyle kapattım.
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)
    
return sendLog({ embeds: [papaz] });

});

OtherGuard.on("webhookUpdate", async (channel) => {
    let logs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: "WEBHOOK_CREATE"
    });
    let entry = logs.entries.first();
    if (!entry || entry.executor.bot || await checkPermission(OtherGuard, entry.executor.id, "bot")) return;
    cezaVer(OtherGuard, entry.executor.id, "jail");

    const webhooks = await channel.fetchWebhooks();
    await webhooks.map(x => x.delete({reason: "Guard Webhook Silindi!"}))

    const papaz = new MessageEmbed()
    .setColor("000001")
    .setThumbnail(entry.executor.avatarURL({ dynamic: true }))   
    .setDescription(`
${entry.executor} üyesi tarafından sunucuda izinsiz webhook açıldı, webhook silindi ve yetkili jail atıldı.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)
    
 sendLog({ embeds: [papaz] });
});

OtherGuard.on("webhookUpdate", async (channel) => {
    let logs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: "WEBHOOK_DELETE"
    });
    let entry = logs.entries.first();
    if (!entry || entry.executor.bot || await checkPermission(OtherGuard, entry.executor.id, "bot")) return;
    cezaVer(OtherGuard, entry.executor.id, "jail");

    const papaz = new MessageEmbed()
    .setColor("000001")
    .setThumbnail(entry.executor.avatarURL({ dynamic: true }))   
    .setDescription(`
${entry.executor} üyesi tarafından sunucuda izinsiz webhook silindi, kullanıcı jail atıldı.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)
    
 sendLog({ embeds: [papaz] });
});

OtherGuard.on("emojiDelete", async (emoji) => {
    let logs = await emoji.guild.fetchAuditLogs({
        limit: 1,
        type: "EMOJI_DELETE"
    });
    let entry = logs.entries.first();
    if (!entry || await checkPermission(OtherGuard, entry.executor.id, "full") || await checkPermission(OtherGuard, entry.executor.id, "roleandchannel")) return;
    cezaVer(OtherGuard, entry.executor.id, "jail");
    emoji.guild.emojis.create(`${emoji.url}`, `${emoji.name}`).catch(console.error);

    const papaz = new MessageEmbed()
    .setColor("000001")
    .setThumbnail(entry.executor.avatarURL({ dynamic: true }))   
    .setDescription(`
${entry.executor} üyesi izinsiz emoji sildi ve kullanıcıyı karantina atıp, emojiyi yeniden yükledim.
─────────────────────
Yetkili: (${entry.executor} - \`${entry.executor.id}\`)
Emoji: \`${emoji.name}\` - \`${emoji.id}\`
─────────────────────
Tarih: \`${moment(Date.now()).format("LLL")}\``)
    
 sendLog({ embeds: [papaz] });
});
//#endjaylen

//#chat guard

let reklamLimit = {};
OtherGuard.on("messageCreate", async (message) => {
    if (message.author.bot || message.channel.type == "dm") return;
    if (await checkPermission(OtherGuard, message.author.id, "full") || await checkPermission(OtherGuard, message.author.id, "chatguard")) return;
    let messages = [...message.channel.messages.cache.values()];
    messages = messages.splice(messages.length - 10, messages.length);
    let ms = messages.filter(e => e.cleanContent == message.cleanContent && e.author.id == message.author.id);
    const kelime = ["discord.gg", "discord.me", "discordapp.com", "discord.io", "discord.tk", ".gg/", ".gg"];
    let links = message.content.match(/(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}?\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi);
    if (ms.length > 5 && !["game","owo","fun","kamp-ateşi-chat","konser-chat"].some(ver => message.channel.name.includes(ver))) {
        ms.forEach(m => m.delete().catch(() => {}));
        message.member.roles.add(setup.chatMute);
        message.reply({ content: `Sohbet kanallarını kirletme sebebiyle \`3 dakika\` süresince susturuldunuz, mesajlar temizlendi. Lütfen yavaşlayın. ${message.author}`});
        setTimeout(() => {
            if (!message.member.roles.cache.has(setup.chatMute)) return;
            message.member.roles.remove(setup.chatMute);
            message.reply({ ontent: `Sohbet kanallarını kirletme sebebiyle 3 dakika süresince susturmanız bitti. Lütfen tekrarlamayınız. ${message.author}`});
        }, 1000 * 60 * 3);
        return;
    }
    if ((message.mentions.members.size >= allah.Guard.Limit.Etiket || message.mentions.roles.size >= allah.Guard.Limit.Etiket || message.mentions.channels.size >= allah.Guard.Limit.Etiket)) {
        message.delete().catch(() => {});
    message.member.roles.add(setup.chatMute);
    message.channel.send({ content: `Birden çok kişiyi etiketlediğin için \`15 dakika\` boyunca susturuldun. ${message.author}`});
    setTimeout(() => {
        if (!message.member.roles.cache.has(setup.chatMute)) return;
        message.member.roles.remove(setup.chatMute);
        message.channel.send({ content: `Birden çok kişiyi etiketleme sebebiyle olan, Muten açıldı lütfen tekrar insanları etiketleme. ${message.author}`});
    }, 1000 * 60 * 15);
}

    let args = message.content.split(" ");
    const kufurler = allah.Guard.Küfürler;
    if (kufurler.some(word => args.some(c => word.toLowerCase() == c.toLowerCase())) && !["t-sustum"].some(ver => message.channel.name.includes(ver))) {
        
		message.delete();
        message.channel.send({ content: `Bu sunucuda küfür etmek yasak. ${message.author}`}).then((e) => setTimeout(() => { e.delete(); }, 5000)).catch(err => {});
		
    }
    
    if (kelime.some(reklam => message.content.toLowerCase().includes(reklam)) && ![message.guild.vanityURLCode].some(reklam => message.content.toLocaleLowerCase().includes(reklam))) {
        if (!reklamLimit[message.author.id]) reklamLimit[message.author.id] = 0;
        if (reklamLimit[message.author.id] && reklamLimit[message.author.id] >= 5) {
            reklamLimit[message.author.id] = 0;
            message.member.ban({
                reason: "Reklam Link Koruması"
            });
            return;
        };
        reklamLimit[message.author.id]++;
        setTimeout(() => {
            reklamLimit[message.author.id]--
        }, 1000 * 60 * 5);
        if (message.deletable) message.delete().catch(err => {});
    } else {
        if (!links) return;
        if (!reklamLimit[message.author.id]) reklamLimit[message.author.id] = 0;
        if (reklamLimit[message.author.id] && reklamLimit[message.author.id] >= 5) {
            reklamLimit[message.author.id] = 0;
            message.member.ban({
                reason: "Reklam Link Koruması"
            });
            return;
        };
        reklamLimit[message.author.id]++;
        setTimeout(() => {
            reklamLimit[message.author.id]--
        }, 1000 * 60 * 5);
        if (message.deletable) message.delete().catch(err => {});
    }
});

OtherGuard.on("messageUpdate", async (oldMessage, newMessage) => {
    if (oldMessage.author.bot || newMessage.channel.type == "dm") return;
    if (await checkPermission(OtherGuard, oldMessage.author.id, "full") || await checkPermission(OtherGuard, oldMessage.author.id, "chatguard")) return;
    const kelime = ["discord.gg", "discord.me", "discordapp.com", "discord.io", "discord.tk", ".gg/", ".gg"];
    let args = newMessage.content.split(" ");
    const kufurler = allah.Guard.Küfürler
    if (kufurler.some(word => args.some(c => word.toLowerCase() == c.toLowerCase())) && !["sus"].some(ver => newMessage.channel.name.includes(ver))) {
      newMessage.delete().then(message => {
        newMessage.channel.send({ content: `Bu Sunucuda reklam yasak!. ${message.author}`}).then((e) => setTimeout(() => { e.delete(); }, 5000)).catch(err => {});
      });
    }

    if (kelime.some(reklam => newMessage.content.toLowerCase().includes(reklam)) && ![newMessage.guild.vanityURLCode].some(reklam => newMessage.content.toLocaleLowerCase().includes(reklam))) {
        if (!reklamLimit[oldMessage.author.id]) reklamLimit[oldMessage.author.id] = 0;
        if (reklamLimit[oldMessage.author.id] && reklamLimit[oldMessage.author.id] >= allah.Guard.Limit.ReklamKick) {
            reklamLimit[oldMessage.author.id] = 0;
            newMessage.member.ban({
                reason: "Reklam Guard"
            });
            return;
        };
        reklamLimit[oldMessage.author.id]++;
        setTimeout(() => {
            reklamLimit[oldMessage.author.id]--
        }, 1000 * 60 * 5);
        if (newMessage.deletable) newMessage.delete().catch(err => {});
    } else {
        let links = newMessage.content.match(/(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}?\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi);
        if (!links) return;
        if (!reklamLimit[oldMessage.author.id]) reklamLimit[oldMessage.author.id] = 0;
        if (reklamLimit[oldMessage.author.id] && reklamLimit[oldMessage.author.id] >= allah.Guard.Limit.ReklamKick) {
            reklamLimit[oldMessage.author.id] = 0;
            newMessage.member.ban({
                reason: "Reklam Guard"
            });
            return;
        };
        reklamLimit[oldMessage.author.id]++;
        setTimeout(() => {
            reklamLimit[oldMessage.author.id]--
        }, 1000 * 60 * 5);
        if (newMessage.deletable) newMessage.delete().catch(err => {});
    }
});

//#end chat guard

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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

        if (allah.owners.some(uye => uye == member?member.id:false) || res.Full.some(uye => uye == member?member.id:false  || member ? member.roles.cache.has(uye) : false) || Bots.some(guard => guard.user.id == member?member.id:false ) || OtherGuard.user.id == member?member.id:false ) {
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

