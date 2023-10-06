const fs = require("node:fs")
const path = require("node:path")


const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith(".js") && file != "index.js")


for (const file of commandFiles) {
	const filePath = path.join(__dirname, file)
	const cmd = require(filePath)
	if ("name" in cmd && "run" in cmd) {
		exports[cmd.name.toLowerCase()] = cmd.run
	}
}