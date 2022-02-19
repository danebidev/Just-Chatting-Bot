const bumpCount = require('../misc/bumpCount');

module.exports = {

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

	execute: function(args, message, client) {

		client.users.fetch(args[0].replaceAll(/@|<|>|!/g, '')).then(user => {

			if(!args[1]) return bumpCount.changeBumps(user, 1, client);

			const quant = Number(args[1]);
			if(!quant || quant <= 0) return message.reply('Il numero inserito non è valido.');
			bumpCount.changeBumps(user, Number(args[1]), client);
			message.reply('Bump aumentati con successo');

		}).catch(err => {
			message.reply('Non sono riuscito a trovare l\'utente che stai cercando (Probabilmente).');
			console.error(err);
		});

	},

};