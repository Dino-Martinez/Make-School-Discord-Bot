const fetch = require('node-fetch')
const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  name: 'apod',
  aliases: ['space-picture', 'astronomy'],
  description: 'Returns the astronomy picture of the day',
  usage: '',
  minArgs: 0,
  cooldown: 3,
  dmCommand: false,
  guildCommand: true,
  async execute (props) {
    // Destructure the things we need out of props
    const { message } = props
    const { channel } = message

    const res = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_TOKEN}`
    )
    const json = await res.json()
    console.log(json)
    const imageUrl = json.hdurl
    const { title } = json

    // Simulate the author joining the server
    return channel.send(`${title}\n${imageUrl}`)
  }
}
