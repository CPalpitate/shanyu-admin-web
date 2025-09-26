import {defineStore} from 'pinia'
import type {AuthState, LoginParams, R} from '@/api'
import {authApi} from '@/api'
import {usePermissionStore} from './permission'

/**
 * 工具方法：根据路由名称批量移除动态注册的路由
 * 退出登录或切换账号时需要执行，防止保留旧权限
 */
async function removeDynamicRoutes(routeNames: string[]) {
    if (!routeNames.length) return
    const {router} = await import('@/router')
    routeNames.forEach((name) => {
        if (router.hasRoute(name)) router.removeRoute(name)
    })
}

/**
 * 认证相关的状态管理
 * 处理登录、注销、权限等功能
 */
export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        accessToken: '',
        tokenType: 'Bearer',
        expiresIn: 0,
        roles: [],
        user: null
    }),

    getters: {
        // 是否已登录
        isLoggedIn(): boolean {
            return !!this.accessToken && this.expiresIn > Date.now()
        },

        // 获取请求头
        authHeader(): string | null {
            return this.accessToken ? `${this.tokenType || 'Bearer'} ${this.accessToken}` : null
        },

        // 获取用户角色
        getRoles(): string[] {
            return this.roles
        },
    },

    actions: {
        /**
         * 登录（失败会抛出异常，调用处用 try/catch）
         * 1. 调用登录接口获取 token 信息
         * 2. 缓存 token / 用户信息
         * 3. 立即刷新一次权限列表，确保后续按钮鉴权可用
         */
        async login(loginData: LoginParams): Promise<void> {
            const res: R<AuthState> = await authApi.login(loginData)

            this.accessToken = res.data.accessToken
            this.tokenType = (res.data.tokenType || 'Bearer') as any
            this.expiresIn = Date.now() + (res.data.expiresIn ?? 0) * 1000
            this.user = res.data.user ?? null

            const permissionStore = usePermissionStore()
            await permissionStore.loadUserPermissions(true)
        },


        /**
         * 退出登录
         * 1. 调用后端注销接口（忽略错误）
         * 2. 清空本地权限/用户信息
         * 3. 按名称移除动态注入的路由
         */
        async logout() {
            try {
                await authApi.logout()
            } catch {
            }
            const permissionStore = usePermissionStore()
            const routeNames = permissionStore.addedRouteNames.slice()
            permissionStore.reset()
            this.$reset()
            await removeDynamicRoutes(routeNames)
        },

        /**
         * 清除前端本地token
         * 与 logout 类似，但不会调用后端接口，适用于 token 失效等被动场景
         */
        clearAuth() {
            const permissionStore = usePermissionStore()
            const routeNames = permissionStore.addedRouteNames.slice()
            permissionStore.reset()
            this.$reset()
            void removeDynamicRoutes(routeNames)
        },
    },

    // 持久化存储配置
    persist: {
        key: 'auth',
        storage: localStorage,
        // 不写将保存所有字段
        paths: ['accessToken', 'roles', 'expiresIn', 'user'],
    },
})
