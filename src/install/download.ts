import http from 'node:http'
import https from 'node:https'
import { URL } from 'node:url'
import { getProxy } from './url'
import { logger } from '@/common/log'

/**
 * 创建HTTP请求选项
 * @param urlStr URL字符串
 * @param method 请求方法
 * @returns HTTP请求选项
 */
const getRequestOptions = (urlStr: string, method: string = 'GET'): {
  /** HTTP请求选项 */
  options: http.RequestOptions,
  /** HTTP客户端 */
  client: typeof http | typeof https
} => {
  const urlObj = new URL(urlStr)
  const { protocol } = urlObj
  const client = protocol === 'https:' ? https : http

  const { http: httpProxy, https: httpsProxy } = getProxy()
  const proxyToUse = protocol === 'https:' ? httpsProxy : httpProxy

  const options: http.RequestOptions = {
    method,
    host: urlObj.hostname,
    path: urlObj.pathname + urlObj.search,
    port: urlObj.port || (protocol === 'https:' ? 443 : 80)
  }

  // 如果存在代理，设置代理相关选项
  if (proxyToUse) {
    const proxy = new URL(proxyToUse)
    options.host = proxy.hostname
    options.port = proxy.port ? parseInt(proxy.port, 10) : 80
    options.path = urlStr // 使用完整URL作为路径
    if (proxy.username || proxy.password) {
      const auth = `${proxy.username}:${proxy.password}`
      options.headers = {
        'Proxy-Authorization': `Basic ${Buffer.from(auth).toString('base64')}`
      }
    }
  }

  return { options, client }
}

/**
 * 网络探针测试 传入多个url，返回最快的一个
 * @param urls URL列表
 * @param timeout 超时时间，单位秒，默认2秒
 * @returns 最快的URL 如果所有URL都超时则返回null
 */
export const probe = async (
  urls: string[],
  timeout: number = 2
): Promise<string | null> => {
  if (!urls.length) {
    throw new Error('No URLs provided for probe')
  }

  // 为每个URL创建一个Promise
  const probePromises = urls.map(url => {
    return new Promise<string>((resolve, reject) => {
      const { options, client } = getRequestOptions(url, 'HEAD')

      const request = client.request(options, () => {
        resolve(url)
      })

      // 设置超时
      const timeoutId = setTimeout(() => {
        request.destroy()
        reject(new Error(`Timeout connecting to ${url}`))
      }, timeout * 1000)

      request.on('error', reject)

      request.on('close', () => {
        clearTimeout(timeoutId)
      })

      request.end()
    })
  })

  try {
    // 使用Promise.race获取最快响应的URL
    return await Promise.race(probePromises)
  } catch (error) {
    return null
  }
}

/**
 * 下载文件，支持自动跟随重定向，并返回 Buffer
 * @param url 下载地址
 * @param timeout 超时时间（秒），默认 10 秒
 * @param maxRedirects 最大重定向次数，默认 5 次
 * @returns 成功返回 Buffer，失败返回 null
 */
export const download = async (
  url: string,
  timeout: number = 10,
  maxRedirects: number = 5
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const attemptDownload = (currentUrl: string, redirectsLeft: number) => {
      if (redirectsLeft <= 0) {
        return reject(new Error('Too many redirects'))
      }

      const { options, client } = getRequestOptions(currentUrl, 'GET')

      let request: http.ClientRequest | null = null
      const chunks: Buffer[] = []

      const timeoutId = setTimeout(() => {
        if (request) request.destroy()
        reject(new Error(`Download timeout after ${timeout} seconds`))
      }, timeout * 1000)

      request = client.get(options, (response) => {
        if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          // 处理重定向
          const redirectUrl = new URL(response.headers.location, currentUrl).href
          logger.info(`Redirecting to: ${redirectUrl}`)
          clearTimeout(timeoutId)
          attemptDownload(redirectUrl, redirectsLeft - 1)
          return
        }

        if (response.statusCode !== 200) {
          clearTimeout(timeoutId)
          return reject(new Error(`Failed to download: ${response.statusCode} ${response.statusMessage}`))
        }

        response.on('data', (chunk) => chunks.push(chunk))

        response.on('end', () => {
          clearTimeout(timeoutId)
          const buffer = Buffer.concat(chunks)
          logger.info(`Download success: ${currentUrl} (${buffer.length} bytes)`)
          resolve(buffer)
        })
      })

      request.on('error', (err) => {
        clearTimeout(timeoutId)
        reject(err)
      })
    }

    attemptDownload(url, maxRedirects)
  })
}
