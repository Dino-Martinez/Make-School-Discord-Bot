/* Top-level handler code for our discord bot. The MVP for this project is
 * extensible command functionality, with a few simple all-access commands.
 */

// Require necessary packages
const dotenv = require('dotenv')
const Discord = require('discord.js')

// Discord client setup/login
const client = new Discord.Client()

dotenv.config()

// Log message so we know the bot is ready for use
client.once('ready', () => {
  console.log('Ready!')
})

client.login(process.env.BOT_TOKEN)

// Simple test to check that bot is working
// Any message sent in the server will be logged
client.on('message', message => {
  console.log(message.content)

  // Simple ping command - this will be modularized in the future
  if (message.content === '!ping') {
    // send back "Pong." to the channel the message was sent in
    message.channel.send('Pong.')
  }

  if (message.content === '!help') {
    message.channel.send('This command is not yet configured!')
  }
})
