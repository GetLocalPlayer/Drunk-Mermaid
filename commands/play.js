const { useMainPlayer, QueryType, GuildQueueEvent } = require("discord-player");


module.exports = {
	name: "play",
	description: "will be used as the info for 'help' command",

	callback: async (message, url) => {
		const voiceChannel = message.member.voice.channel
		if (!(voiceChannel)) {
			await message.reply("> You are not connected to a voice channel")
			return
		}

		if (!url) {
			message.reply("> You must provide a valid link")
			return
		}

		const player = useMainPlayer()

		try {
			await player.play(voiceChannel, url, {
				searchEngine: QueryType.AUTO,
				nodeOptions: {
					metadata: {
						message: message,
					},
				},
			})
		}
		catch (err) {
			if (err.name == "ERR_NO_RESULT") {
				await message.reply("> No track found")
				return
			}
			return console.log(err)
		}
	},
}


const player = useMainPlayer()

player.events.on(GuildQueueEvent.playerStart, async (queue, track) => {
	if (!queue.metadata) return
	if (!queue.metadata.message) return

	const channel = queue.metadata.message.channel
	await channel.send(`> :arrow_forward:  _${track.title}_
		> **Author:** _${track.author}_
		> **Duration:** _${track.duration}_
		_ _`)
})

player.events.on(GuildQueueEvent.audioTrackAdd, async (queue, track) => {
	if (!queue.metadata) return
	if (!queue.metadata.message) return

	if (queue.tracks.size === 1) return
	const channel = queue.metadata.message.channel
	await channel.send(`> :clock1:  **Added in the queue:** ${track.title}.
	_ _`)
})

player.events.on(GuildQueueEvent.audioTracksAdd, async (queue, tracks) => {
	if (!queue.metadata) return
	if (!queue.metadata.message) return

	const channel = queue.metadata.message.channel
	await channel.send(`> :clock1:  **${tracks.length}** tracks have been added in the queue.
	_ _`)
})