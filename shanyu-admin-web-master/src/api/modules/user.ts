/**
 * 用户相关 API 接口
 *
 * 包含用户管理相关的所有接口：
 * 1. 用户登录/登出
 * 2. 用户信息管理
 * 3. 用户权限管理
 * 4. 用户列表管理
 */

import request from '../request'
import type * as T from '@/api'

/**
 * 用户 API 接口
 */
export const userApi = {
    /**
     * 用户登录
     * @param data 登录参数
     * @returns 登录结果
     */
    login(data: T.LoginParams): Promise<T.R<T.AuthState>> {
        return request.post<T.AuthState>('/auth/login', data)
    },

    /**
     * 用户登出
     * @returns 登出结果
     */
    logout(): Promise<T.R<boolean>> {
        return request.post<boolean>('/auth/logout')
    },

    /**
     * 刷新令牌
     * @param refreshToken 刷新令牌
     * @returns 新的访问令牌
     */
    refreshToken(refreshToken: string): Promise<T.R<{ accessToken: string }>> {
        return request.post<{ accessToken: string }>('/auth/refresh', {refreshToken})
    },

    /**
     * 获取当前用户信息
     * @returns 用户信息
     */
    getCurrentUser(): Promise<T.R<T.UserInfo>> {
        return request.get<T.UserInfo>('/user/current')
    },

    /**
     * 更新用户信息
     * @param data 用户信息
     * @returns 更新结果
     */
    updateUserInfo(data: Partial<T.UserInfo>): Promise<T.R<boolean>> {
        return request.put<boolean>('/user/current', data)
    },

    /**
     * 修改密码
     * @param data 密码信息
     * @returns 修改结果
     */
    changePassword(data: { oldPassword: string; newPassword: string }): Promise<T.R<boolean>> {
        return request.post<boolean>('/user/change-password', data)
    },

    /**
     * 获取用户列表
     * @param params 查询参数
     * @returns 用户列表
     */
    getUserList(params: T.PageParams & {
        username?: string
        nickname?: string
        email?: string
        phone?: string
        status?: 'enabled' | 'disabled'
        roleId?: string | number
    }): Promise<T.R<T.PageResult<T.UserInfo>>> {
        return request.get<T.PageResult<T.UserInfo>>('/user/list', params)
    },

    /**
     * 获取用户详情
     * @param id 用户ID
     * @returns 用户详情
     */
    getUserDetail(id: string | number): Promise<T.R<T.UserInfo>> {
        return request.get<T.UserInfo>(`/user/${id}`)
    },

    /**
     * 创建用户
     * @param data 用户信息
     * @returns 创建结果
     */
    createUser(data: Omit<T.UserInfo, 'id' | 'createTime' | 'updateTime'>): Promise<T.R<T.UserInfo>> {
        return request.post<T.UserInfo>('/user', data)
    },

    /**
     * 更新用户
     * @param id 用户ID
     * @param data 用户信息
     * @returns 更新结果
     */
    updateUser(id: string | number, data: Partial<T.UserInfo>): Promise<T.R<boolean>> {
        return request.put<boolean>(`/user/${id}`, data)
    },

    /**
     * 删除用户
     * @param id 用户ID
     * @returns 删除结果
     */
    deleteUser(id: string | number): Promise<T.R<boolean>> {
        return request.delete<boolean>(`/user/${id}`)
    },

    /**
     * 批量删除用户
     * @param ids 用户ID数组
     * @returns 删除结果
     */
    batchDeleteUsers(ids: (string | number)[]): Promise<T.R<boolean>> {
        return request.post<boolean>('/user/batch-delete', {ids})
    },

    /**
     * 启用/禁用用户
     * @param id 用户ID
     * @param status 状态
     * @returns 操作结果
     */
    toggleUserStatus(id: string | number, status: 'enabled' | 'disabled'): Promise<T.R<boolean>> {
        return request.patch<boolean>(`/user/${id}/status`, {status})
    },

    /**
     * 重置用户密码
     * @param id 用户ID
     * @param newPassword 新密码
     * @returns 重置结果
     */
    resetUserPassword(id: string | number, newPassword: string): Promise<T.R<boolean>> {
        return request.post<boolean>(`/user/${id}/reset-password`, {newPassword})
    },

    /**
     * 分配用户角色
     * @param id 用户ID
     * @param roleIds 角色ID数组
     * @returns 分配结果
     */
    assignUserRoles(id: string | number, roleIds: (string | number)[]): Promise<T.R<boolean>> {
        return request.post<boolean>(`/user/${id}/roles`, {roleIds})
    },

    /**
     * 获取用户角色
     * @param id 用户ID
     * @returns 角色列表
     */
    getUserRoles(id: string | number): Promise<T.R<string[]>> {
        return request.get<string[]>(`/user/${id}/roles`)
    },
} 