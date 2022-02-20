import Discord = require('discord.js');
import bumpCount = require('../misc/bumpCount');
import { Data } from '../index';

export = {

	name: 'bump-decrease',
	minArgs: 1,
	maxArgs: 2,
	syntax: 'bump-decrease <menzione dell\'utente> [quantità]',
	args: [
		{
			name: '<menzione all\' utente>',
			explaination: 'Una menzione(@nome dell\' utente) dell\' utente di cui vuoi diminuire i bump'
		},
		{
			name: '[quantità]',
			explaination: 'Di quanto diminuire i bump dell\'utente'
		}
	],
	helpMessage: 'Diminuisci i bump fatti da un utente',

	execute: async function (message: Discord.Message, args: string[], data: Data) {

		const user = await data.client.users.fetch(args[0]!.replaceAll(/@|<|>|!/g, ''))

		if (!args[1]) return await bumpCount.changeBumps(user, -1, data);
		
		const quant = Number(args[1]);
		if (!quant || quant <= 0) return message.reply('Il numero inserito non è valido.');
		
		await bumpCount.changeBumps(user, -Number(args[1]), data);
		message.reply('Bump diminuiti con successo');

	},

};