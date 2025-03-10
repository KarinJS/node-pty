# @karinjs/node-pty

一个轻量级的 node-pty 预编译包,基于 [@homebridge/node-pty-prebuilt-multiarch](https://github.com/homebridge/node-pty-prebuilt-multiarch) 优化。

[English](./README.en.md) | 简体中文

## 特点

- 🚀 极致轻量: 移除源代码,仅保留必要的预编译二进制文件
- 🇨🇳 国内加速: 默认使用 npmmirror.com 镜像,无需额外配置
- 💪 多架构支持: 支持主流操作系统和CPU架构
- 🔧 开箱即用: 无需编译,支持多种包管理器

> [!WARNING]  
> 目前仅在 Windows Node.js 环境下完成测试。其他环境（Linux、macOS等）的兼容性需要用户自行验证。如遇到问题，欢迎反馈。

## 安装

使用 npm:

```bash
npm install @karinjs/node-pty
```

使用 yarn:

```bash
yarn add @karinjs/node-pty
```

使用 pnpm:

```bash
pnpm add @karinjs/node-pty
```

使用别名安装:

```bash
npm install node-pty:@karinjs/node-pty
# or
npm install @homebridge/node-pty-prebuilt-multiarch:@karinjs/node-pty
```

## 支持的环境

| 操作系统      | 架构                      |
| ------------- | ------------------------- |
| macOS         | x64, arm64                |
| Linux (glibc) | ia32, x64, armv6, aarch64 |
| Linux (musl)  | x64, armv6, aarch64       |
| Windows       | ia32, x64                 |

> 注意: 仅支持 Node.js 16+ 和 Electron 16.0.0+ 版本(不含 Electron 28)

## 注意事项

由于采用预编译的方式分发,包的安装依赖于网络环境的稳定性。如果遇到下载问题,可以:

1. 使用代理
2. 切换到其他包管理器
3. 多次重试安装

## 版本对照

| @karinjs/node-pty | @homebridge/node-pty-prebuilt-multiarch |
| ----------------- | --------------------------------------- |
| 1.0.1             | 0.11.14                                 |

## 上游项目

本项目基于以下优秀的开源项目:

- [microsoft/node-pty](https://github.com/microsoft/node-pty) - 原始的 node-pty 项目
- [homebridge/node-pty-prebuilt-multiarch](https://github.com/homebridge/node-pty-prebuilt-multiarch) - 提供多架构预编译支持

## 开源许可

本项目基于 MIT 协议开源。感谢以下项目的贡献:

- Copyright (c) 2012-2015, Christopher Jeffrey (MIT License)
- Copyright (c) 2016, Daniel Imms (MIT License)
- Copyright (c) 2018, Microsoft Corporation (MIT License)
- Copyright (c) 2018, David Wilson (MIT License)
- Copyright (c) 2018, oznu (MIT License)
- Copyright (c) 2023, Homebridge (MIT License)

