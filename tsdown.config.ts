import { defineConfig } from 'tsdown/config'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/worker/conoutSocketWorker.ts',
    'src/conpty_console_list_agent.ts'
  ],
  dts: true,
  format: ['esm'],
  target: 'node18',
  platform: 'node',
  sourcemap: false,
  clean: true,
  treeshake: true,
  shims: true,
  external: [
    '**/*.node',
    '../build/Release/pty.node',
    '../build/Release/conpty.node',
    '../build/Debug/pty.node',
    '../build/Release/conpty_console_list.node'
  ],
})
