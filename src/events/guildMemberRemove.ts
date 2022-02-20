import Discord = require("discord.js");
import { Data } from "../index";

export = {

	name: 'guildMemberRemove',

	execute: async function(member: Discord.GuildMember, data: Data) {

		if(data.bumps.get(member.id)! <= 0) return;

		const guild = await data.client.guilds.fetch(/*'917119141511589959'*/'748232983768465408');
		const channel = await guild.channels.fetch(/*'927603928252702820'*/'836579149107691580') as Discord.TextChannel;
		const message = (await channel!.messages!.fetch()).filter((m) => m.content.startsWith(`<@${member.id}>`)).first()!;

		await message.delete();

	}

};