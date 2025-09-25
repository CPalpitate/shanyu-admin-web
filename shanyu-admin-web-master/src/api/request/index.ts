/**
 * HTTP 请求工具
 *
 * 基于 axios 封装的统一请求工具，提供：
 * 1. 统一的请求配置
 * 2. 请求/响应拦截器
 * 3. 错误处理机制
 * 4. 请求重试功能
 * 5. 请求取消功能
 */

import axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from 'axios'
import {extractFilename, message, saveBlob, throwIfJsonErrorBlob} from '@/utils'
import {useAuthStore} from '@/store'
import type {R} from '@/api'
import qs from 'qs'

/**
 * 创建 axios 实例
 */
const service: AxiosInstance = axios.create({
    // 基础URL，从环境变量获取
    baseURL: '/api',
    // 请求超时时间
    timeout: 15000,
    // 请求头
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },

    // GET 参数序列化支持 orders[0].column 这种写法
    paramsSerializer: {
        serialize: (params) => qs.stringify(params, {arrayFormat: 'indices', allowDots: true}),
    },
})

/**
 * 请求拦截器
 * 在请求发送之前进行一些处理，比如添加 token
 */
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 获取 token
        const auth = useAuthStore()

        // 如果有 token，添加到请求头
        if (auth.authHeader) {
            config.headers = config.headers || {}
            config.headers.Authorization = auth.authHeader
        }

        // 添加请求时间戳，防止缓存
        if (config.method === 'get') {
            config.params = {
                ...config.params,
                _t: Date.now(),
            }
        }

        return config
    },
    (error) => {
        console.error('请求拦截器错误:', error)
        return Promise.reject(error)
    },
)

/**
 * 响应拦截器
 * 在响应返回之后进行一些处理，比如统一错误处理
 */
service.interceptors.response.use(
    (response: AxiosResponse<any>) => {
        const {data} = response

        // 如果是文件下载（blob/arraybuffer），跳过 R<> 校验
        const rt = response.config.responseType
        const ct = (response.headers['content-type'] || response.headers['Content-Type'] || '') as string
        if (rt === 'blob' || rt === 'arraybuffer' || (!ct.includes('application/json') && !!ct)) {
            return response
        }

        // 如果响应成功
        const ok = data && (data.code === 200 || data.code === 0)
        if (ok) return response

        // 特殊错误码处理
        switch (data.code) {
            case 401:
                // 未授权，清除 token 并跳转到登录页
                useAuthStore().clearAuth()
                window.location.href = '/login'
                break
            case 403:
                // 无权限
                message.error(data.msg || '无权限访问')
                break
            case 500:
                // 服务器错误
                message.error(data.msg || '服务器内部错误')
                break
            default:
                // 其他错误
                message.error(data.msg || '未知错误')
        }

        return Promise.reject(new Error(data.msg || '请求失败'))
    },
    async (error) => {
        console.error('响应拦截器错误:', error)

        // 如果是 blob 错误，尝试解析 JSON 并提示
        const resp = error?.response as AxiosResponse | undefined
        if (resp && resp.data instanceof Blob) {
            try {
                await throwIfJsonErrorBlob(resp as AxiosResponse<Blob>)
            } catch (e: any) {
                message.error(e?.message || '请求失败')
                return Promise.reject(e)
            }
        }

        // 网络错误
        if (error.code === 'NETWORK_ERROR') {
            message.error('网络连接失败，请检查网络设置')
            return Promise.reject(error)
        }

        // 请求超时
        if (error.code === 'ECONNABORTED') {
            message.error('请求超时，请稍后重试')
            return Promise.reject(error)
        }

        // HTTP 状态码错误
        if (error.response) {
            const {status} = error.response
            switch (status) {
                case 401:
                    message.error('登录已过期，请重新登录')
                    useAuthStore().clearAuth()
                    window.location.href = '/login'
                    break
                case 403:
                    message.error('无权限访问')
                    break
                case 404:
                    message.error('请求的资源不存在')
                    break
                case 500:
                    message.error('服务器内部错误')
                    break
                default:
                    message.error(`请求失败 (${status})`)
            }
        } else {
            message.error('请求失败，请稍后重试')
        }

        return Promise.reject(error)
    },
)

/**
 * 通用请求方法
 */
export const request = {
    /**
     * GET 请求
     */
    async get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<R<T>> {
        const res = await service.get<R<T>>(url, {params, ...config})
        return res.data
    },

    /**
     * POST 请求
     */
    async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R<T>> {
        const res = await service.post<R<T>>(url, data, config)
        return res.data
    },

    /**
     * PUT 请求
     */
    async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R<T>> {
        const res = await service.put<R<T>>(url, data, config)
        return res.data
    },

    /**
     * DELETE 请求
     */
    async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<R<T>> {
        const res = await service.delete<R<T>>(url, config)
        return res.data
    },

    /**
     * PATCH 请求
     */
    async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R<T>> {
        const res = await service.patch<R<T>>(url, data, config)
        return res.data
    },

    /**
     * 文件上传
     */
    async upload<T = any>(
        url: string,
        file: File,
        onProgress?: (progress: number) => void,
    ): Promise<R<T>> {
        const formData = new FormData()
        formData.append('file', file)

        const res = await service.post<R<T>>(url, formData, {
            headers: {'Content-Type': 'multipart/form-data'},
            onUploadProgress: (e) => {
                if (onProgress && e.total) {
                    onProgress(Math.round((e.loaded * 100) / e.total))
                }
            },
        })
        return res.data
    },

    /**
     * GET 下载（支持 params、文件名解析、进度回调、额外配置）
     */
    async downloadGet(
        url: string,
        params?: Record<string, any>,
        filenameHint = 'download.bin',
        onProgress?: (p: number) => void,
        config?: AxiosRequestConfig,
    ): Promise<void> {
        const resp = await service.request<Blob>({
            url,
            method: 'GET',
            params,
            responseType: 'blob',
            headers: {Accept: 'application/octet-stream,*/*'},
            onDownloadProgress: (e) => {
                if (onProgress && e.total) onProgress(e.loaded / e.total)
            },
            ...config,
        })
        await throwIfJsonErrorBlob(resp as AxiosResponse<Blob>).catch((e) => {
            message.error(e.message || '下载失败')
            throw e
        })
        const filename = extractFilename(resp.headers as any, filenameHint)
        saveBlob(resp.data, filename)
    },

    /**
     * POST 下载（支持复杂查询体）
     */
    async downloadPost(
        url: string,
        data?: any,
        filenameHint = 'download.bin',
        onProgress?: (p: number) => void,
        config?: AxiosRequestConfig,
    ): Promise<void> {
        const resp = await service.request<Blob>({
            url,
            method: 'POST',
            data,
            responseType: 'blob',
            headers: {Accept: 'application/octet-stream,*/*'},
            onDownloadProgress: (e) => {
                if (onProgress && e.total) onProgress(e.loaded / e.total)
            },
            ...config,
        })
        await throwIfJsonErrorBlob(resp as AxiosResponse<Blob>).catch((e) => {
            message.error(e.message || '下载失败')
            throw e
        })
        const filename = extractFilename(resp.headers as any, filenameHint)
        saveBlob(resp.data, filename)
    },
}

/**
 * 导出 axios 实例，供特殊需求使用
 */
export {service as axios}

/**
 * 默认导出请求方法
 */
export default request
