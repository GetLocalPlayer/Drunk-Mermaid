const { Client, Events, GatewayIntentBits } = require("discord.js")
const { Player } = require("discord-player")

require("dotenv").config()

const COMMAND_PREFIX = "dm!"

// Create a new client instance
const client = new Client({
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


client.commands = require("./commands")

client.on(Events.MessageCreate, async (message) => {
	if (message.author.id === client.user.id) return

	const cmdPrefix = COMMAND_PREFIX.toLowerCase()

	if (message.content.slice(0, cmdPrefix.length).toLowerCase() === cmdPrefix) {
		const list = message.content.split(" ").filter((v) => v !== "")
		const cmd = list[1].toLowerCase()

		if (cmd === "") {
			await message.reply("> Empty command")
		}
		else if (cmd == undefined) {
			await message.reply(`> "${message.content.slice(0, cmdPrefix.length)}" must be followed by a command`)
		}
		else if (!(cmd in client.commands)) {
			await message.reply(`> No "${list[1]}" command found`)
		}
		else {
			try {
				await client.commands[cmd](message, ...list.slice(2))
			}
			catch (err) {
				console.log(err)
			}
		}
	}
})

// Log in to Discord with your client"s token
client.login(process.env.DISCORD_TOKEN)