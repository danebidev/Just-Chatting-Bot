import Discord = require('discord.js');
import { Data } from '../index';

export = {

	name: 'debug',
	minArgs: 0,
	maxArgs: 0,
	syntax: 'debug',
	args: [],
	helpMessage: 'Aiuta questo povero developer a smattare un po\' di meno',

	execute: function(message: Discord.Message, _args: string[], _data: Data) {

		const embed = {
			title: 'Test',
			description: `<@${message.author.id}> Bump done!`
		};

		message.reply({ embeds: [embed] });

	},

};