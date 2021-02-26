const { EmbedWrapper } = require('./EmbedWrapper.js')
const { logChannelId } = require('../config/bot-config.json')
module.exports = {
  log: (reason, client, content) => {
    const response = new EmbedWrapper(reason)
    response.addField('Content:', content)
    const channel = client.channels.cache.get(logChannelId)

    channel.send(response)
  }
}
