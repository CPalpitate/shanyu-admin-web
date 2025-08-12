/**
 * 主题相关工具函数
 */

/**
 * 设置HTML元素暗黑模式
 * @param isDark 是否暗黑模式
 */
export function setHtmlDarkMode(isDark: boolean): void {
  // 获取HTML元素
  const htmlEl = document.querySelector('html')
  
  if (!htmlEl) return
  
  // 根据isDark参数添加或移除dark类
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  
  // 同时设置暗黑模式meta标签，用于兼容一些浏览器的暗黑模式
  setDarkModeMeta(isDark)
}

/**
 * 设置暗黑模式meta标签
 * @param isDark 是否暗黑模式
 */
export function setDarkModeMeta(isDark: boolean): void {
  // 获取已有的主题颜色meta标签
  let meta = document.querySelector('meta[name="theme-color"]')
  
  // 如果不存在则创建一个
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', 'theme-color')
    document.head.appendChild(meta)
  }
  
  // 设置content属性值，根据是否为暗黑模式设置不同的颜色
  meta.setAttribute('content', isDark ? '#171717' : '#ffffff')
}

/**
 * 根据用户操作系统设置，判断是否应该使用暗黑模式
 * @returns 是否暗黑模式
 */
export function isOsThemeDark(): boolean {
  // 使用媒体查询判断操作系统是否为暗黑模式
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * 监听操作系统主题变化
 * @param callback 回调函数，接收一个boolean参数表示是否为暗黑模式
 */
export function listenOsThemeChange(callback: (isDark: boolean) => void): void {
  // 获取媒体查询对象
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  
  // 添加监听器
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', (e) => {
      callback(e.matches)
    })
  } else {
    // 旧版浏览器兼容
    mediaQuery.addListener((e) => {
      callback(e.matches)
    })
  }
} 