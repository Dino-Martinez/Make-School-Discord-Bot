module.exports = props => {
  const { client } = props
  // Log message so we know the bot is ready for use
  client.once('ready', () => {
    console.log('Ready!')

    // Set bot presence
    client.user.setPresence({
      activity: {
        name: 'your problems :)',
        type: 'LISTENING',
        details: 'Type !help for a list of my commands and features!'
      },
      status: 'idle'
    })
  })
}
