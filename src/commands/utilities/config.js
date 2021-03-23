const { readFileSync, writeFileSync } = require('fs')
const path = require('path')
const { EmbedWrapper } = require('../../EmbedWrapper.js')

module.exports = {
  name: 'config',
  aliases: ['setup', 'cfg'],
  description: 'Edit bot config.',
  usage: '<key> <value>',
  minArgs: 0,
  cooldown: 2,
  dmCommand: true,
  guildCommand: true,
  execute (props) {
    // Destructure the things we need out of props
    const { message, args } = props
    const { guild, channel } = message
    const filePath = path.resolve(__dirname, '../../../config/bot-config.json')
    const rawData = readFileSync(filePath)
    const botConfig = JSON.parse(rawData)
    const response = new EmbedWrapper('Here is my current configuration:')

    const addConfigToResponse = () => {
      Object.keys(botConfig).forEach(key => {
        if (Array.isArray(botConfig[key]) && botConfig[key].length === 0) {
          response.addField(key, '[]')
        } else {
          response.addField(key, botConfig[key])
        }
      })
    }

    if (!guild || guild.available) {
      // If no arguments, send existing information
      if (args.length === 0) {
        addConfigToResponse()
      } else if (args.length === 1) {
        // User is passing 1 argument
        if (Object.prototype.hasOwnProperty.call(botConfig, args[0])) {
          response.addField(args[0], botConfig[args[0]])
        } else {
          return channel.send(`The key \`${args[0]}\` does not exist!`)
        }
      } else if (args.length === 2) {
        if (args[0] === 'clear' && Array.isArray(botConfig[args[1]])) {
          botConfig[args[1]] = []
          addConfigToResponse()
          writeFileSync(
            filePath,
            `${JSON.stringify(botConfig, undefined, 2)}\n`
          )
        } else if (Object.prototype.hasOwnProperty.call(botConfig, args[0])) {
          if (typeof botConfig[args[0]] === 'string') {
            botConfig[args[0]] = args[1]
          } else {
            botConfig[args[0]] = [args[1]]
          }
          Object.keys(botConfig).forEach(key => {
            response.addField(key, botConfig[key])
          })
          writeFileSync(
            filePath,
            `${JSON.stringify(botConfig, undefined, 2)}\n`
          )
        } else {
          return channel.send(`The key \`${args[0]}\` does not exist!`)
        }
      } else {
        if (Object.prototype.hasOwnProperty.call(botConfig, args[0])) {
          if (Array.isArray(botConfig[args[0]])) {
            botConfig[args[0]] = args.slice(1)
            addConfigToResponse()
            writeFileSync(
              filePath,
              `${JSON.stringify(botConfig, undefined, 2)}\n`
            )
          } else {
            return channel.send('You are sending too many arguments.')
          }
        }
      }
      return channel.send(response)
    } else {
      throw new Error('The guild is not available')
    }
  }
}
