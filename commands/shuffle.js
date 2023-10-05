const { usePlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js")
const { embedPatterns: skipEmbedPatterns } = require("./skip")
const { embedPatterns: playEmbedPatterns } = require("./play")


const pattern = {
	"color": 0x00ffe6,
	"type": "rich",
}


module.exports = {
	name: "shuffle",
	description: "I'll shuffle the tracks in the current playlist",

	run: async (message) => {
		const voiceChannel = message.member.voice.channel

		if (!(voiceChannel)) {
			await message.reply({ "embeds": [EmbedBuilder.from(playEmbedPatterns.errorNoVoice)] })
			return
		}

		const queuePlayer = usePlayer(message.guildId)

		if (!queuePlayer || !queuePlayer.queue.currentTrack) {
			await message.reply({ "embeds": [EmbedBuilder.from(skipEmbedPatterns.errorNothingIsPlaying)] })
			return
		}

		if (queuePlayer.queue.getSize() > 1) {
			queuePlayer.queue.tracks.shuffle()
			const embed = EmbedBuilder.from(pattern)
				.setTitle(":twisted_rightwards_arrows:  Tracks in the queue have been shuffled.")
			await message.channel.send({ "embeds": [embed] })
		}
	},
}

