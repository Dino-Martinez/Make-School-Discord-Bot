const { EmbedWrapper } = require("../EmbedWrapper.js")

module.exports = props => {
  const { client, students } = props
  client.on('guildMemberAdd', async member => {
    // Begin tracking new student
    const student = { username: member.username, email: 'None' }
    student.messageHistory = []
    await students.set(member.id, student)


    const response = new EmbedWrapper('Click the link below to connect your Make School Email:')
    response.addField('Google Auth Link:', `http://localhost:3000/start/?discordID=${member.id}`)

    // When a user joins, request their MS id number and apply the student role
    member.createDM().then(channel => {
      channel.send(response)
    })
  })
}
