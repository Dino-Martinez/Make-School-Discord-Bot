# Features

## Existing Features:

Here's what we've already done.

### Core Structures

- ✅Dynamic command grabber to make adding new commands easy
- ✅Dynamic listener grabber to make adding new listeners easy
- ✅Discord embed wrapper to make pretty messages easier to build
- ✅Dynamic logging functionality to allow important events to be tracked
- ✅Simple message sanitizing/parsing, with very basic profanity filter
- ✅Dynamic cooldown handling for commands
- ✅Deleted message tracking for informational purposes
- ✅KeyV wrapper for a SQLite Database (will be mongo or something in the future)

### Commands

- ✅Dynamic help command to allow users to learn how the bot works
- ✅Simple info command to receive information about the server
- ✅Project idea command that queries [this for that](http://itsthisforthat.com/api.php)
- ✅Simple FAQ command to be populated with real FAQs later
- ✅Credits command that lets everyone know who worked on this project
- ✅Configuration command to allow staff members to configure the bot dynamically
- ✅Messages command to see the messages that a user has deleted
- 🚧Email command to allow a user to link their email with the bot
- ✅Helper commands to simulate some discord events (user join, user leave)
- ✅Moderation commands (ban, kick, mute) to be used by staff members

### Event Listeners

- ✅Message delete listener to track the deleted message with the user who deleted it
- ✅User join listener to begin tracking them in our database and send them a greeting
- ✅User leave listener to untrack them from our database (to help keep space complexity down)
- ✅Client ready listener to log when the bot has successfully logged in
- ✅Message send listener to sanitize the message and execute it if it's a command

## Future Features:

If you want to add a cool feature but can't think of anything, pick something off this list!

### High Priority

- All purpose information:
  - !code-help command that takes a code question/topic and either returns an answer or a link to some smart google search or maybe DMs a list of resources
- Miscellaneous functionality:
  - Configure Keyv to track existing users, rather than only tracking new users

### Low Priority

- All purpose information:
  - Refactor FAQ command to take a query and return the most relevant answer
- Fun stuff:
  - Text game commands like tic tac toe, rock paper scissors, hangman, etc.
  - !space-facts command that returns a random space fact (maybe pulled from an API)
  - Channel points per user, added whenever the user sends a message (with cooldown to avoid incentivizing spam). Maybe a bonus for images/links, or for receiving certain reactions
- Utilities:
  - !remindme command that allows users to be DM'd the contents of a message they specify at a later time
  - Mod Mail feature - if the bot recieves a dm with !mail, send the contents to a special #mod-mail channel in the server and @ staff roles
  - Dynamic utilities handler to make adding non-command functionality easy
