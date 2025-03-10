import fs from 'node:fs'
import path from 'node:path'
import decompress from 'decompress'
import { logger } from '../common/log'
import { getUrl } from './url'
import { getFileName } from './filename'
import { download, probe } from './download'

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
  const dir = path.resolve(__dirname, '../..')
  const build = path.resolve(dir, 'build')
  const pkg = path.resolve(dir, 'package.json')

  const release = path.resolve(build, 'Release')
  mkdir(release)
  return {
    dir,
    build,
    pkg,
    release
  }
}

/**
 * 下载成功之后解压
 * @param data 下载的压缩包数据
 * @param destPath 目标路径
 */
const downloadAndUnzip = async (data: Buffer, destPath: string) => {
  await decompress(data, destPath)
  logger.info('unzip Success:', destPath)
}

/**
 * 判断
 */
const main = async () => {
  try {
    const fileName = getFileName()
    logger.info('name:', fileName)

    const dir = getPath()
    const url = getUrl(fileName)

    if (url.custom) {
      logger.info('download URL:', url.custom)

      try {
        const customResult = await download(url.custom)
        return await downloadAndUnzip(customResult, dir.dir)
      } catch {
        logger.error('failed to download custom binary, fallback to default')
      }
    }

    /** 探针 */
    const target = await probe([url.npmmirror, url.github]).then(res => res || url.npmmirror)
    logger.info('download URL:', target)

    const data = await download(target)
    await downloadAndUnzip(data, dir.dir)
  } catch (error) {
    logger.error('failed to download node-pty binary:')
    logger.error(error)
  } finally {
    process.exit(0)
  }
}

main()
