import { Client, Collection, Guild } from "discord.js";
import { readdirSync, existsSync, mkdirSync, createWriteStream } from "fs";
import { Storage } from "megajs";
import { Command, Data } from "../index";

async function downloadAudios() {

	if (!existsSync("./audio")) {
		mkdirSync("./audio");
	}

	const mega = await new Storage({
		email: process.env["MEGAEMAIL"]!,
		password: process.env["MEGAPASSWORD"]!,
		userAgent: "Just Chatting Bot/1.0"
	}).ready;

	const audios = mega.root.children!.find(folder => folder.name == "audios")!.children!;
	const audioFiles = readdirSync("./audio");

	for(const file of audios) {

		if(audioFiles.includes(file.name!)) continue;
		const stream = createWriteStream(`./audio/${file.name}`);
		file.download({}).pipe(stream);

	}
}

function registerEvents(data: Data) {

	const eventFiles = readdirSync("./src/events").filter(file => file.endsWith(".ts"));

	for(const file of eventFiles) {
		const event = require(`../events/${file}`);
		data.client.on(event.name, eventData => event.execute(eventData, data));
	}

}

function readCommands(): Collection<string, Command> {

	const commands = new Collection<string, Command>();
	const commandFiles = readdirSync("./src/commands").filter(file => file.endsWith(".ts"));

	for(const file of commandFiles) {
		const command = require(`../commands/${file}`);
		commands.set(command.commandData.name, command);
	}

	return commands;

}

async function readConfig(client: Client) {

	const configuration = new Collection<string, any>();

	configuration.set("guild", await client.guilds.fetch(process.env["GUILDID"]!));
	configuration.set("bumpCountChannel", await (configuration.get("guild") as Guild).channels.fetch(process.env["BUMPCOUNTCHANNELID"]!));
	configuration.set("bumpLogChannel", await (configuration.get("guild") as Guild).channels.fetch(process.env["BUMPLOGCHANNELID"]!));
	configuration.set("bumpatoreRole", await (configuration.get("guild") as Guild).roles.fetch(process.env["BUMPATOREROLEID"]!));
	configuration.set("bumpatorePlusRole", await (configuration.get("guild") as Guild).roles.fetch(process.env["BUMPATOREPLUSROLEID"]!));

	return configuration;
}

export {
	downloadAudios,
	registerEvents,
	readCommands,
	readConfig
};
