/**
 * 系统管理相关 API 接口
 * 
 * 包含系统管理相关的所有接口：
 * 1. 角色管理
 * 2. 菜单管理
 * 3. 权限管理
 * 4. 系统配置
 * 5. 日志管理
 */

import request from '../request'
import type { R, PageParams, PageResult, MenuItem } from '@/api'

/**
 * 角色信息类型
 */
export interface RoleInfo {
  /** 角色ID */
  id: string | number
  /** 角色名称 */
  name: string
  /** 角色编码 */
  code: string
  /** 角色描述 */
  description?: string
  /** 角色状态 */
  status: 'enabled' | 'disabled'
  /** 排序 */
  sort: number
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 权限信息类型
 */
export interface PermissionInfo {
  /** 权限ID */
  id: string | number
  /** 权限名称 */
  name: string
  /** 权限编码 */
  code: string
  /** 权限类型 */
  type: 'menu' | 'button' | 'api'
  /** 权限描述 */
  description?: string
  /** 父级权限ID */
  parentId?: string | number
  /** 权限路径 */
  path?: string
  /** 权限图标 */
  icon?: string
  /** 排序 */
  sort: number
  /** 状态 */
  status: 'enabled' | 'disabled'
}

/**
 * 系统配置类型
 */
export interface SystemConfig {
  /** 配置键 */
  key: string
  /** 配置值 */
  value: string
  /** 配置描述 */
  description?: string
  /** 配置类型 */
  type: 'string' | 'number' | 'boolean' | 'json'
  /** 是否系统配置 */
  isSystem: boolean
}

/**
 * 系统日志类型
 */
export interface SystemLog {
  /** 日志ID */
  id: string | number
  /** 操作用户 */
  username: string
  /** 操作类型 */
  operation: string
  /** 操作描述 */
  description: string
  /** 请求方法 */
  method: string
  /** 请求URL */
  url: string
  /** 请求参数 */
  params?: string
  /** 响应结果 */
  result?: string
  /** 执行时间 */
  executionTime: number
  /** IP地址 */
  ip: string
  /** 用户代理 */
  userAgent: string
  /** 创建时间 */
  createTime: string
}

/**
 * 系统 API 接口
 */
export const systemApi = {
  // ==================== 角色管理 ====================
  /**
   * 获取角色列表
   */
  getRoleList(params: PageParams & {
    name?: string
    code?: string
    status?: 'enabled' | 'disabled'
  }): Promise<R<PageResult<RoleInfo>>> {
    return request.get<PageResult<RoleInfo>>('/system/role/list', params)
  },

  /**
   * 获取角色详情
   */
  getRoleDetail(id: string | number): Promise<R<RoleInfo>> {
    return request.get<RoleInfo>(`/system/role/${id}`)
  },

  /**
   * 创建角色
   */
  createRole(data: Omit<RoleInfo, 'id' | 'createTime' | 'updateTime'>): Promise<R<RoleInfo>> {
    return request.post<RoleInfo>('/system/role', data)
  },

  /**
   * 更新角色
   */
  updateRole(id: string | number, data: Partial<RoleInfo>): Promise<R<boolean>> {
    return request.put<boolean>(`/system/role/${id}`, data)
  },

  /**
   * 删除角色
   */
  deleteRole(id: string | number): Promise<R<boolean>> {
    return request.delete<boolean>(`/system/role/${id}`)
  },

  /**
   * 分配角色权限
   */
  assignRolePermissions(roleId: string | number, permissionIds: (string | number)[]): Promise<R<boolean>> {
    return request.post<boolean>(`/system/role/${roleId}/permissions`, { permissionIds })
  },

  /**
   * 获取角色权限
   */
  getRolePermissions(roleId: string | number): Promise<R<string[]>> {
    return request.get<string[]>(`/system/role/${roleId}/permissions`)
  },

  // ==================== 菜单管理 ====================
  /**
   * 获取菜单树
   */
  getMenuTree(): Promise<R<MenuItem[]>> {
    return request.get<MenuItem[]>('/system/menu/tree')
  },

  /**
   * 获取菜单详情
   */
  getMenuDetail(id: string | number): Promise<R<MenuItem>> {
    return request.get<MenuItem>(`/system/menu/${id}`)
  },

  /**
   * 创建菜单
   */
  createMenu(data: Omit<MenuItem, 'id' | 'createTime' | 'updateTime'>): Promise<R<MenuItem>> {
    return request.post<MenuItem>('/system/menu', data)
  },

  /**
   * 更新菜单
   */
  updateMenu(id: string | number, data: Partial<MenuItem>): Promise<R<boolean>> {
    return request.put<boolean>(`/system/menu/${id}`, data)
  },

  /**
   * 删除菜单
   */
  deleteMenu(id: string | number): Promise<R<boolean>> {
    return request.delete<boolean>(`/system/menu/${id}`)
  },

  // ==================== 权限管理 ====================
  /**
   * 获取权限列表
   */
  getPermissionList(params: PageParams & {
    name?: string
    code?: string
    type?: 'menu' | 'button' | 'api'
    status?: 'enabled' | 'disabled'
  }): Promise<R<PageResult<PermissionInfo>>> {
    return request.get<PageResult<PermissionInfo>>('/system/permission/list', params)
  },

  /**
   * 获取权限树
   */
  getPermissionTree(): Promise<R<PermissionInfo[]>> {
    return request.get<PermissionInfo[]>('/system/permission/tree')
  },

  /**
   * 创建权限
   */
  createPermission(data: Omit<PermissionInfo, 'id' | 'createTime' | 'updateTime'>): Promise<R<PermissionInfo>> {
    return request.post<PermissionInfo>('/system/permission', data)
  },

  /**
   * 更新权限
   */
  updatePermission(id: string | number, data: Partial<PermissionInfo>): Promise<R<boolean>> {
    return request.put<boolean>(`/system/permission/${id}`, data)
  },

  /**
   * 删除权限
   */
  deletePermission(id: string | number): Promise<R<boolean>> {
    return request.delete<boolean>(`/system/permission/${id}`)
  },

  // ==================== 系统配置 ====================
  /**
   * 获取系统配置列表
   */
  getConfigList(params: PageParams & {
    key?: string
    type?: 'string' | 'number' | 'boolean' | 'json'
  }): Promise<R<PageResult<SystemConfig>>> {
    return request.get<PageResult<SystemConfig>>('/system/config/list', params)
  },

  /**
   * 获取系统配置
   */
  getConfig(key: string): Promise<R<SystemConfig>> {
    return request.get<SystemConfig>(`/system/config/${key}`)
  },

  /**
   * 设置系统配置
   */
  setConfig(key: string, value: string): Promise<R<boolean>> {
    return request.post<boolean>('/system/config', { key, value })
  },

  /**
   * 批量设置系统配置
   */
  batchSetConfig(configs: { key: string; value: string }[]): Promise<R<boolean>> {
    return request.post<boolean>('/system/config/batch', { configs })
  },

  // ==================== 系统日志 ====================
  /**
   * 获取系统日志列表
   */
  getLogList(params: PageParams & {
    username?: string
    operation?: string
    method?: string
    startTime?: string
    endTime?: string
  }): Promise<R<PageResult<SystemLog>>> {
    return request.get<PageResult<SystemLog>>('/system/log/list', params)
  },

  /**
   * 获取日志详情
   */
  getLogDetail(id: string | number): Promise<R<SystemLog>> {
    return request.get<SystemLog>(`/system/log/${id}`)
  },

  /**
   * 清空日志
   */
  clearLogs(): Promise<R<boolean>> {
    return request.delete<boolean>('/system/log/clear')
  },

  /**
   * 导出日志
   */
  exportLogs(params: {
    username?: string
    operation?: string
    method?: string
    startTime?: string
    endTime?: string
  }): Promise<void> {
    const queryString = new URLSearchParams(params as Record<string, string>).toString()
    return request.download(`/system/log/export?${queryString}`)
  },

  // ==================== 系统信息 ====================
  /**
   * 获取系统信息
   */
  getSystemInfo(): Promise<R<{
    version: string
    uptime: number
    memory: {
      total: number
      used: number
      free: number
    }
    cpu: {
      usage: number
      cores: number
    }
    disk: {
      total: number
      used: number
      free: number
    }
  }>> {
    return request.get('/system/info')
  },

  /**
   * 获取系统统计
   */
  getSystemStats(): Promise<R<{
    userCount: number
    roleCount: number
    menuCount: number
    permissionCount: number
    logCount: number
  }>> {
    return request.get('/system/stats')
  },
} 