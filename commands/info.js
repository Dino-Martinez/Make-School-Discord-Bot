module.exports = {
  name: 'info',
  description: 'Sends a list of server information.',
  execute (message, args) {
    const { guild, channel } = message
    if (guild.available) {
      const name = guild.name
      const memberCount = guild.memberCount
      const owner = guild.owner.nickname
      const info = `Info for ${name}: \nOwned by: ${owner} \nMember Count: ${memberCount}`
      channel.send(info)
    } else {
      throw 'The guild is not available'
    }
  }
}
