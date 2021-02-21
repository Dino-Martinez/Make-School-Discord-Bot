module.exports = {
  name: 'info',
  description: 'Sends a list of server information.',
  execute (props) {
    // Destructure the things we need out of props
    const { message } = props
    const { guild, channel } = message

    // Check that the guild is available for processing
    if (guild.available) {
      // Build server info string from our guild object
      const name = guild.name
      const memberCount = guild.memberCount
      const owner = guild.owner.nickname
      const response = `Info for ${name}: \nOwned by: ${owner} \nMember Count: ${memberCount}`

      // Send formatted string back to user
      channel.send(response)
    } else {
      throw 'The guild is not available'
    }
  }
}
