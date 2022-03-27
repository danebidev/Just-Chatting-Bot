import { Client } from "discord.js";
import { Data } from "../index";
import { updateGuilds, updatePermissions } from "../misc/databaseInterface";

const name = "ready";

async function execute(_client: Client, data: Data) {

	console.log("Ready!");

	await updateGuilds(data);
	updatePermissions(data);

}

export {
	name,
	execute
};
