import { createDiscreteApi, type ConfigProviderProps } from 'naive-ui'

/** 当前的 ConfigProvider 配置，用于让离散 API 继承主题/语言等 */
let discreteConfig: Partial<ConfigProviderProps> | null = null

/** 缓存的离散 API 实例，避免重复创建 */
let cachedApis:
    | {
    message: ReturnType<typeof createDiscreteApi>['message']
    dialog: ReturnType<typeof createDiscreteApi>['dialog']
    notification: ReturnType<typeof createDiscreteApi>['notification']
    loadingBar: ReturnType<typeof createDiscreteApi>['loadingBar']
}
    | null = null

/** 在应用启动或主题切换时调用，注入 ConfigProvider 配置（theme、locale、themeOverrides...） */
export function setNaiveDiscreteConfig(props: Partial<ConfigProviderProps> | null) {
    discreteConfig = props
    cachedApis = null // 配置变化后，下次调用时重建
}

/** 获取一套可用的 API：优先 window，次选离散 API */
function getApis() {
    if (window.$message && window.$dialog && window.$notification && window.$loadingBar) {
        return {
            message: window.$message,
            dialog: window.$dialog,
            notification: window.$notification,
            loadingBar: window.$loadingBar,
        }
    }
    if (!cachedApis) {
        const { message, dialog, notification, loadingBar } = createDiscreteApi(
            ['message', 'dialog', 'notification', 'loadingBar'],
            // 让离散 API 也吃到全局主题/语言等
            discreteConfig ? { configProviderProps: discreteConfig } : undefined
        )
        cachedApis = { message, dialog, notification, loadingBar }
    }
    return cachedApis
}

/** 对外导出：在任意地方直接使用 */
export const message = {
    success: (t: string) => getApis().message.success(t),
    error:   (t: string) => getApis().message.error(t),
    warning: (t: string) => getApis().message.warning(t),
    info:    (t: string) => getApis().message.info(t),
    loading: (t: string, opt?: Parameters<ReturnType<typeof createDiscreteApi>['message']['loading']>[1]) =>
        getApis().message.loading(t, opt),
}

export const dialog = {
    info:    (opt: Parameters<ReturnType<typeof createDiscreteApi>['dialog']['info']>[0])    => getApis().dialog.info(opt),
    success: (opt: Parameters<ReturnType<typeof createDiscreteApi>['dialog']['success']>[0]) => getApis().dialog.success(opt),
    warning: (opt: Parameters<ReturnType<typeof createDiscreteApi>['dialog']['warning']>[0]) => getApis().dialog.warning(opt),
    error:   (opt: Parameters<ReturnType<typeof createDiscreteApi>['dialog']['error']>[0])   => getApis().dialog.error(opt),
    // 需要 confirm 等再按需补充
}

export const notification = {
    create: (opt: Parameters<ReturnType<typeof createDiscreteApi>['notification']['create']>[0]) =>
        getApis().notification.create(opt),
}

export const loadingBar = {
    start:  () => getApis().loadingBar.start(),
    finish: () => getApis().loadingBar.finish(),
    error:  () => getApis().loadingBar.error(),
}
