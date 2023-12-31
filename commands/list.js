const { usePlayer } = require("discord-player")
const { buildEmbed, checkVoiceChannel } = require("./play")
const { checkQueuePlayer } = require("./stop")
const { SlashCommandBuilder } = require("discord.js")


const MAX_TRACKS_TO_SHOW = 10


module.exports = {
	builder: new SlashCommandBuilder()
		.setName("list")
		.setDescription(`I'll show the list of next ${MAX_TRACKS_TO_SHOW} tracks currently in the queue`),
	run: run,
}


const embedPatterns = {
	list:{
		"color": 0x00ffe6,
		"type": "rich",
	},
}


async function run(interaction) {
	if (!await checkVoiceChannel(interaction)) return
	if (!await checkQueuePlayer(interaction)) return

	const queuePlayer = usePlayer(interaction.guildId)
	const embed = buildEmbed(embedPatterns.list)

	if (queuePlayer.queue.currentTrack) {
		embed.addFields([
			{
				"name": ":arrow_forward:  Playing now:",
				"value": queuePlayer.queue.currentTrack.title,
				"inline": false,
			},
		])
	}

	const tracks = queuePlayer.queue.tracks

	if (!tracks.size) {
		await interaction.reply({ "content": "The queue is empty.", "ephemeral": true })
		return
	}

	embed.addFields([
		{
			"name": " ",
			"value": " ",
			"inline": false,
		},
		{
			"name": " ",
			"value": `:notes:  **Tracks in the queue:** ${tracks.size}\n`,
			"inline": false,
		},
	])


	for (let i = 0; i < MAX_TRACKS_TO_SHOW && i < tracks.size; i++) {
		embed.addFields([
			{
				"name": " ",
				"value": `**${i + 1}.** _${tracks.at(i).title}_`,
				"inline": false,
			},
		])
	}
	if (tracks.size > MAX_TRACKS_TO_SHOW) {
		embed.addFields([
			{
				"name": `:warning:  _I can show only ${MAX_TRACKS_TO_SHOW} tracks in a server chat at once. To get the whole list in direct messages use \`listall\` command._`,
				"value": " ",
				"inline": false,
			},
		])
	}
	await interaction.reply({ "embeds": [embed], "ephemeral": true })
}

