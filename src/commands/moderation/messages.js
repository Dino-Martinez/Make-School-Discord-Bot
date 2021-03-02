const { EmbedWrapper } = require('../../EmbedWrapper.js')

module.exports = {
  name: 'messages',
  aliases: ['deleted'],
  description: 'Receive a list of message history for a given user.',
  usage: '<@User> <Message id | optional>',
  minArgs: 1,
  cooldown: 3,
  dmCommand: false,
  guildCommand: true,
  execute(props) {
    // Destructure the things we need out of props
    const { message, args, client } = props
    const { guild, channel } = message

    // Check that the guild is available for processing
    if (guild.available) {
      // Grab requested user from args
      const userRequest = args[0]
      const user = client.members.get(
        userRequest.slice(3, userRequest.length - 1)
      )

      // Grab message id if it was requested
      const messageId = args[1] || 'None'

      // Build response embed based on requested user and optionally requested
      // message id
      const title =
        messageId !== 'None'
          ? 'Here is the message requested'
          : `Here are ${user.username}'s 5 most recent deleted messages `
      const response = new EmbedWrapper(title)

      // If id was requested, return that message if it exists. Otherwise, return
      // last 5 deleted messages

      if (messageId !== 'None') {
        user.messageHistory.forEach((trackedMessage) => {
          if (trackedMessage.id === messageId) {
            response.addField(
              `id = ${trackedMessage.id}:`,
              trackedMessage.content,
              true
            )
            response.addField('Created at:', trackedMessage.sentAt, true)
            response.addField('Deleted at', trackedMessage.deletedAt, true)
          }
        })
      } else {
        const splitPos =
          user.messageHistory.length < 5 ? 0 : user.messageHistory.length - 5
        user.messageHistory.slice(splitPos).forEach((trackedMessage) => {
          const content =
            trackedMessage.content.length < 100
              ? trackedMessage.content
              : `${trackedMessage.content.slice(0, 100)} . . .`
          response.addField(`id = ${trackedMessage.id}:`, content, true)
          response.addField('Created at:', trackedMessage.sentAt, true)
          response.addField('Deleted at', trackedMessage.deletedAt, true)
        })
      }

      return channel.send(response)
    }
  },
}
