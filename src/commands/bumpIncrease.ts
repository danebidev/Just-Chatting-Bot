import { Message } from "discord.js";
import { changeBumps } from "../misc/bumpCount";
import { getIdByMention } from "../misc/util";
import { Data } from "../index";

const name = "bump-increase";
const minArgs = 1;
const maxArgs = 2;
const syntax = "bump-increase <menzione all'utente> [quantità]";
const helpMessage = "Aumenta i bump fatti da un utente";
const helpArgs = [
	{
		name: "<menzione dell' utente>",
		explaination: "Una menzione(@nome dell' utente) dell' utente di cui vuoi aumentare i bump"
	},
	{
		name: "[quantità]",
		explaination: "Di quanto aumentare i bump dell'utente"
	}
];

async function execute(message: Message, args: string[], data: Data) {

	const user = await data.client.users.fetch(getIdByMention(args[0]!));

	if (!args[1]) return await changeBumps(user, 1, message.author, data);

	const quant = Number(args[1]);
	if (!quant || quant <= 0) return message.reply("Il numero inserito non è valido.");

	await changeBumps(user, Number(args[1]), message.author, data);
	return message.reply("Bump aumentati con successo");

}

export {
	name,
	minArgs,
	maxArgs,
	syntax,
	helpMessage,
	helpArgs,
	execute
};