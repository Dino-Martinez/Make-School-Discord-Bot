const { EmbedWrapper } = require('../../EmbedWrapper.js')
const questions = require('../../questions.json')

module.exports = {
  name: 'faq',
  aliases: ['questions'],
  description: 'Displays frequently asked questions',
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
      const response = new EmbedWrapper('Frequently Asked Questions:')
      questions.questions.forEach(
          q => {
            response.addField(`Q: ${q.question}`, `A: ${q.answer}`)
          })

      // Send formatted response to user
      channel.send(response)
	} else {
      throw new Error('The guild is not available')
	}
  }
}
