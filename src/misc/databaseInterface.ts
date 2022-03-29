import { ApplicationCommand, Collection, Guild } from "discord.js";
import { QueryResult } from "pg";
import { Data } from "../index";

async function updateGuilds(data: Data) {

	for(const guild of data.client.guilds.cache.values()) {
		if(!(await guildInDatabase(guild, data))) addGuildToDB(guild, data);
	}

}

async function guildInDatabase(guild: Guild, data: Data) {

	const res = await data.database.query("SELECT * FROM guilds WHERE id=$1", [guild.id]);
	return res.rowCount == 1;

}

async function addGuildToDB(guild: Guild, data: Data) {

	const client = await data.database.connect();
	client.query("INSERT INTO guilds (id) VALUES ($1)", [guild.id]);

	for(const command of (await guild.commands.fetch()).values()) {
		client.query("INSERT INTO permissions (guild_id, command_id, command_name, user_id) VALUES ($1, $2, $3, $4)", [guild.id, command.id, command.name, guild.ownerId]);
	}

}

async function updatePermissions(data: Data) {

	const client = await data.database.connect();
	const res = await client.query("SELECT * FROM permissions");

	for(const row of res.rows) {

		const guild = await data.client.guilds.fetch(row.guild_id);
		const commands = await guild.commands.fetch();

		if(!commands.has(row.command_id)) client.query("DELETE FROM permissions WHERE command_id=$1", [row.command_id]);

	}

}

async function getPermissions(guild: Guild, data: Data, commandID?: string): Promise<Collection<string, {id: string, type: "user" | "role"}[]>> {

	const permissions = new Collection<string, {id: string, type: "user" | "role"}[]>();
	const res: QueryResult<{ command_id: string, role_id: string, user_id: string }> = commandID ? await data.database.query("SELECT * FROM permissions WHERE guild_id=$1 AND command_id=$2 ORDER BY role_id, user_id", [guild.id, commandID]) : await data.database.query("SELECT * FROM permissions WHERE guild_id=$1 ORDER BY role_id, user_id", [guild.id]);

	for(const row of res.rows) {

		const command = (await guild.commands.fetch(row.command_id)).id;
		const mentionable: string = row.user_id ? row.user_id : row.role_id;

		if(!permissions.has(command)) {
			permissions.set(command, [{ id: mentionable, type: row.user_id ? "user" : "role" }]);
		} else {
			permissions.get(command)!.push({ id: mentionable, type: row.user_id ? "user" : "role" });
		}

	}

	return permissions;

}

async function addPermission(guild: Guild, command: ApplicationCommand, id: string, type: "user" | "role", data: Data) {

	data.database.query(`INSERT INTO permissions (guild_id, command_id, command_name, ${type}_id) VALUES ($1, $2, $3, $4)`, [guild.id, command.id, command.name, id]);

}

export {
	updateGuilds,
	addGuildToDB,
	updatePermissions,
	getPermissions,
	addPermission
};