import type {ProxyOptions} from 'vite'

/**
 * 生成代理模式配置
 * @description 将环境配置转换为代理模式配置，为每个API添加代理前缀
 * @param envConfig 环境配置对象，如 { api: 'http://api.example.com', auth: 'http://auth.service.com' }
 * @returns 返回包含原始值和代理路径的映射对象
 */
export function generateProxyPattern(envConfig: Record<string, string>) {
    const result: Record<string, { value: string; proxy: string }> = {}

    // 遍历配置，生成代理模式
    Object.keys(envConfig).forEach(key => {
        result[key] = {
            value: envConfig[key],      // 原始URL
            proxy: `/proxy-${key}`,     // 代理路径前缀
        }
    })

    return result
}

/**
 * 创建简单的Vite代理配置（单API场景）
 * @param apiUrl 后端API基础URL
 * @returns Vite代理配置对象
 */
export function createSimpleProxy(apiUrl: string): Record<string, ProxyOptions> {
    if (!apiUrl) {
        return {}
    }

    return {
        '/api': {
            target: apiUrl,
            changeOrigin: true,
            rewrite: (path: string) => path.replace(/^\/api/, ''),
            // 可选的调试配置
            // configure: (proxy, options) => {
            //   proxy.on('error', (err, req, res) => {
            //     console.log('代理错误:', err)
            //   })
            //   proxy.on('proxyReq', (proxyReq, req, res) => {
            //     console.log('发送请求:', req.url)
            //   })
            //   proxy.on('proxyRes', (proxyRes, req, res) => {
            //     console.log('请求响应:', req.url, proxyRes.statusCode)
            //   })
            // },
        },
    }
}

/**
 * 创建多服务的Vite代理配置
 * @param envConfig 多服务的环境配置对象，如 { api: 'http://api.example.com', auth: 'http://auth.service.com' }
 * @returns Vite代理配置对象
 */
export function createMultiServiceProxy(envConfig: Record<string, string>): Record<string, ProxyOptions> {
    // 生成代理模式配置
    const proxyMap = generateProxyPattern(envConfig)
    const result: Record<string, ProxyOptions> = {}

    // 遍历代理模式，生成Vite代理配置
    Object.keys(proxyMap).forEach(key => {
        const {value, proxy} = proxyMap[key]

        result[proxy] = {
            target: value,               // 目标服务器URL
            changeOrigin: true,          // 修改请求头中的origin，解决跨域问题
            rewrite: (path: string) => path.replace(new RegExp(`^${proxy}`), ''), // 路径重写，去掉代理前缀
        }
    })

    return result
}

/**
 * 创建Vite代理配置
 * @description 根据环境配置创建开发服务器的代理配置，支持单API和多服务模式
 * @param envConfig 环境配置，可以是单个URL字符串或多服务配置对象
 * @returns Vite代理配置对象
 */
export function createViteProxy(envConfig: string | Record<string, string>): Record<string, ProxyOptions> {
    // 单API模式
    if (typeof envConfig === 'string') {
        return createSimpleProxy(envConfig)
    }

    // 多服务模式
    return createMultiServiceProxy(envConfig)
}