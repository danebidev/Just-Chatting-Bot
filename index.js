const { suffix } = require('./config.json');
const { Client, Intents } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const token = process.env.token;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES] });
client.login(token);

client.addListener("")