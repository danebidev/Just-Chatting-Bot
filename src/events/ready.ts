import { GuildMember } from "discord.js";
import { Data } from "../index";
import { addGuildToDB, guildIsInDatabase } from "../misc/databaseInterface";

const name = "ready";

async function execute(_member: GuildMember, data: Data) {

	console.log("Ready!");

	for(const guild of data.client.guilds.cache.values()) {
		if(!(await guildIsInDatabase(guild, data))) addGuildToDB(guild, data);
	}

}

export {
	name,
	execute
};