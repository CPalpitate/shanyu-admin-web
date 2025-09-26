import type {Router} from "vue-router";
import {useAppStore, useAuthStore, usePermissionStore} from "@/store";
import {message} from '@/utils/message'

/**
 * 设置路由守卫
 * 用于处理路由跳转前的权限验证等逻辑
 * @param router 路由实例
 */
export function setupRouterGuard(router: Router) {
    createPageGuard(router)
    createPermissionGuard(router)
    createPageTitleGuard(router)

    // 用 meta.scrollable 控制“内容区能否滚动”
    router.afterEach((to) => {
        const app = useAppStore()
        // 找到离当前路由最近的一条，谁定义了 scrollable 就用谁
        const record = [...to.matched].reverse().find(r => 'scrollable' in (r.meta || {}))
        const scrollable = record?.meta?.scrollable
        // 默认不可滚：只有 meta.scrollable === true 才允许滚动
        app.setPageScrollable(scrollable === true)
    })
}

/**
 * 创建页面加载守卫
 * 在页面跳转时显示加载进度条
 * @param router 路由实例
 */
function createPageGuard(router: Router) {
    router.beforeEach(() => {
        // 显示加载进度条
        window.$loadingBar?.start()
        return true
    })

    router.afterEach(() => {
        // 完成加载进度条
        window.$loadingBar?.finish()
    })

    router.onError(() => {
        // 发生错误时结束加载进度条
        window.$loadingBar?.error()
    })
}

/**
 * 创建权限守卫
 * 在页面跳转时进行权限验证
 * @param router 路由实例
 */
function createPermissionGuard(router: Router) {
    router.beforeEach(async (to, _from, next) => {
        // 获取认证状态
        const authStore = useAuthStore()
        const loggedIn = authStore.isLoggedIn

        // 白名单路由，不需要登录即可访问
        const whiteList = ['/login', '/403', '/404', '/500']

        // 如果访问的是白名单页面，直接放行
        if (whiteList.includes(to.path)) {
            // 如果已登录且要访问登录页，重定向到首页
            if (loggedIn && to.path === '/login') {
                next({path: '/'})
            } else {
                next()
            }
            return
        }

        // 如果未登录，跳转到登录页
        if (!loggedIn) {
            next({path: '/login', query: {redirect: to.fullPath}})
            return
        }

        if (import.meta.env.VITE_AUTH_MODE === 'dynamic') {
            const permissionStore = usePermissionStore()
            if (!permissionStore.isDynamicAdded) {
                try {
                    // 当首次进入受保护页面时，请求后端动态路由并注册到 vue-router 中
                    const routes = await permissionStore.buildRoutes()
                    routes.forEach(route => router.addRoute(route))
                    next({...to, replace: true})
                    return
                } catch (error) {
                    console.error('加载动态路由失败:', error)
                    // 动态路由加载失败时兜底处理：提示、退出登录并回到登录页
                    message.error('加载动态路由失败，请重新登录')
                    await authStore.logout()
                    next({path: '/login', query: {redirect: to.fullPath}})
                    return
                }
            }
        } else {
            const permissionStore = usePermissionStore()
            if (!permissionStore.perms.length) {
                try {
                    // 静态路由模式下仍需拉取一次权限点集合，供按钮级别校验使用
                    await permissionStore.loadUserPermissions()
                } catch (error) {
                    console.error('加载权限失败:', error)
                }
            }
        }

        // 已登录状态，允许访问
        next()
    })
}

/**
 * 创建页面标题守卫
 * 在页面跳转时设置文档标题
 * @param router 路由实例
 */
function createPageTitleGuard(router: Router) {
    router.afterEach((to) => {
        // 获取应用状态
        const appStore = useAppStore()

        // 如果路由元数据中有标题，则设置为文档标题
        if (to.meta?.title) {
            document.title = `${to.meta.title as string} - ${appStore.title}`
        } else {
            document.title = appStore.title
        }
    })
}
