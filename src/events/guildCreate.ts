import { Guild } from "discord.js";
import { Data } from "../index";
import { addGuildToDB } from "../misc/databaseInterface";

const name = "guildMemberRemove";

function execute(guild: Guild, data: Data) {

	addGuildToDB(guild, data);

}

export {
	name,
	execute
};