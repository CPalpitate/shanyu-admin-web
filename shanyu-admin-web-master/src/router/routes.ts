import type {RouteRecordRaw} from 'vue-router'

/**
 * 基础路由
 * 这些路由不需要登录即可访问，或者属于布局之外的页面
 */
export const basicRoutes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            title: '登录',
            hidden: true,
        },
    },
    {
        path: '/403',
        name: 'NoPermission',
        component: () => import('@/views/error/403.vue'),
        meta: {
            title: '无权限',
            hidden: true,
        },
    },
    {
        path: '/404',
        name: 'NotFound',
        component: () => import('@/views/error/404.vue'),
        meta: {
            title: '页面未找到',
            hidden: true,
        },
    },
    {
        path: '/500',
        name: 'ServerError',
        component: () => import('@/views/error/500.vue'),
        meta: {
            title: '服务器错误',
            hidden: true,
        },
    },
    // {
    //     path: '/',
    //     name: 'Root',
    //     redirect: '/dashboard',
    //     meta: {
    //         hidden: true,
    //     },
    // },
]

/**
 * 主应用路由（需要登录后才能访问）
 */
export const asyncRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Layout',
        component: () => import('@/layouts/index.vue'),
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/index.vue'),
                meta: {
                    title: 'Dashboard',
                    icon: 'bx:atom',
                    affix: true, // 固定在标签栏
                    order: 1,
                    scrollable: true
                },
            },
            {
                path: 'users',
                name: 'Users',
                component: () => import('@/views/users/index.vue'),
                meta: {
                    title: '用户管理',
                    icon: 'bx:user',
                    order: 2,
                },
            },
            {
                path: 'settings',
                name: 'Settings',
                component: () => import('@/views/settings/index.vue'),
                meta: {
                    title: '系统设置',
                    icon: 'bx:cog',
                    order: 3
                },
                redirect: '/settings/codegen',
                children: [
                    {
                        path: 'codegen',
                        name: 'CodeGen',
                        component: () => import('@/views/settings/codegen/index.vue'),
                        meta: {title: '代码生成'}
                    },
                    {
                        path: 'menu',
                        name: 'Menu',
                        component: () => import('@/views/settings/menu/index.vue'),
                        meta: {title: '菜单管理'}
                    },
                    {
                        path: 'role',
                        name: 'Role',
                        component: () => import('@/views/settings/role/index.vue'),
                        meta: {title: '角色管理'}
                    }
                ]
            }
        ],
    },
]

/**
 * 动态添加路由的处理函数，用于权限控制
 * 根据环境变量中的配置决定使用静态路由还是动态路由
 */
export const routes = [...basicRoutes, ...(import.meta.env.VITE_AUTH_MODE === 'static' ? asyncRoutes : [])]