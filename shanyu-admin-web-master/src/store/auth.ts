import type {AuthState, LoginParams, R} from '@/api'
import {authApi} from '@/api'

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
         * @param loginData { username, password }
         */
        async login(loginData: LoginParams): Promise<void> {
            const res: R<AuthState> = await authApi.login(loginData)

            this.accessToken = res.data.accessToken
            this.tokenType = (res.data.tokenType || 'Bearer') as any
            this.expiresIn = Date.now() + (res.data.expiresIn ?? 0) * 1000
            this.user = res.data.user ?? null
        },


        /**
         * 退出登录
         */
        async logout() {
            try {
                await authApi.logout()
            } catch {
            }
            this.$reset()
        },

        /**
         * 清除前端本地token
         */
        clearAuth() {
            this.$reset()
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