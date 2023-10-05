const { useMainPlayer, QueryType, usePlayer } = require("discord-player");
const path = require("node:path")

const SOUND_PATH = path.join(require.main.path, "/resources/test_sound.mp3")


module.exports = {
	name: "test",
	description: "I will connect to the voice channel you're currently in to play the test sound",

	run: async (message) => {
		const channel = message.member.voice.channel
		if (!(channel)) {
			return
		}

		const queuePlayer = usePlayer()

		if (!queuePlayer) {
			await useMainPlayer().play(channel, SOUND_PATH, {
				searchEngine: QueryType.FILE,
			})
		}
	},
}
