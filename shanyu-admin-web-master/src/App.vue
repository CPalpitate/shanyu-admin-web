<script setup lang="ts">
// 导入NaiveUI暗色主题
import {darkTheme} from 'naive-ui'
import {useAppStore} from '@/store'
import {naiveI18nOptions} from '@/utils'
import { setNaiveDiscreteConfig } from '@/utils/message'

// 获取应用状态
const appStore = useAppStore()

// 计算属性：根据当前语言设置获取对应的NaiveUI国际化配置
// 如果找不到对应的语言配置，则默认使用中文
const naiveLocale = computed(() => {
  // 默认使用中文
  return naiveI18nOptions.zhCN
})

watchEffect(() => {
  setNaiveDiscreteConfig({
    theme: appStore.getTheme === 'dark' ? darkTheme : null,
    themeOverrides: appStore.getThemeOverrides,
    locale: naiveLocale.value.locale,
    dateLocale: naiveLocale.value.dateLocale,
  })
})

</script>

<template>
  <n-config-provider
      class="wh-full"
      inline-theme-disabled
      :theme="appStore.getTheme === 'dark' ? darkTheme : null"
      :locale="naiveLocale.locale"
      :date-locale="naiveLocale.dateLocale"
      :theme-overrides="appStore.getThemeOverrides"
  >
    <!-- Naive UI组件上下文提供者，提供消息通知、对话框等功能的全局调用方法 -->
    <naive-provider>
      <router-view />
    </naive-provider>
  </n-config-provider>
</template>

<style scoped>
</style>
