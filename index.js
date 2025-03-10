'use strict'
Object.defineProperty(exports, '__esModule', { value: true })

const pty = require('./lib/index.js')
const main = require('./lib/scripts/index.js')

exports.init = main.main
exports.spawn = pty.spawn
exports.fork = pty.fork
exports.createTerminal = pty.createTerminal
exports.open = pty.open
exports.native = pty.native
