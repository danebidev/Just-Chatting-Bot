const bumpCount = require('../misc/bumpCount');

module.exports = {

	name: 'messageCreate',

	execute: function(message, client) {

		// eslint-disable-next-line no-inline-comments
		if(message.author.id == /* '302050872383242240'*/'942383043526656040') return bumpCount.execute(message, client);

		message.content = message.content.trim();

		if(message.content.substring(0, client.config.prefix.length) != client.config.prefix || message.author.bot) return;

		const args = message.content.split(/\s+/);
		const commandName = args.shift().substring(client.config.prefix.length).toLowerCase();

		if(!client.commands.has(commandName)) return;

		const command = client.commands.get(commandName);

		if(args.length < command.minArgs || args.length > command.maxArgs) return message.reply(`Gli argomenti non sono validi! Scrivi \`${client.config.prefix}help\` per aiuto su come usare questo comando`);

		command.execute(args, message, client);

	}

};