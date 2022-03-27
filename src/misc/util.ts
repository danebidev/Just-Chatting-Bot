import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Collection } from "discord.js";
import { readdirSync, existsSync, mkdirSync, createWriteStream } from "fs";
import { Storage, File } from "megajs";
import { Command } from "../index";

async function downloadAudios() {

	if (!existsSync("./audio")) {
		mkdirSync("./audio");
	}

	const mega = await new Storage({
		email: process.env["MEGAEMAIL"]!,
		password: process.env["MEGAPASSWORD"]!,
		userAgent: "Just Chatting Bot/1.0"
	}).ready;

	Promise.all(mega.root.children!.find(folder => folder.name == "audios")!.children!.map(file => file.link({}))).then(async audioLinks => {

		await mega.close();
		const audioFiles = readdirSync("./audio");

		for (const link of audioLinks) {

			let file = File.fromURL(link);
			file = await file.loadAttributes();

			if(audioFiles.includes(file.name!)) continue;

			const stream = createWriteStream(`./audio/${file.name}`);
			file.download({}).pipe(stream);

		}

	});

}

async function registerCommands(comms: Collection<string, Command>) {

	const commands = comms.map(command => command);
	for (const command of commands) {
		if (command.initData) await command.initData(commands);
	}

	const rest = new REST({ version: "9" }).setToken(process.env["TOKEN"]!);

	rest.put(Routes.applicationGuildCommands(process.env["CLIENTID"]!, "748232983768465408"), { body: commands.map(command => command.commandData) })
		.then(() => console.log("Successfully registered application commands. 1"))
		.catch(console.error);

	rest.put(Routes.applicationGuildCommands(process.env["CLIENTID"]!, "917119141511589959"), { body: commands.map(command => command.commandData) })
		.then(() => console.log("Successfully registered application commands. 2"))
		.catch(console.error);

};

function readCommands(): Collection<string, Command> {

	const commands = new Collection<string, Command>();
	const commandFiles = readdirSync("./src/commands").filter(file => file.endsWith(".ts"));

	for (const file of commandFiles) {
		const command = require(`../commands/${file}`);
		commands.set(command.commandData.name, command);
	}

	return commands;

}

export {
	downloadAudios,
	registerCommands,
	readCommands
};
