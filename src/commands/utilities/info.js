const { EmbedWrapper } = require('../../EmbedWrapper.js')

module.exports = {
  name: 'info',
  aliases: ['server', 'information'],
  description: 'Sends a list of server information.',
  usage: '',
  minArgs: 0,
  cooldown: 2,
  dmCommand: false,
  guildCommand: true,
  async execute (props) {
    // Destructure the things we need out of props
    const { message } = props
    const { guild, channel } = message

    // Check that the guild is available for processing
    if (guild.available) {
      // Build server info string from our guild object
      const name = guild.name
      const memberCount = guild.memberCount
      const owner = await guild.members.fetch(guild.ownerID)
      const ownerName = owner.user.username
      const response = new EmbedWrapper(`Here is information about ${name}`)

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
