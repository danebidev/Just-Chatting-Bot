import { Message } from "discord.js";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, StreamType } from "@discordjs/voice";
import { readdirSync, createReadStream } from "fs";
import { Data } from "../index";

const name = "audio";
const minArgs = 1;
const maxArgs = 2;
const syntax = "audio <audio da riprodurre>";
const helpMessage = "Riproduci un audio";
const helpArgs = [
	{
		name: "<audio da riprodurre>",
		explanation: "Il nome dell'audio da riprodurre"
	}
];

function execute(message: Message, args: string[], _data: Data) {

	if(!message.member!.voice.channel) return message.reply("Non sei in un canale vocale!");
	if(message.channel.type == "DM") return message.reply("Questo comando funziona solo nei server");

	const audioName = getAudio(args);
	if(!audioName) return message.reply("L'audio specificato non è stato trovato");

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

	const resource = createAudioResource(createReadStream(`./audio/${audioName}`), {
		inputType: StreamType.Arbitrary,
	});

	player.on(AudioPlayerStatus.Idle, () => {
		connection.destroy();
	});

	return player.play(resource);

}

function getAudio(args: string[]) {

	const audios = readdirSync("./audio");
	let audioName = "";

	if(args[1]) {

		audioName = `${args[0]!.toLowerCase()} ${args[1].toLowerCase()}.ogg`;
		if(!audios.includes(audioName)) return null;

	} else if (args[0]!.length == 2) {

		for(const audio of audios) {

			const split = audio.substring(0, audio.length - 4).split(" ");
			if(split[0]!.at(0) == args[0]!.at(0) && split[1]!.at(0) == args[0]!.at(1)) {
				audioName = audio;
				break;
			}

		}

		if(audioName == "") return null;

	} else {
		return null;
	}

	return audioName;

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
