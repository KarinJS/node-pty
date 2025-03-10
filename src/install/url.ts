import { PKG_NAME, VERSION } from '../version'

/**
 * 获取环境变量前缀
 * @param pkgName 包名
 */
function getEnvPrefix (pkgName: string) {
  return 'npm_config_' + pkgName.replace(/[^a-zA-Z0-9]/g, '_').replace(/^_/, '')
}

/**
 * 获取二进制host地址
 * @param pkgName 包名
 */
const getHostMirrorUrl = (pkgName: string) => {
  const propName = getEnvPrefix(pkgName) + '_binary_host'
  return process.env[propName] || process.env[propName + '_mirror'] || null
}

/**
 * 获取github下载地址
 * @param fileName 文件名
 */
const getGithubUrl = (fileName: string) => {
  return `https://github.com/homebridge/${PKG_NAME}/releases/download/${VERSION}/${fileName}`
}

/**
 * 获取npmmirror下载地址
 */
const getNpmMirrorUrl = (fileName: string) => {
  return ` https://registry.npmmirror.com/-/binary/${PKG_NAME}/v${VERSION}/${fileName}`
}

/**
 * 获取环境变量下载地址
 */
const getEnvMirrorUrl = (fileName: string) => {
  const host = getHostMirrorUrl(PKG_NAME)
  if (!host) return host
  return `${host}/v${VERSION}/${fileName}`
}

/**
 * 获取代理
 */
export const getProxy = () => {
  return {
    http: process.env.http_proxy || process.env.http_proxy || process.env.HTTP_PROXY || null,
    https: process.env.https_proxy || process.env.https_proxy || process.env.HTTPS_PROXY || null
  }
}

/**
 * 获取下载地址
 * @param fileName 文件名
 */
export const getUrl = (fileName: string) => {
  return {
    github: getGithubUrl(fileName),
    npmmirror: getNpmMirrorUrl(fileName),
    custom: getEnvMirrorUrl(fileName)
  }
}
