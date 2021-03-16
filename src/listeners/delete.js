module.exports = props => {
  const { client, students, Logger } = props
  // Handler to track deleted messages
  client.on('messageDelete', async message => {
    console.log('Deleted message')
    // Check for existing member
    const student = await students.get(message.author.id)
    const { id, content, author } = message

    // Add current message to user's history
    let deletedAt = new Date().toUTCString()
    deletedAt = deletedAt.slice(0, deletedAt.length - 13)
    let sentAt = message.createdAt.toUTCString()
    sentAt = sentAt.slice(0, sentAt.length - 13)

    student.messageHistory.push({
      id,
      content,
      sentAt,
      deletedAt
    })
    await students.set(author.id, student)
    const reason = 'Message Deleted'

    Logger.log({ reason, client, message })
  })
}
