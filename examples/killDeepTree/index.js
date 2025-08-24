import { platform } from 'os'
import { spawn } from '../../dist/index.js'

var shell = platform() === 'win32' ? 'powershell.exe' : 'bash'

var ptyProcess = spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: __dirname,
  env: process.env
})

ptyProcess.onData((data) => process.stdout.write(data))

ptyProcess.write('start notepad\r')
ptyProcess.write('npm start\r')

// Kill the tree at the end
setTimeout(() => {
  console.log('Killing pty')
  ptyProcess.kill()
}, 10000)
