import fs from 'node:fs'
import path from 'node:path'
import decompress from 'decompress'
import { logger } from '../common/log'
import { getUrl } from './url'
import { getFileName } from './filename'
import { download, probe } from './download'
import { VERSION_JSON_NAME } from '@/version'

/**
 * 递归创建目录
 */
const mkdir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    mkdir(path.dirname(dir))
    fs.mkdirSync(dir)
  }
}

/**
 * 获取基本路径
 */
const getPath = () => {
  /** 根目录 */
  const dir = path.resolve(__dirname, '../..')
  /** 二进制根目录 */
  const build = path.resolve(dir, 'build')
  /** package.json路径 */
  const pkg = path.resolve(dir, 'package.json')
  /** 保存当前二进制文件的json路径 */
  const versionData = path.resolve(build, VERSION_JSON_NAME)
  return {
    dir,
    build,
    pkg,
    versionData
  }
}

/**
 * 当前版本缓存
 */
const version = {
  set: (name: string) => {
    const dir = getPath().versionData
    fs.writeFileSync(dir, JSON.stringify({ name }))
  },
  get: (): { name: string } | null => {
    const dir = getPath().versionData
    if (!fs.existsSync(dir)) {
      return null
    }
    return JSON.parse(fs.readFileSync(dir, 'utf-8'))
  }
}

/**
 * 下载成功之后解压
 * @param data 下载的压缩包数据
 * @param destPath 目标路径
 * @param fileName 缓存文件名称
 */
const downloadAndUnzip = async (data: Buffer, destPath: string, fileName: string) => {
  mkdir(destPath)
  await decompress(data, destPath)
  logger.info('unzip Success:', destPath)

  version.set(fileName)
}

/**
 * 主函数
 * @param isForce 是否强制下载
 * @param isExit 执行完成后是否退出
 */
export const main = async (isForce = false) => {
  try {
    const fileName = getFileName()

    /** 判断已下载版本是否一致 */
    if (!isForce && version.get()?.name === fileName) {
      return
    }

    logger.info('name:', fileName)
    const dir = getPath()

    const url = getUrl(fileName)

    if (url.custom) {
      logger.info('download URL:', url.custom)

      try {
        const customResult = await download(url.custom)
        return await downloadAndUnzip(customResult, dir.dir, fileName)
      } catch {
        logger.error('failed to download custom binary, fallback to default')
      }
    }

    /** 探针 */
    const target = await probe([url.npmmirror, url.github]).then(res => res || url.npmmirror)
    logger.info('download URL:', target)

    const data = await download(target)
    await downloadAndUnzip(data, dir.dir, fileName)
  } catch (error) {
    logger.error('failed to download node-pty binary:')
    logger.error(error)
  }
}
