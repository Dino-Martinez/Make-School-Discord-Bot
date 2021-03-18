const Discord = require('discord.js')
const { embedColor } = require('../config/bot-config.json')

class EmbedWrapper extends Discord.MessageEmbed {
  constructor (title) {
    super()
      .setColor(embedColor)
      .setTimestamp()
      .setTitle(title)
  }
}

module.exports = {
  EmbedWrapper
}
