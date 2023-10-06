const { EmbedBuilder } = require("discord.js")
const fs = require("node:fs")
const path = require("node:path")


module.exports = {
	name: "help",
	description: "I'll show you the list of available commands in direct messages",
	run: run,
}

const embedPattern = {
	color: 0x00ffe6,
	type: "rich",
	title: ":speech_balloon:  Hello there!",
	fields: [
		{
			name: " ",
			value: "To interract with me you need to send a message to a server chat I participate. The message must start with my initials and an exclamation mark: `dm!`, that is followed by any of the commands listed below.",
			inline: false,
		},
		{
			name: " ",
			value: "**Example:**  `dm! skip`",
			inline: false,
		},
		{
			name: " ",
			value: " ",
			inline: false,
		},
		{
			name: "Commands:",
			value: " ",
			inline: false,
		},
		{
			name: " ",
			value: " ",
			inline: false,
		},
	],
}


const commandFiles = fs.readdirSync(__dirname).filter(
	file => file.endsWith(".js") && file != "index.js" && file != path.basename(__filename))


for (const file of commandFiles) {
	const filePath = path.join(__dirname, file)
	const cmd = require(filePath)
	if ("name" in cmd && "description" in cmd) {
		embedPattern.fields.push({
			name: `${cmd.name}`,
			value: `_${cmd.description}_`,
			inline: false,
		})
	}
}

embedPattern.fields.push({
	name: `${module.exports.name}`,
	value: `_${module.exports.description}_`,
	inline: false,
})


async function run(message) {
	await message.author.send({ embeds: [EmbedBuilder.from(embedPattern)] })
}