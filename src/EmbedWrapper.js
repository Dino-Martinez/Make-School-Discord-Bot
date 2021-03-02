const Discord = require('discord.js')

class EmbedWrapper extends Discord.MessageEmbed {
  constructor (title) {
    super()
      .setColor('#ffbad2')
      .setTimestamp()
      .setTitle(title)
  }
}

module.exports = {
  EmbedWrapper
}
