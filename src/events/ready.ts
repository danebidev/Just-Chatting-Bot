import { Client } from "discord.js";
import { Data } from "../index";
import { updateGuilds } from "../misc/databaseInterface";

const name = "ready";

async function execute(_client: Client, data: Data) {

	console.log("Ready!");

	await updateGuilds(data);

}

export {
	name,
	execute
};
