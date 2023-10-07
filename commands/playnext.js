const { EmbedBuilder } = require("discord.js")
const { run: play } = require("./play")


module.exports = {
	name: "playnext",
	description: "I'll put the track I find by the given link or request in the begginning of the queue",
	run: run,

}


const embedPattern = {
	color: 0x00ffe6,
	type: "rich",
	title: ":arrow_heading_up:  A track has been moved in the beginning of the queue:",
}


async function run(message, url) {
	const [queue, track, searchResult, extractor] = await play(message, url)

	if (queue.currentTrack !== track) {
		delete queue.metadata.channel
		queue.moveTrack(track, 0)
		queue.metadata.channel = message.channel
		const embed = EmbedBuilder.from(embedPattern)
			.addFields([
				{
					name: " ",
					value: `${track.title}`,
					inline: false,
				},
			])
		await message.channel.send({ embeds: [embed] })
	}
	return [queue, track, searchResult, extractor]
}

