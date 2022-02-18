module.exports = {

	changeBumps: async function(user, quant, client) {

		const newValue = (client.bumps.get(user.id) || 0) + quant;
		const dbClient = await client.database.connect();

		if(newValue <= 0) {

			await dbClient.query(`DELETE FROM bumps WHERE id='${user.id}';`);
			client.bumps.delete(user.id);
			dbClient.release();
			this.updateMessage(user, newValue, client);

		} else {

			if(!client.bumps.has(user.id)) await dbClient.query(`INSERT INTO bumps (id, bumps) VALUES ('${user.id}', ${newValue})`);
			await dbClient.query(`UPDATE bumps SET bumps = ${newValue} WHERE id='${user.id}'`);
			client.bumps.set(user.id, newValue);

		}

		dbClient.release();
		this.updateMessage(user, newValue, client);
		this.updateRoles(user, newValue, client);

	},

	updateMessage: async function(user, newValue, client) {

		const guild = await client.guilds.fetch('917119141511589959');
		const channel = await guild.channels.fetch('927603928252702820');
		const message = (await channel.messages.fetch()).filter((m) => m.content.startsWith(`<@${user.id}>`)).first();

		if(newValue <= 0 && message) return message.delete();

		if(!message && newValue >= 1) return channel.send(`<@${user.id}>: ${newValue}`);
		message.edit(`<@${user.id}>: ${newValue}`);

	},

	updateRoles: async function(user, newValue, client) {

		const guild = await client.guilds.fetch('917119141511589959');
		const bumpatoreRole = await guild.roles.fetch('923967135682813992');
		const bumpatorepRole = await guild.roles.fetch('928385637386690620');
		const member = await guild.members.fetch(user.id);

		if(await client.bumps.get(user.id) >= 50 && client.bumps.get(user.id) < 100 && !member.roles.cache.has(bumpatoreRole.id)) await member.roles.add(bumpatoreRole);
		if(await client.bumps.get(user.id) >= 100 && !member.roles.cache.has(bumpatorepRole.id)) await member.roles.add(bumpatorepRole);

	},

	autoBumpCount: function(botMessage, client) {

		const embed = botMessage.embeds[0];
		if (!embed || !embed.description.includes('Bump done!')) return;

		client.users.fetch(embed.description.split(' ')[0].replaceAll(/@|<|>/g, '')).then(user => this.changeBumps(user, 1, client));
	}

};
