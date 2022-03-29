import { CommandInteraction, GuildMember, Role } from "discord.js";
import { Command, CommandData, Data } from "../index";
import { addPermission, getPermissions } from "../misc/databaseInterface";

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

	const commands = await interaction.guild!.commands.fetch();
	const command = [...commands.values()].find(appCommand => appCommand.name == interaction.options.getString("comando"));
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

	const commands = await interaction.guild!.commands.fetch();
	const command = commands.find(cmd => cmd.name == interaction.options.getString("comando"))!;
	const mentionable = interaction.options.getMentionable("utente");

	if (mentionable instanceof GuildMember || mentionable instanceof Role) {

		if (mentionable instanceof Role && mentionable.name == "@everyone") return interaction.reply("Ma anche no!");
		const permissions = await getPermissions(interaction.guild!, data, command.id);

		if(permissions.get(command.id)!.some(permission => permission.id == mentionable.id)) return interaction.reply("Questo utente/ruolo ha già questo permesso!");

		await addPermission(interaction.guild!, command, mentionable.id, mentionable instanceof GuildMember ? "user" : "role", data);
		interaction.reply("Permesso aggiunto con successo (spero)");

	} else {
		return interaction.reply("Uhmmmmmmm-----Tu non dovresti poter vedere questo messaggio...");
	}

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