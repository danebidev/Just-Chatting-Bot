import { GuildMember, TextChannel } from "discord.js";
import { Data } from "../index";

const name = "guildMemberRemove";

async function execute(member: GuildMember, data: Data) {

	if (data.bumps.get(member.user.id)! <= 0) return;

	const message = (await (data.config!.get("bumpCountChannel") as TextChannel).messages!.fetch()).filter((m) => m.content.startsWith(`<@${member.user.id}>`)).first()!;

	await message.delete();

}

export {
	name,
	execute
};