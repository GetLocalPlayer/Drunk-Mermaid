const { usePlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js")
const { embedPatterns: skipEmbedPatterns } = require("./skip")
const { embedPatterns: playEmbedPatterns } = require("./play")


const pattern = {
	"color": 0xff0000,
	"type": "rich",
	"title": ":x:  Stop playing",
}


module.exports = {
	name: "stop",
	description: "I'll stop playing",

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

		queuePlayer.stop(true)
		await message.channel.send({ "embeds": [EmbedBuilder.from(pattern)] })
	},
}

