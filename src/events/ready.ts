import { GuildMember } from "discord.js";
import { Data } from "../index";
import { readConfig } from "../misc/util";

const name = "ready";

function execute(_member: GuildMember, data: Data) {

	readConfig(data.client).then(configuration => {

		data.config = configuration;
		console.log("Ready!");

	});
}

export {
	name,
	execute
};