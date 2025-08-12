/**
 * 认证相关 API 接口
 *
 * 包含认证相关的所有接口：
 * 1. 登录/登出
 * 2. 令牌管理
 * 3. 权限验证
 * 4. 验证码
 */

import request from '../request'
import type {AuthState, CaptchaResponse, LoginParams, R} from '@/api'

/**
 * 认证 API 接口
 */
export const authApi = {
    /**
     * 用户登录
     * @param data 登录参数
     * @returns 登录结果
     */
    login(data: LoginParams): Promise<R<AuthState>> {
        return request.post<AuthState>('/auth/login', data)
    },

    /**
     * 用户登出
     * @returns 登出结果
     */
    logout(): Promise<R<boolean>> {
        return request.post<boolean>('/auth/logout')
    },

    /**
     * 刷新访问令牌
     * @param refreshToken 刷新令牌
     * @returns 新的访问令牌
     */
    refreshToken(refreshToken: string): Promise<R<{ accessToken: string; expiresIn: number }>> {
        return request.post<{ accessToken: string; expiresIn: number }>('/auth/refresh', {refreshToken})
    },

    /**
     * 验证令牌有效性
     * @returns 验证结果
     */
    verifyToken(): Promise<R<boolean>> {
        return request.get<boolean>('/auth/verify')
    },

    // /**
    //  * 获取用户权限菜单
    //  * @returns 菜单列表
    //  */
    // getUserMenus(): Promise<R<MenuItem[]>> {
    //   return request.get<MenuItem[]>('/auth/menus')
    // },

    /**
     * 获取用户权限列表
     * @returns 权限列表
     */
    getUserPermissions(): Promise<R<string[]>> {
        return request.get<string[]>('/auth/permissions')
    },

    /**
     * 获取验证码
     * @returns 验证码信息
     */
    getCaptcha(): Promise<R<CaptchaResponse>> {
        return request.get<CaptchaResponse>('/auth/captcha')
    },

    /**
     * 发送短信验证码
     * @param phone 手机号
     * @returns 发送结果
     */
    sendSmsCode(phone: string): Promise<R<boolean>> {
        return request.post<boolean>('/auth/send-sms', {phone})
    },

    /**
     * 验证短信验证码
     * @param phone 手机号
     * @param smsCode 短信验证码
     * @returns 验证结果
     */
    verifySmsCode(phone: string, smsCode: string): Promise<R<boolean>> {
        return request.post<boolean>('/auth/verify-sms', {phone, smsCode})
    },

    /**
     * 忘记密码
     * @param data 忘记密码参数
     * @returns 操作结果
     */
    forgotPassword(data: {
        username: string
        email?: string
        phone?: string
        smsCode?: string
        newPassword: string
    }): Promise<R<boolean>> {
        return request.post<boolean>('/auth/forgot-password', data)
    },

    /**
     * 修改密码
     * @param data 修改密码参数
     * @returns 修改结果
     */
    changePassword(data: {
        oldPassword: string
        newPassword: string
    }): Promise<R<boolean>> {
        return request.post<boolean>('/auth/change-password', data)
    },

    /**
     * 检查用户名是否可用
     * @param username 用户名
     * @returns 检查结果
     */
    checkUsername(username: string): Promise<R<boolean>> {
        return request.get<boolean>('/auth/check-username', {username})
    },

    /**
     * 检查邮箱是否可用
     * @param email 邮箱
     * @returns 检查结果
     */
    checkEmail(email: string): Promise<R<boolean>> {
        return request.get<boolean>('/auth/check-email', {email})
    },

    /**
     * 检查手机号是否可用
     * @param phone 手机号
     * @returns 检查结果
     */
    checkPhone(phone: string): Promise<R<boolean>> {
        return request.get<boolean>('/auth/check-phone', {phone})
    },
} 