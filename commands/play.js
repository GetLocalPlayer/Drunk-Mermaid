const { useMainPlayer, QueryType, GuildQueueEvent } = require("discord-player");
const { EmbedBuilder } = require ("discord.js")


const patterns = {
	errorNoVoice: {
		"color": 0xff0000,
		"type": "rich",
		"title": ":x:  You are not joined to any voice channel.",
	},
	errorInvalidRequest: {
		"color": 0xff0000,
		"type": "rich",
		"title": ":x:  You must provide a valid URL or request",
	},
	errorNoTrackFound: {
		"color": 0xff0000,
		"type": "rich",
		"title": ":x:  No track found.",
	},
	play: {
		"color": 0x00ffe6,
		"type": "rich",
	},
}


module.exports = {
	name: "play",
	description: "will be used as the info for 'help' command",
	embedPatterns: patterns,

	run: async (message, url) => {
		const voiceChannel = message.member.voice.channel
		if (!(voiceChannel)) {
			await message.reply({ "embeds": [EmbedBuilder.from(patterns.errorNoVoice)] })
			return
		}

		if (!url) {
			await message.reply({ "embeds": [EmbedBuilder.from(patterns.errorInvalidRequest)] })
			return
		}

		const player = useMainPlayer()

		try {
			await player.play(voiceChannel, url, {
				searchEngine: QueryType.AUTO,
				blockExtractors: QueryType.FILE,
				nodeOptions: {
					metadata: {
						message: message,
					},
				},
			})
		}
		catch (err) {
			if (err.name == "ERR_NO_RESULT") {
				await message.reply({ "embeds": [EmbedBuilder.from(patterns.errorNoTrackFound)] })
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
	const embed = EmbedBuilder.from(patterns.play)
		.setTitle(":musical_note:  Start playing")
		.addFields([
			{
				"name": " ",
				"value": track.title,
				"inline": false,
			},
			{
				"name": "Duration:",
				"value": track.duration,
				"inline": false,
			},
		])
		.setThumbnail(track.thumbnail)
	await channel.send({ "embeds": [embed] })
})

player.events.on(GuildQueueEvent.audioTrackAdd, async (queue, track) => {
	if (!queue.metadata) return
	if (!queue.metadata.message) return
	if (!queue.currentTrack) return

	const channel = queue.metadata.message.channel
	const embed = EmbedBuilder.from(patterns.play)
		.setTitle(":notes:  Added in the queue")
		.addFields([
			{
				"name": " ",
				"value": track.title,
				"inline": false,
			},
			{
				"name": "Tracks in total:",
				"value": `${queue.getSize() + 1}`,
				"inline": true,
			},
			{
				"name": "Total duration:",
				"value": queue.durationFormatted,
				"inline": true,
			},
		])
	await channel.send({ "embeds": [embed] })
})

player.events.on(GuildQueueEvent.audioTracksAdd, async (queue, tracks) => {
	if (!queue.metadata) return
	if (!queue.metadata.message) return

	const channel = queue.metadata.message.channel
	const embed = EmbedBuilder.from(patterns.play)
		.setTitle(`:notes:  ${tracks.length} tracks have been added in the queue`)
		.addFields([
			{
				"name": "Tracks in total:",
				"value": `${queue.getSize() + (queue.currentTrack ? 1 : 0)}`,
				"inline": true,
			},
			{
				"name": "Total duration:",
				"value": queue.durationFormatted,
				"inline": true,
			},
		])
	await channel.send({ "embeds": [embed] })
})