import Discord = require("discord.js");
import bumpCount = require("../misc/bumpCount");
import { Data } from "../index";

export = {

	name: "messageCreate",

	execute: async function(message: Discord.Message, data: Data) {

		if(message.author.id == "302050872383242240") return bumpCount.autoBumpCount(message, data);

		const prefix = data.config.get("prefix")!;

		message.content = message.content.trim();
		if(message.content.substring(0, prefix.length) != prefix || message.author.bot) return;

		const guild = data.client.guilds.cache.get("917119141511589959")!;
		const role = guild.roles.cache.get("942820621744742432")!;
		const member = guild.members.cache.get(message.author.id)!;

		if(!member.roles.cache.has(role.id)) return;

		const args = message.content.split(/\s+/);
		const commandName = args.shift()!.substring(prefix.length).toLowerCase();

		if(!data.commands.has(commandName)) return;

		const command = data.commands.get(commandName)!;

		if(args.length < command.minArgs || args.length > command.maxArgs) return message.reply(`Gli argomenti non sono validi! Scrivi \`${prefix}help\` per aiuto su come usare questo comando`);

		command.execute(message, args, data);

	}

};