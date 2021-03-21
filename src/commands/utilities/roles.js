const { logChannelId } = require('../../../config/bot-config.json')

module.exports = {
  name: 'roles',
  aliases: ['update'],
  description:
    'Mocks an instance of google calendar authorization, as though we have a calendar object, and auto assigns roles respectively',
  usage: '',
  minArgs: 0,
  cooldown: 3,
  dmCommand: true,
  guildCommand: false,
  async execute (props) {
    // Destructure the things we need out of props
    const { message, client } = props
    const { author } = message
    const guild = await client.guilds.fetch('663769843186663444')
    const member = await guild.members.fetch(author.id)

    // Create mock calendar -- this will be replaced by a google calendar api call later
    const calendar = {
      courses: ['BEW1.2', 'BEW1.3', 'SPD1.3', 'PM1000']
    }

    let roles = await guild.roles.fetch()
    roles = roles.cache.filter(role => calendar.courses.includes(role.name))

    // Edit users roles according to the calendar
    roles.forEach(role => {
      member.roles.add(role)
    })
  }
}
