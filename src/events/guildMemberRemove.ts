import { GuildMember, TextChannel } from "discord.js";
import { Data } from "../index";

const name = "guildMemberRemove";

async function execute(member: GuildMember, data: Data) {

	if (data.bumps.get(member.id)! <= 0) return;

	const guild = await data.client.guilds.fetch("917119141511589959");
	const channel = await guild.channels.fetch("927603928252702820") as TextChannel;
	const message = (await channel!.messages!.fetch()).filter((m) => m.content.startsWith(`<@${member.id}>`)).first()!;

	await message.delete();

}

export {
	name,
	execute
};