const { usePlayer } = require("discord-player");


module.exports = {
	name: "shuffle",
	description: "I'll shuffle the tracks in the queue",

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

		if (queuePlayer.queue.getSize() > 1) {
			queuePlayer.queue.tracks.shuffle()
			await message.channel.send("> :twisted_rightwards_arrows:  The queue has been shufffled.")
		}
	},
}

