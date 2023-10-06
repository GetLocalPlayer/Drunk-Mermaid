const { usePlayer } = require("discord-player");
const { checkVoiceChannel, buildEmbed } = require("./play")
const { checkQueuePlayer } = require("./stop")


module.exports = {
	name: "shuffle",
	description: "I'll shuffle the tracks in the current playlist",
	run: run,
}

const embedPatterns = {
	shuffle: {
		"color": 0x3b88c3,
		"type": "rich",
		"title": ":twisted_rightwards_arrows:  Tracks in the queue have been shuffled.",
	},
}

async function run(message) {
	if (!await checkVoiceChannel(message)) return
	if (!await checkQueuePlayer(message)) return

	const queuePlayer = usePlayer(message.guildId)

	if (queuePlayer.queue.getSize() > 1) {
		queuePlayer.queue.tracks.shuffle()
		await message.channel.send({ "embeds": [buildEmbed(embedPatterns.shuffle)] })
	}
}

