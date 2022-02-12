module.exports = {

	name: 'help',
	minArgs: 0,
	maxArgs: 1,
	syntax: 'help [command]',
	args: [
		{
			name: 'command',
			explaination: 'The command you want to know more about'
		}
	],
	helpMessage: 'Send this message',

	execute: function(args, message, client) {

		const channel = message.author.dmChannel;

		if(args.length == 0) {

			const embed = {

				color: 0x104eb2,
				title: 'Help',
				author: { name: message.author.username, iconURL: message.author.avatarURL },
				description: 'Help message with all the commands and their explaination',
				fields: []
				// timestamp: new Date(),

			};

			for(const command of client.commands.values()) {

				embed.fields.push({
					name: `\`${command.name}\``,
					value: command.helpMessage,
					inline: true
				});

			}

			return channel.send({ embeds:[embed] });
		}

		const commandName = args[0];
		if(!client.commands.has(commandName)) return channel.send(`Could not find the \`${commandName}\` command`);
		const command = client.commands.get(commandName);

		const embed = {

			color: 0x104eb2,
			title: commandName,
			author: { name: message.author.username, iconURL: message.author.avatarURL },
			description: command.helpMessage,
			fields: [{ name: 'Synax', value: `\`${command.syntax}\``, inline: false }]
			// timestamp: new Date(),

		};

		for(const arg of command.args) {
			embed.fields.push({
				name: arg.name,
				value: arg.explaination,
				inline: true
			});
		}

		channel.send({ embeds: [embed] });

	}

};