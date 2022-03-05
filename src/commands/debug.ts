import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Data } from "..";

const commandData = new SlashCommandBuilder()
	.setName("debug")
	.setDescription("Aiuta questo povero developer a smattare un po' di meno");

const syntax = "debug";

// eslint-disable-next-line no-unused-vars
function execute(interaction: CommandInteraction, _data: Data) {

	const embed = {
		title: "Test",
		description: `<@${interaction.user.id}> Bump done!`
	};

	interaction.reply({ embeds: [embed] });

}

export {
	commandData,
	syntax,
	execute
};