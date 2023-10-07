const { useMainPlayer, QueryType } = require("discord-player");
const { EmbedBuilder } = require ("discord.js");


module.exports = {
	name: "play",
	description: "I'll start playing the track I find by the given link or request, for instance: `dm! play Never Gonna Give You Up`",
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


async function checkVoiceChannel(message) {
	const voiceChannel = message.member.voice.channel
	if (!(voiceChannel)) {
		await message.reply({ "embeds": [buildEmbed(embedPatterns.errorNoVoice)] })
		return false
	}
	return true
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
			nodeOptions: {
				metadata: omitReport ? null : { channel: message.channel },
			},
		})
		return [queue, track, searchResult, extractor]
	}
	catch (err) {
		if (err.name == "ERR_NO_RESULT") {
			await message.reply({ "embeds": [buildEmbed(embedPatterns.errorNoTrackFound)] })
			return [null, null, null, null]
		}
		throw err
	}
}
