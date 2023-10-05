const { usePlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js")


const embedPattern = {
	"type": "rich",
	"color": 0x00ffe6,
}


module.exports = {
	name: "shuffle",
	description: "I'll shuffle the tracks in the current playlist",

	callback: async (message) => {
		const voiceChannel = message.member.voice.channel
		const embed = EmbedBuilder.from(embedPattern)
		if (!(voiceChannel)) {
			embed.setTitle(":x:  You are not joined to any voice channel.")
				.setColor(0xff0000)
			await message.reply({ "embeds": [embed] })
			return
		}

		const queuePlayer = usePlayer(message.guildId)

		if (!queuePlayer) {
			embed.setTitle(":x:  Nothing is currently playing")
				.setColor(0xff0000)
			await message.reply({ "embeds": [embed] })
			return
		}

		if (queuePlayer.queue.getSize() > 1) {
			queuePlayer.queue.tracks.shuffle()
			embed.setTitle(":twisted_rightwards_arrows:  Tracks in the queue have been shuffled.")
			await message.channel.send({ "embeds": [embed] })
		}
	},
}

