import { changeBumps } from "../misc/bumpCount";
import { Data } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

const commandData = new SlashCommandBuilder()
	.setName("bumpincrease")
	.setDescription("Aumenta i bump fatti da un utente")
	.addUserOption(option => option
		.setName("utente")
		.setDescription("Una menzione dell' utente di cui vuoi aumentare i bump")
		.setRequired(true))
	.addStringOption(option => option
		.setName("motivo")
		.setDescription("La ragione per cui si ha aumentato i bump")
		.setRequired(true))
	.addIntegerOption(option => option
		.setName("quanto")
		.setDescription("Di quanto aumentare i bump dell'utente")
		.setRequired(false));

const syntax = "bump-increase <menzione all'utente> [quantità]";

async function execute(interaction: CommandInteraction, data: Data) {

	const user = interaction.options.getUser("utente")!;
	const quant = interaction.options.getInteger("quanto");
	const reason = interaction.options.getString("motivo")!;

	if (!quant) return await changeBumps(user, 1, data, interaction.user, reason);

	if (quant <= 0) return interaction.reply({ content: "Il numero inserito non è valido.", ephemeral: true });

	changeBumps(user, quant, data, interaction.user, reason);
	return interaction.reply({ content: "Bump aumentati con successo", ephemeral:true });

}

export {
	commandData,
	syntax,
	execute
};