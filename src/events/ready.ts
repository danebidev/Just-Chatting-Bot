import { GuildMember } from "discord.js";
import { Data } from "../index";

const name = "ready";

function execute(_member: GuildMember, _data: Data) {
	console.log("Ready!");
}

export {
	name,
	execute
};