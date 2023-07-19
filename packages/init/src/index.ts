import fs from 'node:fs'
import { spawnSync } from 'child_process'
import path from 'node:path'
import inquirer from 'inquirer'
import semver from 'semver'
import ejs from 'ejs'
import { glob } from 'glob'
import fse from 'fs-extra'
import { Command } from '@solkatt-one/models'
import { log, sleep, spinnerStart } from '@solkatt-one/utils'
import { Package } from '@solkatt-one/models'
import { COMPONENT, Template, getTemplateData, types, typesMap, whiteCommandList } from './utils'

class InitCommand extends Command {
  projectName: string
  force: boolean
  cwd: string
  templates: Template[]
  selectedTemplate: Template
  projectInfo: {
    name: string
    version: string
    desc?: string
  }
  pkg: Package

  init() {
    console.log('init command init..', this.cmdName, this.cmdOption, process.env.CLI_REGISTRY)
    this.projectName = this.cmdName
    this.force = this.cmdOption?.force
    this.cwd = process.cwd() //当前操作目录
  }

  async exec() {
    try {
      // 准备阶段
      await this.prepare()
      // 下载模板到全局目录
      if (this.projectInfo) {
        await this.downloadTemplate()
        // 安装模板到目标目录
        await this.installTemplate()
      }
    } catch (error) {
      log.error('error', error.message)
      log.verbose('error', error)
      process.exit(1)
    }
  }

  async downloadTemplate() {
    console.log('selectedTemplate', this.selectedTemplate)
    console.log('projectInfo', this.projectInfo)

    const { npmName, npmVersion } = this.selectedTemplate
    const targetPath = path.resolve(process.env.CLI_HOME_PATH, 'template')
    const storeDir = path.join(targetPath, 'node_modules')
    log.verbose('targetPath', targetPath)
    log.verbose('storeDir', storeDir)
    this.pkg = new Package({
      targetPath,
      storeDir,
      packageName: npmName,
      packageVersion: npmVersion,
    })
    if (await this.pkg.exists()) {
      const spinner = spinnerStart('正在更新模板')
      await sleep()

      try {
        await this.pkg.update()
        spinner.stop()
        log.success('更新模板成功')
      } catch (error) {
        throw error
      } finally {
        spinner.stop()
      }
    } else {
      const spinner = spinnerStart('正在下载模板')
      await sleep()

      try {
        await this.pkg.install()
        spinner.stop()
        log.success('下载模板成功')
      } catch (error) {
        throw error
      } finally {
        spinner.stop()
      }
    }
  }

  async prepare() {
    this.templates = await getTemplateData()
    if (!this.templates || this.templates.length === 0) throw new Error('模板信息不存在')

    const res = await this.isDirEmpty()
    if (!res && !this.force) {
      const isContinue = await this.confirmEmpty()
      console.log('isContinue', isContinue)
      if (!isContinue) return
      // 清空目录
      fse.emptyDirSync(this.cwd)
    }
    await this.getSelectedTemplate()
  }

  // 获取选择的项目模板信息
  async getSelectedTemplate() {
    function isValidName(v) {
      return /^(@[a-zA-Z0-9-_]+\/)?[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v)
    }
    let answer = await inquirer.prompt([
      {
        type: 'list',
        choices: types.map((t) => ({ name: typesMap[t], value: t })),
        message: '请选择创建项目类型',
        name: 'type',
      },
      {
        type: 'input',
        message: '请填写名称',
        name: 'packageName',
        default: this.cmdName,
        validate: function (v) {
          const done = this.async()
          setTimeout(function () {
            // 1.首字符必须为英文字符
            // 2.尾字符必须为英文或数字，不能为字符
            // 3.字符仅允许"-_"
            if (!isValidName(v)) {
              done(`请输入合法的名称`)
              return
            }
            done(null, true)
          }, 0)
        },
        filter: function (v) {
          return v
        },
      },
      {
        type: 'input',
        message: '请填写项目版本号',
        name: 'packageVersion',
        default: '1.0.0',
        validate: function (v) {
          const done = this.async()
          setTimeout(function () {
            if (!!!semver.valid(v)) {
              done('请输入合法的版本号')
              return
            }
            done(null, true)
          }, 0)
        },
        filter: function (v) {
          if (!!semver.valid(v)) {
            return semver.valid(v)
          } else {
            return v
          }
        },
      },
    ])
    if (answer.type === COMPONENT) {
      answer.desc = (
        await inquirer.prompt([
          {
            type: 'input',
            message: '请填写组件描述',
            name: 'desc',
          },
        ])
      ).desc
    }
    const selectTemplateList = this.templates.filter((t) => t.tags.includes(answer.type))
    if (!selectTemplateList || selectTemplateList.length === 0) throw new Error(`${answer.type}类似模板不存在`)
    const selectedName = (
      await inquirer.prompt([
        {
          type: 'list',
          choices: selectTemplateList.map((t) => ({ name: t.label, value: t.npmName })),
          message: '请选择模板',
          name: 'selectedName',
        },
      ])
    ).selectedName

    this.projectInfo = {
      name: answer.packageName,
      version: answer.packageVersion,
      desc: answer.desc,
    }
    this.selectedTemplate = this.templates.find((t) => t.npmName === selectedName)
  }

  async confirmEmpty() {
    return (
      await inquirer.prompt([
        {
          type: 'confirm',
          name: 'isContinue',
          message: '当前文件夹不为空，是否继续创建项目？',
          default: false,
        },
      ])
    ).isContinue
  }

  async installTemplate() {
    if (this.selectedTemplate.type === 'normal') {
      await this.installNormalTemplate()
    } else if (this.selectedTemplate.type === 'custom') {
      await this.installCustomTemplate()
    } else {
      throw new Error('无法识别项目模板类型')
    }
  }

  async installNormalTemplate() {
    // 拷贝到当前目录
    await this.copyToDest()
    // ejs渲染
    await this.ejsRender()
    // 执行安装命令
    if (this.selectedTemplate?.installCommand) {
      await this.execCommand(this.selectedTemplate.installCommand, '安装命令执行失败！')
    }
    // 执行启动命令
    if (this.selectedTemplate?.startCommand) {
      await this.execCommand(this.selectedTemplate.startCommand, '启动命令执行失败！')
    }
  }

  async installCustomTemplate() {
    if (await this.pkg.exists()) {
      const rootFile = await this.pkg.getRootFilePath()
      if (fs.existsSync(rootFile)) {
        log.info('开始执行自定义模板', '')
        const templatePath = path.resolve(this.pkg.getCachePackageRootDir, 'template')
        const options = {
          templateInfo: this.selectedTemplate,
          projectInfo: this.projectInfo,
          sourcePath: templatePath,
          targetPath: process.cwd(),
        }
        const code = `require('${rootFile}')(${JSON.stringify(options)})`
        log.verbose('code', code)
        spawnSync('node', ['-e', code], { stdio: 'inherit', cwd: process.cwd() })
        log.success('自定义模板安装成功')
      } else {
        throw new Error('自定义模板入口文件不存在！')
      }
    }
  }

  async execCommand(command: string, errMsg = '命令执行失败！') {
    // 解析参数
    const [cmd, ...cmdArgs] = command.split(' ')
    if (!whiteCommandList.includes(cmd)) {
      throw new Error('命令不存在！命令：' + command)
    }
    const res = spawnSync(cmd, cmdArgs, {
      cwd: this.cwd,
      stdio: 'inherit',
    })
    // 检查子进程是否执行成功
    if (res.status === 0) {
      // 子进程成功执行
      log.success(command, '执行成功！')
    } else {
      // 子进程执行失败
      log.error('error', errMsg + '程序退出')
    }
  }

  async ejsRender() {
    const ignore = ['node_modules/**', ...(this.selectedTemplate?.ignore || [])]
    const files = await glob('**/*', { ignore, cwd: this.cwd, dot: true, nodir: true })

    const resolveFileList = files.map((file) => {
      const cwd = this.cwd
      return new Promise((resolve, reject) => {
        ejs.renderFile(path.resolve(cwd, file), this.projectInfo, {}, function (err, str) {
          if (err) reject(err)
          else {
            fs.writeFileSync(path.resolve(cwd, file), str)
            resolve(str)
          }
        })
      })
    })
    await Promise.all(resolveFileList)
    log.success('模板渲染成功')
  }

  async copyToDest() {
    const sourcePath = path.resolve(this.pkg.getCachePackageRootDir, 'template')
    fse.copySync(sourcePath, this.cwd)
  }

  // 当前目录是否为空
  async isDirEmpty() {
    let files = fs.readdirSync(this.cwd)
    files = files.filter((file) => !file.startsWith('.') && ['node_modules'].indexOf(file) < 0)
    return files.length === 0
  }
}

function init(argv) {
  return new InitCommand(argv)
}

export default init
