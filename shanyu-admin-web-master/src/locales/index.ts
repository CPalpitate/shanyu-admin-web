import type {I18n, I18nOptions} from "vue-i18n";
import {createI18n} from "vue-i18n";
import type {App} from "vue";

// 导入语言文件
import zhCN from './zh-CN.ts'
import enUS from './en-US.ts'
import {useAppStore} from "@/store/app.ts";

/**
 * 支持的语言类型
 */
export type LocaleType = 'zhCN' | 'enUS'

/**
 * 语言配置
 */
export const localeConfig = {
    // 默认语言
    locale: 'zhCN',
    // 备用语言
    fallbackLocale: 'zhCN',
    // 可用语言配置
    availableLocales: [
        {
            code: 'zhCN',
            name: '简体中文',
        },
        {
            code: 'enUS',
            name: 'English',
        },
    ],
    // 语言映射表
    messages: {
        zhCN,
        enUS,
    },
}

/**
 * 创建i18n实例
 */
export function createI18nOptions(): I18nOptions {
    return {
        legacy: false, // 使用组合式API
        locale: localeConfig.locale,
        fallbackLocale: localeConfig.fallbackLocale,
        messages: localeConfig.messages,
        sync: true, // 将i18n实例与全局状态同步
        silentTranslationWarn: true, // 关闭翻译警告
        missingWarn: false, // 关闭缺少翻译警告
        silentFallbackWarn: true, // 关闭备用语言警告
    }
}

// i18n实例
export let i18n: I18n

/**
 * 安装i18n
 * @param app Vue应用实例
 */
export async function installI18n(app: App) {
    const appStore = useAppStore()

    // 使用当前设置的语言创建i18n实例
    i18n = createI18n({
        ...createI18nOptions(),
        locale: appStore.lang,
    })

    app.use(i18n)
}