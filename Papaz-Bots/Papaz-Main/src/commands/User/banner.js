const Discord = require('discord.js');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const axios = require('axios');
const fetch = require('node-fetch')
const client = global.bot;

module.exports = {
    conf: {
        aliases: ["banner"],
        name: "banner",
        help: "banner",
        category: "kullanıcı"
    },

    run: async (client, message, args, embed, prefix) => {


        const üye = args.length > 0 ? message.mentions.users.first() || await client.users.fetch(args[0]) || message.author : message.author
        async function bannerXd(user, client) {
            const response = await axios.get(`https://discord.com/api/v9/users/${user}`, { headers: { 'Authorization': `Bot ${client.token}` } });
            if (!response.data.banner) return `https://media.discordapp.net/attachments/938786568175513660/972982817359274024/Banner_bulunmamakta.png`
            if (response.data.banner.startsWith('a_')) return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.gif?size=512`
            else return (`https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.png?size=512`)
        }
        let banner = await bannerXd(üye.id, client)
        let msg = await message.channel.send({ content: `${banner}` })
    },
};