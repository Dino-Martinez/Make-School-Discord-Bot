/* Top-level handler code for our discord bot. The MVP for this project is
 * extensible command functionality, with a few simple all-access commands.
 */

const dotenv = require('dotenv')
const Discord = require('discord.js')
const { prefix } = require('./config/bot-config.json')
const Processor = require('./src/Processor.js')
const Logger = require('./src/Logger.js')
const Keyv = require('keyv')

// One of the following
const students = new Keyv('sqlite://students.db')
students.on('error', err => console.error('Keyv connection error:', err))

// Configure dotenv for token grabbing
dotenv.config()

// Discord client setup/login
const client = new Discord.Client()

// Create list of cooldowns to populate on the fly
const cooldowns = new Discord.Collection()

// Grab list of commands from our commands folder
client.commands = Processor.getCommands()

// Start all Discord event listeners and pass necessary dependencies
Processor.startListeners({
  client,
  students,
  Processor,
  Logger,
  Discord,
  prefix,
  cooldowns
})

client.login(process.env.BOT_TOKEN)
