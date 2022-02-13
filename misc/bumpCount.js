const fs = require('fs');

module.exports = {

	execute: function(botMessage, client) {

		const embed = botMessage.embeds[0];
		if (!embed || !embed.description.includes('Bump done!')) return;

		client.users.fetch(embed.description.split(' ')[0].replaceAll(/@|<|>/g, '')).then(user => this.incrementBump(user, 1, client));
	},

	incrementBump: function(user, quant, client) {

		client.bumps[user.id] = client.bumps[user.id] + quant;
		fs.writeFile('./bumps.json', JSON.stringify(client.bumps, null, 2), err => {
			if (err) return console.error(err);
		});

		const channel = client.channels.cache.get('836579149107691580');

		if (client.bumps[user.id] == 1) return channel.send(`<@${user.id}>: ${quant}`);

		channel.messages.fetch({ limit: 100 }).then(messages => {
			messages.forEach(message => {
				if (message.content.split(' ')[0].replaceAll(/@|<|>|:/g, '') == user.id) {
					message.edit(`<@${user.id}>: ${client.bumps[user.id]}`);
				}
			});
		});

	}

};