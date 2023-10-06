const { usePlayer } = require("discord-player");
const { buildEmbed, checkVoiceChannel, reportPlayerStart } = require("./play")
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


async function run(message, omitSkipReport, omitPlayReport) {
	if (!await checkVoiceChannel(message)) return
	if (!await checkQueuePlayer(message)) return

	const queuePlayer = usePlayer(message.guildId)

	if (queuePlayer.skip()) {
		if (!omitSkipReport) {
			await message.channel.send({ "embeds": [buildEmbed(embedPatterns.skip)] })
		}
		if (queuePlayer.queue.currentTrack && !omitPlayReport) {
			await reportPlayerStart(message.channel, queuePlayer.queue.currentTrack)
		}
	}
}

