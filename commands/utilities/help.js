const fs = require('fs')
const { EmbedWrapper } = require('../../helpers/EmbedWrapper.js')

module.exports = {
  name: 'help',
  description: 'Sends information on available commands.',
  usage: '[command | optional]',
  minArgs: 0,
  cooldown: 2,
  execute (props) {
    // Destructure the things we need out of props
    const { message, args, client, prefix } = props
    const { guild, channel } = message

    // Check that the guild is available for processing
    if (guild.available) {
      // Build response string based on number of args
      const response = new EmbedWrapper(
        args.length < 1
          ? 'Here is a list of my commands:'
          : 'Here is information on the commands you requested:'
      )

      if (args.length > 0) {
        // We have args, which means a specific list of commands was requested
        args.forEach(requestedCommand => {
          const command = client.commands.get(requestedCommand)
          if (command) {
            response.addField(
              `\n- ${command.name}:`,
              `Description: ${command.description}\n  Usage: \`${prefix}${command.name} ${command.usage}\`\n`
            )
          }
        })
      } else {
        // We have no args, which means no specific commands were requested
        // Return list of all commands
        client.commands.forEach(command => {
          response.addField(`- ${command.name}:`, ` ${command.description}`)
        })
      }

      // Send formatted response to user
      channel.send(response)
    } else {
      throw 'The guild is not available'
    }
  }
}
