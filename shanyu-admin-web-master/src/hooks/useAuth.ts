import { computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth.ts'
import { usePermissionStore } from '@/store/permission'
import { message } from '@/utils/message'
import type { LoginParams } from '@/api/types'

/**
 * useAuth 认证与权限 Hook
 *
 * 封装了登录、登出、权限判断等功能，依赖 Pinia 的 useAuthStore 状态
 * 使用场景：
 *   - 登录页面：调用 login()
 *   - 退出登录按钮：调用 logout()
 *   - 页面/按钮权限控制：调用 hasRole / hasPerm 等
 */
export function useAuth() {
  // Pinia 认证状态 store
  const store = useAuthStore()

  // Vue Router 实例
  const router = useRouter()
  // 权限 store，负责维护当前用户的权限码集合 & 动态路由
  const permissionStore = usePermissionStore()

  /**
   * 当前用户信息
   * 从 store.user 派生（响应式）
   */
  const userInfo = computed(() => store.user)

  /**
   * 登录状态
   * 判断是否已登录（store.isLoggedIn）
   */
  const isLoggedIn = computed(() => store.isLoggedIn)

  /**
   * 登录
   * @param payload 登录参数（用户名、密码等）
   * @returns Promise<boolean> 登录是否成功
   */
  const login = async (payload: LoginParams) => {
    try {
      await store.login(payload)
      message.success('登录成功')

      // 登录成功后跳转：
      // 如果 URL 有 redirect 参数，则跳转到该地址，否则跳首页
      const redirect = (router.currentRoute.value.query.redirect as string) || '/'
      await router.push(redirect)
      return true
    } catch (e: any) {
      message.error(e?.message || '登录失败')
      return false
    }
  }

  /**
   * 退出登录
   * 清空认证状态并跳转到登录页
   */
  const logout = async () => {
    // 触发 Pinia store 的退出逻辑，内部会清理 token、权限以及动态路由
    await store.logout()
    message.success('已退出登录')
    await nextTick()
    await router.push('/login')
  }

  /**
   * 判断是否拥有指定角色
   * @param role 角色标识
   */
  const hasRole = (role: string) => (store.roles || []).includes(role)

  /**
   * 判断是否拥有任意一个角色
   * @param roles 角色标识数组
   */
  const hasAnyRole = (roles: string[]) => roles.some(r => (store.roles || []).includes(r))

  /**
   * 判断是否同时拥有所有角色
   * @param roles 角色标识数组
   */
  const hasAllRoles = (roles: string[]) => roles.every(r => (store.roles || []).includes(r))

  /**
   * 当前用户权限码数组
   * 从 permission store 派生（响应式）
   */
  const perms = computed(() => Array.from(permissionStore.permissionSet))

  /**
   * 判断是否拥有指定权限
   * @param perm 权限码
   */
  const hasPerm = (perm: string) => permissionStore.permissionSet.has(perm)

  /**
   * 判断是否拥有任意一个权限
   * @param arr 权限码数组
   */
  const hasAnyPerm = (arr: string[]) => arr.some(p => permissionStore.permissionSet.has(p))

  /**
   * 判断是否同时拥有所有权限
   * @param arr 权限码数组
   */
  const hasAllPerms = (arr: string[]) => arr.every(p => permissionStore.permissionSet.has(p))

  return {
    userInfo,
    isLoggedIn,
    login,
    logout,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasPerm,
    hasAnyPerm,
    hasAllPerms,
  }
}
