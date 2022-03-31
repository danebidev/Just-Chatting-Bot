import { Client } from "discord.js";
import { Data } from "../index";
import { removeInvalidDBCommands, updateGuilds } from "../misc/databaseInterface";

const name = "ready";

async function execute(_client: Client, data: Data) {

	console.log("Ready!");

	await updateGuilds(data);
	removeInvalidDBCommands(data);

}

export {
	name,
	execute
};