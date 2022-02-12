module.exports = {

	name: 'messageCreate',

	execute: function(event, client) {

		event.content = event.content.trim();

		if(event.content.substring(0, client.config.prefix.length) != client.config.prefix) return;

		const args = event.content.split(/\s+/);
		const command = args.shift().substring(client.config.prefix.length);

		if(!client.commands.has(command)) return;

		client.commands.get(command).execute(args, event, client);

	}

};