const { deleteBumps } = require('../misc/bumpCount');

module.exports = {

	name: 'guildMemberRemove',

	/**
	 *
	 * @param {GuildMember} member
	 * @param {Client} client
	 */
	execute: function(member, client) {

		if(client.bumps[member.id] <= 0) return;

		const channel = client.channels.cache.get('836579149107691580');

		deleteBumps(member.user, channel, client);

	}

};