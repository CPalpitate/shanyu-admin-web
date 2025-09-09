/**
 * 通用 API 响应结构
 */
export interface R<T = any> {
  /** 响应状态码 */
  code: number
  /** 响应消息 */
  msg: string
  /** 响应数据 */
  data: T
}

/**
 * 排序字段
 */
export interface OrderItem {
  /** 排序列名 */
  column: string
  /** 是否升序；true=升序，false=降序 */
  asc: boolean
}

/**
 * 分页请求参数
 */
export interface PageParams {
  /** 当前页，从 1 开始 */
  current: number
  /** 每页数量 */
  size: number
  /** 统计总数（默认 true） */
  searchCount?: boolean
  /** 优化 count SQL（默认 true） */
  optimizeCountSql?: boolean
  /** 多字段排序 */
  orders?: OrderItem[]
}

/** 查询条件与分页参数合并后的通用请求类型 */
export type PageQuery<F extends object = {}> = PageParams & Omit<F, keyof PageParams>

/**
 * 分页响应数据
 */
export interface PageResult<T = any> {
  /** 数据列表 */
  records: T[]
  /** 总数量 */
  total: number
  /** 当前页码 */
  current: number
  /** 每页数量 */
  size: number
  /** 总页数 */
  pages: number
}

/**
 * 上传文件响应
 */
export interface UploadResponse {
  /** 文件URL */
  url: string
  /** 文件名 */
  name: string
  /** 文件大小 */
  size: number
  /** 文件类型 */
  type: string
}

/**
 * 分页 API 响应
 */
export type PageResponse<T = any> = R<PageResult<T>>

/**
 * 列表 API 响应
 */
export type ListResponse<T = any> = R<T[]>

/**
 * 详情 API 响应
 */
export type DetailResponse<T = any> = R<T>

/**
 * 操作结果 API 响应
 */
export type ResultResponse = R<boolean>

// 后端状态码
export enum RCodeEnum {
  SUCCESS = 200,
  ERROR = 400,
  SYS_ERROR = 500,
  AUTHORIZATION_ERROR = 401,
  FORBIDDEN = 403,
  BIZ_ERROR = 1000,
  FILE_OUT_MAX = 9000,
  FILE_FORMAT_ERROR = 9001,
  PARAM_ERROR = 9050,
  JSON_FORMAT_ERROR = 9051,
  SQL_ERROR = 9052,
  NETWORK_TIMEOUT = 9510,
  UNKNOWN_INTERFACE = 9520,
  REQ_MODE_NOT_SUPPORTED = 9530,
}
