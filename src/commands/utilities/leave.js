module.exports = {
  name: 'leave',
  aliases: [],
  description:
    'Emits a guildMemberDelete event for the author of the message. This is a development-only command',
  usage: '',
  minArgs: 0,
  cooldown: 3,
  dmCommand: false,
  guildCommand: true,
  execute (props) {
    // Destructure the things we need out of props
    const { message, client } = props

    // Simulate the author joining the server
    return client.emit('guildMemberDelete', message.author)
  }
}
