import { User, MessageEmbedOptions, GuildTextBasedChannel } from "discord.js";
import { Data } from "..";

async function logBump(bump: { user: User, oldValue: number, newValue: number, changeAuthor?: User, reason?: string }, data: Data) {

	const embed: MessageEmbedOptions = {

		color: bump.newValue - bump.oldValue < 0 ? 0xff0000 : 0x00ff00,
		title: bump.changeAuthor ? "Manual bump change" : "Auto bump change",
		author: {
			name: bump.changeAuthor ? bump.changeAuthor.username : bump.user.username,
			iconURL: bump.changeAuthor ? bump.changeAuthor.defaultAvatarURL : bump.user.defaultAvatarURL
		},
		description: `**User:** <@${bump.user.id}>\n**Before:** ${bump.oldValue}\n**After:** ${bump.newValue}`,
		fields: [],
		timestamp: new Date()

	};

	if (bump.changeAuthor && bump.reason) embed.description += `\n**Change author:** <@${bump.changeAuthor.id}>\n**Reason:** ${bump.reason}`;
	(data.config!.get("bumpLogChannel") as GuildTextBasedChannel).send({ embeds: [embed] });
}

export {
	logBump
};