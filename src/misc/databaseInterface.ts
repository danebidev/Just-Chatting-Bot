import { Guild } from "discord.js";
import { Data } from "../index";
import format from "pg-format";

async function init(data: Data) {

	const res = await data.database.query("SELECT * FROM bumps");

	for (const row of res.rows) {
		data.bumps.set(row.id, row.bumps);
	}

}

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

async function getGuildChannels(guildID: string, data: Data, channelType?: string) {

	if(channelType) {
		const query = format("SELECT %I FROM guilds WHERE id=%L", channelType, guildID);
		return (await data.database.query(query)).rows;
	}

	const res = await data.database.query("SELECT bump_channel_id, bump_count_channel_id, bump_log_channel_id FROM guilds WHERE id=$1", [guildID]);
	return [res.rows[0].bump_channel_id, res.rows[0].bump_count_channel_id, res.rows[0].bump_log_channel_id];

}

export {
	init,
	guildIsInDatabase,
	addGuildToDB,
	getGuildChannels
};