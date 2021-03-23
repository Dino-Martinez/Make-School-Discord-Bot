const { EmbedWrapper } = require('./EmbedWrapper.js')
const { logChannelId } = require('../config/bot-config.json')
module.exports = {
  log: props => {
    const { message, client, reason } = props
    const response = new EmbedWrapper(`${reason} by ${message.author.username}`)
    const channel = client.channels.cache.get(logChannelId)
    if (reason === 'Message Deleted') {
      response.addField('Content:', message.content)
    } else if (reason === 'Member Banned') {
      const bannedMember = message.mentions.members.first()
      response.addField('Banned Member:', bannedMember.displayName)
    } else if (reason === 'Member Muted') {
      const mutedMember = message.mentions.members.first()
      response.addField('Muted Member:', mutedMember.displayName)
    } else {
      // If none of the expected reasons were provided, don't log
      return
    }
    channel.send(response)
  }
}
