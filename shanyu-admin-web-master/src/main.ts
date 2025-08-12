import {createApp} from 'vue'
import AppLoading from '@/components/common/AppLoading.vue'
import {installPinia} from '@/store'
import {installRouter} from '@/router'
import AppVue from './App.vue'

import 'uno.css'
// 导入全局样式
import '@/styles/index.scss'

/**
 * 应用初始化函数，负责设置和挂载Vue应用
 */
async function setupApp() {
    // 创建并挂载加载中组件，在应用准备好之前显示
    const appLoading = createApp(AppLoading)
    if (document.querySelector('#appLoading')) {
        appLoading.mount('#appLoading')
    }

    // 创建Vue主应用实例
    const app = createApp(AppVue)

    // 安装并初始化Pinia状态管理
    installPinia(app)

    // 安装并初始化Vue Router路由管理
    await installRouter(app)

    // 应用初始化完成，卸载加载中组件
    if (document.querySelector('#appLoading')) {
        appLoading.unmount()
        // 移除加载元素
        const loadingEl = document.querySelector('#appLoading')
        if (loadingEl) {
            loadingEl.remove()
        }
    }

    // 将Vue应用挂载到id为app的DOM元素上，正式启动应用
    app.mount('#app')
}

// 等待DOM加载完成后再初始化应用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            void setupApp()
        }, 0)
    })
} else {
    setTimeout(() => {
        void setupApp()
    }, 0)
}