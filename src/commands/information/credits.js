const { EmbedWrapper } = require('../../EmbedWrapper.js')

module.exports = {
  name: 'credits',
  aliases: [],
  description: 'Displays the people that worked on this bot.',
  usage: '',
  minArgs: 0,
  cooldown: 2,
  dmCommand: true,
  guildCommand: true,
  execute (props) {
    // Destructure the things we need out of props
    const { message } = props
    const { guild, channel } = message

    // Check that the command is in a dm or the guild is available for processing
    if (!guild || guild.available) {
      // Build response string
      const response = new EmbedWrapper('Credits:')
      response.addField('Dino Martnez', 'Beast')
      response.addField('Tristan Thompson', 'Also Beast')
      response.addField('Chai Nunes', 'Monky')

      // Send formatted response to user
      channel.send(response)
    } else {
      throw new Error('The guild is not available')
    }
  }
}
