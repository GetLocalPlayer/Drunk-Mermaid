const { usePlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js")


const embedPattern = {
	"type": "rich",
	"color": 0x00ffe6,
}


module.exports = {
	name: "skip",
	description: "I'll skip currently playing track",

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

		if (queuePlayer.skip()) {
			embed.setTitle(":track_next:  Skip current track")
			await message.reply({ "embeds": [embed] })
		}
		else {
			embed.setTitle(":x:  There's no track to skip")
				.setColor(0xff0000)
			await message.reply({ "embeds": [embed] })
		}
	},
}

