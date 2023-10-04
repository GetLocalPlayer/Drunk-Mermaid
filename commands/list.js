const { usePlayer } = require("discord-player");


const MAX_TRACKS_TO_SHOW = 15
const COMMAND = "list"
const SUBCOMMAND = "-all"


module.exports = {
	name: COMMAND,
	description: "I'll show the list of tracks currently in the queue",

	callback: async (message, subcommand) => {
		const voiceChannel = message.member.voice.channel
		if (!(voiceChannel)) {
			await message.reply("> You are not connected to a voice channel")
			return
		}

		const queuePlayer = usePlayer(message.guildId)

		if (!queuePlayer) {
			await message.reply("> Nothing is currently playing.")
			return
		}

		const sendDM = subcommand ? subcommand.toLowerCase() === SUBCOMMAND.toLowerCase() : false

		const tracks = queuePlayer.queue.tracks.toArray()

		let trackCount = 1
		let msg = `> **Currently tracks in the queue:** ${tracks.length + 1}\n> `
		msg += `\n> :arrow_forward:  **${trackCount}** ${queuePlayer.queue.currentTrack.title}`

		while (tracks.length) {
			const spliced = tracks.splice(0, MAX_TRACKS_TO_SHOW - 1)
			while (spliced.length) {
				trackCount++
				msg += `\n> **${trackCount}.** _${spliced.shift().title}_`
			}
			if (sendDM) {
				await message.author.send(msg)
				msg = ""
			}
			else {
				if (tracks.length) {
					msg += `\n>	\n> :warning:  I can show only ${MAX_TRACKS_TO_SHOW} tracks in a server chat at once.`
					msg += ` To get the whole list in direct messages, use \`${COMMAND} ${SUBCOMMAND}\` command.`
				}
				msg += "\n_ _"
				await message.reply(msg)
				break
			}
		}
	},
}

