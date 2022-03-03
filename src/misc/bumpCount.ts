import { Message, User, TextChannel } from "discord.js";
import { logBump } from "./logging";
import { Data } from "../index";

async function changeBumps(user: User, quant: number, data: Data, author?: User, reason?: string) {

	const newValue = (data.bumps.get(user.id) || 0) + quant;
	const dbClient = await data.database.connect();

	if (newValue <= 0) {

		await dbClient.query(`DELETE FROM bumps WHERE id='${user.id}';`);
		data.bumps.delete(user.id);

	} else {

		if (!data.bumps.has(user.id)) await dbClient.query(`INSERT INTO bumps (id, bumps) VALUES ('${user.id}', ${newValue})`);
		await dbClient.query(`UPDATE bumps SET bumps = ${newValue} WHERE id='${user.id}'`);
		data.bumps.set(user.id, newValue);

	}

	dbClient.release();

	updateMessage(user, newValue, data);
	updateRoles(user, newValue, data);
	logBump({ user: user, oldValue: newValue - quant, newValue: newValue, changeAuthor: author, reason: reason }, data);

}

async function updateMessage(user: User, newValue: number, data: Data): Promise<any> {

	const guild = await data.client.guilds.fetch("917119141511589959");
	const channel = await guild.channels.fetch("927603928252702820") as TextChannel;
	const message = (await channel.messages.fetch()).filter((m: Message) => m.content.startsWith(`<@${user.id}>`)).first()!;

	if (newValue <= 0 && message) return message.delete();

	if (!message && newValue >= 1) return channel.send(`<@${user.id}>: ${newValue}`);
	message.edit(`<@${user.id}>: ${newValue}`);

}

async function updateRoles(user: User, newValue: number, data: Data) {

	const guild = await data.client.guilds.fetch("917119141511589959");
	const bumpatoreRole = (await guild.roles.fetch("923967135682813992"))!;
	const bumpatorepRole = (await guild.roles.fetch("928385637386690620"))!;
	const member = await guild.members.fetch(user.id);

	if(newValue < 50) return;
	if(newValue >= 50 && newValue < 100) member.roles.add(bumpatoreRole);
	if(newValue >= 100) {
		member.roles.remove(bumpatoreRole);
		member.roles.add(bumpatorepRole);
	}

	return;
}

function autoBumpCount(botMessage: Message, data: Data) {

	const embed = botMessage.embeds[0];
	if (!embed || !embed.description!.includes("Bump done!")) return;

	data.client.users.fetch(embed.description!.split(" ")[0]!.replaceAll(/@|<|>/g, "")).then(user => changeBumps(user, 1, data));

}

export {
	changeBumps,
	autoBumpCount
};