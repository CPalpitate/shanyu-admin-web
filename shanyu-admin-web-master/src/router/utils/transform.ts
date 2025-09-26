import type {RouteRecordRaw, RouteMeta} from 'vue-router'
import type {MenuRoute, MetaMenu} from '@/api'

// 统一的布局组件 & 异常页面懒加载函数
const layoutComponent = () => import('@/layouts/index.vue')
const exceptionComponent = () => import('@/views/error/404.vue')

// 预扫描 views 目录下的全部页面组件，便于根据字符串快速定位
const viewModules = import.meta.glob('@/views/**/*.vue')

// 默认按 order 升序排列，缺省值放在末尾
function orderSorter(a?: number, b?: number) {
    return (a ?? Number.MAX_SAFE_INTEGER) - (b ?? Number.MAX_SAFE_INTEGER)
}

/**
 * 根据后端返回的 component 字段解析真实的 Vue 组件
 * - 目录（type=1）默认使用主布局组件
 * - component=Layout 时强制使用主布局
 * - 其它情况会尝试匹配 `/src/views/${component}.vue` 或同名目录下的 index.vue
 * - 未命中时降级到 404 页面，便于排查错误
 */
function resolveComponent(component?: string, type?: number) {
    if (!component) {
        return type === 1 ? layoutComponent : undefined
    }
    if (component === 'Layout') {
        return layoutComponent
    }

    const normalized = component.startsWith('/') ? component.slice(1) : component
    const candidates = [`/src/views/${normalized}.vue`, `/src/views/${normalized}/index.vue`]
    for (const key of candidates) {
        const loader = viewModules[key]
        if (loader) return loader
    }

    console.warn(`[permission] 未找到组件: ${component}, 已回退到 404 页面`)
    return exceptionComponent
}

/**
 * 将后端的 metaMenu 字段转换成 vue-router meta
 * 保留原有动态路由的排序、图标、权限等信息
 */
function buildRouteMeta(route: MenuRoute): RouteMeta | undefined {
    const meta: RouteMeta = {}
    const menu: MetaMenu | undefined = route.metaMenu

    if (menu?.title) meta.title = menu.title
    if (menu?.icon) meta.icon = menu.icon
    if (menu?.hidden !== undefined) meta.hidden = menu.hidden
    if (menu?.keepAlive !== undefined) meta.keepAlive = menu.keepAlive
    if (menu?.affix !== undefined) meta.affix = menu.affix
    if (menu?.iframe !== undefined) (meta as any).iframe = menu.iframe
    if (menu?.externalUrl) (meta as any).externalUrl = menu.externalUrl
    if (menu?.perms) (meta as any).perms = menu.perms

    if (route.orderNum !== undefined) (meta as any).order = route.orderNum

    return Object.keys(meta).length ? meta : undefined
}

/**
 * 转换单条后端路由记录为 vue-router RouteRecordRaw
 * - 过滤掉 type=3 的按钮节点
 * - 动态挂载 component / redirect / children / meta 等字段
 */
function transformSingleRoute(route: MenuRoute): RouteRecordRaw | null {
    if (!route || route.type === 3) return null

    const record: RouteRecordRaw = {
        path: route.path || '',
        name: route.name || route.id,
    }

    const component = resolveComponent(route.component, route.type)
    if (component) {
        record.component = component as RouteRecordRaw['component']
    }

    if (route.redirect) {
        record.redirect = route.redirect
    }

    const children = transformMenuRoutes(route.children || [], false)
    if (children.length) {
        record.children = children
    }

    const meta = buildRouteMeta(route)
    if (meta) {
        record.meta = meta
    }

    return record
}

/**
 * 批量转换后端返回的菜单路由
 * 会根据 orderNum 排序，同时移除空节点
 */
export function transformMenuRoutes(routes: MenuRoute[], isRoot = true): RouteRecordRaw[] {
    if (!routes?.length) return []

    const records = routes
        .slice()
        .sort((a, b) => orderSorter(a.orderNum, b.orderNum))
        .map((route) => transformSingleRoute(route))
        .filter((r): r is RouteRecordRaw => !!r)

    if (!isRoot) {
        return records
    }

    const hasRoot = records.some((route) => route.path === '/' || route.name === 'Layout')
    if (hasRoot) {
        return records
    }

    const redirect = findFirstNavigablePath(records)

    const layoutRoute: RouteRecordRaw = {
        path: '/',
        name: 'Layout',
        component: layoutComponent as RouteRecordRaw['component'],
        redirect,
        children: records,
    }

    return [layoutRoute]
}

function findFirstNavigablePath(routes: RouteRecordRaw[], parentPath = ''): string | undefined {
    for (const route of routes) {
        if (typeof route.redirect === 'string') {
            return route.redirect
        }
        const currentPath = resolveFullPath(parentPath, route.path)
        if (!route.children?.length && route.component) {
            return currentPath
        }
        if (route.children?.length) {
            const childPath = findFirstNavigablePath(route.children, currentPath)
            if (childPath) {
                return childPath
            }
        }
    }
    return undefined
}

/**
 * 获取可用于渲染侧边栏的一级路由列表
 * 默认取 layout 路由的 children，若不存在则返回原数组
 */
export function resolveSidebarRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
    if (!routes?.length) return []
    const layoutRoute = routes.find(route => route.path === '/' || route.name === 'Layout')
    if (layoutRoute?.children?.length) {
        return layoutRoute.children
    }
    return routes
}

/**
 * 收集动态注入的所有路由名称，便于后续清理
 */
export function collectRouteNames(routes: RouteRecordRaw[]): string[] {
    const names: string[] = []
    const travel = (list: RouteRecordRaw[]) => {
        list.forEach(route => {
            if (route.name) names.push(String(route.name))
            if (route.children?.length) travel(route.children)
        })
    }
    travel(routes)
    return Array.from(new Set(names))
}

/**
 * 递归拼接父子路由的 path，确保菜单 key 与实际访问路径一致
 */
export function resolveFullPath(base: string, path: string): string {
    if (!path) return base || '/'
    if (path.startsWith('/')) return path
    const cleanedBase = base.endsWith('/') ? base.slice(0, -1) : base
    return `${cleanedBase}/${path}`.replace(/[/]+/g, '/')
}
