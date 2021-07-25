require('dotenv').config()
const cache = require('../cache/cacheMain');
const clean = require('../utils/tempClean');
const shell = require('shelljs');
const containersStrings = require('../utils/containers');
const scopes = require('../utils/scopes');
const {
    Docker
} = require('../utils/docker-compose');
const dockercomp = new Docker({
    path: '/opt/mailcow-dockerized/'
});

function getNowDateTimeStr() {
    var now = new Date();
    var hour = now.getHours() - (now.getHours() >= 12 ? 12 : 0);
    return [
        [AddZero(now.getDate()), AddZero(now.getMonth() + 1), now.getFullYear()].join("/"), [AddZero(hour), AddZero(now.getMinutes())].join(":"), now.getHours() >= 12 ? "PM" : "AM"
    ].join(" ");
}

function AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
}

const {
    WebhookClient,
    MessageEmbed
} = require('discord.js');
let web = new WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN)
let embed = new MessageEmbed().setColor(process.env.LOGGING_COLOR_SUCCESS).setTimestamp(Date.now());

async function query() {
    cache.lastLog.lastRecordedLogCheck = getNowDateTimeStr(0);
    function timer(ms) {
        return new Promise(res => setTimeout(res, ms));
    }
    const w = require('wumpfetch');
    let headers = {
        'User-Agent': `CyciLogs/${require('../../package.json').author} (${require('../../package.json').version})`,
        'X-API-Key': `${process.env.MAILCOW_API_KEY}`
    }
    let base_url = 'https://mail.cyci.org/api/v1';
    //containers
    const containers = await w(base_url + '/get/status/containers', {headers}).send();
    let detailsCon = containers.body.toString('utf-8');
    let logsCon = JSON.parse(detailsCon);
    //console.log(logsCon['watchdog-mailcow']);
    // get UI Logins to admin panel
    const uiLogs = await w(base_url + '/get/logs/ui/10', {headers}).send();
    let details = uiLogs.body.toString('utf-8');
    let logs = JSON.parse(details);

    if (uiLogs.statusCode == 404) {
        web.send(embed.setTitle('UI Logs').setURL(base_url).setColor(process.env.LOGGING_COLOR_ERROR).setDescription('\`\`\`Error: StatusCode 404 \nIs site down? checking containers\`\`\`'));
        if (containers.statusCode == 404) {
            web.send(embed.setTitle('Container Logs').setURL(base_url).setColor(process.env.LOGGING_COLOR_ERROR).setDescription('\`\`\`Error: StatusCode 404 \nWebsite down. trying to restart\`\`\`'))
            let runningCount = 0;
            containersStrings.forEach(async string => {
                let finalLog = logsCon[string];
                if (finalLog.state !== 'running') {
                    runningCount++;
                    if (runningCount > 3) {
                        await dockercomp.restartAll();
                        await timer(5);
                        runningCount = 0;
                        return web.send(embed.setTitle('Container Logs').setURL(base_url).setColor(process.env.LOGGING_COLOR_SUCCESS).setDescription(`\`\`\`Info: Restarted every container\`\`\``))
                    } else {
                        await dockercomp.restart(finalLog.container)
                        await timer(5);
                        runningCount = 0;
                        return web.send(embed.setTitle('Container Logs').setURL(base_url).setColor(process.env.LOGGING_COLOR_SUCCESS).setDescription(`\`\`\`Info: Restarted the container [${finalLog.image}]\`\`\``))
                    }
                }
            })
        }
    }
    const json = await clean(logs[0])
    if (cache.lastLog.lastStoredId < logs[0].id) {
        setTimeout(function() {
            cache.lastLog.lastStoredId = logs[0].id;
            web.send(embed.setTitle('UI Logs').setURL(base_url).setColor(process.env.LOGGING_COLOR_SUCCESS).setDescription(`\`\`\`${json}\`\`\``));
        }, 2000)
    }
}
module.exports = query;