const Discord = require('discord.js')
const fs = require('fs')
const path = require('path')

const getCommand = (args, commands, prefix) => {
  const commandName = args.shift().toLowerCase()
  const command =
    commands.get(commandName) ||
    commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
  return command
}

module.exports = {
  process: (message, commands, prefix) => {
    const args = message
      .slice(prefix.length)
      .trim()
      .split(/ +/)
    const command = getCommand(args, commands, prefix)

    return { args, command }
  },
  getCommands: () => {
    const commands = new Discord.Collection()
    const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'))
    commandFolders.forEach(folder => {
      const commandFiles = fs
        .readdirSync(path.join(__dirname, 'commands', folder))
        .filter(file => file.endsWith('.js'))

      // Populate our commands list with the modules in our commands folder
      commandFiles.forEach(file => {
        const command = require(path.join(__dirname, 'commands', folder, file))
        commands.set(command.name, command)
      })
    })
    return commands
  },
  startListeners: props => {
    const listenerFiles = fs
      .readdirSync(path.join(__dirname, 'listeners'))
      .filter(file => file.endsWith('.js'))

    // Populate our listeners list with the modules in our listeners folder
    listenerFiles.forEach(file => {
      const listener = require(path.join(__dirname, 'listeners', file))
      listener(props)
    })
  },
  checkCoolDown: (timestamps, command, author) => {
    const now = Date.now()
    const cooldownAmount = (command.cooldown || 3) * 1000
    if (timestamps.has(author)) {
      const expirationTime = timestamps.get(author) + cooldownAmount

      if (now < expirationTime) {
        const timeLeft = ((expirationTime - now) / 1000).toFixed(1)
        return timeLeft
      }
    }

    timestamps.set(author, now)
    setTimeout(() => timestamps.delete(author), cooldownAmount)
    return 0
  },
  filterProfanity: (message, prefix) => {
    // If profanity exists, delete message, log info, and DM user
    const badList = ['fuck', 'bitch']
    message.content.split(' ').forEach(word => {
      if (badList.includes(word)) {
        message.author.send('You said a bad word')
        if (message.guild) {
          message.delete()
        }
      }
    })
  }
}
