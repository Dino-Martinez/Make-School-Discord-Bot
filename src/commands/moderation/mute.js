module.exports = {
    name: 'mute',
    aliases: [],
    description: 'Mutes a specified user.',
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
        return channel.send("plz implement")
      } else {
        throw new Error('The guild is not available')
      }
    }
  }
  