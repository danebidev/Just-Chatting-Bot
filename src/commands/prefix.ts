import Discord = require('discord.js');
import { Data } from '../index';

export = {

	name: 'prefix',
	minArgs: 1,
	maxArgs: 1,
	syntax: 'prefix <nuovo prefisso>',
	args: [
		{
			name: '<nuovo prefisso>',
			explaination: 'Il nuovo prefisso per i comandi del bot'
		}
	],
	helpMessage: 'Cambia il prefisso per i comandi del bot',

	execute: async function(message: Discord.Message, args: string[], data: Data) {

		data.config.set('prefix', args[0]!);
		data.database.connect().then(client => {
			client.query(`UPDATE config SET value='${args[0]!}' WHERE name='prefix';`);
		}).catch(err => console.error(err));

		message.reply(`Il prefisso è stato cambiato a \`${args[0]}\``);
	}

};