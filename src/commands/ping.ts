import Discord = require("discord.js");
import { Data } from "../index";

export = {

	name: "ping",
	minArgs: 0,
	maxArgs: 0,
	syntax: "ping",
	args: [],
	helpMessage: "Controlla il ping del bot",

	execute: function(message: Discord.Message, _args: string[], data: Data) {

		message.reply("Pinging...").then(reply => {
			reply.edit(`Websocket heartbeat: ${data.client.ws.ping}ms.\nRoundtrip latency: ${reply.createdTimestamp - message.createdTimestamp}ms`);
		});

	},

};