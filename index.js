const { Client, Events, GatewayIntentBits } = require("discord.js")
const { Player, GuildQueueEvent } = require("discord-player")


require("dotenv").config()


// Create a new client instance
const client = new Client({
	restRequestTimeout: 60000,
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
	],
})

const player = new Player(client)
player.extractors.loadDefault()


client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`)
})


player.events.on(GuildQueueEvent.error, (queue, error) => {
	console.log(`General player error event: ${error.message}`)
	console.log(error)
})


player.events.on(GuildQueueEvent.playerError, (queue, error) => {
	console.log(`Player error event: ${error.message}`);
	console.log(error);
})


/* player.events.on(GuildQueueEvent.debug, async (queue, message) => {
	console.log(`Player debug event: ${message}`);
}) */


const { commands, builders } = require("./commands")


client.on(Events.InteractionCreate, async (interraction) => {
	if (!interraction.isChatInputCommand()) return

	const cmd = commands[interraction.commandName]

	if (!cmd) {
		console.error(`No command found: "${interraction.commandName}"`)
		return
	}

	try {
		await cmd(interraction)
	}
	catch (err) {
		console.log(err)
	}
})


if (process.argv.includes("-registerCommands")) {
	const { registerCommands } = require("./register-commands")
	;(async () => {
		await registerCommands(process.env.DISCORD_TOKEN, builders, process.argv.includes("--globally"))
	})()
}


client.login(process.env.DISCORD_TOKEN)
