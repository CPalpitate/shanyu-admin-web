/**
 * 代码生成相关 API 接口
 *
 */

import request from '../request'
import type * as T from '@/api'
import type {CodeGenRequest, CodegenTable, CodegenTableFilter, PageQuery, PageResult} from "@/api";

export const codegenApi = {
  /**
   * 获取库列表
   * @returns 库列表
   */
  getDatabases(): Promise<T.R<string[]>> {
    return request.get<string[]>('/codegen/databases')
  },

  /**
   * 条件查询表列表
   * @param params 请求参数
   * @returns 表列表
   */
  getTables(params: PageQuery<CodegenTableFilter>): Promise<T.R<PageResult<CodegenTable>>> {
    return request.get<PageResult<CodegenTable>>(`/codegen/tables`,params)
  },

  /**
   * 下载代码文件
   * @param codeGenRequest 请求参数
   */
  downloadCodeZip(codeGenRequest: CodeGenRequest): Promise<void> {
    return request.downloadPost('/codegen/download',codeGenRequest)
  },
}
