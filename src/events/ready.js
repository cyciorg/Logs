/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const query = require('../runnables/queryAPI');
module.exports = async (client) => {
	// Log that the bot is online.
	var cMembers = client.users.cache.size;
	var gCount = client.guilds.cache.size;
	console.log(`Logged into '${client.user.tag}' (${client.user.id}). Ready to serve ${cMembers} users in ${gCount} guilds. Bot Version: ${client.version}`);
	client.setInterval(function() {
         query();
    }, 10000)



};