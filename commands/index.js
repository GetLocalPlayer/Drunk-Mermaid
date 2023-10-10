const fs = require("node:fs")
const path = require("node:path")


const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith(".js") && file != __filename)


const commands = {}
const builders = []


for (const file of commandFiles) {
	const filePath = path.join(__dirname, file)
	const cmd = require(filePath)
	if ("builder" in cmd) {
		commands[cmd.builder.name] = cmd.run
		builders.push(cmd.builder)
	}
}


module.exports = {
	"commands": commands,
	"builders": builders,
}