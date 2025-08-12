// 导入Vue应用类型
import type { App } from 'vue'
// 导入Vue Router的核心功能
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
// 导入路由守卫设置函数
import { setupRouterGuard } from './guard'
// 导入路由配置
import { routes } from './routes'

// 从环境变量中获取路由模式和基础URL
const { VITE_ROUTE_MODE = 'hash', VITE_BASE_URL = '/' } = import.meta.env

/**
 * 创建路由实例
 */
export const router = createRouter({
  // 根据环境变量配置选择哈希模式或历史模式
  // 哈希模式不需要服务器配置，更适合静态部署
  // 历史模式需要服务器配置，但URL更美观
  history: VITE_ROUTE_MODE === 'hash' 
    ? createWebHashHistory(VITE_BASE_URL) 
    : createWebHistory(VITE_BASE_URL),
  // 路由配置数组，定义了URL路径与组件的映射关系
  routes,
  /* 是否应该抑制导航故障
  该选项启用 严格路径匹配模式：
  作用：
  检查路由路径是否严格匹配（包括末尾斜杠 /）。
  示例：
  strict: true → /user 和 /user/ 视为不同路径。
  strict: false → /user 和 /user/ 视为相同路径。
  默认值：false
  */
  strict: true,
  // 滚动行为控制 功能每次导航到新路由后，将页面滚动到顶部（top: 0）和左侧（left: 0）。
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

/**
 * 安装Vue路由的函数
 * @param app Vue应用实例
 */
export async function installRouter(app: App) {
  // 设置路由守卫(如登录检查、权限控制等)
  setupRouterGuard(router)
  // 将路由实例安装到Vue应用
  app.use(router)
  // 等待路由准备就绪后再继续
  await router.isReady()
} 