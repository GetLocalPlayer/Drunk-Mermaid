const { usePlayer } = require("discord-player");
const { checkVoiceChannel, buildEmbed } = require("./play")
const { checkQueuePlayer } = require("./stop");
const { SlashCommandBuilder } = require("discord.js");


module.exports = {
	builder: new SlashCommandBuilder()
		.setName("shuffle")
		.setDescription("I'll shuffle the current queue"),
	run: run,
}

const embedPatterns = {
	shuffle: {
		"color": 0x3b88c3,
		"type": "rich",
		"title": ":twisted_rightwards_arrows:  Tracks in the queue have been shuffled.",
	},
	nothingToShuffle: {
		"color": 0x3b88c3,
		"type": "rich",
		"title": ":zero:  There are no tracks in the queue to shuffle.",
	},
}

async function run(interaction) {
	if (!await checkVoiceChannel(interaction)) return
	if (!await checkQueuePlayer(interaction)) return

	const queuePlayer = usePlayer(interaction.guildId)

	if (queuePlayer.queue.getSize() > 1) {
		queuePlayer.queue.tracks.shuffle()
		await interaction.channel.send({ "embeds": [buildEmbed(embedPatterns.shuffle)] })
	}
	else {
		await interaction.reply({ "embeds": [buildEmbed(embedPatterns.nothingToShuffle)], "ephemeral": true })
	}
}

