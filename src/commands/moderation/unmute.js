module.exports = {
  name: 'unmute',
  aliases: [],
  description: 'Unmutes a specified user.',
  usage: '<@User>',
  minArgs: 1,
  cooldown: 2,
  dmCommand: false,
  guildCommand: true,
  async execute (props) {
    // Destructure the things we need out of props
    const { message } = props
    const { guild, channel } = message

    // Check that the guild is available for processing
    if (guild.available) {
      const member = message.mentions.members.first()
      if (member === undefined) {
        return channel.send('You must supply a user!')
      }
      const roles = await guild.roles.fetch()
      const mutedRole = roles.cache.find(role => role.name === 'Muted')
      if (member.roles.cache.find(role => role.name === 'Muted')) {
        member.roles.remove(mutedRole)
        channel.send('User has been unmuted')
      } else {
        channel.send('User is not muted!')
      }
    } else {
      throw new Error('The guild is not available')
    }
  }
}
