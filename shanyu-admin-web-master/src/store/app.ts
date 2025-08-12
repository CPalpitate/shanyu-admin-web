import type {GlobalThemeOverrides} from 'naive-ui'
import type {LocaleType} from '@/locales'
import {localeConfig} from '@/locales'

// 定义主题类型
export type ThemeType = 'light' | 'dark' | 'auto'

const {VITE_APP_TITLE, VITE_COPYRIGHT_INFO} = import.meta.env

// 定义应用状态接口
interface AppState {
    // 页脚文本
    footerText: string,
    // 语言
    lang: LocaleType,
    // 应用标题
    title: string
    // 主题模式
    theme: ThemeType
    // 主题覆盖配置
    themeOverrides: GlobalThemeOverrides
    // 侧边栏折叠状态
    sidesCollapsed: boolean
    // 是否显示标签页
    showTabs: boolean
    // 是否显示面包屑
    showBreadcrumb: boolean
    // 是否显示页脚
    showFooter: boolean
    // 是否显示水印
    showWatermark: boolean
    // 页面是否允许纵向滚动
    pageScrollable: boolean
}

// 定义Naive UI自定义主题配置
const themeOverrides: GlobalThemeOverrides = {
    common: {
        borderRadius: '8px',
        borderRadiusSmall: '4px',
        primaryColor: '#1e80ff', // 主色
        primaryColorHover: '#409eff',
        primaryColorPressed: '#0056b3'
    },
    Menu: {
        itemColorActive: '#e0f2fe', // 菜单高亮背景色
        itemTextColorActive: '#1e80ff', // 菜单高亮文字色
        itemIconColorActive: '#1e80ff', // 菜单高亮图标色
    },
}

/**
 * 应用设置状态管理
 * 管理全局UI配置、主题等
 */
export const useAppStore = defineStore('app', {
    state: (): AppState => ({
        footerText: VITE_COPYRIGHT_INFO,
        lang: localeConfig.locale as LocaleType,
        title: VITE_APP_TITLE,
        theme: 'light',
        themeOverrides: themeOverrides,
        sidesCollapsed: false,
        showTabs: true,
        showBreadcrumb: true,
        showFooter: true,
        showWatermark: false,
        pageScrollable: false
    }),

    getters: {
        /**
         * 获取主题
         */
        getTheme(): ThemeType {
            return this.theme
        },

        /**
         * 获取自定义主题设置
         */
        getThemeOverrides(): GlobalThemeOverrides {
            return this.themeOverrides
        },

        // 获取侧边栏状态
        getSidesCollapsed(): boolean {
            return this.sidesCollapsed
        },
    },


    actions: {
        /**
         * 设置主题
         * @param theme 主题类型
         */
        setTheme(theme: ThemeType) {
            this.theme = theme

            // 应用主题到HTML元素
            const htmlEl = document.documentElement
            if (theme === 'dark') {
                htmlEl.classList.add('dark')
            } else {
                htmlEl.classList.remove('dark')
            }
        },

        /**
         * 切换侧边栏折叠状态
         */
        toggleSidesCollapsed() {
            this.sidesCollapsed = !this.sidesCollapsed
        },

        /**
         * 设置内容区是否允许纵向滚动
         */
        setPageScrollable(v: boolean) {
            this.pageScrollable = v
        },

        /**
         * 设置侧边栏折叠状态
         * @param collapsed 是否折叠
         */
        setSidesCollapse(collapsed: boolean) {
            this.sidesCollapsed = collapsed
        },

        /**
         * 设置标签页显示状态
         * @param show 是否显示
         */
        setShowTabs(show: boolean) {
            this.showTabs = show
        },

        /**
         * 设置面包屑显示状态
         * @param show 是否显示
         */
        setShowBreadcrumb(show: boolean) {
            this.showBreadcrumb = show
        },

        /**
         * 设置页脚显示状态
         * @param show 是否显示
         */
        setShowFooter(show: boolean) {
            this.showFooter = show
        },

        /**
         * 设置水印显示状态
         * @param show 是否显示
         */
        setShowWatermark(show: boolean) {
            this.showWatermark = show
        },

        /**
         * 重置应用设置到默认状态
         */
        resetSettings() {
            this.theme = 'light'
            this.sidesCollapsed = false
            this.showTabs = true
            this.showBreadcrumb = true
            this.showFooter = true
            this.showWatermark = false
            this.pageScrollable = false
        },
    },

    // 持久化配置
    persist: {
        key: 'app-settings',
        storage: localStorage,
    },
})