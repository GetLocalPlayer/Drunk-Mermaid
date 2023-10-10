const { usePlayer } = require("discord-player");
const { buildEmbed, checkVoiceChannel } = require("./play");
const { SlashCommandBuilder } = require("discord.js");


module.exports = {
	builder: new SlashCommandBuilder()
		.setName("stop")
		.setDescription("I'll stop playing"),
	run: run,
	checkQueuePlayer: checkQueuePlayer,
}

const embedPatterns = {
	errorNothingIsPlaying: {
		"color": 0xff0000,
		"type": "rich",
		"title": ":no_entry_sign:  Nothings is currently playing",
	},
	stop: {
		color: 0x3b88c3,
		type: "rich",
		title: ":stop_button:  Stop playing",
	},
}


async function checkQueuePlayer(interatcion) {
	const queuePlayer = usePlayer(interatcion.guildId)
	if (!queuePlayer || !queuePlayer.queue.currentTrack) {
		await interatcion.reply({ "embeds": [buildEmbed(embedPatterns.errorNothingIsPlaying)], "ephemeral": true })
		return false
	}
	return true
}


async function run(interaction) {
	if (!await checkVoiceChannel(interaction)) return
	if (!await checkQueuePlayer(interaction)) return

	const queuePlayer = usePlayer(interaction.guildId)

	if (!queuePlayer || !queuePlayer.queue.currentTrack) {
		await interaction.reply({ "embeds": [buildEmbed(embedPatterns.errorNothingIsPlaying)] })
		return
	}

	queuePlayer.stop(true)
	await interaction.channel.send({ "embeds": [buildEmbed(embedPatterns.stop)] })
}
