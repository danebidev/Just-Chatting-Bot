const bumpCount = require('../misc/bumpCount');

module.exports = {

	name: 'bump-increase',
	minArgs: 0,
	maxArgs: 2,
	syntax: 'bump-increase <menzione all\'utente> [quantità]',
	args: [
		{
			name: '<menzione all\' utente>',
			explaination: 'Una menzione(@nome dell\' utente) dell\' utente di cui vuoi incrementare i bump'
		},
		{
			name: '[quantità]',
			explaination: 'Di quanto aumentare i bump dell\'utente'
		}
	],
	helpMessage: 'Aiuta questo povero developer a smattare un po\' di meno',

	execute: function(args, message, client) {

		client.users.fetch(args[0].replaceAll(/@|<|>|!/g, '')).then(user => {

			if(!args[1]) return bumpCount.incrementBump(user, 1, client);
			bumpCount.incrementBump(user, Number(args[1]), client);

		});

	},

};