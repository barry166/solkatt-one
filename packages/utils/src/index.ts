import path from 'node:path'
import fs from 'node:fs'
import { pathExists } from 'path-exists'
import log from './log'

export * from './npmInfo'

export const readJsonFile = (filePath: string) => {
  if (!filePath) return
  try {
    const code = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(code)
  } catch (e) {
    throw new Error(e)
  }
}

/**
 * 获取package包入口文件
 * @param packageDir
 */
export const getPackageInputFile = async (packageDir: string) => {
  if (!(await pathExists(packageDir))) return null
  const pkgPath = path.resolve(packageDir, 'package.json')
  const pkg = readJsonFile(pkgPath)
  const inputReleativePath = getPackageInputRelativePath(pkg)
  console.log('inputReleativePath', inputReleativePath)
	return path.resolve(packageDir, inputReleativePath)
}

export const getPackageInputRelativePath = (pkg) => {
  // 判断是否Esm
  if (pkg?.type === 'module') {
    if (pkg?.exports) {
      if (typeof pkg.exports === 'string') return pkg.exports
      if (pkg.exports['.'] && typeof pkg.exports['.'] === 'string')
        return pkg.exports['.']
      if (
        pkg.exports['.'] &&
        pkg.exports['.'] &&
        typeof pkg.exports['.']['import'] === 'string'
      )
        return pkg.exports['.']['import']
    }
  }
  return pkg?.main || 'index.js' || 'main.js'
}

export { log }
