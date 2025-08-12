import {defineConfig} from 'unocss'
import presetWind3 from '@unocss/preset-wind3'
import presetAttributify from '@unocss/preset-attributify'

export default defineConfig({
    // 用新版的 wind3 预设替代旧的 uno 预设
    presets: [
        presetWind3(),
        presetAttributify(),
    ],

    shortcuts: {
        'wh-full': 'w-full h-full',
        'flex-center': 'flex justify-center items-center',
        'flex-between': 'flex justify-between items-center',
        'flex-col-center': 'flex-center flex-col',
        'flex-x-center': 'flex justify-center',
        'flex-y-center': 'flex items-center',
        // ========== Dashboard 通用样式抽取 ==========
        // 卡片基础样式：圆角+阴影+过渡
        'card-base': 'rounded-3xl shadow transition-all duration-300',
        // 卡片悬停浮起效果
        'card-hover': 'hover:-translate-y-1 hover:shadow-lg',
        // 图表卡片圆角
        'chart-card': 'rounded-3xl',
        // 页面头部下边框和内边距
        'page-header': 'border-b border-gray-200 pb-4 mb-6',
        // 统计标题样式
        'stat-title': 'text-sm text-gray-600 mb-2',
        // 统计数值样式
        'stat-value': 'text-3xl font-bold',
        // 图标通用大号
        'icon-large': 'text-2xl',
        // 图标主题色
        'icon-blue': 'text-blue-500',
        'icon-green': 'text-green-500',
        'icon-orange': 'text-orange-500',
        'icon-purple': 'text-purple-500',
        // ========== End ==========
    },

    theme: {
        extend: {
            animation: {
                float: 'float 30s ease-in-out infinite',
            },
            keyframes: {
                float: `{ 
                    0% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(0, 0) scale(1); }
                    100% { transform: translate(0, 0) scale(1); }
                }`,
            },
        },
        blur: {
            sm: '4px',
            md: '12px',
            lg: '24px',
            xl: '40px',
            '2xl': '60px',
            '3xl': '80px',
            '4xl': '120px',
        },
    }
    // theme: {
    //     boxShadow: {
    //         // 模仿 shadow-md，但偏移方向不同
    //         'top-md': '0 -4px 6px -1px rgba(0,0,0,0.1), 0 -2px 4px -1px rgba(0,0,0,0.06)',
    //         'bottom-md': '0  4px 6px -1px rgba(0,0,0,0.1), 0  2px 4px -1px rgba(0,0,0,0.06)',
    //         'left-md': '-4px 0 6px -1px rgba(0,0,0,0.1), -2px 0 4px -1px rgba(0,0,0,0.06)',
    //         'right-md': '4px 0 6px -1px rgba(0,0,0,0.1), 2px 0 4px -1px rgba(0,0,0,0.06)',
    //     }
    // }
})
