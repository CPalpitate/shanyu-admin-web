/**
 * 服务接口配置文件
 *
 * 本文件定义了不同环境(开发、测试、生产)下的API接口地址配置
 */

// 环境类型定义
export type ServiceEnvType = 'dev' | 'test' | 'prod'

/**
 * 单服务配置示例（原配置）
 */
export const singleServiceConfig: Record<ServiceEnvType, {
    apiUrl: string  // 基础API地址
}> = {
    // 开发环境接口配置
    dev: {
        apiUrl: 'http://localhost:8091',
    },

    // 测试环境接口配置
    test: {
        apiUrl: 'https://test-api.example.com',
    },

    // 生产环境接口配置
    prod: {
        apiUrl: 'https://api.example.com',
    },
}
/**
 * 多服务配置示例
 * 可以根据需要配置多个不同的服务地址
 */
export const multiServiceConfig: Record<ServiceEnvType, Record<string, string>> = {
    // 开发环境多服务配置
    dev: {
        api: 'http://localhost:3000',           // 主API服务
        auth: 'http://localhost:3001',          // 认证服务
        upload: 'http://localhost:3002',        // 文件上传服务
        socket: 'ws://localhost:3003',          // WebSocket服务
    },

    // 测试环境多服务配置
    test: {
        api: 'https://test-api.example.com',
        auth: 'https://test-auth.example.com',
        upload: 'https://test-upload.example.com',
        socket: 'wss://test-socket.example.com',
    },

    // 生产环境多服务配置
    prod: {
        api: 'https://api.example.com',
        auth: 'https://auth.example.com',
        upload: 'https://upload.example.com',
        socket: 'wss://socket.example.com',
    },
}

/**
 * 默认服务配置（当前使用单服务配置）
 * 如需使用多服务配置，请取消下面的注释并注释掉单服务配置导出
 */
export const serviceConfig = singleServiceConfig
// export const serviceConfig = multiServiceConfig;
