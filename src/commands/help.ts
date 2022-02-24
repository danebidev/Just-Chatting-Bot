import { Message, MessageEmbedOptions, EmbedField } from "discord.js";
import { Data } from "../index";

const name = "help";
const minArgs = 0;
const maxArgs = 1;
const syntax = "help [comando]";
const helpMessage = "Ti dà più informazioni sui comandi";
const helpArgs = [
	{
		name: "[comando]",
		explaination: "Il comando di cui vuoi sapere più informazioni"
	}
];

function execute(message: Message, args: string[], data: Data): Promise<any> {

	const user = message.author;

	if (args.length == 0) {

		const embed: MessageEmbedOptions = {

			color: 0x104eb2,
			title: "Aiuto",
			author: { name: message.author.username, iconURL: message.author.defaultAvatarURL },
			description: "Messaggio di aiuto con tutti i comandi e le loro spiegazioni",
			fields: [],
			timestamp: new Date()

		};

		for (const command of data.commands.values()) {

			const field: EmbedField = {
				name: `\`${command.name}\``,
				value: command.helpMessage,
				inline: true
			};

			embed.fields!.push(field);

		}

		return user.send({ embeds: [embed] });
	}

	const commandName = args[0]!;
	if (!data.commands.has(commandName)) return user.send(`Non sono riuscito a trovare il comando \`${commandName}\``);
	const command = data.commands.get(commandName)!;

	const embed: MessageEmbedOptions = {

		color: 0x104eb2,
		title: commandName,
		author: { name: message.author.username, iconURL: message.author.defaultAvatarURL },
		description: command.helpMessage,
		fields: [{ name: "Synax", value: `\`${command.syntax}\``, inline: false }],
		timestamp: new Date()

	};

	for (const arg of command.helpArgs) {
		embed.fields!.push({
			name: arg.name,
			value: arg.explaination,
			inline: true
		});
	}

	return user.send({ embeds: [embed] });


}

export {
	name,
	minArgs,
	maxArgs,
	syntax,
	helpMessage,
	helpArgs,
	execute
};
