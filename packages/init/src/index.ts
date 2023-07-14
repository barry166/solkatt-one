import fs from 'node:fs'
import inquirer from 'inquirer'
import { emptyDirSync } from 'fs-extra'
import { Command } from '@solkatt-one/models'
import { log } from '@solkatt-one/utils'
import { PROJECT, COMPONENT, getTemplateData } from 'utils'

const types = [PROJECT, COMPONENT]

class InitCommand extends Command {
  projectName: string
  force: boolean
  cwd: string
  init() {
    console.log('init command init..', this.cmdName, this.cmdOption)
    this.projectName = this.cmdName
    this.force = this.cmdOption?.force
    this.cwd = process.cwd() //当前操作目录
  }

  async exec() {
    try {
      // 准备阶段
      await this.prepare()
      // 下载模板到全局目录
      await this.downloadTemplate()
      // 安装模板到目标目录
      await this.installTemplate()
    } catch (error) {
      log.verbose('error', error.message)
    }
  }

  async prepare() {
    const res = await this.isDirEmpty()
    if (!res && !this.force) {
      const { isContinue } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'isContinue',
          message: '当前文件夹不为空，是否继续创建项目？',
          default: false,
        },
      ])
      if (!isContinue) return
      // 清空目录
      emptyDirSync(this.cwd)
    }
    
    // 选择创建项目类型（模板/组件）
    const templates = await getTemplateData()

    // 填写项目/组件名称

    // 填写版本号

    // 填写描述
  }

  async downloadTemplate() {
    //todo
  }
  async installTemplate() {
    //todo
  }

  // 当前目录是否为空
  async isDirEmpty() {
    let files = fs.readdirSync(this.cwd)
    files = files.filter(
      (file) => !file.startsWith('.') && ['node_modules'].indexOf(file) < 0
    )
    return files.length === 0
  }
}

function init(argv) {
  return new InitCommand(argv)
}

export default init
