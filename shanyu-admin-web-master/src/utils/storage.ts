/**
 * 本地存储工具函数
 * 封装localStorage和sessionStorage的操作
 */

/**
 * 默认缓存期限（7天）
 */
const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7

/**
 * 创建本地存储对象
 * @param {Storage} storage 存储对象，localStorage或sessionStorage
 */
export const createStorage = (storage: Storage = localStorage) => {
  /**
   * 存储类
   * @class Storage
   */
  class StorageUtil {
    private storage: Storage
    private prefixKey: string

    constructor(storage: Storage, prefixKey = '') {
      this.storage = storage
      this.prefixKey = prefixKey
    }

    /**
     * 获取存储的键名
     * @param {string} key 键名
     * @returns {string}
     */
    private getKey(key: string) {
      return `${this.prefixKey}${key}`.toUpperCase()
    }

    /**
     * 设置缓存
     * @param {string} key 键名
     * @param {*} value 值
     * @param {number} expire 过期时间，单位秒，默认7天
     */
    set(key: string, value: any, expire: number = DEFAULT_CACHE_TIME) {
      const stringData = JSON.stringify({
        value,
        expire: expire !== null ? new Date().getTime() + expire * 1000 : null,
      })
      this.storage.setItem(this.getKey(key), stringData)
    }

    /**
     * 获取缓存
     * @param {string} key 键名
     * @param {*} def 默认值
     * @returns {*}
     */
    get<T = any>(key: string, def: any = null): T {
      const item = this.storage.getItem(this.getKey(key))
      if (item) {
        try {
          const data = JSON.parse(item)
          const { value, expire } = data
          // 在有效期内直接返回
          if (expire === null || expire >= Date.now()) {
            return value
          }
          // 已过期则删除
          this.remove(key)
        } catch (e) {
          return def
        }
      }
      return def
    }

    /**
     * 删除缓存
     * @param {string} key 键名
     */
    remove(key: string) {
      this.storage.removeItem(this.getKey(key))
    }

    /**
     * 清空当前实例前缀的所有缓存
     */
    clear() {
      Object.keys(this.storage).forEach((key) => {
        if (key.startsWith(this.prefixKey)) {
          this.storage.removeItem(key)
        }
      })
    }

    /**
     * 清空所有缓存
     */
    clearAll() {
      this.storage.clear()
    }
  }

  return new StorageUtil(storage)
}

// 创建localStorage缓存
export const local = createStorage(localStorage)

// 创建sessionStorage缓存
export const session = createStorage(sessionStorage)

/**
 * 获取本地缓存的设置
 * @param key 设置键名
 * @param defaultValue 默认值
 * @returns 设置值
 */
export function getLocalSetting<T>(key: string, defaultValue: T): T {
  const localValue = local.get(key)
  return localValue !== null ? localValue : defaultValue
} 