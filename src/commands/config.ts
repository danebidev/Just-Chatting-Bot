import { CommandInteraction } from "discord.js";
import { Command, CommandData, Data } from "../index";
import { getGuildChannels } from "../misc/databaseInterface";

async function execute(interaction: CommandInteraction, data: Data) {

	const group = interaction.options.getSubcommandGroup();
	const command = interaction.options.getSubcommand();

	if(group == "channels") {

		if(command == "get") return channelsGet(interaction, data);
		return channelsSet(interaction, data);

	} else if (group == "roles") {

		switch (command) {

		case "get":
			return rolesGet(interaction, data);
		case "add":
			return rolesAdd(interaction, data);
		case "remove":
			return rolesRemove(interaction, data);
		case "edit":
			return rolesEdit(interaction, data);

		}

	} else {

		switch (command) {

		case "get":
			return permissionsGet(interaction, data);
		case "add":
			return permissionsAdd(interaction, data);
		case "remove":
			return permissionsRemove(interaction, data);

		}

	}

}

async function channelsGet(interaction: CommandInteraction, data: Data) {

	const guild = interaction.guild;
	const type = interaction.options.getString("tipocanale");

	if(type) {
		const res = await getGuildChannels(guild!.id, data, type);
		const messageType = type[0]!.toUpperCase() + type.replaceAll("_", " ").slice(1, type.length - 3);
		return interaction.reply({ content: `**${messageType}**: <#${res[0][type]}>`, ephemeral: true });
	}

	const channels = await getGuildChannels(guild!.id, data);

	for(let i = 0; i < channels.length; i++) {
		if(channels[i]) {
			channels[i] = `<#${channels[i]}>`;
			continue;
		}
		channels[i] = "Non impostato";
	}

	interaction.reply({ content: `**Bump channel**: ${channels[0]}\n**Bump count channel**: ${channels[1]}\n**Bump log channel**: ${channels[2]}`, ephemeral: true });

}

function channelsSet(_interaction: CommandInteraction, _data: Data) {
	throw new Error("Function not implemented.");
}

function rolesGet(_interaction: CommandInteraction, _data: Data) {
	throw new Error("Function not implemented.");
}

function rolesAdd(_interaction: CommandInteraction, _data: Data) {
	throw new Error("Function not implemented.");
}

function rolesRemove(_interaction: CommandInteraction, _data: Data) {
	throw new Error("Function not implemented.");
}

function rolesEdit(_interaction: CommandInteraction, _data: Data) {
	throw new Error("Function not implemented.");
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
			name: "channels",
			description: "Modifica o visualizza la configurazione dei canali",
			type: 2,
			options: [
				{
					name: "get",
					description: "Visualizza la configurazione dei canali",
					type: 1,
					options: [
						{
							name: "tipocanale",
							description: "Il tipo di canale di cui vuoi visualizzare la configurazione",
							type: 3,
							required: false,
							choices: [
								{
									name: "Bump channel",
									value: "bump_channel_id"
								},
								{
									name: "Bump count channel",
									value: "bump_count_channel_id"
								},
								{
									name: "Bump log channel",
									value: "bump_log_channel_id"
								}
							]
						}
					]
				},
				{
					name: "set",
					description: "Modifica la configurazione dei canali",
					type: 1,
					options: [
						{
							name: "tipocanale",
							description: "Il tipo canale di cui vuoi modificare la configurazione",
							type: 3,
							required: true,
							choices: [
								{
									name: "Bump count channel",
									value: "bump_count_channel_id"
								},
								{
									name: "Bump log channel",
									value: "bump_log_channel_id"
								}
							]
						},
						{
							name: "nuovocanale",
							description: "Il nuovo canale che vuoi assegnare al tipo di canale",
							type: 7,
							required: true
						}
					]
				}
			]
		},
		{
			name: "roles",
			description: "Modifica o visualizza la configurazione dei ruoli assegnati automaticamente",
			type: 2,
			options: [
				{
					name: "get",
					description: "Visualizza la configurazione dei ruoli",
					type: 1,
					options: [
						{
							name: "ruolo",
							description: "Il ruolo di cui vuoi visualizzare la configurazione",
							type: 8,
							required: false
						}
					]
				},
				{
					name: "add",
					description: "Aggiungi un ruolo",
					type: 1,
					options: [
						{
							name: "ruolo",
							description: "Il ruolo che vuoi aggiungere",
							type: 8,
							required: true
						}
					]
				},
				{
					name: "remove",
					description: "Rimuovi un ruolo",
					type: 1,
					options: [
						{
							name: "ruolo",
							description: "Il ruolo che vuoi rimuovere",
							type: 8,
							required: true
						}
					]
				},
				{
					name: "edit",
					description: "Modifica un ruolo",
					type: 1,
					options: [
						{
							name: "ruolo",
							description: "Il ruolo che vuoi modificare",
							type: 8,
							required: true
						}
					]
				}
			]
		},
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

	for(let i = 0; i < 3; i++) {
		for(const command of commands) {
			commandData.options![2]!.options![i]!.options![0]!.choices!.push({ name: command.commandData.name, value: command.commandData.name });
		}
	}

}

export {
	execute,
	commandData,
	initData
};