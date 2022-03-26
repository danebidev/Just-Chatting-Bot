import { Guild } from "discord.js";
import { Data } from "../index";

async function guildIsInDatabase(guild: Guild, data: Data) {

	const res = await data.database.query("SELECT * FROM guilds WHERE id=$1", [guild.id]);
	return res.rowCount == 1;

}

async function addGuildToDB(guild: Guild, data: Data) {

	const client = await data.database.connect();
	const configCommandID = [...(await guild.commands.fetch()).values()].find(command => command.name == "config")!.id;
	client.query("INSERT INTO guilds (id) VALUES ($1)", [guild.id]);
	client.query("INSERT INTO permissions (guild_id, command_id, user_id) VALUES ($1, $2, $3)", [guild.id, configCommandID, guild.ownerId]);

}

export {
	guildIsInDatabase,
	addGuildToDB,
};