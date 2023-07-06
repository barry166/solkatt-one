import path from 'node:path'
import rootCheck from 'root-check'
import semver from 'semver'
import chalk from 'chalk'
import os from 'os'
import { pathExists } from 'path-exists'
import dotEnv from 'dotenv'
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

async function prepare() {
  checkPkgVersion()
  checkNodeVersion()
  checkRoot()
  await checkUserHome()
  checkEnv()
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

async function checkUserHome() {
  const userHomePath = os.homedir()
  log.info('userHomePath', userHomePath)
  if (!(await pathExists(userHomePath))) {
    throw new Error(chalk.red('当前登录用户主目录不存在'))
  }
}

function checkEnv() {
  const envPath = path.resolve(os.homedir(), '.env')
  dotEnv.config({ path: envPath })
  console.log(process.env.CLI_HOME_PATH)
}

// function checkGlobalUpdate () {
//   // 1. 获取当前版本号和模块名
//   // 2. 调用 npm API，获取所有版本号
//   // 3. 提取所有版本号，比对哪些版本号是大于当前版本号
//   // 4. 获取最新的版本号，提示用户更新到该版本
//  }

export default core
