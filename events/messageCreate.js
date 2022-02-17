const bumpCount = require('../misc/bumpCount');

module.exports = {

	name: 'messageCreate',

	execute: async function(message, client) {

		if(message.author.id == '302050872383242240') return bumpCount.autoBumpCount(message, client);

		message.content = message.content.trim();

		if(message.content.substring(0, client.config.prefix.length) != client.config.prefix || message.author.bot) return;

		const guild = await client.guilds.cache.get('917119141511589959');
		const role = await guild.roles.cache.get('942820621744742432');
		const member = await guild.members.cache.get(message.author.id);

		if(await !member.roles.cache.has(role.id)) return;

		const args = message.content.split(/\s+/);
		const commandName = args.shift().substring(client.config.prefix.length).toLowerCase();

		if(!client.commands.has(commandName)) return;

		const command = client.commands.get(commandName);

		if(args.length < command.minArgs || args.length > command.maxArgs) return message.reply(`Gli argomenti non sono validi! Scrivi \`${client.config.prefix}help\` per aiuto su come usare questo comando`);

		command.execute(args, message, client);

	}

};