import Discord = require('discord.js');
import { Data } from '../index';

export = {

	changeBumps: async function(user: Discord.User, quant: number, data: Data) {

		const newValue = (data.bumps.get(user.id) || 0) + quant;
		const dbClient = await data.database.connect();

		if(newValue <= 0) {

			await dbClient.query(`DELETE FROM bumps WHERE id='${user.id}';`);
			data.bumps.delete(user.id);
			dbClient.release();
			this.updateMessage(user, newValue, data);

		} else {

			if(!data.bumps.has(user.id)) await dbClient.query(`INSERT INTO bumps (id, bumps) VALUES ('${user.id}', ${newValue})`);
			await dbClient.query(`UPDATE bumps SET bumps = ${newValue} WHERE id='${user.id}'`);
			data.bumps.set(user.id, newValue);

		}

		dbClient.release();
		this.updateMessage(user, newValue, data);
		this.updateRoles(user, newValue, data);

	},

	updateMessage: async function(user: Discord.User, newValue: number, data: Data): Promise<any> {

		const guild = await data.client.guilds.fetch(/*'917119141511589959'*/'748232983768465408');
		const channel = await guild.channels.fetch(/*'927603928252702820'*/'836579149107691580') as Discord.TextChannel;
		const message = (await channel.messages.fetch()).filter((m: Discord.Message) => m.content.startsWith(`<@${user.id}>`)).first()!;

		if(newValue <= 0 && message) return message.delete();

		if(!message && newValue >= 1) return channel.send(`<@${user.id}>: ${newValue}`);
		message.edit(`<@${user.id}>: ${newValue}`);

	},

	updateRoles: async function(user: Discord.User, newValue: number, data: Data) {

		const guild = await data.client.guilds.fetch(/*'917119141511589959'*/'748232983768465408');
		const bumpatoreRole = (await guild.roles.fetch(/*'923967135682813992'*/'944941019252805652'))!;
		const bumpatorepRole = (await guild.roles.fetch(/*'928385637386690620'*/'944941123791630337'))!;
		const member = await guild.members.fetch(user.id);
		
		if(newValue < 50 && (member.roles.cache.has(bumpatoreRole.id) || member.roles.cache.has(bumpatorepRole.id))) {
			member.roles.remove(bumpatoreRole);
			member.roles.remove(bumpatorepRole);
		}
		
		if(newValue >= 50 && newValue < 100 && !member.roles.cache.has(bumpatoreRole.id)) member.roles.add(bumpatoreRole);
		if(newValue >= 50 && newValue < 100 && member.roles.cache.has(bumpatorepRole.id)) member.roles.remove(bumpatorepRole);
		
		if(newValue >= 100 && !member.roles.cache.has(bumpatorepRole.id)) member.roles.add(bumpatorepRole);
		if(newValue >= 100 && member.roles.cache.has(bumpatoreRole.id)) member.roles.remove(bumpatoreRole);
			
	},

	autoBumpCount: function(botMessage: Discord.Message, data: Data) {

		const embed = botMessage.embeds[0];
		if (!embed || !embed.description!.includes('Bump done!')) return;

		data.client.users.fetch(embed.description!.split(' ')[0]!.replaceAll(/@|<|>/g, '')).then(user => this.changeBumps(user, 1, data));
	}

};
