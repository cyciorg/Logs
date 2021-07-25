require('dotenv').config()
const Discord = require("discord.js");
const cfg = require(`./config.js`);
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
// ws: {intents: cfg.intents}
const client = new Discord.Client({fetchAllMembers: false,disabledEvents: ['TYPING_START', 'TYPING_STOP', 'RELATIONSHIP_ADD', 'RELATIONSHIP_REMOVE', 'USER_NOTE_UPDATE', 'USER_NOTE_UPDATE', 'GUILD_BAN_ADD', 'GUILD_BAN_REMOVE'],http: { api: 'https://discordapp.com/api', version: 7 },disableEveryone: true,messageCacheMaxSize: 1,messageCacheLifetime: 1,messageSweepInterval: 1});
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.cooldown = new Discord.Collection();
client.cache = require(`./cache/cacheMain`);
client.config = cfg;
require(`./utils/functions`)(client);
require(`./commands/commandHandler`)(client);


const init = async() => {
    const cmds = await readdir("./src/commands/run/");
    console.log(`Loading a total of ${cmds.length} commands.`);
    cmds.forEach(f => {
        if (!f.endsWith(".js")) return;
        const response = client.loadCommand(f);
        if (response) console.log(response);
    });
    const event = await readdir("./src/events/");
    console.log(`Loading a total of ${event.length} events.`);
    event.forEach(file => {
        const eventName = file.split(".")[0];
        const event = require(`./events/${eventName}`);
        client.on(eventName, event.bind(null, client));
    });
    client.levelCache = {};
    for (let i = 0; i < client.config.permLevels.length; i++) {
        const thisLevel = client.config.permLevels[i];
        client.levelCache[thisLevel.name] = thisLevel.level;
    }
    try {
        client.login(client.config.token);
    } catch (err) {
        client.logger.error(err);
        procces.exit(1);
    }
};
init();