import { CommandInteraction, GuildMember } from "discord.js";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, StreamType } from "@discordjs/voice";
import { readdirSync, createReadStream } from "fs";
import { Data } from "../index";
import { SlashCommandBuilder } from "@discordjs/builders";

const commandData = new SlashCommandBuilder()
	.setName("audio")
	.setDescription("Riproduci un audio")
	.addStringOption(option => option
		.setName("audio")
		.setDescription("L'audio da riprodurre")
		.setRequired(true));

const syntax = "audio <audio da riprodurre>";

async function execute(interaction: CommandInteraction, _data: Data) {

	if (!(interaction.member! as GuildMember).voice.channel) return interaction.reply({ content: "Non sei in un canale vocale!", ephemeral: true });
	if (interaction.channel!.type == "DM") return interaction.reply({ content: "Questo comando funziona solo nei server", ephemeral: true });

	const audioName = getAudio(interaction);
	if (!audioName) return interaction.reply({ content: "L'audio specificato non è stato trovato", ephemeral: true });

	const player = createAudioPlayer({
		behaviors: {
			noSubscriber: NoSubscriberBehavior.Pause
		}
	});

	const resource = createAudioResource(createReadStream(`./audio/${audioName}`), {
		inputType: StreamType.Arbitrary,
	});

	player.play(resource);

	const member = interaction.member as GuildMember;

	const connection = joinVoiceChannel({
		channelId: member.voice.channel!.id,
		guildId: member.guild.id,
		adapterCreator: member.guild.voiceAdapterCreator
	});

	connection.subscribe(player);

	player.on(AudioPlayerStatus.Idle, () => {
		connection.destroy();
	});

	return interaction.reply("Riproduzione audio iniziata");

}

function getAudio(interaction: CommandInteraction) {

	const inputAudio = interaction.options.getString("audio")!.split(/\s+/);
	const audios = readdirSync("./audio");
	let audioName = "";
	if (inputAudio.length > 2) return interaction.reply("L'audio non è valido!");

	if (inputAudio.length == 2) {

		audioName = `${inputAudio[0]!.toLowerCase()} ${inputAudio[1]!.toLowerCase()}-${inputAudio[0]!.at(0)! + inputAudio[1]!.at(0)!}.ogg`;
		if (!audios.includes(audioName)) return null;

	} else if (inputAudio[0]!.length == 2) {

		for (const audio of audios) {
			if (audio.includes(inputAudio[0]!)) {
				audioName = audio;
				break;
			}
		}
	}

	if (audioName == "") return null;

	return audioName;

}

export {
	commandData,
	syntax,
	execute
};
