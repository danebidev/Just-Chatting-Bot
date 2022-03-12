import { CommandInteraction } from "discord.js";
import { CommandData, Data } from "../index";

function execute(interaction: CommandInteraction, _data: Data) {

	const embed = {
		title: "Test",
		description: `<@${interaction.user.id}> Bump done!`
	};

	interaction.reply({ embeds: [embed] });

}

const commandData: CommandData = {
	name: "debug",
	description: "Esegue dei test",
	default_permission: false
};

export {
	execute,
	commandData
};