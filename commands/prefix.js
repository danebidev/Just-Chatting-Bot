const fs = require('fs');

module.exports = {

	name: 'prefix',
	args: '<new prefix>',

	execute: function(args, event, client) {

		client.config.prefix = args[0];
		fs.writeFile('./config.json', JSON.stringify(client.config), err => {
			if(err) return console.error(err);
		});

	},

	getArgs: function(prefix) {
		return prefix + this.args;
	}

};