const { usePlayer } = require("discord-player");
const { checkVoiceChannel } = require("./play")
const { checkQueuePlayer } = require("./stop")


module.exports = {
	name: "skip",
	description: "I'll skip currently playing track",
	run: run,
	queueEventSkip: "audioTrackSkip",
}


async function run(message) {
	if (!await checkVoiceChannel(message)) return
	if (!await checkQueuePlayer(message)) return

	const queuePlayer = usePlayer(message.guildId)

	if (queuePlayer.skip()) {
		/*
			Looks like default `playerSkip` event isn't what it
			seems to be. API says:
				* Emitted when the audio player skips current track
			SO do the docs, but comment section in "Additing Events" says:
				// Emitted when the audio player fails to load the stream for a song
			Anyway, doesn't seem like `.skip()` emmits the event.
		*/
		queuePlayer.queue.emit(module.exports.queueEventSkip, queuePlayer.queue, queuePlayer.queue.currentTrack)
	}
}

