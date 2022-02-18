module.exports = {

	name: 'guildMemberRemove',

	execute: async function(member, client) {

		if(client.bumps[member.id] <= 0) return;

		const guild = await client.guilds.fetch('917119141511589959');
		const channel = await guild.channels.fetch('927603928252702820');
		const message = (await channel.messages.fetch()).filter((m) => m.content.startsWith(`<@${member.id}>`)).first();

		await message.delete();

	}

};