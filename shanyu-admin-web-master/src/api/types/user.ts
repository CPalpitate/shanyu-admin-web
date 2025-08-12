/**
 * 用户信息类型
 */
export interface UserInfo {
    /** 用户ID */
    id: string | number
    /** 用户名 */
    username: string
    /** 昵称 */
    nickname: string
    /** 邮箱 */
    email?: string
    /** 手机号 */
    phone?: string
    /** 头像 */
    avatar?: string
    /** 角色列表 */
    roles: string[]
    /** 权限列表 */
    permissions: string[]
    /** 创建时间 */
    createTime: string
    /** 更新时间 */
    updateTime: string
}

/**
 * 登录返回用户信息
 */
export interface UserInfoDto {
    userId: string
    username: string
    nickname: string
    avatarUrl?: string
}