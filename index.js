// Imports
const config = require('./config.json');
const fs = require('fs');
const dotenv = require('dotenv');
const Discord = require('discord.js');

// Other constants
dotenv.config();
const token = process.env.TOKEN;
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGES], partials: ['CHANNEL'] });
client.config = config;
registerEvents();
readCommands();

client.login(token);

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