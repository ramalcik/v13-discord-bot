const client = global.bot;
const settings = require("../../../../config.json")
module.exports = async () => {

    client.guilds.cache.forEach(guild => {
        guild.invites.fetch()
        .then(invites => {
          const codeUses = new Map();
          invites.each(inv => codeUses.set(inv.code, inv.uses));
          client.invites.set(guild.id, codeUses);
      })
    })
    
    
    
      const { joinVoiceChannel } = require("@discordjs/voice");
    
    
        const VoiceChannel = client.channels.cache.get(settings.botSes);
        joinVoiceChannel({
            channelId: VoiceChannel.id,
            guildId: VoiceChannel.guild.id,
            adapterCreator: VoiceChannel.guild.voiceAdapterCreator,
            selfDeaf: true
        });
        setInterval(() => {
          const oynuyor = settings.botDurum;
          const index = Math.floor(Math.random() * (oynuyor.length));
          client.user.setActivity(`${oynuyor[index]}`, {
            type: "WATCHING",});
          }, 10000);
        }
          module.exports.conf = {
            name: "ready",
          };
          