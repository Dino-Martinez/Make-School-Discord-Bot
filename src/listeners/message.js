const { readFileSync } = require('fs')
const path = require('path')

module.exports = props => {
  // Grab dependencies from props
  const {
    client,
    students,
    Processor,
    Logger,
    Discord,
    prefix,
    cooldowns
  } = props
  client.on('message', message => {
    // If message is not a command or if author is a bot, then do nothing
    if (message.author.bot) return

    Processor.filterProfanity(message, prefix)

    if (!message.content.startsWith(prefix)) return

    // Separate the command from the arguments
    const { command, args } = Processor.process(
      message.content,
      client.commands,
      prefix
    )
    
    const configPath = path.resolve(__dirname, '../../config/bot-config.json')
    const rawConfig = readFileSync(configPath)
    const { blacklist } = JSON.parse(rawConfig)

    // Dynamically execute command, if it exists in our command folder
    try {
      if (!command) {
        return message.reply(
          `I could not find that command! For a list of commands, please type ${prefix}help`
        )
      }
      // Check command against current cooldowns
      if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection())
      }

      const timeLeft = Processor.checkCoolDown(
        cooldowns.get(command.name),
        command,
        message.author.id
      )

      if (timeLeft > 0.1) {
        return message.reply(
          `Please wait ${timeLeft} more seconds before using that command again.`
        )
      }

      // check if command is blacklisted
      if (blacklist.includes(command.name) && command.name != 'config') {
        message.channel.send('That command is blacklisted.')
      } else if (!message.guild && !command.dmCommand) {
        message.channel.send('You must be in a server to use this command.')
      } else if (message.guild && !command.guildCommand) {
        message.author.send(
          `Use the command here instead! You sent: \`${message.content}\``
        )
        message.delete()
      } else if (args.length >= command.minArgs) {
        const result = command.execute({
          message,
          args,
          client,
          prefix,
          students
        })
        Logger.log({ result, client, message })
      } else {
        message.channel.send(
          `You did not provide enough arguments!\nThe correct usage is \`${prefix}${command.name} ${command.usage}\``
        )
      }
    } catch (error) {
      console.error(error)
      message.reply('There was an error trying to execute that command!')
    }
  })
}
