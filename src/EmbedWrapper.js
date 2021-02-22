const Discord = require('discord.js')

class EmbedWrapper extends Discord.MessageEmbed {
  constructor (title) {
    super()
      .setColor('#ffbad2')
      .setAuthor('Rich Embeds', 'https://i.imgur.com/wSTFkRM.png')
      .setFooter('Courtesy of custom bot')
      .setTimestamp()
      .setTitle(title)
  }
}

module.exports = {
  EmbedWrapper
}
