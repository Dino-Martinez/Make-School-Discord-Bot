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
