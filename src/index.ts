import { downloadAudios, registerEvents, readCommands } from "./misc/util";
import { Client, Intents, Collection, CommandInteraction } from "discord.js";
import { Pool } from "pg";
import { config } from "dotenv";
import { SlashCommandBuilder } from "@discordjs/builders";

config();

interface Command {

	commandData: SlashCommandBuilder,
	initData?: () => Promise<any>,
	execute: (interaction: CommandInteraction, data: Data) => void

}

interface Data {

	client: Client,
	bumps: Collection<string, number>,
	database: Pool,
	config?: Collection<string, any>,
	commands: Collection<string, Command>

}

interface Option {
	name: string,
	description: string,
	type: number,
	required?: boolean,
	options?: Option[]
	choices?: {name: string, value: string | number}[]
}

interface CommandData {
	name: string,
	type?: 1 | 2 | 3,
	description: string,
	default_permission?: boolean
	options?: Option[]
}


const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES],
	partials: ["CHANNEL", "GUILD_MEMBER", "USER", "MESSAGE"]
});

const data: Data = {

	client: client,
	bumps: new Collection<string, number>(),
	database: new Pool({
		connectionString: process.env["DATABASE_URL"] || "postgresql://postgres:1515@localhost:5432/postgres",
		ssl: process.env["DATABASE_URL"] ? {
			rejectUnauthorized: false
		} : false
	}),
	commands: readCommands()

};

client.login(process.env["TOKEN"]);

downloadAudios();
registerEvents(data);

client.on("shardError", error => {
	console.error("A websocket connection encountered an error:", error);
});

export {
	Command,
	Data,
	CommandData
};