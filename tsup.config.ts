import { defineConfig } from 'tsup'
import type { Options } from 'tsup'

/**
 * @description `tsup` configuration options
 */
export const options: Options = {
  entry: ['src/install/index.ts', 'src/install/main.ts'], // 入口文件
  format: ['cjs'], // 输出格式
  target: 'node16', // 目标环境
  splitting: true, // 是否拆分文件
  sourcemap: false, // 是否生成 sourcemap
  clean: true, // 是否清理输出目录
  dts: false, // 是否生成 .d.ts 文件
  outDir: 'lib/scripts', // 输出目录
  treeshake: true, // 树摇优化
  minify: true, // 压缩代码
  external: [],
  ignoreWatch: [],
  noExternal: ['decompress'],
  shims: false,
}

export default defineConfig(options)
