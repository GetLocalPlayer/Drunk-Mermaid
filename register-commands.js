const { REST, Routes } = require("discord.js");


module.exports = {
	registerCommands: register,
}


async function register(discordToken, builders, globally) {
	const rest = new REST().setToken(discordToken)

	const commandsJSON = []

	for (const b of builders) {
		commandsJSON.push(b.toJSON())
	}

	try {
		console.log(`Started refreshing ${builders.length} application (/) commands.`)

		const appCommands = globally ?
			Routes.applicationCommands(process.env.APPLIACTION_ID)
			: Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.TEST_GUILD_ID)
		const data = await rest.put(appCommands,
			{ body: commandsJSON },
		)

		console.log(`Successfully reloaded ${data.length} application (/) commands.`)
	}
	catch (error) {
		console.error(error)
	}
}
