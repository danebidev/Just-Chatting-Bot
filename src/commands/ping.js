module.exports = {

	name: 'ping',
	minArgs: 0,
	maxArgs: 0,
	syntax: 'ping',
	args: [],
	helpMessage: 'Controlla il ping del bot',

	execute: function(args, message, client) {

		message.reply({ content: 'Pinging...', fetchReply: true }).then(reply => {
			reply.edit(`Websocket heartbeat: ${client.ws.ping}ms.\nRoundtrip latency: ${reply.createdTimestamp - message.createdTimestamp}ms`);
		});

	},

};