const fs = require('fs')
const { EmbedWrapper } = require('../../EmbedWrapper.js')

module.exports = {
  name: 'messages',
  description: 'Receive a list of message history for a given user.',
  usage: '<@User>',
  minArgs: 1,
  cooldown: 3,
  execute (props) {
    const { message, args, client } = props
    const { channel } = message
    const userRequest = args[0]
    const user = client.members.get(
      userRequest.slice(3, userRequest.length - 1)
    )
    const response = new EmbedWrapper(
      `Here are ${user.username}'s 5 most recent messages `
    )
    const splitPos =
      user.messageHistory.length < 5 ? 0 : user.messageHistory.length - 5
    user.messageHistory.slice(splitPos).forEach(trackedMessage => {
      const content =
        trackedMessage.content.length < 100
          ? trackedMessage.content
          : `${trackedMessage.content.slice(0, 100)} . . .`
      response.addField(trackedMessage.sentAt, content, false)
    })

    return channel.send(response)
  }
}
