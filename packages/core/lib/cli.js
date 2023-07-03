// import pkg from '../package.json.js'
import { log } from '@solkatt-one/utils';
async function core() {
    console.log('core');
    prepare();
}
function prepare() {
    checkPkgVersion();
}
function checkPkgVersion() {
    // console.log('log', log)
    log.default.info('cli', 'test cli log');
}
// function checkNodeVersion () { }
// function checkRoot () { }
// function checkUserHome () { }
// function checkEnv () { }
// function checkGlobalUpdate () { }
export default core;
