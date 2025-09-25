import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 重新导出各store模块，方便全局引用
export { useAppStore } from './app'
export { useAuthStore } from './auth'

/**
 * 安装Pinia状态管理的函数
 * @param app Vue应用实例
 */
export function installPinia(app: App) {
  // 创建Pinia实例
  const pinia = createPinia()
  
  // 使用持久化插件，让状态可以保存在浏览器本地存储中
  pinia.use(piniaPluginPersistedstate)
  
  // 将Pinia安装到Vue应用中
  app.use(pinia)
  
  return pinia
} 