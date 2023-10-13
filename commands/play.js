const { useMainPlayer, QueryType, GuildQueueEvent } = require("discord-player");
const { EmbedBuilder, SlashCommandBuilder } = require ("discord.js");


module.exports = {
	builder: new SlashCommandBuilder()
		.setName("play")
		.setDescription("I'll start playing the track I find by the given link or request")
		.addStringOption(option =>
			option
				.setName("track")
				.setDescription("Link or title of the track")
				.setRequired(true))
		.addBooleanOption(option =>
			option
				.setName("shuffle")
				.setDescription("Shuffle the tracks before additing them in the queue")),
	run: run,
	checkVoiceChannel: checkVoiceChannel,
	buildEmbed: buildEmbed,
}


const embedPatterns = {
	errorNoVoice: {
		color: 0xff0000,
		type: "rich",
		title: ":no_entry_sign:  You are not joined to any voice channel.",
	},
	errorInvalidRequest: {
		color: 0xff0000,
		type: "rich",
		title: ":no_entry_sign:  You must provide a valid URL or request",
	},
	errorNoTrackFound: {
		color: 0xff0000,
		type: "rich",
		title: ":no_entry_sign:  No track found.",
	},
	play: {
		color: 0x00ffe6,
		type: "rich",
		title: ":musical_note:  Start playing:",
	},
}


function buildEmbed(pattern) {
	return EmbedBuilder.from(pattern)
}


async function checkVoiceChannel(interaction) {
	const voiceChannel = interaction.member.voice.channel
	if (!(voiceChannel)) {
		await interaction.reply({ "embeds": [buildEmbed(embedPatterns.errorNoVoice)], "ephemeral": true })
		return false
	}
	return true
}


async function run(interaction, silentPlayEvent, silentQueueEvent) {
	if (!await checkVoiceChannel(interaction)) return

	try {
		let searchResult = await useMainPlayer().search(
			interaction.options.get("track").value,
			{
				"searchEngine": QueryType.AUTO,
				"blockExtractors": QueryType.FILE,
			})

		const shuffleOption = interaction.options.get("shuffle")
		if (searchResult.length > 1 && shuffleOption && shuffleOption.value) {
			const tracks = searchResult.tracks
			for (let i = tracks.length - 1; i >= 0; i--) {
				const j = Math.floor(Math.random() * (i + 1))
				const tmp = tracks[i]
				tracks[i] = tracks[j]
				tracks[j] = tmp
			}
			searchResult = searchResult.setTracks(tracks)
		}

		return await useMainPlayer().play(
			interaction.member.voice.channel,
			searchResult,
			{
				"searchEngine": QueryType.AUTO,
				"nodeOptions": {
					"metadata": {
						"channel": interaction.channel,
						"silentPlayEvent": typeof silentPlayEvent === "boolean" ? silentPlayEvent : false,
						"silentQueueEvent": typeof silentQueueEvent === "boolean" ? silentQueueEvent : false,
					},
				},
			})
	}
	catch (err) {
		if (err.name == "ERR_NO_RESULT") {
			await interaction.reply({ "embeds": [buildEmbed(embedPatterns.errorNoTrackFound)], "ephemeral": true })
			return [undefined, undefined, undefined, undefined]
		}
		throw err
	}
}


useMainPlayer().events.on(GuildQueueEvent.playerStart, async (queue, track) => {
	if (!queue.metadata || !queue.metadata.channel || queue.metadata.silentPlayEvent) return

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


useMainPlayer().events.on(GuildQueueEvent.audioTrackAdd, async (queue, track) => {
	if (!queue.metadata || !queue.metadata.channel || queue.metadata.silentQueueEvent) return
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


useMainPlayer().events.on(GuildQueueEvent.audioTracksAdd, async (queue, tracks) => {
	if (!queue.metadata || !queue.metadata.channel || queue.metadata.silentQueueEvent) return

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