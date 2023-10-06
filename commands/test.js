const { useMainPlayer, QueryType, usePlayer } = require("discord-player");
const path = require("node:path")

const SOUND_PATH = path.join(require.main.path, "/resources/test_sound.mp3")

/*
	Playing test sound.
	Works only if nothing is playing
*/
module.exports = {
	name: "test",

	run: async (message) => {
		const channel = message.member.voice.channel
		if (!(channel)) {
			return
		}

		const queuePlayer = usePlayer()

		if (!queuePlayer || (!queuePlayer.queue.currentTrack && !queuePlayer.queue.getSize())) {
			await useMainPlayer().play(channel, SOUND_PATH, {
				searchEngine: QueryType.FILE,
			})
		}
	},
}
