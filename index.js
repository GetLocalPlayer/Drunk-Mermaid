const { Client, Events, GatewayIntentBits } = require("discord.js")
const { Player } = require("discord-player")

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


require("./events")

const { commands } = require("./commands")


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

// Log in to Discord with your client"s token
client.login(process.env.DISCORD_TOKEN)