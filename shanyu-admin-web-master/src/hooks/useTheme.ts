/**
 * 主题相关的自定义 Hook
 * 
 * 提供主题切换功能，包括：
 * 1. 主题模式切换
 * 2. 主题色管理
 * 3. 主题配置持久化
 * 4. 主题状态管理
 */

import { ref, computed, watch } from 'vue'
import { useOsTheme } from 'naive-ui'
import { local } from '@/utils/storage'

/**
 * 主题模式类型
 */
export type ThemeMode = 'light' | 'dark' | 'auto'

/**
 * 主题配置类型
 */
export interface ThemeConfig {
  /** 主题模式 */
  mode: ThemeMode
  /** 主题色 */
  primaryColor: string
  /** 是否跟随系统 */
  followSystem: boolean
}

/**
 * 使用主题的 Hook
 * @returns 主题状态和方法
 */
export function useTheme() {
  const osTheme = useOsTheme()
  
  // 主题配置
  const themeConfig = ref<ThemeConfig>({
    mode: 'auto',
    primaryColor: '#18a058',
    followSystem: true,
  })

  // 从本地存储加载主题配置
  const loadThemeConfig = () => {
    const saved = local.get('theme_config')
    if (saved) {
      themeConfig.value = { ...themeConfig.value, ...saved }
    }
  }

  // 保存主题配置到本地存储
  const saveThemeConfig = () => {
    local.set('theme_config', themeConfig.value)
  }

  // 加载配置
  loadThemeConfig()

  // 当前主题模式
  const currentTheme = computed(() => {
    if (themeConfig.value.mode === 'auto') {
      return osTheme.value
    }
    return themeConfig.value.mode
  })

  // 是否为暗色主题
  const isDark = computed(() => currentTheme.value === 'dark')

  // 是否为亮色主题
  const isLight = computed(() => currentTheme.value === 'light')

  // 是否为自动模式
  const isAuto = computed(() => themeConfig.value.mode === 'auto')

  /**
   * 设置主题模式
   */
  const setThemeMode = (mode: ThemeMode) => {
    themeConfig.value.mode = mode
    saveThemeConfig()
  }

  /**
   * 切换主题模式
   */
  const toggleTheme = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'auto']
    const currentIndex = modes.indexOf(themeConfig.value.mode)
    const nextIndex = (currentIndex + 1) % modes.length
    setThemeMode(modes[nextIndex])
  }

  /**
   * 设置主题色
   */
  const setPrimaryColor = (color: string) => {
    themeConfig.value.primaryColor = color
    saveThemeConfig()
  }

  /**
   * 设置是否跟随系统
   */
  const setFollowSystem = (follow: boolean) => {
    themeConfig.value.followSystem = follow
    if (follow) {
      themeConfig.value.mode = 'auto'
    }
    saveThemeConfig()
  }

  /**
   * 重置主题配置
   */
  const resetTheme = () => {
    themeConfig.value = {
      mode: 'auto',
      primaryColor: '#18a058',
      followSystem: true,
    }
    saveThemeConfig()
  }

  // 监听配置变化，自动保存
  watch(themeConfig, () => {
    saveThemeConfig()
  }, { deep: true })

  return {
    // 状态
    themeConfig,
    currentTheme,
    isDark,
    isLight,
    isAuto,
    
    // 方法
    setThemeMode,
    toggleTheme,
    setPrimaryColor,
    setFollowSystem,
    resetTheme,
  }
} 