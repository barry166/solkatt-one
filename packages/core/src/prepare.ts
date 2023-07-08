//@ts-check
import path from 'node:path'
import rootCheck from 'root-check'
import semver from 'semver'
import chalk from 'chalk'
import os from 'os'
import { pathExists } from 'path-exists'
import dotEnv from 'dotenv'
import { log, getNpmLatestVersion } from '@solkatt-one/utils'
import pkg from '../package.json' assert { type: 'json' }
import { DEFAULT_CLI_HOME_PATH, LATEST_NODE_VERSION } from './constant'

export async function prepare() {
	checkPkgVersion()
	checkNodeVersion()
	checkRoot()
	await checkUserHome()
	await checkEnv()
	await checkGlobalUpdate()
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
	log.verbose('userHomePath', userHomePath)
	if (!(await pathExists(userHomePath))) {
		throw new Error(chalk.red('当前登录用户主目录不存在'))
	}
}

async function checkEnv() {
	const envPath = path.resolve(os.homedir(), '.env')
	if (await pathExists(envPath)) {
		const config = dotEnv.config({ path: envPath })
		console.log(config)
	}
	createDefaultConfig()
}

function createDefaultConfig() {
	let homePath = ''
	if (!process.env.CLI_HOME_PATH) {
		homePath = path.resolve(os.homedir(), DEFAULT_CLI_HOME_PATH)
	} else {
		homePath = path.resolve(os.homedir(), process.env.CLI_HOME_PATH)
	}
	process.env.CLI_HOME_PATH = homePath
}

async function checkGlobalUpdate() {
	const currentVersion = pkg.version
	const npmName = pkg.name
	const latestVersion = await getNpmLatestVersion(npmName)
	
	if (semver.gt(latestVersion, currentVersion)) {
		log.warn(
			'更新提示',
			chalk.yellow(`请手动更新 ${npmName}, 当前版本：${currentVersion}, 最新版本：${latestVersion}
    更新命令：npm install -g ${npmName}`)
		)
	}
}
