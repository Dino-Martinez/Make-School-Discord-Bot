# Discord Bot for the official Make School discord server

## Set up:

Before setting up, make sure you have [node](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/get-npm) installed.

Before working on this project, consider checking out this [tutorial on using discord.js](https://discordjs.guide/) - for the time being, this tutorial is only useful until 'Commands with user inputs.' We will move further with the project at a later date. At that point, more of the tutorial will be useful so feel free to read ahead!

1. Clone this repository onto your local machine using git CLI: `git clone git@github.com:Dino-Martinez/Make-School-Discord-Bot.git`
2. CD into the project root directory `/Make-School-Bot`
3. Install dependencies/style guides using `npm ci`
4. Create a file named `.env` at the root directory, and add the line `BOT_TOKEN=<TOKEN GOES HERE>` replacing the right hand side with your bot token.
5. Make sure you switch to the dev branch before making any changes `git checkout dev`
6. <strong> Before pushing to github, make sure you enforce styling: </strong>
   - Run `npm run lint <file_path>` to receive styling suggestions.
   - Run `npm run fix <file_path>` to automatically fix incorrect styling. Note: this will not always fix everything, you may have to fix certain things manually.

## The basics:

### Creating commands -

In order to create a new command, simply add it into a folder within `src/commands`.
For example, if you want to make a command that sends users cat pictures, create the file `/commands/fun/cats.js`. A command file should be structured as follows (see existing commands for reference):

```
module.exports = {
  name: '<name of command>',
  description: '<description of command>',
  usage: '<usage information to be displayed by !help>',
  minArgs: <minimum number of arguments for the command to work>,
  cooldown: <cooldown time in seconds>,
  execute (props) {
    // Your code goes here
  }
}
```

This will define your command code as a module that index.js can understand, so your bot will be able to utilize it with little effort on your part. The `props` parameter is an object which you can destructure at your discretion. It contains the `message` sent, the `args` provided, the `client` running our bot, and the `prefix` that our bot uses to distinguish commands from normal messages. For more information on object destructuring, check out [these docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#object_destructuring).

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
    inline:true,
  },
  ...
)

```

Then, to send the embed, just use `message.channel.send(response)`

## Further Documentation:

Check out [discord.js](https://discord.js.org/#/docs/main/stable/general/welcome) for more information on everything available through the Discord API.

Check out [node.js](https://nodejs.org/en/docs/) for more information on the Node runtime and environments.

Check out the [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript) for more information on JavaScript as a whole.
