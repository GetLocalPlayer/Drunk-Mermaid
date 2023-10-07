const { run: playnext } = require("./playnext")
const { run: skip } = require("./skip")


module.exports = {
	name: "playnow",
	description: "I'll skip the current track and play the given right away",
	run: run,
}


async function run(message, url) {
	const [queue, track, searchResult, extractor] = await playnext(message, url)
	if (queue.getSize()) {
		await skip(message)
	}
	return [queue, track, searchResult, extractor]
}

