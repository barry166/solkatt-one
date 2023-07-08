import path from 'node:path'
import { Package } from '@solkatt-one/models'
import { log } from '@solkatt-one/utils'
// import { pathExists } from 'path-exists'

const packagesMap = {
  // init: '@solkatt-one/init',
  init: 'axios',
  publish: '@solkatt-one/publish',
}

const cache_dir = 'dependencies'

async function exec() {
  console.log('exec', process.env.CLI_TARGET_PATH)
  let targetPath = process.env.CLI_TARGET_PATH || ''
  // eslint-disable-next-line prefer-rest-params
  const cmdObj = arguments[arguments.length - 1]
  const cmdName = cmdObj.name()
  const packageName = packagesMap[cmdName]
  const packageVersion = '1.3.4'
  let pkg: Package
  if (!targetPath) {
    targetPath = path.resolve(process.env.CLI_HOME_PATH, cache_dir)
    const storeDir = path.join(targetPath, 'node_modules')
    pkg = new Package({
      targetPath, //npm install root dir
      storeDir, // npm modules store dir, default is `${targetDir}/node_modules`
      packageName,
      packageVersion,
    })
    if (await pkg.exists()) {
      await pkg.update()
    } else {
      await pkg.install()
    }
  } else {
    pkg = new Package({
      targetPath,
      packageName,
      packageVersion,
    })
  }
  const rootFilePath = await pkg.getRootFilePath()
  log.verbose('rootFilePath', rootFilePath)
  // if (await pathExists(rootFilePath)) {
  // }
}

export default exec
