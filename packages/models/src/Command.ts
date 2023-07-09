class Command {
  _argv: any[]
  cmdName: string
  cmdOption: { [key: string]: any } = {}
  runner: Promise<any>
  constructor(argv) {
    if (!argv || !Array.isArray(argv))
      throw new Error('Command argv参数必须传入且为数组')
    this._argv = argv
    this.runner = new Promise((resolve, reject) => {
      let chain = Promise.resolve()
      chain = chain.then(() => this.processInputArgs())
      chain = chain.then(() => this.init())
      chain = chain.then(() => this.exec())

      chain.catch((err) => {
        console.error(err)
        reject(err)
      })
    })
  }

  processInputArgs() {
    this.cmdName = this._argv[0]
    this.cmdOption = this._argv[1]
  }

  init() {
    throw new Error('init必须被实现')
  }

  exec() {
    throw new Error('exec必须被实现')
  }
}

export default Command
