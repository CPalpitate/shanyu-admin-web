import type {GlobalThemeOverrides} from 'naive-ui'

/**
 * 定义Naive UI自定义主题配置
 */
export const DEFAULT_THEME_OVERRIDES: GlobalThemeOverrides = {
    common: {
        borderRadius: '8px',
        borderRadiusSmall: '4px',
        primaryColor: '#1e80ff', // 主色
        primaryColorHover: '#409eff',
        primaryColorPressed: '#0056b3'
    },
    Input: {borderRadius: '8px'},
    Select: {borderRadius: '8px'},
    Button: {borderRadius: '8px'},
    DatePicker: {borderRadius: '8px'},
    Pagination: {itemBorderRadius: '8px'},
    Menu: {
        itemColorActive: '#e0f2fe', // 菜单高亮背景色
        itemTextColorActive: '#1e80ff', // 菜单高亮文字色
        itemIconColorActive: '#1e80ff', // 菜单高亮图标色
    },
}
