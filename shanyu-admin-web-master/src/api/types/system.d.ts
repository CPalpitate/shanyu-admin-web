export interface MetaMenu {
    /**
     * 标题（菜单名称）
     */
    title?: string

    /**
     * 图标
     */
    icon?: string

    /**
     * 是否隐藏（由 visible 反转）
     */
    hidden?: boolean

    /**
     * 是否缓存（keep-alive）
     */
    keepAlive?: boolean

    /**
     * 是否固定标签（Affix）
     */
    affix?: boolean

    /**
     * 是否 iframe 页面
     */
    iframe?: boolean

    /**
     * 外链/iframe 地址
     */
    externalUrl?: string

    /**
     * 页面级权限编码
     */
    perms?: string
}

export interface MenuRoute {
    /**
     * 菜单 ID
     */
    id: string

    /**
     * 父级菜单 ID
     */
    parentId: string

    /**
     * 类型：1目录 2页面 3按钮
     */
    type: number

    /**
     * 路由路径
     */
    path: string

    /**
     * 路由唯一名称
     */
    name?: string

    /**
     * 组件标识
     */
    component?: string

    /**
     * 默认重定向
     */
    redirect?: string

    /**
     * 显示排序
     */
    orderNum?: number

    /**
     * 元信息
     */
    metaMenu?: MetaMenu

    /**
     * 子路由
     */
    children?: MenuRoute[]
}
