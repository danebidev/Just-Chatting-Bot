// Imports
import Discord = require('discord.js');
import pg = require('pg');
import fs = require('fs');
import dotenv = require("dotenv");

dotenv.config();


// Interfaces
export interface Command {
	
	name: string,
	minArgs: number,
	maxArgs: number,
	syntax: string,
	args: {name: string, explaination: string}[],
	helpMessage: string
	execute: (arg0: Discord.Message, arg1: string[], arg2: Data) => void
	
}

export interface Data {
	
	client: Discord.Client,
	bumps: Discord.Collection<string, number>,
	config: Discord.Collection<string, string>
	database: pg.Pool,
	commands: Discord.Collection<string, Command>
	
};


// Functions
function registerEvents(): void {

	const eventFiles = fs.readdirSync('./build/events').filter(file => file.endsWith('.js'));

	for(const file of eventFiles) {
		const event = require(`./events/${file}`);
		client.on(event.name, eventData => event.execute(eventData, data));
	}
	
}

function readCommands(): Discord.Collection<string, Command> {

	const commands = new Discord.Collection<string, Command>();
	const commandFiles = fs.readdirSync('./build/commands').filter(file => file.endsWith('.js'));

	for(const file of commandFiles) {
		const command = require(`./commands/${file}`);
		commands.set(command.name, command);
	}
	
	return commands; 

}


// Variables / Properties
const token = process.env['TOKEN'];
const client = new Discord.Client({
	intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGES],
	partials: ['CHANNEL']
});

const data: Data = {
	
	client: client,
	bumps: new Discord.Collection<string, number>(),
	config: new Discord.Collection<string, string>(),
	database: new pg.Pool({
		connectionString: process.env['DATABASE_URL'] || 'postgresql://postgres:1515@localhost:5432/postgres',
		ssl: process.env['DATABASE_URL'] ? {
			rejectUnauthorized: false
		} : false
	}),
	commands: readCommands()
	
}


// Random shit
data.database.connect().then(dbClient => {
	dbClient.query('SELECT * FROM bumps;').then(res => {

		for(const row of res.rows) {
			data.bumps.set(row.id, row.bumps);
		}

	});
	dbClient.query('SELECT * FROM config;').then(res => {

		dbClient.release();

		for(const row of res.rows) {
			data.config.set(row.name, row.value);
		}

	});
}).catch(err => console.error(err));

registerEvents();
client.login(token);