const { useMainPlayer, QueryType, usePlayer } = require("discord-player");
const path = require("node:path")

const SOUND_PATH = path.join(require.main.path, "/resources/test_sound.mp3")


module.exports = {
	name: "test",
	description: "I will connect to the voice channel you're currently in to play the test sound",

	callback: async (message) => {
		const channel = message.member.voice.channel
		if (!(channel)) {
			await message.reply("You must join a voice channel first!")
			return
		}

		if (!usePlayer()) {
			await useMainPlayer().play(channel, SOUND_PATH, {
				searchEngine: QueryType.FILE,
			})
		}
	},
}