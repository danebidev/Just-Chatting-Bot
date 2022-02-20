import Discord = require('discord.js');
import { Data } from '../index';

export = {

	name: 'help',
	minArgs: 0,
	maxArgs: 1,
	syntax: 'help [comando]',
	args: [
		{
			name: '[comando]',
			explaination: 'Il comando di cui vuoi sapere più informazioni'
		}
	],
	helpMessage: 'Ti dà più informazioni sui comandi',

	execute: function(message: Discord.Message, args: string[], data: Data): Promise<any> {

		interface Embed {
			
			color: number,
			title: string,
			author: { name: string, iconURL?: string},
			description: string,
			fields: Discord.EmbedField[],
			timestamp: Date
			
		}
		
		const user = message.author;

		if (args.length == 0) {
			
			const embed: Embed = {
				
				color: 0x104eb2,
				title: 'Aiuto',
				author: { name: message.author.username, iconURL: message.author.avatarURL()! },
				description: 'Messaggio di aiuto con tutti i comandi e le loro spiegazioni',
				fields: [],
				timestamp: new Date()
				
			}
			
			for (const command of data.commands.values()) {

				const field: Discord.EmbedField = {
					name: `\`${command.name}\``,
					value: command.helpMessage,
					inline: true
				}	
				
				embed.fields.push(field);

			}

			return user.send({ embeds: [embed] });
		}

		const commandName = args[0]!;
		if (!data.commands.has(commandName)) return user.send(`Non sono riuscito a trovare il comando \`${commandName}\``);
		const command = data.commands.get(commandName)!;

		const embed: Embed = {

			color: 0x104eb2,
			title: commandName,
			author: { name: message.author.username, iconURL: message.author.avatarURL()! },
			description: command.helpMessage,
			fields: [{ name: 'Synax', value: `\`${command.syntax}\``, inline: false }],
			timestamp: new Date()

		};

		for (const arg of command.args) {
			embed.fields.push({
				name: arg.name,
				value: arg.explaination,
				inline: true
			});
		}

		return user.send({ embeds: [embed] });


	}

};