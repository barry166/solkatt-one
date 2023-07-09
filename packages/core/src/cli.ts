import { Command } from 'commander'
import chalk from 'chalk'
import { log } from '@solkatt-one/utils'
import exec from '@solkatt-one/exec'

import { prepare } from './prepare'
import pkg from '../package.json' assert { type: 'json' }

async function core() {
  try {
    await prepare()
    registerCommand()
  } catch (error) {
    log.error('error', error.message)
    log.verbose('error', error)
  }
}

function registerCommand() {
  const program = new Command()
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .description('一个通用的脚手架工具')
    .version(pkg.version)

  program
    .option('-d, --debug', '是否开启调试模式', false)
    .option('-tp, --targetPath <targetPath>', '本地调试文件路径', '')

  program
    .command('init [projectName]')
    .description('初始化项目')
    .option('-f, --force', '是否强制初始化项目', false)
    .option('-tt, --test', '测试参数', 'test-params')
    .action(exec)

  program.on('option:targetPath', function () {
    process.env.CLI_TARGET_PATH = program.opts().targetPath
  })

  program.on('command:*', (obj) => {
    console.log(chalk.red('未知的命令：' + obj[0]))
  })

  program.parse(process.argv)

  if (program.args && program.args.length < 1) {
    program.outputHelp()
    console.log()
  }
}

export default core
