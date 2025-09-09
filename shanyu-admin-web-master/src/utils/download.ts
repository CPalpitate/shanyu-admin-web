// 通用下载工具：解析文件名、保存 Blob、解析 blob 错误 JSON
import type {AxiosResponse} from 'axios'
import {message} from '@/utils/message'

/** 从 Content-Disposition 提取文件名，支持 filename*（RFC 5987） */
export function extractFilename(
    headers: Record<string, string | undefined>,
    fallback = 'download.bin',
): string {
    const cd = (headers['content-disposition'] || headers['Content-Disposition'] || '').trim()

    // 优先 filename*=UTF-8''xxx
    let m = /filename\*=(?:UTF-8'')?([^;]+)/i.exec(cd)
    if (m?.[1]) {
        const raw = m[1].trim().replace(/^["']|["']$/g, '')
        try {
            return decodeURIComponent(raw)
        } catch {
            return raw || fallback
        }
    }

    // 退回 filename=xxx
    m = /filename=([^;]+)/i.exec(cd)
    if (m?.[1]) {
        return m[1].trim().replace(/^["']|["']$/g, '') || fallback
    }
    return fallback
}

/** 将 Blob 另存为文件（浏览器端） */
export function saveBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || 'download'
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    a.remove()
}

/** 如果后端把错误以 JSON + blob 返回，尝试解析并抛错 */
export async function throwIfJsonErrorBlob(resp: AxiosResponse<Blob>) {
    const ct = (resp.headers['content-type'] || resp.headers['Content-Type'] || '') as string
    if (ct.includes('application/json')) {
        const text = await resp.data.text()
        try {
            const json = JSON.parse(text)
            const msg = json.message || json.msg || json.error || text
            message.error(msg)
        } catch {
            throw new Error(text)
        }
    }
}
