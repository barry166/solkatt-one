import { Command } from '@solkatt-one/models'

class InitCommand extends Command {
  projectName: string
  force: boolean
  init() {
    console.log('init command init..', this.cmdName, this.cmdOption)
    this.projectName = this.cmdName
    this.force = this.cmdOption?.force
  }

  exec() {
    console.log('init command exec..')
  }
}

function init(argv) {
  return new InitCommand(argv)
}

export default init
