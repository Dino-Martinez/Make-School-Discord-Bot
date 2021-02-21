const fs = require('fs')

module.exports = {
  name: 'help',
  description: 'Sends a list of commands with information.',
  execute (message, args) {
    const { channel } = message
    let commandList = 'Here is a list of my commands:'
    const commandFiles = fs
      .readdirSync('./commands')
      .filter(file => file.endsWith('.js'))
    for (const file of commandFiles) {
      const command = require(`../commands/${file}`)
      commandList += `\n${command.name} - ${command.description}`
    }

    channel.send(commandList)
  }
}
