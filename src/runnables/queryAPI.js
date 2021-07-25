require('dotenv').config()
const cache = require('../cache/cacheMain');
const clean = require('../utils/tempClean');
const shell = require('shelljs')
function getNowDateTimeStr() {
    var now = new Date();
    var hour = now.getHours() - (now.getHours() >= 12 ? 12 : 0);
    return [[AddZero(now.getDate()), AddZero(now.getMonth() + 1), now.getFullYear()].join("/"), [AddZero(hour), AddZero(now.getMinutes())].join(":"), now.getHours() >= 12 ? "PM" : "AM"].join(" ");
  }
  function AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
  }

const {WebhookClient, MessageEmbed} = require('discord.js');
let web = new WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN)
let embed = new MessageEmbed().setColor(process.env.LOGGING_COLOR_SUCCESS).setTimestamp(Date.now());

async function query() {
    cache.lastLog.lastRecordedLogCheck = getNowDateTimeStr(0);
    function timer(ms) {
        return new Promise(res => setTimeout(res, ms));
      }
    const scopes = require('../utils/scopes');
    const w = require('wumpfetch');
    let headers = {
        'User-Agent': `CyciLogs/${require('../../package.json').author} (${require('../../package.json').version})`,
        'X-API-Key': `${process.env.MAILCOW_API_KEY}`
    }
    let base_url = 'https://mail.cyci.org/api/v1';
    //containers
    const containers = await w(base_url + '/status/containers', {headers}).send();
    // get UI Logins to admin panel
    const uiLogs = await w(base_url + '/get/logs/ui/10', {headers}).send();
    let details = uiLogs.body.toString('utf-8');
    let logs = JSON.parse(details);

    if (uiLogs.statusCode == 404) {
        web.send(embed.setTitle('UI-Logs').setURL(base_url).setColor(process.env.LOGGING_COLOR_ERROR).setDescription('\`\`\`Error: StatusCode 404 \nIs site down? checking containers\`\`\`'));
        if (containers.statusCode == 404) {
            web.send(embed.setTitle('Container-Logs').setURL(base_url).setColor(process.env.LOGGING_COLOR_ERROR).setDescription('\`\`\`Error: StatusCode 404 \nWebsite down. trying to restart\`\`\`'))
            // implement SH script to restart the network on docker
        }
    }
    const json = await clean(logs[0])
    
    if (cache.lastLog.lastStoredId < logs[0].id) {
        setTimeout(function() {
            cache.lastLog.lastStoredId = logs[0].id;
            console.log(cache.lastLog.lastStoredId);
            web.send(embed.setTitle('UI-Logs').setURL(base_url).setColor(process.env.LOGGING_COLOR_SUCCESS).setDescription(`\`\`\`${json}\`\`\``));}, 2000)
    }
    
}

module.exports = query;