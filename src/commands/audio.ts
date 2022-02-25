import { Message } from "discord.js";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, StreamType } from "@discordjs/voice";
import { createReadStream } from "node:fs";
import { readdirSync } from "fs";
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

function execute(message: Message, args: string[], _data: Data) {

	if(!message.member!.voice.channel) return message.reply("Non sei in un canale vocale!");
	if(message.channel.type == "DM") return message.reply("Questo comando funziona solo nei server");

	const connection = joinVoiceChannel({
		channelId: message.member!.voice.channelId!,
		guildId: message.guildId!,
		adapterCreator: message.guild!.voiceAdapterCreator
	});

	const player = createAudioPlayer({
		behaviors: {
			noSubscriber: NoSubscriberBehavior.Play
		}
	});

	connection.subscribe(player);

	player.on("error", error => {
		console.error("Error:", error.message);
	});

	const audios = readdirSync("./audio");
	if(!audios.includes(args[0] + ".ogg")) return message.reply("L'audio specificato non esiste.");

	const resource = createAudioResource(createReadStream(`./audio/${args[0] + ".ogg"}`), {
		inputType: StreamType.Arbitrary,
	});

	player.on(AudioPlayerStatus.Idle, () => {
		connection.destroy();
	});

	return player.play(resource);

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
