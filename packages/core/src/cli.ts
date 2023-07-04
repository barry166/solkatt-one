import { log } from '@solkatt-one/utils'
import pkg from '../package.json'
// import path from 'path'
// import fse from 'fs-extra'
// import { dirname } from 'dirname-filename-esm'
// import pkg from '../package.json';
// const __dirname = dirname(import.meta)

// const pkgPath = path.resolve(__dirname, '../package.json')
// const pkg = fse.readJSONSync(pkgPath)

async function core() {
  console.log('core')
  prepare()
}

function prepare() {
  checkPkgVersion()
}

function checkPkgVersion() {
  console.log('log', pkg)
  log.info('cli', 'test cli log')
}

// function checkNodeVersion () { }
// function checkRoot () { }
// function checkUserHome () { }
// function checkEnv () { }
// function checkGlobalUpdate () { }

export default core
