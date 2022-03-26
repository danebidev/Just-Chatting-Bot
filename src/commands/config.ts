import { CommandInteraction } from "discord.js";
import { Command, CommandData, Data } from "../index";

async function execute(interaction: CommandInteraction, data: Data) {

	const command = interaction.options.getSubcommand();

	if(command == "get") {
		permissionsGet(interaction, data);
	} else if (command == "add") {
		permissionsAdd(interaction, data);
	} else {
		permissionsRemove(interaction, data);
	}

}

function permissionsGet(_interaction: CommandInteraction, _data: Data) {
	throw new Error("Function not implemented.");
}

function permissionsAdd(_interaction: CommandInteraction, _data: Data) {
	throw new Error("Function not implemented.");
}

function permissionsRemove(_interaction: CommandInteraction, _data: Data) {
	throw new Error("Function not implemented.");
}


const commandData: CommandData = {
	name: "config",
	description: "Configura il bot",
	// eslint-disable-next-line no-inline-comments
	default_permission: true, // DA METTERE A FALSE
	options: [
		{
			name: "permissions",
			description: "Modifica o visualizza i permessi dei comandi",
			type: 2,
			options: [
				{
					name: "get",
					description: "Visualizza i permessi dei comandi",
					type: 1,
					options: [
						{
							name: "comando",
							description: "Il comando di cui vuoi vedere i permessi",
							type: 3,
							required: false,
							choices: []
						}
					]
				},
				{
					name: "add",
					description: "Dai il permesso ad un utente o ad un ruolo di usare un certo comando",
					type: 1,
					options: [
						{
							name: "comando",
							description: "Il comando per il quale vuoi aggiungere un permesso",
							type: 3,
							required: true,
							choices: []
						},
						{
							name: "utente",
							description: "L'utente per il quale vuoi aggiungere il permesso di usare il comando (puoi anche usare un ruolo)",
							type: 9,
							required: true
						}
					]
				},
				{
					name: "remove",
					description: "Togli il permesso ad un utente o ad un ruolo di usare un certo comando",
					type: 1,
					options: [
						{
							name: "comando",
							description: "Il comando per il quale vuoi rimuovere un permesso",
							type: 3,
							required: true,
							choices: []
						},
						{
							name: "utente",
							description: "L'utente per il quale vuoi aggiungere il permesso di usare il comando (puoi anche usare un ruolo)",
							type: 9,
							required: true
						}
					]
				}
			]
		}
	]
};

async function initData(commands: Command[]) {

	for (let i = 0; i < 3; i++) {
		for (const command of commands) {
			commandData.options![0]!.options![i]!.options![0]!.choices!.push({ name: command.commandData.name, value: command.commandData.name });
		}
	}

}

export {
	execute,
	commandData,
	initData
};