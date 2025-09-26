import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 重新导出各 store 模块，方便全局引用
export { useAppStore } from './app'
export { useAuthStore } from './auth'
export { usePermissionStore } from './permission'

/**
 * 安装 Pinia 状态管理的函数
 * - 创建 Pinia 实例
 * - 注入持久化插件
 * - 将 Pinia 安装到根应用
 */
export function installPinia(app: App) {
  // 创建 Pinia 实例
  const pinia = createPinia()

  // 使用持久化插件，让状态可以保存在浏览器本地存储中
  pinia.use(piniaPluginPersistedstate)

  // 将 Pinia 安装到 Vue 应用中
  app.use(pinia)

  return pinia
}
