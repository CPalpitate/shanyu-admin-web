/**
 * 状态常量定义
 * 
 * 定义系统中使用的各种状态常量
 */

/**
 * HTTP状态码
 */
export const HTTP_STATUS = {
  /** 成功 */
  OK: 200,
  /** 创建成功 */
  CREATED: 201,
  /** 无内容 */
  NO_CONTENT: 204,
  /** 重定向 */
  MOVED_PERMANENTLY: 301,
  /** 临时重定向 */
  FOUND: 302,
  /** 未修改 */
  NOT_MODIFIED: 304,
  /** 错误请求 */
  BAD_REQUEST: 400,
  /** 未授权 */
  UNAUTHORIZED: 401,
  /** 禁止访问 */
  FORBIDDEN: 403,
  /** 未找到 */
  NOT_FOUND: 404,
  /** 方法不允许 */
  METHOD_NOT_ALLOWED: 405,
  /** 请求超时 */
  REQUEST_TIMEOUT: 408,
  /** 冲突 */
  CONFLICT: 409,
  /** 内部服务器错误 */
  INTERNAL_SERVER_ERROR: 500,
  /** 未实现 */
  NOT_IMPLEMENTED: 501,
  /** 服务不可用 */
  SERVICE_UNAVAILABLE: 503,
} as const

/**
 * 业务状态码
 */
export const BUSINESS_STATUS = {
  /** 成功 */
  SUCCESS: 200,
  /** 失败 */
  FAIL: 500,
  /** 参数错误 */
  PARAM_ERROR: 400,
  /** 未授权 */
  UNAUTHORIZED: 401,
  /** 无权限 */
  FORBIDDEN: 403,
  /** 资源不存在 */
  NOT_FOUND: 404,
  /** 业务错误 */
  BUSINESS_ERROR: 600,
  /** 系统错误 */
  SYSTEM_ERROR: 700,
} as const

/**
 * 响应状态
 */
export const RESPONSE_STATUS = {
  /** 成功 */
  SUCCESS: 'success',
  /** 失败 */
  FAIL: 'fail',
  /** 错误 */
  ERROR: 'error',
  /** 警告 */
  WARNING: 'warning',
  /** 信息 */
  INFO: 'info',
} as const

/**
 * 操作状态
 */
export const OPERATION_STATUS = {
  /** 进行中 */
  PENDING: 'pending',
  /** 成功 */
  SUCCESS: 'success',
  /** 失败 */
  FAIL: 'fail',
  /** 取消 */
  CANCEL: 'cancel',
} as const

/**
 * 加载状态
 */
export const LOADING_STATUS = {
  /** 加载中 */
  LOADING: 'loading',
  /** 加载完成 */
  LOADED: 'loaded',
  /** 加载失败 */
  ERROR: 'error',
  /** 空数据 */
  EMPTY: 'empty',
} as const

/**
 * 表单状态
 */
export const FORM_STATUS = {
  /** 编辑 */
  EDIT: 'edit',
  /** 查看 */
  VIEW: 'view',
  /** 新增 */
  CREATE: 'create',
  /** 复制 */
  COPY: 'copy',
} as const

/**
 * 数据状态
 */
export const DATA_STATUS = {
  /** 正常 */
  NORMAL: 'normal',
  /** 禁用 */
  DISABLED: 'disabled',
  /** 删除 */
  DELETED: 'deleted',
  /** 锁定 */
  LOCKED: 'locked',
} as const

/**
 * 文件状态
 */
export const FILE_STATUS = {
  /** 上传中 */
  UPLOADING: 'uploading',
  /** 上传成功 */
  SUCCESS: 'success',
  /** 上传失败 */
  FAIL: 'fail',
  /** 已删除 */
  DELETED: 'deleted',
} as const

/**
 * 任务状态
 */
export const TASK_STATUS = {
  /** 等待中 */
  PENDING: 'pending',
  /** 进行中 */
  RUNNING: 'running',
  /** 已完成 */
  COMPLETED: 'completed',
  /** 失败 */
  FAILED: 'failed',
  /** 已取消 */
  CANCELLED: 'cancelled',
} as const

/**
 * 通知状态
 */
export const NOTIFICATION_STATUS = {
  /** 未读 */
  UNREAD: 'unread',
  /** 已读 */
  READ: 'read',
  /** 已处理 */
  PROCESSED: 'processed',
} as const 