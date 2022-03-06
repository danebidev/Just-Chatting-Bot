import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message } from "discord.js";
import { Data } from "../index";

const commandData = new SlashCommandBuilder()
	.setName("ping")
	.setDescription("Controlla il ping del bot");

const syntax = "ping";

async function execute(interaction: CommandInteraction, data: Data) {

	const reply = await interaction.reply({ content: "Pinging...", fetchReply: true }) as Message;
	reply.edit(`Websocket heartbeat: ${data.client.ws.ping}ms.\nRoundtrip latency: ${reply.createdTimestamp - interaction.createdTimestamp}ms`);

}

export {
	commandData,
	syntax,
	execute
};