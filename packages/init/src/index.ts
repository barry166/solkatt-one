import fs from 'node:fs'
import { Command } from '@solkatt-one/models'

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
    // 准备阶段
    await this.prepare()
    // 下载模板到全局目录
    await this.downloadTemplate()
    // 安装模板到目标目录
    await this.installTemplate()
  }

  async prepare() {
    //todo
    const res = await this.isDirEmpty()
    console.log('res', res)
  }

  async downloadTemplate() {
    //todo
  }
  async installTemplate() {
    //todo
  }

  async isDirEmpty() {
    const files = fs.readdirSync(this.cwd)
    console.log('files', files)
  }
}

function init(argv) {
  return new InitCommand(argv)
}

export default init
