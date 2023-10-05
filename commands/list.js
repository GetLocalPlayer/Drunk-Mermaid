const { usePlayer } = require("discord-player");
const { EmbedBuilder } = require ("discord.js")
const { embedPatterns: skipEmbedPatterns } = require ("./skip")
const { embedPatterns: playEmbedPatterns } = require ("./play")


const MAX_TRACKS_TO_SHOW = 15
const COMMAND = "list"
const SUBCOMMAND = "-all"


const pattern = {
	"color": 0x00ffe6,
	"type": "rich",
}


module.exports = {
	name: COMMAND,
	description: "I'll show the list of tracks currently in the queue",

	run: async (message, subcommand) => {
		const voiceChannel = message.member.voice.channel

		if (!(voiceChannel)) {
			await message.reply({ "embeds": [EmbedBuilder.from(playEmbedPatterns.errorNoVoice)] })
			return
		}

		const queuePlayer = usePlayer(message.guildId)

		if (!queuePlayer || !queuePlayer.queue.getSize()) {
			await message.reply({ "embeds": [EmbedBuilder.from(skipEmbedPatterns.errorNothingIsPlaying)] })
			return
		}

		const sendDM = subcommand ? subcommand.toLowerCase() === SUBCOMMAND.toLowerCase() : false
		const tracks = queuePlayer.queue.tracks.toArray()
		let embed = EmbedBuilder.from(pattern)

		if (queuePlayer.queue.currentTrack) {
			embed.addFields([
				{
					"name": ":arrow_forward:  Playing now:",
					"value": queuePlayer.queue.currentTrack.title,
					"inline": false,
				},
			])
		}

		let trackCount = 1

		if (!tracks.length) {
			embed.addFields([
				{
					"name": " ",
					"value": "No tracks in the queue",
					"inline": false,
				},
			])
			await message.channel.send({ "embeds": [embed] })
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

		while (tracks.length) {
			const spliced = tracks.splice(0, MAX_TRACKS_TO_SHOW - 1)
			while (spliced.length) {
				embed.addFields([
					{
						"name": " ",
						"value": `> **${trackCount}.** _${spliced.shift().title}_`,
						"inline": false,
					},
				])
				trackCount++
			}
			if (sendDM) {
				await message.author.send({ "embeds": [embed] })
				embed = EmbedBuilder.from(pattern)
			}
			else {
				if (tracks.length) {
					embed.addFields([
						{
							"name": `:warning:  _I can show only ${MAX_TRACKS_TO_SHOW} tracks in a server chat at once. To get the whole list in direct messages use \`${COMMAND} ${SUBCOMMAND}\` command._`,
							"value": " ",
							"inline": false,
						},
					])
				}
				await message.channel.send({ "embeds": [embed] })
				break
			}
		}
	},
}

