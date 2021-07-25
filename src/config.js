const {Intents} = require('discord.js');

const config = {

    ownerIDS: ["393996898945728523", "188712985475284996"],
  
    token: process.env.BOTKEY,
    
    intents: [
      'GUILD_MESSAGES',
      'GUILD_MEMBERS',
      'GUILD_EMOJIS',
      'GUILD_INTEGRATIONS',
      'GUILDS',
      'GUILD_VOICE_STATES'
    ],
    permLevels: [
        { level: 0,
          name: "User", 
          check: () => true
        },
        { level: 10,
          name: "Bot Owner", 
          check: (message) => config.ownerIDS.includes(message.author.id)
        }
      ]
    };

module.exports = config;