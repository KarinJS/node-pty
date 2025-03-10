import fs from 'node:fs'
import { VERSION, PKG_NAME } from '@/version'

/**
 * 获取runtime
 */
const getRuntime = (): 'electron' | 'node' => {
  if (process.env.npm_config_runtime) {
    return process.env.npm_config_runtime as 'electron' | 'node'
  }

  return process.versions.electron ? 'electron' : 'node'
}

/**
 * 获取abi
 */
const getAbi = () => {
  return process.versions.modules
}

/**
 * 获取当前平台
 */
const getPlatform = () => {
  if (process.env.npm_config_platform) {
    return process.env.npm_config_platform
  }

  /** 如果是darwin或win32直接返回即可 */
  if (process.platform === 'darwin' || process.platform === 'win32') {
    return process.platform
  }

  /** 如果非linux 则是不支持的架构 */
  if (process.platform !== 'linux') {
    throw new Error('Unsupported platform')
  }

  /**
   * 判断是否是musl
   */
  const isMusl = (): boolean => {
    /** musl 链接器 */
    const musl = [
      '/lib/ld-musl-x86_64.so.1',
      '/lib/ld-musl-aarch64.so.1',
      '/lib/ld-musl-armhf.so.3',
      '/lib/ld-musl-i386.so.1'
    ].some(path => fs.existsSync(path))

    if (musl) return true

    try {
      /** 检查发行版 */
      if (fs.existsSync('/etc/os-release')) {
        const osRelease = fs.readFileSync('/etc/os-release', 'utf8')
        return osRelease.includes('Alpine')
      }
    } catch {
      return false
    }

    return false
  }

  return isMusl() ? 'linuxmusl' : 'linux'
}

/**
 * 获取当前架构 arch
 */
const getArch = () => {
  if (process.env.npm_config_arch) {
    return process.env.npm_config_arch
  }
  return process.arch
}

/**
 * 获取当前版本对应的文件名称
 * @param version 版本号
 */
export const getFileName = () => {
  const platform = getPlatform()
  const runtime = getRuntime()
  const abi = getAbi()
  const arch = getArch()
  return `${PKG_NAME}-v${VERSION}-${runtime}-v${abi}-${platform}-${arch}.tar.gz`
}
