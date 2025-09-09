/**
 * 数字格式化工具
 * 
 * 提供数字格式化的相关功能
 */

/**
 * 格式化数字（添加千分位分隔符）
 * @param num 数字
 * @param decimals 小数位数
 * @returns 格式化后的数字字符串
 */
export function formatNumber(num: number, decimals: number = 0): string {
  if (isNaN(num)) {
    return '0'
  }
  
  const parts = num.toFixed(decimals).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  
  return parts.join('.')
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @param decimals 小数位数
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) {
    return '0 Bytes'
  }
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * 格式化百分比
 * @param num 数字
 * @param decimals 小数位数
 * @returns 格式化后的百分比字符串
 */
export function formatPercent(num: number, decimals: number = 2): string {
  if (isNaN(num)) {
    return '0%'
  }
  
  return (num * 100).toFixed(decimals) + '%'
}

/**
 * 格式化货币
 * @param num 数字
 * @param currency 货币符号
 * @param decimals 小数位数
 * @returns 格式化后的货币字符串
 */
export function formatCurrency(num: number, currency: string = '¥', decimals: number = 2): string {
  if (isNaN(num)) {
    return currency + '0'
  }
  
  return currency + formatNumber(num, decimals)
}

/**
 * 数字转中文
 * @param num 数字
 * @returns 中文数字字符串
 */
export function numberToChinese(num: number): string {
  const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const units = ['', '十', '百', '千', '万', '十', '百', '千', '亿']
  
  if (num === 0) {
    return chineseNums[0]
  }
  
  const numStr = String(num)
  let result = ''
  
  for (let i = 0; i < numStr.length; i++) {
    const digit = parseInt(numStr[i])
    const unit = units[numStr.length - 1 - i]
    
    if (digit === 0) {
      if (result && !result.endsWith('零')) {
        result += chineseNums[0]
      }
    } else {
      result += chineseNums[digit] + unit
    }
  }
  
  return result
} 