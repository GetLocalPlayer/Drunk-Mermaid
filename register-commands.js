const { REST, Routes } = require("discord.js");
require("dotenv").config()

/*
	Standalone module to register slash-commands on dirscord
	side. Copy-pasted from:
	 https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands
*/

const { builders } = require("./commands")


const commands = []

for (const b of builders) {
	commands.push(b.toJSON())
}


// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// and deploy your commands!
async function register(globally) {
	try {
		console.log(`Started refreshing ${builders.length} application (/) commands.`)

		const appCommands = globally ?
			Routes.applicationCommands(process.env.APPLIACTION_ID)
			: Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.TEST_GUILD_ID)
		const data = await rest.put(appCommands,
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`)
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error)
	}
}


"-globally" in process.argv ? register(true) : register()