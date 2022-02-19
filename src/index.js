// Imports
const Discord = require('discord.js');
const pg = require('pg');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();


// Variables / Properties
const token = process.env.TOKEN;
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGES], partials: ['CHANNEL'] });
client.bumps = new Discord.Collection();
client.config = {};
client.database = new pg.Pool({
	connectionString: process.env.DATABASE_URL || 'postgresql://postgres:1515@localhost:5432/postgres',
	ssl: process.env.DATABASE_URL ? {
		rejectUnauthorized: false
	} : false
});

client.database.connect().then(dbClient => {
	dbClient.query('SELECT * FROM bumps;').then(res => {

		for(const row of res.rows) {
			client.bumps.set(row.id, row.bumps);
		}

	}).catch(err => console.error(err));
	dbClient.query('SELECT * FROM config;').then(res => {

		dbClient.release();

		for(const row of res.rows) {
			client.config[row.name] = row.value;
		}

	}).catch(err => console.error(err));
}).catch(err => console.error(err));


// Random shit
registerEvents();
readCommands();

client.login(token);


// Functions
function registerEvents() {

	const events = [];
	const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

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
	const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

	for(const file of commandFiles) {
		const command = require(`./commands/${file}`);
		client.commands.set(command.name, command);
	}

}