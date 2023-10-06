const { usePlayer } = require("discord-player");
const { buildEmbed, checkVoiceChannel } = require("./play")
const { checkQueuePlayer } = require("./stop")


module.exports = {
	name: "skip",
	description: "I'll skip currently playing track",
	run: run,
}

const embedPatterns = {
	skip: {
		"color": 0x00ffe6,
		"type": "rich",
		"title": ":track_next:  Skip current track",
	},
}


async function run(message) {
	if (!checkVoiceChannel(message)) return
	if (!checkQueuePlayer(message)) return

	if (usePlayer(message.guildId).skip()) {
		await message.channel.send({ "embeds": [buildEmbed(embedPatterns.skip)] })
	}
}

