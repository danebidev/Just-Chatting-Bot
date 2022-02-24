import { Message } from "discord.js";
import { Data } from "../index";

const name = "debug";
const minArgs = 0;
const maxArgs = 0;
const syntax = "debug";
const helpMessage = "Aiuta questo povero developer a smattare un po' di meno";
const helpArgs: {name: string, explaination: string}[] = [];

// eslint-disable-next-line no-unused-vars
function execute(message: Message, _args: string[], _data: Data) {

	const embed = {
		title: "Test",
		description: `<@${message.author.id}> Bump done!`
	};

	message.reply({ embeds: [embed] });

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