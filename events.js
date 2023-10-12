const { useMainPlayer, GuildQueueEvent } = require("discord-player");


const player = useMainPlayer()


player.events.on(GuildQueueEvent.error, (queue, error) => {
	console.log(`General player error event: ${error.message}`)
	console.log(error)
})


player.events.on(GuildQueueEvent.playerError, (queue, error) => {
	console.log(`Player error event: ${error.message}`);
	console.log(error);
})