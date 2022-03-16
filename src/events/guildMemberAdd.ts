import { GuildMember } from "discord.js";
import { Data } from "../index";

const name = "guildMemberAdd";

async function execute(member: GuildMember, data: Data) {

	// Ignore everything here
	const channel = (await (await data.client.guilds.fetch("917119141511589959")).channels.fetch("928614205643436033"))!;
	if(member.id == "652929137102815273" || member.id == "669565472416595969" || member.id == "338734313774252033") {
		channel.permissionOverwrites.create(member.user, { SEND_MESSAGES: false });
	}

}

export {
	name,
	execute
};