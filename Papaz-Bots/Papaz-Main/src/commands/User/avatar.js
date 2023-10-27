const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const conf = require("../../configs/sunucuayar.json")
const axios = require('axios');
const fetch = require('node-fetch')
const client = global.bot;

module.exports = {
    conf: {
      aliases: ["avatar","av"],
      name: "avatar",
      help: "avatar",
      category: "kullanıcı"
    },
  
run: async (client, message, args, embed, prefix) => {
	if (!message.guild) return;
let üye = args.length > 0 ? message.mentions.users.first() || await client.users.fetch(args[0]) || message.author : message.author

let msg = await message.channel.send({ content: `${üye.displayAvatarURL({ dynamic: true, size: 4096 })}`})

},
  };