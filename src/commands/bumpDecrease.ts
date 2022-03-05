import { CommandInteraction } from "discord.js";
import { changeBumps } from "../misc/bumpCount";
import { Data } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";

const commandData = new SlashCommandBuilder()
	.setName("bumpdecrease")
	.setDescription("Diminuisci i bump fatti da un utente")
	.addUserOption(option => option
		.setName("utente")
		.setDescription("Una menzione dell' utente di cui vuoi diminuire i bump")
		.setRequired(true))
	.addStringOption(option => option
		.setName("motivo")
		.setDescription("La ragione per cui vuoi diminire i bump")
		.setRequired(true))
	.addIntegerOption(option => option
		.setName("quanto")
		.setDescription("Di quanto diminuire i bump dell'utente")
		.setRequired(false));

const syntax = "bump-decrease <menzione dell'utente> [quantità]";

async function execute(interaction: CommandInteraction, data: Data) {

	const user = interaction.options.getUser("utente")!;
	const quant = interaction.options.getInteger("quanto");
	const reason = interaction.options.getString("motivo")!;

	if (!quant) return await changeBumps(user, -1, data, interaction.user, reason);

	if (quant <= 0) return interaction.reply({ content: "Il numero inserito non è valido.", ephemeral: true });

	await changeBumps(user, -quant, data, interaction.user, reason);
	interaction.reply({ content: "Bump diminuiti con successo", ephemeral: true });

}

export {
	commandData,
	syntax,
	execute
};