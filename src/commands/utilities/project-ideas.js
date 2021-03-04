const { EmbedWrapper } = require('../../EmbedWrapper.js')
const fetch = require('node-fetch')

module.exports = {
  name: 'projects',
  aliases: ['ideas', 'project-ideas', 'project', 'idea'],
  description: 'Queries an API to generate a project idea.',
  usage: '',
  minArgs: 0,
  cooldown: 2,
  dmCommand: true,
  guildCommand: true,
  async execute (props) {
    // Destructure the things we need out of props
    const { message, args, client, prefix } = props
    const { guild, channel } = message

    // Check that the command is in a dm or the guild is available for processing
    if (!guild || guild.available) {
      // Build response string based on number of args
      const response = new EmbedWrapper('Here is a cool project idea!')

      // Query thisforthat API
      const res = await fetch('http://itsthisforthat.com/api.php?json')
      const project = await res.json()
      const text = `Create ${project.this} for ${project.that}!`

      response.addField('Project', text)

      // Send formatted response to user
      channel.send(response)
    } else {
      throw new Error('The guild is not available')
    }
  }
}
