/**
 * 权限相关的自定义 Hook
 * 
 * 提供权限检查功能，包括：
 * 1. 权限检查
 * 2. 角色检查
 * 3. 权限指令支持
 * 4. 权限状态管理
 */

import { computed } from 'vue'
import { 
  hasPermission,
  hasRole,
  hasAnyPermission,
  hasAnyRole,
  hasAllPermissions,
  hasAllRoles,
  getUserInfo,
} from '@/utils/auth'

/**
 * 使用权限的 Hook
 * @returns 权限检查方法
 */
export function usePermission() {
  // 用户信息
  const userInfo = computed(() => getUserInfo())

  // 用户权限列表
  const permissions = computed(() => userInfo.value?.permissions || [])

  // 用户角色列表
  const roles = computed(() => userInfo.value?.roles || [])

  /**
   * 检查是否有指定权限
   */
  const can = (permission: string) => {
    return hasPermission(permission)
  }

  /**
   * 检查是否有指定角色
   */
  const canRole = (role: string) => {
    return hasRole(role)
  }

  /**
   * 检查是否有任意一个指定权限
   */
  const canAny = (permissions: string[]) => {
    return hasAnyPermission(permissions)
  }

  /**
   * 检查是否有任意一个指定角色
   */
  const canAnyRole = (roles: string[]) => {
    return hasAnyRole(roles)
  }

  /**
   * 检查是否有所有指定权限
   */
  const canAll = (permissions: string[]) => {
    return hasAllPermissions(permissions)
  }

  /**
   * 检查是否有所有指定角色
   */
  const canAllRoles = (roles: string[]) => {
    return hasAllRoles(roles)
  }

  /**
   * 检查是否超级管理员
   */
  const isSuperAdmin = computed(() => {
    return hasRole('super_admin') || hasRole('admin')
  })

  /**
   * 检查是否普通用户
   */
  const isUser = computed(() => {
    return hasRole('user')
  })

  return {
    // 状态
    userInfo,
    permissions,
    roles,
    isSuperAdmin,
    isUser,
    
    // 方法
    can,
    canRole,
    canAny,
    canAnyRole,
    canAll,
    canAllRoles,
  }
} 