import fs from 'node:fs'
import axios from 'axios'
import decompress from 'decompress'
import { VERSION, NPM_PKG_NAME, _PKG_NAME } from './version'
import path from 'node:path'

const main = async () => {
  const url = `https://registry.npmjs.org/${NPM_PKG_NAME}/${VERSION}`
  const registry = await axios.get(url)
  const { tarball } = registry.data.dist

  /** 下载 */
  const response = await axios.get(tarball, { responseType: 'arraybuffer' })
  const buffer = Buffer.from(response.data)

  /** 解压路径 */
  const tmp = './tmp'
  fs.mkdirSync(tmp, { recursive: true })
  await decompress(buffer, tmp)

  /** 解压后的pkg路径 */
  const pkgPath = `${tmp}/package`
  const dts = `${pkgPath}/typings/node-pty.d.ts`
  const lib = `${pkgPath}/lib`

  /** 修改node-pty.d中包名 */
  const data = fs.readFileSync(dts, 'utf-8')
  fs.writeFileSync(
    path.resolve(lib, 'index.d.ts'),
    data.replace('@homebridge/node-pty-prebuilt-multiarch', _PKG_NAME)
  )

  /**
   * 递归删除lib文件夹下 后缀.map、 test.js后缀的
   * @param dir 目录
   */
  const rm = (dir: string) => {
    fs.readdirSync(dir).forEach(file => {
      const filePath = path.resolve(dir, file)
      if (fs.statSync(filePath).isDirectory()) {
        rm(filePath)
      } else {
        if (file.endsWith('.map') || file.endsWith('.test.js')) {
          fs.unlinkSync(filePath)
        }
      }
    })
  }

  /**
   * 递归复制
   * @param src 源路径
   * @param dest 目标路径
   */
  const cp = (src: string, dest: string) => {
    fs.readdirSync(src).forEach(file => {
      const srcPath = path.resolve(src, file)
      const destPath = path.resolve(dest, file)
      if (fs.statSync(srcPath).isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true })
        cp(srcPath, destPath)
        return
      }

      fs.copyFileSync(srcPath, destPath)
    })
  }

  rm(lib)
  const destLib = path.resolve(process.cwd(), 'lib')
  fs.mkdirSync(destLib, { recursive: true })
  cp(lib, destLib)
  fs.rmdirSync(tmp, { recursive: true })
  process.exit(0)
}

main()
