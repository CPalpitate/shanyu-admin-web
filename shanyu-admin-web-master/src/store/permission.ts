import type {RouteRecordRaw} from 'vue-router'
import {defineStore} from 'pinia'
import {systemApi} from '@/api'
import type {MenuRoute} from '@/api'
import {collectRouteNames, resolveSidebarRoutes, transformMenuRoutes} from '@/router/utils/transform'

interface PermissionState {
    rawRoutes: MenuRoute[]
    routes: RouteRecordRaw[]
    menuRoutes: RouteRecordRaw[]
    perms: string[]
    addedRouteNames: string[]
    isDynamicAdded: boolean
    loading: boolean
}

/**
 * 权限相关的 Pinia Store
 * 负责：
 * 1. 缓存后端返回的原始菜单路由
 * 2. 将菜单路由转换成 vue-router 配置
 * 3. 维护侧边栏菜单、权限码集合以及动态路由状态
 */
export const usePermissionStore = defineStore('permission', {
    state: (): PermissionState => ({
        rawRoutes: [],
        routes: [],
        menuRoutes: [],
        perms: [],
        addedRouteNames: [],
        isDynamicAdded: false,
        loading: false,
    }),

    getters: {
        /**
         * 侧边栏展示使用的路由数组
         */
        sidebarRoutes(state): RouteRecordRaw[] {
            return state.menuRoutes
        },

        /**
         * 将权限码转换为 Set，方便进行包含判断
         */
        permissionSet(state): Set<string> {
            return new Set(state.perms)
        },
    },

    actions: {
        /**
         * 拉取当前用户的权限编码列表
         * @param force 是否强制刷新（默认命中缓存直接返回）
         */
        async loadUserPermissions(force = false): Promise<string[]> {
            if (!force && this.perms.length) return this.perms
            const res = await systemApi.getCurrentUserPerms()
            this.perms = Array.from(new Set(res.data || []))
            return this.perms
        },

        /**
         * 构建动态路由树：
         * 1. 请求后端菜单路由
         * 2. 转换为 vue-router 配置
         * 3. 记录侧边栏菜单 & 动态注入的路由名称
         */
        async buildRoutes(): Promise<RouteRecordRaw[]> {
            if (this.loading) return this.routes
            this.loading = true
            try {
                const res = await systemApi.getCurrentUserRoutes()
                const data = res.data || []
                this.rawRoutes = data

                const routeRecords = transformMenuRoutes(data)
                this.routes = routeRecords
                this.menuRoutes = resolveSidebarRoutes(routeRecords)
                this.addedRouteNames = collectRouteNames(routeRecords)

                this.isDynamicAdded = true

                await this.loadUserPermissions()

                return routeRecords
            } finally {
                this.loading = false
            }
        },

        /**
         * 静态权限模式下，从本地路由同步侧边栏数据
         */
        setStaticMenuRoutes(routes: RouteRecordRaw[]) {
            this.menuRoutes = routes
        },

        /**
         * 重置所有权限相关状态
         */
        reset() {
            this.rawRoutes = []
            this.routes = []
            this.menuRoutes = []
            this.perms = []
            this.addedRouteNames = []
            this.isDynamicAdded = false
            this.loading = false
        },
    },
})
