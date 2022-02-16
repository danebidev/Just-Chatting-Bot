// Imports
const config = require('./config.json');
const Discord = require('discord.js');
const pg = require('pg');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();


// Variables / Properties
const token = process.env.TOKEN;
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGES], partials: ['CHANNEL'] });
client.config = config;
client.bumps = require('./bumps.json');
client.database = new pg.Pool({
	connectionString: process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/postgres',
	ssl: process.env.DATABASE_URL ? {
		rejectUnauthorized: false
	} : false
});


// Random shit
registerEvents();
readCommands();

client.login(token);
client.database.connect();


// Functions
function registerEvents() {

	const events = [];
	const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

	for(const file of eventFiles) {
		const event = require(`./events/${file}`);
		events.push(event);
	}

	for(const event of events) {
		client.on(event.name, data => event.execute(data, client));
	}

}

function readCommands() {

	client.commands = new Discord.Collection;
	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

	for(const file of commandFiles) {
		const command = require(`./commands/${file}`);
		client.commands.set(command.name, command);
	}

}