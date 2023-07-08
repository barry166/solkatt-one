import { packageDirectory } from 'pkg-dir'
import {
  getNpmLatestVersion,
  getPackageInputFile,
  log,
  npmTaobaoRegisterUrl,
} from '@solkatt-one/utils'
import npminstall from 'npminstall'
import { pathExists } from 'path-exists'

interface PackageOptions {
  targetPath?: string
  storeDir?: string
  packageName?: string
  packageVersion?: string
}

class Package {
  targetPath: string
  storeDir: string
  packageName: string
  packageVersion: string

  constructor(options: PackageOptions) {
    this.targetPath = options.targetPath
    this.storeDir = options.storeDir
    this.packageName = options.packageName
    this.packageVersion = options.packageVersion
  }

  async prepare() {
    this.packageVersion = await getNpmLatestVersion(this.packageName)
  }

  // 获取缓存目录中包的的一级目录
  get cachePackagePath() {
    return `${this.storeDir}/.store/${this.packageName}@${this.packageVersion}`
  }

  // 获取缓存目录中包的真实跟路径，在npminstall中，包存放格式为.store/${pkg}/node_modules/${pkg}下
  get getCachePackageRootDir() {
    return `${this.storeDir}/.store/${this.packageName}@${this.packageVersion}/node_modules/${this.packageName}`
  }

  // 查看包是否存在
  async exists() {
    if (this.storeDir) {
      return await pathExists(this.cachePackagePath)
    }
    return await pathExists(this.targetPath)
  }

  async install() {
    await npminstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      registry: npmTaobaoRegisterUrl,
      pkgs: [{ name: this.packageName, version: this.packageVersion }],
    })
  }

  async update() {
    await this.prepare()
    if (!(await pathExists(this.cachePackagePath))) {
      log.verbose(this.packageName, 'is updating...')
      await npminstall({
        root: this.targetPath,
        storeDir: this.storeDir,
        registry: npmTaobaoRegisterUrl,
        pkgs: [{ name: this.packageName, version: this.packageVersion }],
      })
    }
  }

  async getRootFilePath() {
    //todo
    async function _getRootFilePath(targetPath: string) {
      const packageDir = await packageDirectory({
        cwd: targetPath,
      })
      if (!packageDir) return null
      const rootFile = await getPackageInputFile(packageDir)
      return rootFile
    }

    let rootFilePath
    if (this.storeDir) {
      rootFilePath = await _getRootFilePath(this.getCachePackageRootDir)
    } else {
      rootFilePath = await _getRootFilePath(this.targetPath)
    }
    return rootFilePath
  }
}

export default Package
