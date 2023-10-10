const { SlashCommandBuilder } = require("discord.js")
const { run: playnext } = require("./playnext")
const { run: skip } = require("./skip")


module.exports = {
	builder: new SlashCommandBuilder()
		.setName("playnow")
		.setDescription("I'll skip the current track and play the given right away")
		.addStringOption(option =>
			option
				.setName("track")
				.setDescription("Link or title of the track")
				.setRequired(true)),
	run: run,
}


async function run(interaction) {
	const [queue, track, searchResult, extractor] = await playnext(interaction, true, true)
	if (queue.getSize()) {
		await skip(interaction)
	}
	return [queue, track, searchResult, extractor]
}

