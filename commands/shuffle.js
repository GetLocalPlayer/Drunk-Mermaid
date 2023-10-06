const { usePlayer } = require("discord-player");
const { checkVoiceChannel, buildEmbed } = require("./play")
const { checkQueuePlayer } = require("./stop")


module.exports = {
	name: "shuffle",
	description: "I'll shuffle the tracks the queue",
	run: run,
}

const embedPatterns = {
	shuffle: {
		"color": 0x3b88c3,
		"type": "rich",
		"title": ":twisted_rightwards_arrows:  Tracks in the queue have been shuffled.",
	},
	nothingToShuffle: {
		"color": 0x3b88c3,
		"type": "rich",
		"title": ":zero:  There are no tracks in the queue to shuffle.",
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
	else {
		await message.channel.send({ "embeds": [buildEmbed(embedPatterns.nothingToShuffle)] })
	}
}

