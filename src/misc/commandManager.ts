import { REST } from "@discordjs/rest";
import { ApplicationCommand, Client, Collection, Guild, GuildMember, Role } from "discord.js";
import { readdirSync } from "fs";
import { Command, Data } from "../index";
import { addPermission, getPermissions, removeInvalidDBCommands, removePermission } from "./databaseInterface";

async function getCommands(client: Client, guild: Guild) {

	return process.env["LOCAL_TEST_GUILDS_IDS"] ? guild.commands.fetch() : client.application!.commands.fetch();

}

async function getCommandByName(name: string, client: Client, guild: Guild) {

	const commands = await getCommands(client, guild);
	return commands.find(command => command.name === name);

}

function readCommandFiles(): Collection<string, Command> {

	const commands = new Collection<string, Command>();
	const commandFiles = readdirSync("./src/commands").filter(file => file.endsWith(".ts"));

	for (const file of commandFiles) {
		const command = require(`../commands/${file}`);
		commands.set(command.commandData.name, command);
	}

	return commands;

}

async function registerCommands(data: Data) {

	const commands = readCommandFiles();
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
			.then(() => console.log("Started registering application commands (will take an hour)."))
			.catch(console.error);
	}
	removeInvalidDBCommands(data);

};

async function givePermission(user: GuildMember | Role, command: ApplicationCommand, data: Data) {

	await addPermission(user.guild, command, user.id, user instanceof GuildMember ? "user" : "role", data);
	updatePermissions(user.guild, data);

}

async function revokePermission(user: GuildMember | Role, command: ApplicationCommand, data: Data) {

	await removePermission(user.guild, command, user.id, user instanceof GuildMember ? "user" : "role", data);
	updatePermissions(user.guild, data);

}

async function updatePermissions(guild: Guild, data: Data) {

	const rest = new REST({ version: "9" }).setToken(process.env["TOKEN"]!);
	const permissions = await getPermissions(guild, data);
	const body: {id: string, application_id: string, guild_id: string, permissions: {id: string, type: 1 | 2, permission: true}[]}[] = [];

	for(const entry of permissions.entries()) {
		body.push({ id: entry[0], application_id: data.client.application!.id, guild_id: guild.id, permissions: entry[1].map(permission => {
			return {
				id: permission.id,
				type: permission.type == "role" ? 1 : 2,
				permission: true
			};
		})
		});
	}

	rest.put(`/applications/${data.client.application!.id}/guilds/${guild.id}/commands/permissions`, { body: body });

}

export {
	getCommands,
	getCommandByName,
	readCommandFiles,
	registerCommands,
	givePermission,
	revokePermission,
	updatePermissions
};