module.exports = {
  name: 'ban',
  aliases: [],
  description: 'Bans a specified user.',
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
        return channel.send("You must supply a user!")
      }
      if (member.bannable) {
        member.ban()
        return channel.send(`User ${member.displayName} was banned.`)
      } else {
        return channel.send(`Cannot ban ${member.displayName}.`)
      }
    } else {
      throw new Error('The guild is not available')
    }
  }
}
