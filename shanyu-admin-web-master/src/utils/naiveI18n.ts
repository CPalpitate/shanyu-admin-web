/**
 * NaiveUI国际化配置工具
 * 用于将应用国际化配置与NaiveUI组件库国际化配置匹配
 */
import { zhCN, enUS, dateZhCN, dateEnUS } from 'naive-ui'
import type { NDateLocale, NLocale } from 'naive-ui'
import type { LocaleType } from '@/locales'

/**
 * NaiveUI国际化配置对象
 */
interface NaiveI18nConfig {
  /** 组件国际化配置 */
  locale: NLocale
  /** 日期国际化配置 */
  dateLocale: NDateLocale
}

/**
 * NaiveUI国际化配置映射表
 * 将应用国际化配置与NaiveUI组件库国际化配置匹配
 */
export const naiveI18nOptions: Record<LocaleType, NaiveI18nConfig> = {
  // 中文
  zhCN: {
    locale: zhCN,
    dateLocale: dateZhCN,
  },
  // 英文
  enUS: {
    locale: enUS,
    dateLocale: dateEnUS,
  },
}