import { Interaction } from "discord.js";
import { Data } from "../index";

const name = "interactionCreate";

async function execute(interaction: Interaction, data: Data) {

	if(!interaction.isCommand()) return;
	if(!interaction.inGuild()) return;
	if (!data.commands.has(interaction.commandName)) return;

	const command = data.commands.get(interaction.commandName)!;

	command.execute(interaction, data);

}

export {
	name,
	execute
};