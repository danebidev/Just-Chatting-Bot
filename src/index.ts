import { Client, Intents, CommandInteraction, Collection } from "discord.js";
import { Pool } from "pg";
import { config } from "dotenv";
import { readdirSync } from "fs";
import { downloadAudios } from "./misc/util";
import { readCommandFiles } from "./misc/commandManager";

config();

interface Command {
	execute: (interaction: CommandInteraction, data: Data) => void,
	commandData: CommandData,
	initData?: (commands: Collection<string, Command>) => Promise<void>
}

interface Data {
	client: Client,
	database: Pool,
	commands: Collection<string, Command>
}

interface Option {
	name: string,
	description: string,
	type: number,
	required?: boolean,
	options?: Option[],
	choices?: { name: string, value: string | number }[]
}

interface CommandData {
	name: string,
	type?: 1 | 2 | 3,
	description: string,
	default_permission?: boolean,
	options?: Option[]
}

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES],
	partials: ["CHANNEL", "GUILD_MEMBER", "USER", "MESSAGE"]
});

const data: Data = {

	client: client,
	database: new Pool({
		connectionString: process.env["DATABASE_URL"] || process.env["LOCAL_DATABASE_URL"],
		ssl: process.env["DATABASE_URL"] ? {
			rejectUnauthorized: false
		} : false
	}),
	commands: readCommandFiles()

};

client.login(process.env["TOKEN"]);

downloadAudios();
registerEvents();

function registerEvents() {

	const eventFiles = readdirSync("./src/events").filter(file => file.endsWith(".ts"));

	for (const file of eventFiles) {
		const event = require(`./events/${file}`);
		data.client.on(event.name, eventData => event.execute(eventData, data));
	}

}

export {
	Command,
	Data,
	CommandData
};