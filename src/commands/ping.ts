import { Message } from "discord.js";
import { Data } from "../index";

const name = "ping";
const minArgs = 0;
const maxArgs = 0;
const syntax = "ping";
const helpMessage = "Controlla il ping del bot";
const helpArgs: {name: string, explanation: string}[] = [];

function execute(message: Message, _args: string[], data: Data) {

	message.reply("Pinging...").then(reply => {
		reply.edit(`Websocket heartbeat: ${data.client.ws.ping}ms.\nRoundtrip latency: ${reply.createdTimestamp - message.createdTimestamp}ms`);
	});

}

export {
	name,
	minArgs,
	maxArgs,
	syntax,
	helpMessage,
	helpArgs,
	execute
};