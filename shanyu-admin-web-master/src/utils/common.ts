/**
 * 通用工具函数
 */

/**
 * 休眠函数，用于等待指定时间
 * @param ms 等待时间（毫秒）
 * @returns Promise<void>
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 防抖函数，用于限制函数的调用频率
 * @param fn 需要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: number | null = null
  
  return function(this: any, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer)
    }
    
    timer = window.setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

/**
 * 节流函数，用于限制函数的调用频率
 * @param fn 需要节流的函数
 * @param delay 延迟时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let last = 0
  
  return function(this: any, ...args: Parameters<T>) {
    const now = Date.now()
    
    if (now - last > delay) {
      fn.apply(this, args)
      last = now
    }
  }
}

/**
 * 格式化日期
 * @param date 日期对象或时间戳
 * @param format 格式化字符串，如 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | number | string, format = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = new Date(date)
  
  const year = d.getFullYear().toString()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  const hour = d.getHours().toString().padStart(2, '0')
  const minute = d.getMinutes().toString().padStart(2, '0')
  const second = d.getSeconds().toString().padStart(2, '0')
  
  return format
    .replace(/YYYY/g, year)
    .replace(/MM/g, month)
    .replace(/DD/g, day)
    .replace(/HH/g, hour)
    .replace(/mm/g, minute)
    .replace(/ss/g, second)
}

/**
 * 生成随机字符串
 * @param length 字符串长度
 * @returns 随机字符串
 */
export function randomString(length = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise<boolean> 复制是否成功
 */
export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
      .then(() => true)
      .catch(() => false)
  }
  
  try {
    const input = document.createElement('textarea')
    input.value = text
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    return Promise.resolve(true)
  } catch (error) {
    return Promise.resolve(false)
  }
}

/**
 * 格式化文件大小
 * @param size 文件大小（字节）
 * @param decimals 小数位数
 * @returns 格式化后的文件大小
 */
export function formatFileSize(size: number, decimals = 2): string {
  if (size === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  
  const i = Math.floor(Math.log(size) / Math.log(k))
  
  return parseFloat((size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * 下载文件
 * @param url 文件URL
 * @param filename 文件名
 */
export function downloadFile(url: string, filename?: string): void {
  const link = document.createElement('a')
  link.href = url
  link.download = filename || url.split('/').pop() || 'download'
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
} 