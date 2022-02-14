const fs = require('fs');

module.exports = {

	execute: function(botMessage, client) {

		const embed = botMessage.embeds[0];
		if (!embed || !embed.description.includes('Bump done!')) return;

		client.users.fetch(embed.description.split(' ')[0].replaceAll(/@|<|>/g, '')).then(user => this.incrementBumps(user, 1, client));
	},

	incrementBumps: async function(user, quant, client) {

		if (client.bumps[user.id] == undefined) {
			client.bumps[user.id] = 0;
		}

		const channel = client.channels.cache.get('927603928252702820');

		if (client.bumps[user.id] == 0) channel.send(`<@${user.id}>: ${quant}`);

		client.bumps[user.id] = client.bumps[user.id] + quant;
		fs.writeFile('./bumps.json', JSON.stringify(client.bumps, null, 2), err => {
			if(err) return console.error(err);
		});

		channel.messages.fetch({ limit: 100 }).then(messages => {
			messages.forEach(message => {
				if (message.content.split(' ')[0].replaceAll(/@|<|>|:/g, '') == user.id) {
					message.edit(`<@${user.id}>: ${client.bumps[user.id]}`);
				}
			});
		});

		const guild = await client.guilds.cache.get('917119141511589959');
		const bumpatore = await guild.roles.cache.get('923967135682813992');
		const bumpatorePlus = await guild.roles.cache.get('928385637386690620');
		const member = await guild.members.cache.get(user.id);

		if(client.bumps[user.id] >= 50 && client.bumps[user.id] < 100 && !member.roles.cache.has(bumpatore.id)) member.roles.add(bumpatore);

		if(client.bumps[user.id] >= 100) {
			if(member.roles.cache.has(bumpatore.id)) member.roles.remove(bumpatore);
			member.roles.add(bumpatorePlus);
		}

	},

	decreaseBumps: function(user, quant, client) {

		client.bumps[user.id] = client.bumps[user.id] - quant;
		const channel = client.channels.cache.get('927603928252702820');

		if(client.bumps[user.id] <= 0) return this.deleteBumps(user, channel, client);

		fs.writeFile('./bumps.json', JSON.stringify(client.bumps, null, 2), err => {
			if (err) return console.error(err);
		});

		if (client.bumps[user.id] == 1) return channel.send(`<@${user.id}>: ${quant}`);

		channel.messages.fetch({ limit: 100 }).then(messages => {
			messages.forEach(message => {
				if (message.content.split(' ')[0].replaceAll(/@|<|>|:/g, '') == user.id) {
					message.edit(`<@${user.id}>: ${client.bumps[user.id]}`);
				}
			});
		});

	},

	deleteBumps: function(user, channel, client) {

		delete client.bumps[user.id];
		fs.writeFile('./bumps.json', JSON.stringify(client.bumps, null, 2), err => {
			if (err) return console.error(err);
		});

		channel.messages.fetch({ limit: 100 }).then(messages => {
			messages.forEach(message => {
				if (message.content.split(' ')[0].replaceAll(/@|<|>|:/g, '') == user.id) {
					message.delete();
				}
			});
		});

	}

};