const { usePlayer } = require("discord-player");


module.exports = {
	name: "skip",
	description: "I'll skip currently playing track",

	callback: async (message) => {
		const voiceChannel = message.member.voice.channel
		if (!(voiceChannel)) {
			await message.reply("> You are not connected to a voice channel")
			return
		}

		const queuePlayer = usePlayer(message.guildId)

		if (!queuePlayer) {
			await message.reply("> Nothing is currently playing.")
			return
		}

		if (queuePlayer.skip()) {
			message.channel.send(`> :track_next: **Skip:** _${queuePlayer.queue.currentTrack.title}_`)
		}
		else {
			await message.reply("> No track to skip.")
		}
	},
}

