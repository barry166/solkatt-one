import path from 'node:path'
import fs from 'node:fs'
import { pathExists } from 'path-exists'
import { packageDirectory } from 'pkg-dir'
import ora, { Ora } from 'ora'
import log from './log'

export * from './npmInfo'
export * from './request'

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
  return path.resolve(packageDir, inputReleativePath)
}

export const getPackageInputRelativePath = (pkg) => {
  // 判断是否Esm
  if (pkg?.type === 'module') {
    if (pkg?.exports) {
      if (typeof pkg.exports === 'string') return pkg.exports
      if (pkg.exports['.'] && typeof pkg.exports['.'] === 'string') return pkg.exports['.']
      if (pkg.exports['.'] && pkg.exports['.'] && typeof pkg.exports['.']['import'] === 'string')
        return pkg.exports['.']['import']
    }
  }
  return pkg?.main || 'index.js' || 'main.js'
}

// 兼容window和mac路径格式
export function formatPath(p) {
  if (p && typeof p === 'string') {
    const sep = path.sep
    if (sep === '/') {
      return p
    } else {
      return p.replace(/\\/g, '/')
    }
  }
  return p
}

// 判断是否esmodule
export const isEsModule = async (filePath) => {
  const packageDir = await packageDirectory({
    cwd: filePath,
  })
  const pkgPath = path.resolve(packageDir, 'package.json')
  const pkg = readJsonFile(pkgPath)
  return pkg?.type === 'module'
}

export function spinnerStart(msg: string): Ora {
  const spinner = ora(msg).start()
  return spinner
}

export function sleep(timeout = 1000) {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

export { log }
