import { Message, User, TextChannel, Guild, Role } from "discord.js";
import { logBump } from "./logging";
import { Data } from "..";

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

async function updateMessage(user: User, newValue: number, data: Data) {

	const channel = (data.config!.get("bumpCountChannel") as TextChannel);
	const message = (await channel.messages.fetch()).filter((m: Message) => m.content.startsWith(`<@${user.id}>`)).first()!;

	if (newValue <= 0 && message) return message.delete();

	if (!message && newValue >= 1) return channel.send(`<@${user.id}>: ${newValue}`);
	return message.edit(`<@${user.id}>: ${newValue}`);

}

async function updateRoles(user: User, newValue: number, data: Data) {

	const member = await (data.config!.get("guild") as Guild).members.fetch(user.id);
	const bumpatoreRole = data.config!.get("bumpatoreRole") as Role;

	if(newValue < 50) return;
	if(newValue >= 50 && newValue < 100) member.roles.add(bumpatoreRole);
	if(newValue >= 100) {
		member.roles.remove(bumpatoreRole);
		member.roles.add(data.config!.get("bumpatorePlusRole") as Role);
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