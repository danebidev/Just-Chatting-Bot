import { Message } from "discord.js";
import { changeBumps } from "../misc/bumpCount";
import { getIdByMention } from "../misc/util";
import { Data } from "../index";

const name = "bump-decrease";
const minArgs = 3;
const maxArgs = 3;
const syntax = "bump-decrease <menzione dell'utente> [quantità]";
const helpMessage = "Diminuisci i bump fatti da un utente";
const helpArgs = [
	{
		name: "<menzione all' utente>",
		explanation: "Una menzione(@nome dell' utente) dell' utente di cui vuoi diminuire i bump"
	},
	{
		name: "<quantità>",
		explanation: "Di quanto diminuire i bump dell'utente"
	},
	{
		name: "<ragione>",
		explanation: "La ragione per cui si ha diminuito i bump"
	}
];

async function execute(message: Message, args: string[], data: Data) {

	const id = getIdByMention(args[0]);
	if(!id) return message.reply("La menzione dell'utente non è valida");

	const user = await data.client.users.fetch(id);

	if (!args[1]) return await changeBumps(user, -1, data, message.author, args[2]);

	const quant = Number(args[1]);
	if (!quant || quant <= 0) return message.reply("Il numero inserito non è valido.");

	await changeBumps(user, -Number(args[1]), data, message.author, args[2]);
	message.reply("Bump diminuiti con successo");

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