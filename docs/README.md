# Discord Bot for the official Make School discord server

## What is it?

This project is a comprehensive discord bot for the official Discord Server of [Make School](https://www.makeschool.com/). We will be offering functionality including moderation, fun text games, useful tools for project workflows, as well as automating the student-teacher interactions within the classroom.

## Set up:

Before setting up, make sure you have [node](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/get-npm) installed.

Before working on this project, consider checking out this [tutorial on using discord.js](https://discordjs.guide/) - we use a lot of the methods and concepts presented here!

1. Clone or fork this repository onto your local machine using git CLI: `git clone git@github.com:Dino-Martinez/Make-School-Discord-Bot.git`
2. CD into the project root directory `/Make-School-Bot`
3. Install dependencies/style guides using `npm ci`
4. Create a file named `.env` at the root directory, and add the line `BOT_TOKEN=<TOKEN GOES HERE>` replacing the right hand side with your bot token. You can get a bot token using [this tutorial](https://www.writebots.com/discord-bot-token/)
5. Add your bot to a server [like this](https://discordjs.guide/preparations/adding-your-bot-to-servers.html)
6. To start your bot, run `npm start`

## Adding functionaliy

1. Make sure you switch to the dev branch before starting `git checkout dev`
2. Then, create your own new branch with a descriptive title using `git checkout -b <BRANCH_NAME>`
3. Next, make whatever changes or additions you want.
4. <strong> Before pushing to github, make sure you enforce styling: </strong>
   - Run `npm run lint <file_path>` to receive styling suggestions.
   - Run `npm run fix <file_path>` to automatically fix incorrect styling. Note: this will not always fix everything, you may have to fix certain things manually.
5. Once you've done all of this, it's time to make a [pull request](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request)

## Further Documentation:

Check out [discord.js](https://discord.js.org/#/docs/main/stable/general/welcome) for more information on everything available through the Discord API.

Check out [node.js](https://nodejs.org/en/docs/) for more information on the Node runtime and environments.

Check out the [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript) for more information on JavaScript as a whole.
