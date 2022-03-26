import { CommandInteraction, GuildMember } from "discord.js";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, StreamType } from "@discordjs/voice";
import { readdirSync, createReadStream } from "fs";
import { Command, CommandData, Data } from "../index";
import { downloadAudios } from "../misc/util";

async function execute(interaction: CommandInteraction, _data: Data) {

	if (!(interaction.member! as GuildMember).voice.channel) return interaction.reply({ content: "Non sei in un canale vocale!", ephemeral: true });
	if (interaction.channel!.type == "DM") return interaction.reply({ content: "Questo comando funziona solo nei server", ephemeral: true });

	const audioName = interaction.options.getString("audio")!;
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

const commandData: CommandData = {
	name: "audio",
	description: "Riproduci un audio nel tuo canale attuale",
	default_permission: true,
	options: [
		{
			name: "audio",
			description: "L'audio da riprodurre",
			type: 3,
			required: true,
			choices: []
		}
	]
};

async function initData(_commands: Command[]) {
	await downloadAudios();
	const audios = readdirSync("./audio");
	for (const audio of audios) {
		commandData.options![0]!.choices!.push({ name: audio.split(".")[0]!, value: audio });
	}
}

export {
	execute,
	commandData,
	initData
};