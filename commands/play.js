const { useMainPlayer, QueryType, GuildQueueEvent } = require("discord-player");
const { EmbedBuilder } = require ("discord.js")


const embedPattern = {
	"type": "rich",
	"color": 0x00ffe6,
}


module.exports = {
	name: "play",
	description: "will be used as the info for 'help' command",

	run: async (message, url) => {
		const voiceChannel = message.member.voice.channel
		if (!(voiceChannel)) {
			const embed = EmbedBuilder.from(embedPattern)
				.setTitle(":x:  You are not joined to any voice channel.")
				.setColor(0xff0000)
			await message.reply({ "embeds": [embed] })
			return
		}

		if (!url) {
			const embed = EmbedBuilder.from(embedPattern)
				.setTitle(":x:  No valid link or request provided.")
				.setColor(0xff0000)
			await message.reply({ "embeds": [embed] })
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
				const embed = EmbedBuilder.from(embedPattern)
					.setTitle(":x:  No track found.")
					.setColor(0xff0000)
				await message.reply({ "embeds": [embed] })
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
	const embed = EmbedBuilder.from(embedPattern)
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
	const embed = EmbedBuilder.from(embedPattern)
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
	const embed = EmbedBuilder.from(embedPattern)
		.setTitle(`:notes:  ${tracks.length} tracks have been added in the queue	`)
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