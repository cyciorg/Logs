exports.run = async (client, message, args, level) => {
    const Discord = require("discord.js");
    const code = args.join(" ");

    message.delete();
        if (args < 1) return message.reply("You must provide some (JS) code to eval!");
        if (args > 1999) return message.reply("You may not have more than 2,000 in this EVAL \n returns nothing");
        try {
            const evaled = eval(code);
            const clean = await client.clean(client, evaled);

            // Self explanitory. creates Embed
            const embed = new Discord.MessageEmbed()
                .setTitle("Eval Request Code - " + Math.floor(Math.random() * (99999999 - 11111111)) + 11111111)
                .setColor("RANDOM")
                .addField("**Input**:", "\`\`\`" + args.slice(0).join(' ') + " \`\`\`")
                .addField("**OutPut**:", "\`\`\`" + clean + " \`\`\`")
                .setTimestamp(new Date())
                .setFooter(message.author.username, message.author.avatarURL)
            // sends embed above ^^^^
            message.channel.send({
                embed
            });
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${await client.clean(client, err)}\n\`\`\``);
        }
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["evalulate", "e"],
  permLevel: "Bot Owner",
  cooldown: 5
};

exports.help = {
  name: "eval",
  category: "System",
  description: "Evaluates arbitrary javascript.",
  usage: "eval [...code]"
};