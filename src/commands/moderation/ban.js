const { EmbedWrapper } = require('../../EmbedWrapper.js')

module.exports = {
  name: 'ban',
  aliases: [],
  description: 'Bans a specified user.',
  usage: '<@User>',
  minArgs: 0,
  cooldown: 2,
  dmCommand: false,
  guildCommand: true,
  execute (props) {
    // Destructure the things we need out of props
    const { message } = props
    const { guild, channel } = message

    // Check that the guild is available for processing
    if (guild.available) {

      // Add our fields
      response.addFields(
        {
          name: 'Owned by:',
          value: ownerName
        },
        {
          name: 'Member Count:',
          value: memberCount
        }
      )

      // Send formatted string back to user
      channel.send(response)
    } else {
      throw new Error('The guild is not available')
    }
  }
}
