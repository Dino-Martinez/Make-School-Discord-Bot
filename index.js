/* Top-level handler code for our discord bot. The MVP for this project is
 * extensible command functionality, with a few simple all-access commands.
 */

// Require necessary packages
const fs = require('fs')
const dotenv = require('dotenv')
const Discord = require('discord.js')
const { prefix } = require('./config/bot-config.json')

dotenv.config()

// Discord client setup/login
const client = new Discord.Client()

// Grab list of commands from our commands folder
client.commands = new Discord.Collection()
const commandFolders = fs.readdirSync('./commands')
commandFolders.forEach(folder => {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter(file => file.endsWith('.js'))

  // Populate our commands list with the modules in our commands folder
  commandFiles.forEach(file => {
    const command = require(`./commands/${folder}/${file}`)
    client.commands.set(command.name, command)
  })
})

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
  if (!message.content.startsWith(prefix) || message.author.bot) return

  // Separate the command from the arguments
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/)
  const commandName = args.shift().toLowerCase()
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      cmd => cmd.aliases && cmd.aliases.includes(commandName)
    )

  // Check command against current cooldowns
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection())
  }
  //
  const now = Date.now()
  const timestamps = cooldowns.get(command.name)
  const cooldownAmount = (command.cooldown || 3) * 1000

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount

    if (now < expirationTime) {
      const timeLeft = ((expirationTime - now) / 1000).toFixed(1)
      return message.reply(
        `Please wait ${timeLeft} more seconds before using that command again.`
      )
    }
  }

  timestamps.set(message.author.id, now)
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

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
