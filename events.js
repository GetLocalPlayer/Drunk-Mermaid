const { useMainPlayer, GuildQueueEvent } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const { queueEventSkip, queueEventSkipTo } = require("./commands/skip")


const player = useMainPlayer()

const embedPatterns = {
	play: {
		color: 0x00ffe6,
		type: "rich",
		title: ":musical_note:  Start playing:",
	},
	skip: {
		"color": 0x00ffe6,
		"type": "rich",
		"title": ":track_next:  Skip current track.",
	},
	skipTo: {
		"color": 0x00ffe6,
		"type": "rich",
	},
}


player.events.on(GuildQueueEvent.error, (queue, error) => {
	console.log(`General player error event: ${error.message}`)
	console.log(error)
})


player.events.on(GuildQueueEvent.playerError, (queue, error) => {
	console.log(`Player error event: ${error.message}`);
	console.log(error);
})


player.events.on(GuildQueueEvent.playerStart, async (queue, track) => {
	if (!queue.metadata || !queue.metadata.channel) return

	const embed = EmbedBuilder.from(embedPatterns.play)
		.addFields([
			{
				name: " ",
				value: track.title,
				inline: false,
			},
			{
				name: " ",
				value: `**Duration:** ${track.duration}`,
				inline: false,
			},
		])
	await queue.metadata.channel.send({ embeds: [embed] })
})


player.events.on(GuildQueueEvent.audioTrackAdd, async (queue, track) => {
	if (!queue.metadata || !queue.metadata.channel)	return
	if (!queue.currentTrack) return

	const embed = EmbedBuilder.from(embedPatterns.play)
		.setTitle(":notes:  Track have been added in the queue:")
		.addFields([
			{
				name: " ",
				value: track.title,
				inline: false,
			},
			{
				name: " ",
				value: `**Duration:**  ${track.duration}`,
				inline: false,
			},
			{
				name: "Tracks in the queue:",
				value: `${queue.getSize()}`,
				inline: true,
			},
			{
				name: "Queue duration:",
				value: `${queue.durationFormatted}`,
				inline: true,
			},
		])
	await queue.metadata.channel.send({ embeds: [embed] })
})


player.events.on(GuildQueueEvent.audioTracksAdd, async (queue, tracks) => {
	if (!queue.metadata || !queue.metadata.channel)	return

	const embed = EmbedBuilder.from(embedPatterns.play)
		.setTitle(`:notes:  ${queue.getSize() >= tracks.length ? tracks.length : tracks.length - 1} tracks have been added in the queue`)
		.addFields([
			{
				name: "Tracks in the queue:",
				value: ` ${queue.getSize()}`,
				inline: true,
			},
			{
				name: "Queue total duration:",
				value: `${queue.durationFormatted}`,
				inline: true,
			},
		])
	await queue.metadata.channel.send({ embeds: [embed] })
})


player.events.on(queueEventSkip, async (queue) => {
	if (!queue.metadata || !queue.metadata.channel)	return
	await queue.metadata.channel.send({ embeds: [EmbedBuilder.from(embedPatterns.skip)] })
})


player.events.on(queueEventSkipTo, async (queue, tracks, position) => {
	if (!queue.metadata || !queue.metadata.channel)	return
	await queue.metadata.channel.send({ embeds: [
		EmbedBuilder.from(embedPatterns.skip)
			.setTitle(`:track_next:  Skip current and ${position - 1} tracks in the queue.`),
	] })
})