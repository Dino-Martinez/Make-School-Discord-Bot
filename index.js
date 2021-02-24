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

// Handler to track deleted messages
client.on('messageDelete', message => {
  // Check for existing member
  let member = client.members.get(message.author.id)

  // If member doesn't exist yet, create them and begin tracking message history
  if (!member) {
    member = { username: message.author.username }
    member.messageHistory = []
  }

  // Add current message to user's history
  let deletedAt = new Date().toUTCString()
  deletedAt = deletedAt.slice(0, deletedAt.length - 13)
  let sentAt = message.createdAt.toUTCString()
  sentAt = sentAt.slice(0, sentAt.length - 13)
  member.messageHistory.push({
    id: message.id,
    content: message.content,
    sentAt,
    deletedAt
  })
  client.members.set(message.author.id, member)

  console.log(member.messageHistory)
})
