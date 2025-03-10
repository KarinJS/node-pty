const prefix = '[node-pty]'

/**
 * 简单的日志输出
 */
export const logger = {
  info (...msg: any[]) {
    console.log(`\x1b[32m${prefix}[info]\x1b[0m`, ...msg)
  },
  warn (...msg: any[]) {
    console.log(`\x1b[33m${prefix}[warn]\x1b[0m`, ...msg)
  },
  error (...msg: any[]) {
    console.log(`\x1b[31m${prefix}[error]\x1b[0m`, ...msg)
  },
}
