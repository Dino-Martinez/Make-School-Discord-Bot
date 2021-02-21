const fs = require('fs')

module.exports = {
  name: 'help',
  description: 'Sends a list of commands with information.',
  execute (props) {
    // Destructure the things we need out of props
    const { message, args, client } = props
    const { guild, channel } = message

    // Check that the guild is available for processing
    if (guild.available) {
      // Build response string based on number of args
      let response =
        args.length < 1
          ? 'Here is a list of my commands:'
          : 'Here is information on the commands you requested:'

      if (args.length > 0) {
        // We have args, which means a specific list of commands was requested
        args.forEach(requestedCommand => {
          const command = client.commands.get(requestedCommand)
          if (command) {
            response += `\nName: ${command.name}\n  Description: ${command.description}\n  Usage: ${command.usage}\n`
          }
        })
      } else {
        // We have no args, which means no specific commands were requested
        // Return list of all commands
        client.commands.forEach(command => {
          response += `\n${command.name} - ${command.description}`
        })
      }

      // Send formatted response to user
      channel.send(response)
    } else {
      throw 'The guild is not available'
    }
  }
}
