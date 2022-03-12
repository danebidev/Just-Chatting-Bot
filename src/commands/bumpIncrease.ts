import { changeBumps } from "../misc/bumpCount";
import { CommandData, Data } from "../index";
import { CommandInteraction } from "discord.js";

async function execute(interaction: CommandInteraction, data: Data) {

	const user = interaction.options.getUser("utente")!;
	const quant = interaction.options.getInteger("quanto");
	const reason = interaction.options.getString("motivo")!;

	if (!quant) return await changeBumps(user, 1, data, interaction.user, reason);

	if (quant <= 0) return interaction.reply({ content: "Il numero inserito non è valido.", ephemeral: true });

	changeBumps(user, quant, data, interaction.user, reason);
	return interaction.reply("Bump aumentati con successo");

}

const commandData: CommandData = {
	name: "bumpincrease",
	description: "Aumenta i bump fatti da un utente",
	default_permission: false,
	options: [
		{
			name: "utente",
			description: "Una menzione dell' utente di cui vuoi aumentare i bump",
			required: true,
			type: 6
		},
		{
			name: "ragione",
			description: "La ragione per cui si ha aumentato i bump",
			required: true,
			type: 3
		},
		{
			name: "quanto",
			description: "Di quanto aumentare i bump dell'utente",
			required: false,
			type: 4
		},
	]
};

export {
	execute,
	commandData
};