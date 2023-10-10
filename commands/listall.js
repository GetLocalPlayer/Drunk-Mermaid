const { usePlayer } = require("discord-player")
const { buildEmbed, checkVoiceChannel } = require("./play")
const { checkQueuePlayer } = require("./stop")
const { SlashCommandBuilder } = require("discord.js")


const TRACKS_PER_MESSAGE = 10


module.exports = {
	builder: new SlashCommandBuilder()
		.setName("listall")
		.setDescription("I'll send the whole list of tracks in the current queue in direct messages."),
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
	const tracks = queuePlayer.queue.tracks

	let embed = buildEmbed(embedPatterns.list)

	if (queuePlayer.queue.currentTrack) {
		embed.addFields([
			{
				"name": ":arrow_forward:  Playing now:",
				"value": queuePlayer.queue.currentTrack.title,
				"inline": false,
			},
		])
	}


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
			"value": `:notes:  **Tracks in the queue:** ${tracks.length}\n`,
			"inline": false,
		},
	])

	const tracksArr = tracks.toArray()
	let position = 1

	interaction.reply({ "content": "Sending in direct messages", "ephemeral": true })

	while (tracksArr.length) {
		const spliced = tracksArr.splice(0, TRACKS_PER_MESSAGE - 1)
		while (spliced.length) {
			embed.addFields([
				{
					"name": " ",
					"value": `**${position}.** _${spliced.shift().title}_`,
					"inline": false,
				},
			])
			position++
		}
		await interaction.member.send({ "embeds": [embed], "ephemeral": true })
		embed = buildEmbed(embedPatterns.list)
	}
}

