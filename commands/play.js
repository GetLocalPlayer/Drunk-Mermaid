const { useMainPlayer, QueryType } = require("discord-player");
const { EmbedBuilder } = require ("discord.js");


module.exports = {
	name: "play",
	description: "will be used as the info for 'help' command",
	run: run,
	checkVoiceChannel: checkVoiceChannel,
	buildEmbed: buildEmbed,
	reportPlayerStart: reportPlayerStart,
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


async function checkVoiceChannel(message) {
	const voiceChannel = message.member.voice.channel
	if (!(voiceChannel)) {
		await message.reply({ "embeds": [buildEmbed(embedPatterns.errorNoVoice)] })
		return false
	}
	return true
}


async function reportAddedTracks(channel, queue, tracks) {
	const embed = buildEmbed(embedPatterns.play)
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
	await channel.send({ "embeds": [embed] })
}


async function reportAddedTrack(channel, queue, track) {
	const embed = buildEmbed(embedPatterns.play)
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
	await channel.send({ "embeds": [embed] })
}


async function reportPlayerStart(channel, track) {
	const embed = buildEmbed(embedPatterns.play)
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
	await channel.send({ "embeds": [embed] })
}


async function run(message, url, omitReport) {
	if (!await checkVoiceChannel(message)) return

	if (!url) {
		await message.reply({ "embeds": [buildEmbed(embedPatterns.errorInvalidRequest)] })
		return
	}

	const voiceChannel = message.member.voice.channel
	const player = useMainPlayer()

	try {
		const { queue, track, searchResult, extractor } = await player.play(voiceChannel, url, {
			searchEngine: QueryType.AUTO,
			blockExtractors: QueryType.FILE,
		})
		if (!omitReport) {
			if (queue.currentTrack === track) {
				await reportPlayerStart(message.channel, track)
			}
			if (queue.getSize()) {
				if (searchResult.tracks.length > 1) {
					await reportAddedTracks(message.channel, queue, searchResult.tracks)
				}
				else {
					await reportAddedTrack(message.channel, queue, track)
				}
			}
		}
		return [queue, track, searchResult, extractor]
	}
	catch (err) {
		if (err.name == "ERR_NO_RESULT") {
			await message.reply({ "embeds": [buildEmbed(embedPatterns.errorNoTrackFound)] })
			return
		}
		throw err
	}
}
