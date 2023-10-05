const { usePlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js")
const { embedPatterns: playEmbedPatterns } = require("./play")


const patterns = {
	errorNothingIsPlaying: {
		"color": 0xff0000,
		"type": "rich",
		"title": ":x:  Nothings is currently playing",
	},
	skip: {
		"color": 0x00ffe6,
		"type": "rich",
		"title": ":track_next:  Skip current track",
	},
}


module.exports = {
	name: "skip",
	description: "I'll skip currently playing track",
	embedPatterns: patterns,

	run: async (message) => {
		const voiceChannel = message.member.voice.channel

		if (!(voiceChannel)) {
			await message.reply({ "embeds": [EmbedBuilder.from(playEmbedPatterns.errorNoVoice)] })
			return
		}

		const queuePlayer = usePlayer(message.guildId)

		if (!queuePlayer || !queuePlayer.queue.currentTrack) {
			await message.reply({ "embeds": [EmbedBuilder.from(patterns.errorNothingIsPlaying)] })
			return
		}

		if (queuePlayer.skip()) {
			await message.channel.send({ "embeds": [EmbedBuilder.from(patterns.skip)] })
		}
	},
}

