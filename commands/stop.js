const { usePlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js")


const embedPattern = {
	"type": "rich",
	"color": 0xff0000,
}


module.exports = {
	name: "stop",
	description: "I'll stop playing",

	run: async (message) => {
		const voiceChannel = message.member.voice.channel
		const embed = EmbedBuilder.from(embedPattern)
		if (!(voiceChannel)) {
			embed.setTitle(":x:  You are not joined to any voice channel.")
				.setColor(0xff0000)
			await message.reply({ "embeds": [embed] })
			return
		}

		const queuePlayer = usePlayer(message.guildId)

		if (!queuePlayer || (!queuePlayer.queue.currentTrack && !queuePlayer.queue.getSize())) {
			embed.setTitle(":x:  Nothing is currently playing")
				.setColor(0xff0000)
			await message.reply({ "embeds": [embed] })
			return
		}

		queuePlayer.stop(true)
		embed.setTitle(":x:  Stop playing")
		await message.channel.send({ "embeds": [embed] })
	},
}

