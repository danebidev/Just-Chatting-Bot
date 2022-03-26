import { Client, Intents, Collection, CommandInteraction } from "discord.js";
import { Pool } from "pg";
import { config } from "dotenv";
import { registerCommands } from "./misc/util";
import { downloadAudios, registerEvents, readCommands } from "./misc/util";

config();

interface Command {
	execute: (interaction: CommandInteraction, data: Data) => void,
	commandData: CommandData,
	initData?: (commands: Command[]) => Promise<void>
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
	commands: readCommands()

};

registerCommands(data.commands);

client.login(process.env["TOKEN"]);

downloadAudios();
registerEvents(data);

export {
	Command,
	Data,
	CommandData
};