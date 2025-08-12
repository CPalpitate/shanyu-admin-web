/**
 * 枚举值定义
 * 
 * 定义系统中使用的各种枚举值
 */

/**
 * 用户状态枚举
 */
export enum UserStatus {
  /** 启用 */
  ENABLED = 'enabled',
  /** 禁用 */
  DISABLED = 'disabled',
  /** 锁定 */
  LOCKED = 'locked',
}

/**
 * 用户状态标签
 */
export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  [UserStatus.ENABLED]: '启用',
  [UserStatus.DISABLED]: '禁用',
  [UserStatus.LOCKED]: '锁定',
}

/**
 * 用户状态颜色
 */
export const USER_STATUS_COLORS: Record<UserStatus, string> = {
  [UserStatus.ENABLED]: 'success',
  [UserStatus.DISABLED]: 'error',
  [UserStatus.LOCKED]: 'warning',
}

/**
 * 菜单类型枚举
 */
export enum MenuType {
  /** 目录 */
  DIRECTORY = 'directory',
  /** 菜单 */
  MENU = 'menu',
  /** 按钮 */
  BUTTON = 'button',
}

/**
 * 菜单类型标签
 */
export const MENU_TYPE_LABELS: Record<MenuType, string> = {
  [MenuType.DIRECTORY]: '目录',
  [MenuType.MENU]: '菜单',
  [MenuType.BUTTON]: '按钮',
}

/**
 * 权限类型枚举
 */
export enum PermissionType {
  /** 菜单权限 */
  MENU = 'menu',
  /** 按钮权限 */
  BUTTON = 'button',
  /** API权限 */
  API = 'api',
}

/**
 * 权限类型标签
 */
export const PERMISSION_TYPE_LABELS: Record<PermissionType, string> = {
  [PermissionType.MENU]: '菜单权限',
  [PermissionType.BUTTON]: '按钮权限',
  [PermissionType.API]: 'API权限',
}

/**
 * 操作类型枚举
 */
export enum OperationType {
  /** 查询 */
  QUERY = 'query',
  /** 新增 */
  CREATE = 'create',
  /** 修改 */
  UPDATE = 'update',
  /** 删除 */
  DELETE = 'delete',
  /** 导出 */
  EXPORT = 'export',
  /** 导入 */
  IMPORT = 'import',
}

/**
 * 操作类型标签
 */
export const OPERATION_TYPE_LABELS: Record<OperationType, string> = {
  [OperationType.QUERY]: '查询',
  [OperationType.CREATE]: '新增',
  [OperationType.UPDATE]: '修改',
  [OperationType.DELETE]: '删除',
  [OperationType.EXPORT]: '导出',
  [OperationType.IMPORT]: '导入',
}

/**
 * 性别枚举
 */
export enum Gender {
  /** 男 */
  MALE = 'male',
  /** 女 */
  FEMALE = 'female',
  /** 未知 */
  UNKNOWN = 'unknown',
}

/**
 * 性别标签
 */
export const GENDER_LABELS: Record<Gender, string> = {
  [Gender.MALE]: '男',
  [Gender.FEMALE]: '女',
  [Gender.UNKNOWN]: '未知',
}

/**
 * 主题模式枚举
 */
export enum ThemeMode {
  /** 亮色 */
  LIGHT = 'light',
  /** 暗色 */
  DARK = 'dark',
  /** 自动 */
  AUTO = 'auto',
}

/**
 * 主题模式标签
 */
export const THEME_MODE_LABELS: Record<ThemeMode, string> = {
  [ThemeMode.LIGHT]: '亮色',
  [ThemeMode.DARK]: '暗色',
  [ThemeMode.AUTO]: '自动',
} 