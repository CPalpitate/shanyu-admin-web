import type {UserInfoDto} from '@/api';

/**
 * 登录返回数据
 */
export interface AuthState {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    roles: string[];
    user: UserInfoDto | null;
}

/**
 * 验证码返回数据
 */
export interface CaptchaResponse {
    uuid: string;
    img: string;
}

/**
 * 登录请求参数
 */
export interface LoginParams {
    /** 用户名 */
    username: string
    /** 密码 */
    password: string
    /** 验证码 */
    captcha?: string
    /** 验证码uuid */
    captchaUuid?: string
    /** 记住登录 */
    remember?: boolean
}
