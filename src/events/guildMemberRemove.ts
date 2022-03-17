import { GuildMember, TextChannel } from "discord.js";
import { Data } from "../index";

const name = "guildMemberRemove";

async function execute(member: GuildMember, data: Data) {

	if(member.roles.cache.has("947599298655305758")) (await member.guild.members.fetch("429181658990772225")).send(`Il partner ${member.user.username}`);
	if (data.bumps.get(member.user.id)! <= 0) return;

	const message = (await (data.config!.get("bumpCountChannel") as TextChannel).messages!.fetch()).filter((m) => m.content.startsWith(`<@${member.user.id}>`)).first()!;

	await message.delete();

}

export {
	name,
	execute
};