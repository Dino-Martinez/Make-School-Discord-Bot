/* Top-level handler code for our discord bot. The MVP for this project is
 * extensible command functionality, with a few simple all-access commands.
 */

// Require necessary packages
const dotenv = require('dotenv')
const Discord = require('discord.js')
const { prefix } = require('./config/bot-config.json')
const Processor = require('./src/Processor.js')
const Logger = require('./src/Logger.js')

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
  // Set bot presence
  client.user.setPresence({
    activity: {
      name: 'your problems :)',
      type: 'LISTENING',
      details: 'Type !help for a list of my commands and features!'
    },
    status: 'idle'
  })
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

    if (!message.guild && !command.dmCommand) {
      message.channel.send('You must be in a server to use this command.')
    } else if (message.guild && !command.guildCommand) {
      message.author.send(
        `Use the command here instead! You sent: \`${message.content}\``
      )
      message.delete()
    } else if (args.length >= command.minArgs) {
      const result = command.execute({ message, args, client, prefix })
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

// Handler to track deleted messages
client.on('messageDelete', message => {
  console.log('Deleted message')
  // Check for existing member
  let member = client.members.get(message.author.id)
  const { id, content, author } = message

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
    id,
    content,
    sentAt,
    deletedAt
  })
  client.members.set(author.id, member)
  const reason = 'Message Deleted'

  Logger.log({ reason, client, message })
})

const filter = response =>
  response.content.toLowerCase().match(/\d{7}/g) ||
  response.content
    .toLowerCase()
    .match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g)

client.on('guildMemberAdd', member => {
  // When a user joins, request their MS id number and apply the student role
  member.createDM().then(channel => {
    channel.send(
      'Please provide your Make School ID and email address. Type `!help email` for instructions!'
    )
  })
})
