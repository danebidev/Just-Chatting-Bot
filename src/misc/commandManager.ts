import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Collection } from "discord.js";
import { Command } from "../index";

async function registerCommands(cmds: Collection<string, Command>) {

	const commands = cmds.map(command => command);
	for (const command of commands) {
		if (command.initData) await command.initData(commands);
	}

	const rest = new REST({ version: "9" }).setToken(process.env["TOKEN"]!);

	rest.put(Routes.applicationGuildCommands(process.env["CLIENTID"]!, "748232983768465408"), { body: commands.map(command => command.commandData) })
		.then(() => console.log("Successfully registered application commands. 1"))
		.catch(console.error);

	rest.put(Routes.applicationGuildCommands(process.env["CLIENTID"]!, "917119141511589959"), { body: commands.map(command => command.commandData) })
		.then(() => console.log("Successfully registered application commands. 2"))
		.catch(console.error);

};

export {
	registerCommands
};