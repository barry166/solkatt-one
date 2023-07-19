import axios from 'axios'
import semver from 'semver'

export const npmRegisterUrl = 'https://registry.npmjs.com'
export const npmTaobaoRegisterUrl = 'https://registry.npmmirror.com'

process.env.CLI_REGISTRY = process.env.CLI_REGISTRY ? process.env.CLI_REGISTRY : npmRegisterUrl

/**
 * 获取npm包信息
 * @param npmName
 * @param registry
 */
export const getNpmInfo = async (npmName: string, registry = process.env.CLI_REGISTRY) => {
  if (!npmName) return null
  const npmInfoUrl = `${registry}/${npmName}`
  const res = await axios.get(npmInfoUrl)
  return res.data
}

/**
 * 获取npm包的所有版本号
 * @param npmName
 * @param registry
 */
export const getNpmVersions = async (
  npmName: string,
  registry = process.env.CLI_REGISTRY
) => {
  const npmInfo = await getNpmInfo(npmName, registry)
  const versions = Object.keys(npmInfo.versions) || []
  return versions
}

/**
 * 获取npm包的最新版本号
 * @param npmName 
 * @param registry 
 * @returns 
 */
export const getNpmLatestVersion = async (
  npmName: string,
  registry = process.env.CLI_REGISTRY
) => {
  const npmVersions = await getNpmVersions(npmName, registry)
  const sortVersions = npmVersions.sort((a, b) => semver.gt(b, a) ? 1 : -1)
  return sortVersions[0]
}
