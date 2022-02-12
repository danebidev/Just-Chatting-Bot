const fs = require('fs');

module.exports = {

	name: 'prefix',
	minArgs: 1,
	maxArgs: 1,
	syntax: 'prefix <new prefix>',
	args: [
		{
			name: 'new prefix',
			explaination: 'The new prefix for the bot commands'
		}
	],
	helpMessage: 'Change the bot commands prefix',

	execute: function(args, message, client) {

		client.config.prefix = args[0];
		fs.writeFile('./config.json', JSON.stringify(client.config, null, 2), err => {
			if(err) return console.error(err);
		});

	},

	getArgs: function(prefix) {
		return prefix + this.args;
	}

};