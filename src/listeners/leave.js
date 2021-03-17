module.exports = props => {
  const { students, client } = props
  client.on('guildMemberDelete', async member => {
    // Delete existing student
    const student = await students.get(member.id)
    const deleted = await students.delete(member.id)

    // When a user leaves, DM them
    member.createDM().then(channel => {
      channel.send(
        'You have left students.'
      )
    })
  })
}
