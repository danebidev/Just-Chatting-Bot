module.exports = {

	name: 'debug',
	minArgs: 0,
	maxArgs: 0,
	syntax: 'debug',
	args: [],
	helpMessage: 'Aiuta questo povero developer a smattare un po\' di meno',

	execute: function(args, message, client) {

		const embed = {
			title: 'Test',
			description: '<@441231462759661569> Bump done!'
		};

		message.reply({ embeds: [embed] });

	},

};