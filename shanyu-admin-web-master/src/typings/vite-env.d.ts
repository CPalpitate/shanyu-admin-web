/**
 * 为Vite配置文件提供的环境变量类型声明
 */
declare interface ImportMetaEnv {
  /** 应用标题 */
  readonly VITE_APP_TITLE: string
  /** 应用描述 */
  readonly VITE_APP_DESC: string
  /** 基础路径 */
  readonly VITE_BASE_URL: string
  /** 路由模式 */
  readonly VITE_ROUTE_MODE: 'hash' | 'history'
  /** API接口地址 */
  readonly VITE_API_URL: string
  /** 是否开启HTTP代理 */
  readonly VITE_HTTP_PROXY: 'Y' | 'N'
  /** 是否开启Mock数据 */
  readonly VITE_USE_MOCK: 'Y' | 'N'
  /** 是否删除console */
  readonly VITE_DROP_CONSOLE: 'Y' | 'N'
  /** 是否删除debugger */
  readonly VITE_DROP_DEBUGGER: 'Y' | 'N'
  /** 是否sourcemap */
  readonly VITE_SOURCEMAP: 'Y' | 'N'
  /** 是否开启路由权限验证 */
  readonly VITE_AUTH_ROUTE: 'Y' | 'N'
  /** 是否开启构建压缩 */
  readonly VITE_BUILD_COMPRESS: 'Y' | 'N'
  /** 压缩类型 */
  readonly VITE_COMPRESS_TYPE: 'gzip' | 'brotli' | 'deflate' | 'deflateRaw'
  // 添加其他你需要的环境变量类型
}

/**
 * 确保ImportMeta有正确的环境类型
 */
declare interface ImportMeta {
  readonly env: ImportMetaEnv
} 