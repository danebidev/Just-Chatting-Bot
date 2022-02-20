import Discord = require('discord.js');
import bumpCount = require('../misc/bumpCount');
import { Data } from '../index';

export = {

	name: 'bump-increase',
	minArgs: 1,
	maxArgs: 2,
	syntax: 'bump-increase <menzione all\'utente> [quantità]',
	args: [
		{
			name: '<menzione dell\' utente>',
			explaination: 'Una menzione(@nome dell\' utente) dell\' utente di cui vuoi Aumenta i bump'
		},
		{
			name: '[quantità]',
			explaination: 'Di quanto aumentare i bump dell\'utente'
		}
	],
	helpMessage: 'Aumenta i bump fatti da un utente',

	execute: async function (message: Discord.Message, args: string[], data: Data) {

		const user = await data.client.users.fetch(args[0]!.replaceAll(/@|<|>|!/g, ''))

		if (!args[1]) return await bumpCount.changeBumps(user, 1, data);

		const quant = Number(args[1]);
		if (!quant || quant <= 0) return message.reply('Il numero inserito non è valido.');
		
		await bumpCount.changeBumps(user, Number(args[1]), data);
		return message.reply('Bump aumentati con successo');

	},

};