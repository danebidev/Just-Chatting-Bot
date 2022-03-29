import { Message } from "discord.js";
import { Data } from "../index";
import { registerCommands } from "../misc/commandManager";

const name = "messageCreate";

async function execute(message: Message, data: Data) {

	if(message.author.id == data.client.application!.owner!.id) {
		if(message.content == "updateCommands") registerCommands(data);
	}

}

export {
	name,
	execute
};