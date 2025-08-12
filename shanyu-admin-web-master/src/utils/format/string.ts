/**
 * 字符串格式化工具
 * 
 * 提供字符串格式化的相关功能
 */

/**
 * 截断字符串
 * @param str 字符串
 * @param length 最大长度
 * @param suffix 后缀
 * @returns 截断后的字符串
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (!str || str.length <= length) {
    return str
  }
  
  return str.substring(0, length) + suffix
}

/**
 * 首字母大写
 * @param str 字符串
 * @returns 首字母大写的字符串
 */
export function capitalize(str: string): string {
  if (!str) {
    return str
  }
  
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 驼峰命名转下划线
 * @param str 驼峰命名字符串
 * @returns 下划线命名字符串
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
}

/**
 * 下划线转驼峰命名
 * @param str 下划线命名字符串
 * @returns 驼峰命名字符串
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * 生成随机字符串
 * @param length 长度
 * @returns 随机字符串
 */
export function randomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * 生成UUID
 * @returns UUID字符串
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * 转义HTML字符
 * @param str 字符串
 * @returns 转义后的字符串
 */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
  }
  
  return str.replace(/[&<>"']/g, m => map[m])
}

/**
 * b64转图片
 * @param b64
 */
export function toDataUrl(b64: string) {
  if (!b64) return ''
  const clean = b64.replace(/\s/g, '') // 保险：去掉换行/空格
  return clean.startsWith('data:') ? clean : `data:image/png;base64,${clean}`
}

/**
 * 反转义HTML字符
 * @param str 字符串
 * @returns 反转义后的字符串
 */
export function unescapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': '\'',
  }
  
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, m => map[m])
} 