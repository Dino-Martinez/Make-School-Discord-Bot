module.exports = {
  name: 'fixdb',
  aliases: [],
  description: 'Add all users to database',
  usage: '',
  minArgs: 0,
  cooldown: 2,
  dmCommand: false,
  guildCommand: true,
  async execute (props) {
    const { message, students } = props
    const { guild, channel } = message

    if (guild.available) {
      guild.members.fetch().then(members => {
        [...members.values()].forEach(async member => {
          const student = { username: await member.user.username, email: 'None' }
          student.messageHistory = []
          await students.set(member.id, student)
          console.log(student.username)
        })
      })

      return channel.send('Members added.')
    } else {
      throw new Error('The guild is not available')
    }
  }
}
