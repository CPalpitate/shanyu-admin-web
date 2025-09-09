/**
 * 配置常量定义
 * 
 * 定义系统中使用的各种配置常量
 */

/**
 * 应用配置
 */
export const APP_CONFIG = {
  /** 应用名称 */
  NAME: '善宇管理系统',
  /** 应用版本 */
  VERSION: '1.0.0',
  /** 应用描述 */
  DESCRIPTION: '一个基于Vue3、Vite5、TypeScript和NaiveUI的管理系统框架',
  /** 作者 */
  AUTHOR: 'shanyu',
  /** 版权信息 */
  COPYRIGHT: '© 2024 善宇管理系统. All rights reserved.',
} as const

/**
 * 分页配置
 */
export const PAGINATION_CONFIG = {
  /** 默认每页数量 */
  DEFAULT_PAGE_SIZE: 10,
  /** 每页数量选项 */
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  /** 最大每页数量 */
  MAX_PAGE_SIZE: 1000,
  /** 显示快速跳转 */
  SHOW_QUICK_JUMPER: true,
  /** 显示每页数量选择器 */
  SHOW_SIZE_CHANGER: true,
  /** 显示总数 */
  SHOW_TOTAL: true,
} as const

/**
 * 上传配置
 */
export const UPLOAD_CONFIG = {
  /** 最大文件大小（字节） */
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  /** 支持的文件类型 */
  ACCEPTED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  /** 图片文件类型 */
  IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  /** 文档文件类型 */
  DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
} as const

/**
 * 缓存配置
 */
export const CACHE_CONFIG = {
  /** 默认缓存时间（秒） */
  DEFAULT_CACHE_TIME: 60 * 60 * 24 * 7, // 7天
  /** Token缓存时间（秒） */
  TOKEN_CACHE_TIME: 60 * 60 * 24, // 1天
  /** 用户信息缓存时间（秒） */
  USER_INFO_CACHE_TIME: 60 * 60 * 24, // 1天
  /** 菜单缓存时间（秒） */
  MENU_CACHE_TIME: 60 * 60, // 1小时
} as const

/**
 * 请求配置
 */
export const REQUEST_CONFIG = {
  /** 请求超时时间（毫秒） */
  TIMEOUT: 10000,
  /** 重试次数 */
  RETRY_COUNT: 3,
  /** 重试延迟（毫秒） */
  RETRY_DELAY: 1000,
  /** 是否显示加载状态 */
  SHOW_LOADING: true,
  /** 是否显示错误信息 */
  SHOW_ERROR: true,
} as const

/**
 * 主题配置
 */
export const THEME_CONFIG = {
  /** 默认主题色 */
  DEFAULT_PRIMARY_COLOR: '#18a058',
  /** 默认主题模式 */
  DEFAULT_MODE: 'auto',
  /** 是否跟随系统 */
  FOLLOW_SYSTEM: true,
} as const

/**
 * 国际化配置
 */
export const I18N_CONFIG = {
  /** 默认语言 */
  DEFAULT_LOCALE: 'zh-CN',
  /** 支持的语言 */
  SUPPORTED_LOCALES: ['zh-CN', 'en-US'],
  /** 是否跟随系统 */
  FOLLOW_SYSTEM: false,
} as const

/**
 * 安全配置
 */
export const SECURITY_CONFIG = {
  /** 密码最小长度 */
  MIN_PASSWORD_LENGTH: 6,
  /** 密码最大长度 */
  MAX_PASSWORD_LENGTH: 20,
  /** 密码复杂度要求 */
  PASSWORD_COMPLEXITY: {
    /** 必须包含数字 */
    REQUIRE_NUMBER: true,
    /** 必须包含小写字母 */
    REQUIRE_LOWERCASE: true,
    /** 必须包含大写字母 */
    REQUIRE_UPPERCASE: false,
    /** 必须包含特殊字符 */
    REQUIRE_SPECIAL: false,
  },
  /** 登录失败最大次数 */
  MAX_LOGIN_ATTEMPTS: 5,
  /** 账户锁定时间（分钟） */
  LOCK_TIME: 30,
} as const 