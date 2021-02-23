/* Top-level handler code for our discord bot. The MVP for this project is
 * extensible command functionality, with a few simple all-access commands.
 */

// Require necessary packages
const fs = require('fs')
const dotenv = require('dotenv')
const Discord = require('discord.js')
const { prefix } = require('./config/bot-config.json')
const Processor = require('./src/Processor.js')

dotenv.config()

// Discord client setup/login
const client = new Discord.Client()

// Grab list of commands from our commands folder
client.commands = Processor.getCommands()

// Create list of users for tracking message history
client.members = new Discord.Collection()

// Create list of cooldowns to populate on the fly
const cooldowns = new Discord.Collection()

// Log message so we know the bot is ready for use
client.once('ready', () => {
  console.log('Ready!')
})

client.login(process.env.BOT_TOKEN)

// Listen for messages and handle accordingly
client.on('message', message => {
  let member = client.members.get(message.author.id)
  if (!member) {
    member = {}
    member.messageHistory = []
  }
  member.messageHistory.push(message.content)
  client.members.set(message.author.id, member)

  console.log(client.members)

  // If message is not a command or if author is a bot, then do nothing
  if (!message.content.startsWith(prefix) || message.author.bot) return

  if (message.content.startsWith('!member')) {
    const request = client.members.get(
      message.content.slice(11, message.content.length - 1)
    )
    return message.channel.send(request.messageHistory.join(', '))
  }

  // Separate the command from the arguments
  const { command, args } = Processor.process(
    message.content,
    client.commands,
    prefix
  )

  // Check command against current cooldowns
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection())
  }

  const timestamps = cooldowns.get(command.name)
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

  // Dynamically execute command, if it exists in our command folder
  try {
    if (args.length >= command.minArgs) {
      command.execute({ message, args, client, prefix })
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
