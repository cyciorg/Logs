const location = '/opt/mailcow-dockerized/';
const compose = require('docker-compose');


async function checkFS(location) {
    let dir = location.replace(/(\s+)/g, '\\$1');
    const regLocation = new RegExp("^(.+)\/([^\/]+)$");
    if (!regLocation.exec(dir)) return false;
    const fs = require("fs");
    if (fs.existsSync(dir + 'docker-compose.yml')) {
        return dir;
    } else return false;
}

class Docker {
    /**Docker functions
     * @param {Object} [options={}] Optional options for files etc
     * @param {String} [options.path='/opt/mailcow-dockerized/'] Whether to suppress logging please note additionally when checking for the directory in the system. we additionally add "docker-compose.yml" please only include absolute dir
     */
    constructor({path = location}) {
        this.options = {path};
    }

    async restart(id) {
        const dir = await checkFS(this.options.path);
        compose.restart({ cwd: path.join(dir), log: true })
            .then(() => { console.log('done')},
            err => { console.log('something went wrong:', err.message)});
    }
    async restartAll(id) {
        const dir = await checkFS(this.options.path);
        compose.restartAll({ cwd: path.join(dir), log: true })
            .then(() => { console.log('done')},
            err => { console.log('something went wrong:', err.message)});
    }
}

module.exports = {checkFS, Docker}