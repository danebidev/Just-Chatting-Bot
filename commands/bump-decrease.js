const bumpCount = require('../misc/bumpCount');

module.exports = {

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

	execute: function(args, message, client) {

		client.users.fetch(args[0].replaceAll(/@|<|>|!/g, '')).then(user => {

			if(!args[1]) {
				return bumpCount.decreaseBumps(user, 1, client);
			}
			const quant = Number(args[1]);
			if(!quant || quant <= 0) return message.reply('Il numero inserito non è valido.');
			bumpCount.decreaseBumps(user, Number(args[1]), client);
			message.reply('Bump diminuiti con successo');

		}).catch(err => {
			message.reply('Non sono riuscito a trovare l\'utente che stai cercando (Probabilmente).');
			console.error(err);
		});

	},

};