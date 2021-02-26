const { EmbedWrapper } = require('./EmbedWrapper.js')
const { logChannelId } = require('../config/bot-config.json')
module.exports = {
  log: props => {
    const { message, client, reason } = props
    if (reason === 'Message Deleted') {
      const response = new EmbedWrapper(
        `${reason} by ${message.author.username}`
      )
      response.addField('Content:', message.content)
      const channel = client.channels.cache.get(logChannelId)

      channel.send(response)
    }
  }
}
