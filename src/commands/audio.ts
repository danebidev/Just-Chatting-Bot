import { Guild, Message } from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";
import { Data } from "../index";

const name = "audio";
const minArgs = 1;
const maxArgs = 1;
const syntax = "audio <audio da riprodurre>";
const helpMessage = "Riproduci un audio";
const helpArgs = [
	{
		name: "<audio da riprodurre>",
		explaination: "Il nome dell'audio da riprodurre"
	}
];

function execute(message: Message, args: string[], data: Data) {

	if(!message.member!.voice.channel) return message.reply("Non sei in un canale vocale!");
	if(message.channel.type == "DM") return message.reply("Questo comando funziona solo nei server");

	joinVoiceChannel({
		channelId: message.member!.voice.channelId!,
		guildId: message.guildId!,
		adapterCreator: message.guild!.voiceAdapterCreator
	});

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