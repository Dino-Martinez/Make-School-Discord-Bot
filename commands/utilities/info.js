const { EmbedWrapper } = require('../../helpers/EmbedWrapper.js')

module.exports = {
  name: 'info',
  aliases: ['server', 'information'],
  description: 'Sends a list of server information.',
  usage: '',
  minArgs: 0,
  cooldown: 2,
  execute (props) {
    // Destructure the things we need out of props
    const { message } = props
    const { guild, channel } = message

    // Check that the guild is available for processing
    if (guild.available) {
      // Build server info string from our guild object
      const name = guild.name
      const memberCount = guild.memberCount
      const owner = guild.owner.user.username
      const response = new EmbedWrapper(`Here is information about ${name}`)

      // Add our fields
      response.addFields(
        {
          name: 'Owned by:',
          value: owner
        },
        {
          name: 'Member Count:',
          value: memberCount
        }
      )

      // Send formatted string back to user
      channel.send(response)
    } else {
      throw 'The guild is not available'
    }
  }
}
