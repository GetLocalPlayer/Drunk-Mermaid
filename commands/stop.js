const { usePlayer } = require("discord-player");
const { buildEmbed, checkVoiceChannel } = require("./play");


module.exports = {
	name: "stop",
	description: "I'll stop playing",
	run: run,
	checkQueuePlayer: checkQueuePlayer,
}

const embedPatterns = {
	errorNothingIsPlaying: {
		"color": 0xff0000,
		"type": "rich",
		"title": ":no_entry_sign:  Nothings is currently playing",
	},
	stop: {
		color: 0x3b88c3,
		type: "rich",
		title: ":stop_button:  Stop playing",
	},
}


async function checkQueuePlayer(message) {
	const queuePlayer = usePlayer(message.guildId)
	if (!queuePlayer || !queuePlayer.queue.currentTrack) {
		await message.reply({ "embeds": [buildEmbed(embedPatterns.errorNothingIsPlaying)] })
		return false
	}
	return true
}


async function run(message) {
	if (!await checkVoiceChannel(message)) return
	if (!await checkQueuePlayer(message)) return

	const queuePlayer = usePlayer(message.guildId)

	if (!queuePlayer || !queuePlayer.queue.currentTrack) {
		await message.reply({ "embeds": [buildEmbed(embedPatterns.errorNothingIsPlaying)] })
		return
	}

	queuePlayer.stop(true)
	await message.channel.send({ "embeds": [buildEmbed(embedPatterns.stop)] })
}
