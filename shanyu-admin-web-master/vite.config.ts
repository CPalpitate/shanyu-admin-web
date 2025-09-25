import {defineConfig, loadEnv} from 'vite'
import {getSingleServiceConfig} from './service.config.ts'
import {createVitePlugins} from './build/plugins.ts'
import {resolve} from 'node:path'
import {createViteProxy} from './build/proxy.ts'

/**
 * Vite配置文件
 * @see https://vitejs.dev/config/
 */
export default defineConfig(({mode}) => {

    // 根据当前环境模式(dev/test/prod)加载对应的环境变量文件(.env.*)
    const env = loadEnv(mode, process.cwd()) as unknown as ImportMetaEnv
    // 获取当前环境对应的服务配置
    const envConfig = getSingleServiceConfig(env)[mode as 'dev' | 'test' | 'prod']

    return {
        // 部署时的基本路径，从环境变量中获取
        base: env.VITE_BASE_URL || '/',
        // 使用模块化的插件配置
        plugins: createVitePlugins(env),
        // 路径解析配置
        resolve: {
            alias: {
                // 设置@符号指向src目录，方便导入时使用
                '@': resolve(__dirname, 'src'),
            },
        },
        // 开发服务器配置
        server: {
            // 允许所有IP访问
            host: '0.0.0.0',
            // 配置代理，根据环境变量决定是否启用
            proxy: env.VITE_HTTP_PROXY === 'Y' ? createViteProxy(envConfig.apiUrl) : undefined,
        },
        // 构建选项
        build: {
            // 指定构建的目标环境 esnext表示使用最新的ECMAScript特性
            target: 'esnext',
            // 禁用gzip压缩大小报告，提高构建速度
            reportCompressedSize: false,
            // 根据环境变量配置是否生成sourcemap
            sourcemap: env.VITE_SOURCEMAP === 'Y',
            // 大文件警告阈值(kb)
            chunkSizeWarningLimit: 2000,
            // 分块策略
            rollupOptions: {
                output: {
                    chunkFileNames: 'static/js/[name]-[hash].js',
                    entryFileNames: 'static/js/[name]-[hash].js',
                    assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
                    manualChunks: {
                        vue: ['vue', 'vue-router', 'pinia', 'vue-i18n'],
                        echarts: ['echarts'],
                    },
                },
            },
            // 确保每次构建前清空输出目录
            emptyOutDir: true,
            // 开启CSS代码分割
            cssCodeSplit: true,
        },
        // 预构建依赖
        optimizeDeps: {
            include: ['echarts', 'md-editor-v3', 'quill'],
        },
    }
})
