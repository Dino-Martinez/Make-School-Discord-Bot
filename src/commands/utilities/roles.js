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
    const { message, client, students } = props
    const { author } = message
    const guild = await client.guilds.fetch('663769843186663444')
    const member = await guild.members.fetch(author.id)
    const student = await students.get(author.id)
    const courses = student.courses

    // Acquire all roles within the guild
    let roles = await guild.roles.fetch()
    roles = roles.cache.filter(role => courses.includes(role.name))

    // Edit users roles according to the calendar
    roles.forEach(role => {
      member.roles.add(role)
    })
  }
}
