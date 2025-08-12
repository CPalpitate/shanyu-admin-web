/**
 * 环境变量类型声明
 * 让TypeScript识别import.meta.env中的环境变量
 */
interface ImportMetaEnv {
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
  /** 版权信息 */
  readonly VITE_COPYRIGHT_INFO: string
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
  /** 路由权限模式 */
  readonly VITE_AUTH_MODE: 'static' | 'dynamic'
  /** 布局模式 */
  readonly VITE_LAYOUT_MODE: 'leftMenu' | 'topMenu' | 'mixMenu'
  /** 导航栏模式 */
  readonly VITE_NAV_MODE: 'vertical' | 'horizontal'
  /** 导航栏主题 */
  readonly VITE_NAV_THEME: 'light' | 'dark'
  /** 菜单手风琴模式 */
  readonly VITE_MENU_ACCORDION: 'Y' | 'N'
  /** 颜色模式 */
  readonly VITE_COLOR_MODE: 'light' | 'dark'
  /** 内容区域宽度 */
  readonly VITE_CONTENT_WIDTH: 'fixed' | 'fluid'
  /** 是否固定头部 */
  readonly VITE_FIXED_HEADER: 'Y' | 'N'
  /** 是否固定标签页 */
  readonly VITE_FIXED_TABS: 'Y' | 'N'
  /** 是否显示设置抽屉 */
  readonly VITE_SHOW_SETTING: 'Y' | 'N'
  /** 是否显示页脚 */
  readonly VITE_SHOW_FOOTER: 'Y' | 'N'
  /** 是否显示水印 */
  readonly VITE_SHOW_WATERMARK: 'Y' | 'N'
  /** 是否显示版权信息 */
  readonly VITE_SHOW_COPYRIGHT: 'Y' | 'N'
  /** 是否开启页面切换动画 */
  readonly VITE_ANIMATE_ROUTE: 'Y' | 'N'
  /** 是否开启锁屏功能 */
  readonly VITE_LOCK_SCREEN: 'Y' | 'N'
  /** 是否开启构建压缩 */
  readonly VITE_BUILD_COMPRESS: 'Y' | 'N'
  /** 压缩类型 */
  readonly VITE_COMPRESS_TYPE: 'gzip' | 'brotliCompress' | 'deflate' | 'deflateRaw'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 