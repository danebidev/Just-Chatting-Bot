import { CommandInteraction, Message } from "discord.js";
import { CommandData, Data } from "../index";

async function execute(interaction: CommandInteraction, data: Data) {

	const reply = await interaction.reply({ content: "Pinging...", fetchReply: true }) as Message;
	reply.edit(`Websocket heartbeat: ${data.client.ws.ping}ms.\nRoundtrip latency: ${reply.createdTimestamp - interaction.createdTimestamp}ms`);

}

const commandData: CommandData = {
	name: "ping",
	description: "Controlla il ping del bot",
	default_permission: false
};

export {
	execute,
	commandData
};