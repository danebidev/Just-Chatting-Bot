import { CommandInteraction } from "discord.js";
import { CommandData, Data } from "../index";

function execute(interaction: CommandInteraction, _data: Data) {

	interaction.reply("Ciao");

}

const commandData: CommandData = {
	name: "config",
	description: "Configura il bot",
	default_permission: true,
	options: [
		{
			name: "get",
			description: "Visualizza la configurazione del bot",
			type: 2,
			options: [
				{
					name: "channels",
					description: "Visualizza la configurazione dei canali",
					type: 1
				},
				{
					name: "roles",
					description: "Visualizza la configurazione dei ruoli automatici",
					type: 1
				},
				{
					name: "permissions",
					description: "Visualizza la configurazione dei permessi",
					type: 1
				}
			]
		},
		{
			name: "set",
			description: "Modifica la configurazione del bot",
			type: 2,
			options: [
				{
					name: "channels",
					description: "Modifica la configurazione dei canali",
					type: 1,
					options: [
						{
							name: "canale",
							description: "Il canale che vuoi cambiare",
							type: 3,
							required: true,
							choices: [
								{ name: "Bump Count Channel", value: "BumpCountChannel" },
								{ name: "Bump Log Channel", value: "BumpLogChannel" },
							]
						},
						{
							name: "newid",
							description: "L'id del nuovo canale",
							type: 3,
							required: true
						}
					]
				},
				{
					name: "permissions",
					description: "Modifica la configurazione dei permessi",
					type: 1,
					options: [
						{
							name: "command",
							description: "Il comando di cui vuoi cambiare i permessi",
							type: 3,
							required: true,
							choices: []
						},
						{
							name: "mention",
							description: "L'id del nuovo canale",
							type: 9,
						}
					]
				},
			]
		},
		{
			name: "roles",
			description: "Modifica o visualizza la configurazione dei ruoli automatici",
			type: 2,
			options: [
				{
					name: "get",
					description: "Visualizza la configurazione di tutti i ruoli automatici",
					type: 1
				},
				{
					name: "add",
					description: "Aggiungi un ruolo automatico (max. 5)",
					type: 1
				},
				{
					name: "remove",
					description: "Rimuovi un ruolo automatico",
					type: 1,
				}
			]
		},
	]
};

export {
	execute,
	commandData
};