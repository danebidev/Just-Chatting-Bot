const fs = require('fs');

module.exports = {

	name: 'prefix',
	minArgs: 1,
	maxArgs: 1,
	syntax: 'prefix <nuovo prefisso>',
	args: [
		{
			name: 'nuovo prefisso',
			explaination: 'Il nuovo prefisso per i comandi del bot'
		}
	],
	helpMessage: 'Cambia il prefisso per i comandi del bot',

	execute: function(args, message, client) {

		client.config.prefix = args[0];
		fs.writeFile('./config.json', JSON.stringify(client.config, null, 2), err => {
			if(err) return console.error(err);
		});
		message.reply(`Il prefisso è stato cambiato a \`${client.config.prefix}\``);

	}

};