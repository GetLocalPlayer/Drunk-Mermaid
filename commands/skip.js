const { usePlayer, useMainPlayer } = require("discord-player");
const { checkVoiceChannel, buildEmbed } = require("./play")
const { checkQueuePlayer } = require("./stop");
const { SlashCommandBuilder } = require("discord.js");


module.exports = {
	builder: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("I'll skip the currently playing track or all tracks to the spcified position")
		.addIntegerOption(option =>
			option
				.setName("position")
				.setDescription("The position of the track in the queue to which you want to skip")),
	run: run,
}


const events = {
	skip: "audioTrackSkip",
	skipTo: "audioTrackSkipTo",
}


const embedPatterns = {
	errorInvalidPosition: {
		color: 0xff0000,
		type: "rich",
		title: ":no_entry_sign:  Invalid track queue position.",
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


async function run(interaction) {
	if (!await checkVoiceChannel(interaction)) return
	if (!await checkQueuePlayer(interaction)) return

	const queuePlayer = usePlayer(interaction.guildId)
	const option = interaction.options.get("position")

	if (!option) {
		if (queuePlayer.skip()) {
			/*
				Looks like default `playerSkip` event isn't what it
				seems to be. API says:
					* Emitted when the audio player skips current track
				SO do the docs, but comment section in "Additing Events" says:
					// Emitted when the audio player fails to load the stream for a song
				Anyway, doesn't seem like `.skip()` emmits the event.
			*/
			queuePlayer.queue.emit(events.skip, queuePlayer.queue, queuePlayer.queue.currentTrack)
		}
	}
	else {
		const position = option.value
		const queue = queuePlayer.queue

		if (position > 0 && position <= queue.getSize()) {
			if (queuePlayer.skipTo(queue.tracks.at(position - 1))) {
				queuePlayer.queue.emit(events.skipTo, queue, queue.currentTrack, position)
			}
		}
		else {
			interaction.reply({ "embeds": [buildEmbed(embedPatterns.errorInvalidPosition)], "ephemeral": true })
		}
	}
}


useMainPlayer().events.on(events.skip, async (queue) => {
	if (!queue.metadata || !queue.metadata.channel)	return
	await queue.metadata.channel.send({ embeds: [buildEmbed(embedPatterns.skip)] })
})


useMainPlayer().events.on(events.skipTo, async (queue, tracks, position) => {
	if (!queue.metadata || !queue.metadata.channel)	return
	await queue.metadata.channel.send({ embeds: [
		buildEmbed(embedPatterns.skip)
			.setTitle(`:track_next:  Skip current and ${position - 1} tracks in the queue.`),
	] })
})