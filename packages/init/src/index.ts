import { Command } from '@solkatt-one/models'

class InitCommand extends Command {
  init() {
    console.log('init command init..', this.cmdName, this.cmdOption)
  }

  exec() {
    console.log('init command exec..')
  }
}

function init(argv) {
  return new InitCommand(argv)
}

export default init
