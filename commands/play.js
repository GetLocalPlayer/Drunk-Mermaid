const { useMainPlayer, QueryType } = require("discord-player");
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


async function run(interaction, silent) {
	if (!await checkVoiceChannel(interaction)) return

	const option = interaction.options.get("track")
	if (!option) {
		await interaction.reply({ "embeds": [buildEmbed(embedPatterns.errorInvalidRequest)], "ephemeral": true })
		return
	}

	const voiceChannel = interaction.member.voice.channel
	const player = useMainPlayer()

	try {
		const metadata = { "channel": interaction.channel }
		const { queue, track, searchResult, extractor } = await player.play(voiceChannel, option.value, {
			searchEngine: QueryType.AUTO,
			blockExtractors: QueryType.FILE,
			nodeOptions: {
				metadata: silent ? { "channel": null } : metadata,
			},
		})
		queue.metadata = metadata
		return [queue, track, searchResult, extractor]
	}
	catch (err) {
		if (err.name == "ERR_NO_RESULT") {
			await interaction.reply({ "embeds": [buildEmbed(embedPatterns.errorNoTrackFound)], "ephemeral": true })
			return [undefined, undefined, undefined, undefined]
		}
		throw err
	}
}
