import rootCheck from 'root-check'
import semver from 'semver'
import chalk from 'chalk'
import { log } from '@solkatt-one/utils'
import pkg from '../package.json' assert { type: 'json' }
import { LATEST_NODE_VERSION } from './constant'

async function core() {
  try {
    prepare()
  } catch (error) {
    log.error('error', error.message)
  }
}

function prepare() {
  checkPkgVersion()
  checkNodeVersion()
  checkRoot()
}

function checkPkgVersion() {
  log.info('cli', pkg.version)
}

function checkNodeVersion() {
  if (!semver.gte(process.version, LATEST_NODE_VERSION)) {
    throw new Error(
      chalk.red(`需要安装 v${LATEST_NODE_VERSION} 以上版本的 Node.js`)
    )
  }
}
function checkRoot() {
  rootCheck()
}
// function checkUserHome () { }
// function checkEnv () { }
// function checkGlobalUpdate () { }

export default core
