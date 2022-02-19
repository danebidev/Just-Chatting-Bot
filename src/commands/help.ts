module.exports = {

	name: 'help',
	minArgs: 0,
	maxArgs: 1,
	syntax: 'help [comando]',
	args: [
		{
			name: '[comando]',
			explaination: 'Il comando di cui vuoi sapere più informazioni'
		}
	],
	helpMessage: 'Ti dà più informazioni sui comandi',

	execute: function(args, message, client) {

		const user = message.author;

		if (args.length == 0) {

			const embed = {

				color: 0x104eb2,
				title: 'Aiuto',
				author: { name: message.author.username, iconURL: message.author.avatarURL },
				description: 'Messaggio di aiuto con tutti i comandi e le loro spiegazioni',
				fields: []
				// timestamp: new Date(),

			};

			for (const command of client.commands.values()) {

				embed.fields.push({
					name: `\`${command.name}\``,
					value: command.helpMessage,
					inline: true
				});

			}

			return user.send({ embeds: [embed] });
		}

		const commandName = args[0];
		if (!client.commands.has(commandName)) return user.send(`Non sono riuscito a trovare il comando \`${commandName}\``);
		const command = client.commands.get(commandName);

		const embed = {

			color: 0x104eb2,
			title: commandName,
			author: { name: message.author.username, iconURL: message.author.avatarURL },
			description: command.helpMessage,
			fields: [{ name: 'Synax', value: `\`${command.syntax}\``, inline: false }]
			// timestamp: new Date(),

		};

		for (const arg of command.args) {
			embed.fields.push({
				name: arg.name,
				value: arg.explaination,
				inline: true
			});
		}

		user.send({ embeds: [embed] });


	}

};