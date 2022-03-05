import { Interaction } from "discord.js";
import { Data } from "..";

const name = "interactionCreate";

async function execute(interaction: Interaction, data: Data) {

	if(!interaction.isCommand()) return;

	if (!data.commands.has(interaction.commandName)) return;

	const command = data.commands.get(interaction.commandName)!;

	command.execute(interaction, data);

}

export {
	name,
	execute
};