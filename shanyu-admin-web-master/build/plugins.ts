import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {NaiveUiResolver} from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver' // 自动注册图标组件
import viteCompression from 'vite-plugin-compression'
import VueDevTools from 'vite-plugin-vue-devtools'

/**
 * 创建Vite插件配置
 * @param env 环境变量
 * @returns 配置好的插件数组
 */
export function createVitePlugins(env: ImportMetaEnv) {
    const plugins = [
        // Vue3支持
        vue(),
        // Vue JSX支持
        vueJsx(),
        UnoCSS(),
        // 自动导入API
        AutoImport({
            imports: [
                'vue',
                'vue-router',
                'pinia',
                '@vueuse/core',
                {
                    // NaiveUI的组合式API
                    'naive-ui': [
                        'useDialog', // 对话框
                        'useMessage', // 消息提示
                        'useNotification', // 通知
                        'useLoadingBar', // 加载条
                        'useModal', // 模态框
                    ],
                },
            ],
            dts: 'src/typings/auto-imports.d.ts',
        }),
        // 自动导入组件
        Components({
            resolvers: [
                NaiveUiResolver(),
                IconsResolver({
                    prefix: 'Icon',
                    enabledCollections: ['ion', 'mdi', 'fa'], // 根据需要选
                }),],
            dts: 'src/typings/components.d.ts',
        }),
        // 图标支持
        Icons({
            compiler: 'vue3',
            autoInstall: true,
        }),
        // Vue DevTools支持
        VueDevTools(),
    ]

    // 生产环境开启gzip压缩
    if (env.VITE_BUILD_COMPRESS === 'Y') {
        const {VITE_COMPRESS_TYPE = 'gzip'} = env
        plugins.push(
            viteCompression({
                disable: false,
                algorithm: VITE_COMPRESS_TYPE as 'gzip' | 'brotliCompress' | 'deflate' | 'deflateRaw',
                threshold: 10240, // 大于10kb才压缩
            }),
        )
    }

    return plugins
}