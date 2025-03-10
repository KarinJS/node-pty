import * as os from 'node:os'
import * as pty from './index.js'

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash'
await pty.init()
const ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.HOME,
  env: process.env
})

ptyProcess.onData((data) => {
  process.stdout.write(data)
})

ptyProcess.write('ls\r')
ptyProcess.resize(100, 40)
ptyProcess.write('ls\r')
