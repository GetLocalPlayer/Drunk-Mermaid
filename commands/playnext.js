const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const { run: play } = require("./play")


module.exports = {
	builder: new SlashCommandBuilder()
		.setName("playnext")
		.setDescription("I'll put the track I find by the given link or request in the begginning of the queue")
		.addStringOption(option =>
			option
				.setName("track")
				.setDescription("Link or title of the track")
				.setRequired(true)),
	run: run,

}


const embedPattern = {
	color: 0x00ffe6,
	type: "rich",
	title: ":arrow_heading_up:  A track has been moved in the beginning of the queue:",
}


async function run(interaction, moveSilently, addSilently) {
	const [queue, track, searchResult, extractor] = await play(interaction, addSilently)

	if (queue.currentTrack !== track) {
		queue.metadata.channel = null
		queue.moveTrack(track, 0)
		queue.metadata.channel = interaction.channel
		if (!moveSilently) {
			const embed = EmbedBuilder.from(embedPattern)
				.addFields([
					{
						name: " ",
						value: `${track.title}`,
						inline: false,
					},
				])
			await interaction.reply({ "embeds": [embed] })
		}
	}
	return [queue, track, searchResult, extractor]
}

