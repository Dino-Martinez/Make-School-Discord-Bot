# Documentation

This page will attempt to teach you how to easily add new features, commands, listeners, etc.

## The Beginning:

Before attempting to implement any new features, please take a brief look at [the discord.js docs](https://discord.js.org/#/docs/main/stable/general/welcome). These will give you a good idea of what the Discord API covers, and what is or is not possible within the framework.

### Functionality that isn't a command

If you want to add functionality that isn't just a command (like !help), you have a few options:

- Add it into index.js if it uses a different [Discord Client Event](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelCreate)
- Add it into Processor.js or Logger.js if it directly processes message content or if it extends the logging functionality
- If neither, then create a new js file under src/. Then, require that file into index.js and use it as necessary.

### Creating commands

In order to create a new command, simply add it into a folder within `src/commands`.
For example, if you want to make a command that sends users cat pictures, create the file `/commands/fun/cats.js`. A command file should be structured as follows (see existing commands for reference):

```
module.exports = {
  // Flags
  name: '<name of command>',
  description: '<description of command>',
  usage: '<usage information to be displayed by !help>',
  minArgs: <minimum number of arguments for the command to work>,
  cooldown: <cooldown time in seconds>,
  dmCommand: <true if this command can be used in dms, false otherwise>,
  guildCommand: <true if this command can be used in servers, false otherwise>,
  // Command functionality
  execute (props) {
    // Your code goes here
  }
}
```

This will define your command code as a module that index.js can understand, so your bot will be able to utilize it with little effort on your part. The `props` parameter is an object that includes all necessary information for commands, which you can [destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#object_destructuring) at your discretion. It contains:

- the `message` sent
- the `args` provided
- the `client` running our bot
- the `prefix` that our bot uses to distinguish commands from normal messages
- the `students` database (setup using [KeyV](https://github.com/lukechilds/keyv))

<strong>Note:</strong> If you need to add a prop, you can do so in the `message.js` listener, but this is only recommended if you have a very good grasp on how the project works.

### Adding listeners

If there is a Discord Client event, or custom event, that needs a new listener, you can create one in the `listeners` folder. Set your listener file up as such:

```
module.exports = props => {
  const { client } = props
  client.on('<EVENT_NAME>', () => {
    // Your code goes here
  })
}
```

### Sending messages from the bot

In order have our bot send messages, all we have to do is use the `message` prop we just mentioned. If you want to just send a normal message in the same channel that our command was issued, use `message.channel.send('Your response')`. If you want to reply directly to the user (@ them in the channel the command was issued), use `message.reply('Your response')`. If you want to DM the person who issued the command, use `message.author.send('Your response')`.

### Using rich embeds

In order to have our bot send a rich embed message, we can use the `helpers/EmbedWrapper.js` class. Simply add `const { EmbedWrapper } = require('../../EmbedWrapper.js')` to the top of your command file, and then build an embed with `const response = new EmbedWrapper('Embed Title')`. Next, add fields to the embed with `response.addField('name of field', 'value for field', inline)` where `inline` is a boolean representing if the field is meant to display in-line. To add multiple fields at once, we can call

```
response.addFields(
  {
    name:'name',
    value:'value',
    inline:true},
  },
  {
    name:'name2',
    value:'value2',
    inline:false,
  },
  ...
)

```

Then, to send the embed, just use `message.channel.send(response)`
