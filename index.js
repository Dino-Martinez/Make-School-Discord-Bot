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
const commandFiles = fs
  .readdirSync('./commands')
  .filter(file => file.endsWith('.js'))

// Populate our commands list with the modules in our commands folder
commandFiles.forEach(file => {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
})

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
  const command = args.shift().toLowerCase()

  // Dynamically execute command, if it exists in our command folder.
  try {
    client.commands.get(command).execute({ message, args, client })
  } catch (error) {
    console.error(error)
    message.reply('There was an error trying to execute that command!')
  }
})
