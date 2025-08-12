/**
 * 类型判断工具函数
 */

const toString = Object.prototype.toString

/**
 * 判断是否为函数
 * @param val 待检测的值
 * @returns 是否为函数
 */
export function isFunction(val: unknown): val is (...args: any[]) => any {
  return typeof val === 'function'
}

/**
 * 判断是否为对象
 * @param val 待检测的值
 * @returns 是否为对象
 */
export function isObject(val: any): val is Record<any, any> {
  return val !== null && typeof val === 'object'
}

/**
 * 判断是否为数组
 * @param val 待检测的值
 * @returns 是否为数组
 */
export function isArray(val: any): val is Array<any> {
  return Array.isArray(val)
}

/**
 * 判断是否为字符串
 * @param val 待检测的值
 * @returns 是否为字符串
 */
export function isString(val: unknown): val is string {
  return typeof val === 'string'
}

/**
 * 判断是否为数字
 * @param val 待检测的值
 * @returns 是否为数字
 */
export function isNumber(val: unknown): val is number {
  return typeof val === 'number'
}

/**
 * 判断是否为布尔值
 * @param val 待检测的值
 * @returns 是否为布尔值
 */
export function isBoolean(val: unknown): val is boolean {
  return typeof val === 'boolean'
}

/**
 * 判断是否为undefined
 * @param val 待检测的值
 * @returns 是否为undefined
 */
export function isUndefined(val: unknown): val is undefined {
  return typeof val === 'undefined'
}

/**
 * 判断是否为null
 * @param val 待检测的值
 * @returns 是否为null
 */
export function isNull(val: unknown): val is null {
  return val === null
}

/**
 * 判断是否为null或undefined
 * @param val 待检测的值
 * @returns 是否为null或undefined
 */
export function isNullOrUndefined(val: unknown): val is null | undefined {
  return isNull(val) || isUndefined(val)
}

/**
 * 判断是否为Promise对象
 * @param val 待检测的值
 * @returns 是否为Promise对象
 */
export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return (
    isObject(val) &&
    isFunction((val as any).then) &&
    isFunction((val as any).catch)
  )
}

/**
 * 判断是否为日期对象
 * @param val 待检测的值
 * @returns 是否为日期对象
 */
export function isDate(val: unknown): val is Date {
  return toString.call(val) === '[object Date]'
}

/**
 * 判断是否为正则表达式
 * @param val 待检测的值
 * @returns 是否为正则表达式
 */
export function isRegExp(val: unknown): val is RegExp {
  return toString.call(val) === '[object RegExp]'
}

/**
 * 判断是否为空值（null, undefined, '', [], {}）
 * @param val 待检测的值
 * @returns 是否为空值
 */
export function isEmpty(val: unknown): boolean {
  if (isNullOrUndefined(val)) {
    return true
  }
  
  if (isString(val) && val === '') {
    return true
  }
  
  if (isArray(val) && val.length === 0) {
    return true
  }
  
  if (isObject(val) && Object.keys(val).length === 0) {
    return true
  }
  
  return false
}

/**
 * 判断是否为浏览器环境
 * @returns 是否为浏览器环境
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

/**
 * 判断是否为移动设备
 * @returns 是否为移动设备
 */
export function isMobile(): boolean {
  if (!isBrowser()) return false
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * 判断是否为iOS设备
 * @returns 是否为iOS设备
 */
export function isIOS(): boolean {
  if (!isBrowser()) return false
  
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
} 