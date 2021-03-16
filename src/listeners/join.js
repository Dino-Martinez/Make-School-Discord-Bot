module.exports = props => {
  const { client, students } = props
  client.on('guildMemberAdd', async member => {
    // Begin tracking new student
    const student = { username: member.username, email: 'None' }
    student.messageHistory = []
    await students.set(member.id, student)

    // When a user joins, request their MS id number and apply the student role
    member.createDM().then(channel => {
      channel.send(
        'Please provide your Make School ID and email address. Type `!help email` for instructions!'
      )
    })
  })
}
