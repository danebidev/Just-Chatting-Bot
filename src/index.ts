// Imports
import { Client, Intents, Collection, Message } from "discord.js";
import { Pool } from "pg";
import { get } from "https";
import { readdirSync, readFileSync, createWriteStream } from "fs";
import { config } from "dotenv";
import { Dropbox, files } from "dropbox";
import { getDropboxFileSHA256Checksum } from "./misc/util";

config();


// Interfaces
interface Command {

	name: string,
	minArgs: number,
	maxArgs: number,
	syntax: string,
	helpMessage: string
	helpArgs: {name: string, explaination: string}[],
	execute: (message: Message, args: string[], data: Data) => void

}

interface Data {

	client: Client,
	bumps: Collection<string, number>,
	config: Collection<string, string>
	database: Pool,
	commands: Collection<string, Command>

}


// Functions
async function downloadAudios() {

	const dropbox = new Dropbox({ accessToken: process.env["DROPBOXACCESSTOKEN"] });
	const audios = (await dropbox.filesListFolder({ path: "/bot-audios" })).result.entries as files.FileMetadataReference[];
	const audioFiles = readdirSync("./audio");

	for(const file of audios) {

		if(audioFiles.includes(file.name)) {
			const fileHash = getDropboxFileSHA256Checksum(readFileSync(`./audio/${file.name}`));
			if(fileHash == file.content_hash) continue;
		}

		const link = await dropbox.filesGetTemporaryLink({ path: file.path_lower! });
		const writeStream = createWriteStream(`./audio/${file.name}`);

		get(link.result.link, res => {
			console.log("ciao");
			res.pipe(writeStream);
			writeStream.on("finish", function() {
				writeStream.close();
			});
		});

	}

}

function registerEvents(): void {

	const eventFiles = readdirSync("./src/events").filter(file => file.endsWith(".ts"));

	for(const file of eventFiles) {
		const event = require(`./events/${file}`);
		client.on(event.name, eventData => event.execute(eventData, data));
	}

}

function readCommands(): Collection<string, Command> {

	const commands = new Collection<string, Command>();
	const commandFiles = readdirSync("./src/commands").filter(file => file.endsWith(".ts"));

	for(const file of commandFiles) {
		const command = require(`./commands/${file}`);
		commands.set(command.name, command);
	}

	return commands;

}


// Variables / Properties
const token = process.env["TOKEN"];
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
	partials: ["CHANNEL"]
});

const data: Data = {

	client: client,
	bumps: new Collection<string, number>(),
	config: new Collection<string, string>(),
	database: new Pool({
		connectionString: process.env["DATABASE_URL"] || "postgresql://postgres:1515@localhost:5432/postgres",
		ssl: process.env["DATABASE_URL"] ? {
			rejectUnauthorized: false
		} : false
	}),
	commands: readCommands()

};


// Random shit
data.database.connect().then(dbClient => {
	dbClient.query("SELECT * FROM bumps;").then(res => {

		for(const row of res.rows) {
			data.bumps.set(row.id, row.bumps);
		}

	});
	dbClient.query("SELECT * FROM config;").then(res => {

		dbClient.release();

		for(const row of res.rows) {
			data.config.set(row.name, row.value);
		}

	});
}).catch(err => console.error(err));

downloadAudios();
registerEvents();
client.login(token);


// Exports
export {
	Command,
	Data
};