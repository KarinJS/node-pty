# @karinjs/node-pty

A lightweight prebuilt node-pty package, optimized based on [@homebridge/node-pty-prebuilt-multiarch](https://github.com/homebridge/node-pty-prebuilt-multiarch).

English | [简体中文](./README.md)

## Features

- 🚀 Ultra-lightweight: Removed source code, keeping only necessary prebuilt binaries
- 🇨🇳 China-friendly: Uses npmmirror.com mirror by default
- 💪 Multi-arch support: Supports major operating systems and CPU architectures
- 🔧 Ready to use: No compilation needed, supports multiple package managers

> [!WARNING]  
> Currently only tested in Windows Node.js environment. Compatibility with other environments (Linux, macOS, etc.) needs to be verified by users. Feedback is welcome if you encounter any issues.

## Installation

Using npm:

```bash
npm install @karinjs/node-pty
```

Using yarn:

```bash
yarn add @karinjs/node-pty
```

Using pnpm:

```bash
pnpm add @karinjs/node-pty
```

Using aliases:

```bash
npm install node-ptym:@karinjs/node-pty
# or
npm install @homebridge/node-pty-prebuilt-multiarch:@karinjs/node-pty
```

## Supported Environments

| OS            | Architectures             |
| ------------- | ------------------------- |
| macOS         | x64, arm64                |
| Linux (glibc) | ia32, x64, armv6, aarch64 |
| Linux (musl)  | x64, armv6, aarch64       |
| Windows       | ia32, x64                 |

> Note: Only supports Node.js 16+ and Electron 16.0.0+ (excluding Electron 28)

## Notes

Since this package is distributed in prebuilt form, installation depends on network stability. If you encounter download issues, you can:

1. Use a proxy
2. Switch to another package manager
3. Retry installation multiple times

## Version Mapping

| @karinjs/node-pty | @homebridge/node-pty-prebuilt-multiarch |
| ----------------- | --------------------------------------- |
| 1.0.2             | 0.11.14                                 |

## Upstream Projects

This project is based on these excellent open source projects:

- [microsoft/node-pty](https://github.com/microsoft/node-pty) - Original node-pty project
- [homebridge/node-pty-prebuilt-multiarch](https://github.com/homebridge/node-pty-prebuilt-multiarch) - Provides multi-architecture prebuilt support

## License

This project is open-sourced under the MIT License. Thanks to the contributions from:

- Copyright (c) 2012-2015, Christopher Jeffrey (MIT License)
- Copyright (c) 2016, Daniel Imms (MIT License)
- Copyright (c) 2018, Microsoft Corporation (MIT License)
- Copyright (c) 2018, David Wilson (MIT License)
- Copyright (c) 2018, oznu (MIT License)
- Copyright (c) 2023, Homebridge (MIT License)

## Usage Example

```typescript
import * as os from 'node:os'
import * as pty from '@karinjs/node-pty'

async function run () {
  // Optional: Check and ensure binary compatibility with current environment
  await pty.init()
  
  const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash'
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
}

run()
```

## API

### Base API

This package supports all original APIs from [@homebridge/node-pty-prebuilt-multiarch](https://github.com/homebridge/node-pty-prebuilt-multiarch).

### Extended API

We've added the following new API on top of the original ones:

#### init()

The `init()` method checks if the prebuilt binary is compatible with the current Node.js/Electron environment. This method is optional and is mainly useful in the following scenarios:

- After switching Node.js or Electron versions, to verify compatibility
- When you need to reinstall binaries compatible with the current environment

> Tip: If you don't want to call the init() method, you can also directly run `npx pty` to reinstall binaries compatible with the current environment. 