import { Collection, CommandInteraction, GuildMember, Role } from "discord.js";
import { Command, CommandData, Data } from "../index";
import { getCommandByName, getCommands, givePermission, revokePermission } from "../misc/commandManager";
import { getPermissions } from "../misc/databaseInterface";

async function execute(interaction: CommandInteraction, data: Data) {

	const command = interaction.options.getSubcommand();

	if (command == "get") {
		permissionsGet(interaction, data);
	} else if (command == "add") {
		permissionsAdd(interaction, data);
	} else {
		permissionsRemove(interaction, data);
	}

}

async function permissionsGet(interaction: CommandInteraction, data: Data) {

	const commands = await getCommands(data.client, interaction.guild!);
	const command = await getCommandByName(interaction.options.getString("comando")!, data.client, interaction.guild!);
	const permissions = await getPermissions(interaction.guild!, data, command?.id);

	let message = "";

	for (const permission of permissions) {
		const cmd = commands.get(permission[0]);
		const mentions = permission[1].map(element => `<@${(element.type == "user" ? "" : "&") + element.id}>`);
		message += `**${cmd!.name}**: ${mentions.join(" ")}\n`;
	}

	interaction.reply({ content: message, ephemeral: true });

}

async function permissionsAdd(interaction: CommandInteraction, data: Data) {

	const command = (await getCommandByName(interaction.options.getString("comando")!, data.client, interaction.guild!))!;
	const mentionable = interaction.options.getMentionable("utente");

	if (mentionable instanceof GuildMember || mentionable instanceof Role) {

		const permissions = await getPermissions(interaction.guild!, data, command.id);

		if(permissions.get(command.id)?.some(permission => permission.id == mentionable.id)) return interaction.reply("Questo utente/ruolo ha già questo permesso!");

		givePermission(mentionable, command, data).then(() => {
			interaction.reply("Permesso aggiunto con successo (spero)");
		});

	}

}

async function permissionsRemove(interaction: CommandInteraction, data: Data) {

	const command = (await getCommandByName(interaction.options.getString("comando")!, data.client, interaction.guild!))!;
	const mentionable = interaction.options.getMentionable("utente");

	if (mentionable instanceof GuildMember || mentionable instanceof Role) {

		const permissions = await getPermissions(interaction.guild!, data, command.id);

		if(!permissions.get(command.id)!.some(permission => permission.id == mentionable.id)) return interaction.reply("Questo utente/ruolo non ha questo permesso!");

		revokePermission(mentionable, command, data).then(() => {
			interaction.reply("Permesso rimosso con successo (spero)");
		});

	}

}


const commandData: CommandData = {
	name: "config",
	description: "Configura il bot",
	// eslint-disable-next-line no-inline-comments
	default_permission: true, // SET TO FALSE
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

async function initData(commands: Collection<string, Command>) {

	for (let i = 0; i < 3; i++) {
		for (const command of commands) {
			commandData.options![0]!.options![i]!.options![0]!.choices!.push({ name: command[1].commandData.name, value: command[1].commandData.name });
		}
	}

}

export {
	execute,
	commandData,
	initData
};