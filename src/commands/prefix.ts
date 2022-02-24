import { Message } from "discord.js";
import { Data } from "../index";

const name = "prefix";
const minArgs = 1;
const maxArgs = 1;
const syntax = "prefix <nuovo prefisso>";
const helpMessage = "Cambia il prefisso per i comandi del bot";
const helpArgs = [
	{
		name: "<nuovo prefisso>",
		explaination: "Il nuovo prefisso per i comandi del bot"
	}
];

async function execute(message: Message, args: string[], data: Data) {

	data.config.set("prefix", args[0]!);
	data.database.connect().then(client => {
		client.query(`UPDATE config SET value='${args[0]!}' WHERE name='prefix';`);
	}).catch(err => console.error(err));

	message.reply(`Il prefisso è stato cambiato a \`${args[0]}\``);
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