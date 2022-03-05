import { readdirSync } from "fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { config } from "dotenv";

config();

const files = readdirSync("./src/commands").filter(file => file.endsWith(".ts"));
const commands = [];

for(const file of files) {
	const command = require(`../commands/${file}`);
	commands.push(command.commandData.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env["TOKEN"]!);

rest.put(Routes.applicationGuildCommands(process.env["CLIENTID"]!, process.env["GUILDID"]!), { body: commands })
	.then(() => console.log("Successfully registered application commands."))
	.catch(console.error);