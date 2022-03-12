import { readdirSync } from "fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { config } from "dotenv";
import { Command } from "../index";

config();

const files = readdirSync("./src/commands").filter(file => file.endsWith(".ts"));
const commands: any = [];

main();

async function main() {

	for(const file of files) {
		const command: Command = require(`../commands/${file}`);
		if(command.initData) await command.initData();
		commands.push(command.commandData);
	}

	const rest = new REST({ version: "9" }).setToken(process.env["TOKEN"]!);

	rest.put(Routes.applicationGuildCommands(process.env["CLIENTID"]!, "917119141511589959"), { body: commands })
		.then(() => console.log("Successfully registered application commands."))
		.catch(console.error);

};