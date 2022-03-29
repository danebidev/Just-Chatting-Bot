import { REST } from "@discordjs/rest";
import { Client, Collection, Guild } from "discord.js";
import { readdirSync } from "fs";
import { Command, Data } from "../index";

async function getCommands(client: Client, guild: Guild) {

	return process.env["LOCAL_TEST_GUILDS_IDS"] ? guild.commands.fetch() : client.application!.commands.fetch();

}

function readCommands(): Collection<string, Command> {

	const commands = new Collection<string, Command>();
	const commandFiles = readdirSync("./src/commands").filter(file => file.endsWith(".ts"));

	for (const file of commandFiles) {
		const command = require(`../commands/${file}`);
		commands.set(command.commandData.name, command);
	}

	return commands;

}

async function registerCommands(data: Data) {

	const commands = readCommands();
	for (const command of commands.values()) {
		if (command.initData) await command.initData(commands);
	}

	const rest = new REST({ version: "9" }).setToken(process.env["TOKEN"]!);
	const commandsData = commands.map(command => command.commandData);

	if (process.env["LOCAL_TEST_GUILDS_IDS"]) {

		const guildsIDs = process.env["LOCAL_TEST_GUILDS_IDS"].split(" ");

		guildsIDs.forEach(id => {
			rest.put(`/applications/${data.client.application!.id}/guilds/${id}/commands`, { body: commandsData })
				.then(() => console.log("Successfully registered application commands."))
				.catch(console.error);
		});

	} else {
		rest.put(`/applications/${data.client.application!.id}/commands`, { body: commandsData })
			.then(() => console.log("Started registering application commands (will take an h)."))
			.catch(console.error);
	}

};

export {
	getCommands,
	readCommands,
	registerCommands
};