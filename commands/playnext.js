const { buildEmbed, run: play } = require("./play")


module.exports = {
	name: "playnext",
	description: "I'll put the track I find by the given link or request in the begginning of the queue",
	run: run,
}


const embedPatterns = {
	playnext: {
		color: 0x00ffe6,
		type: "rich",
		title: ":arrow_heading_up:  Next track to play:",
	},
}


async function reportNextTrack(channel, track) {
	const embed = buildEmbed(embedPatterns.playnext)
		.addFields([
			{
				name: " ",
				value: `${track.title}`,
				inline: false,
			},
		])
	await channel.send({ embeds: [embed] })
}


async function run(message, url, omitReport) {
	const [queue, track, searchResult, extractor] = await play(message, url)

	if (queue && queue.currentTrack !== track) {
		queue.moveTrack(track, 0)
		if (!omitReport) await reportNextTrack(message.channel, track)
	}
	return [queue, track, searchResult, extractor]
}

