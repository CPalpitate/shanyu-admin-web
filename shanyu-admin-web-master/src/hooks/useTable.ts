/**
 * 表格相关的自定义 Hook
 * 
 * 提供表格数据管理功能，包括：
 * 1. 分页数据管理
 * 2. 搜索条件管理
 * 3. 排序管理
 * 4. 选择状态管理
 * 5. 加载状态管理
 */

import { ref, reactive, computed, watch } from 'vue'
import type { PageParams, PageResult } from '@/api/types'

/**
 * 表格状态类型
 */
export interface TableState<T = any> {
  /** 数据列表 */
  data: T[]
  /** 总数量 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页数量 */
  pageSize: number
  /** 总页数 */
  totalPages: number
  /** 是否正在加载 */
  loading: boolean
  /** 是否加载完成 */
  loaded: boolean
  /** 是否有错误 */
  error: boolean
  /** 错误信息 */
  errorMessage: string
}

/**
 * 搜索条件类型
 */
export interface SearchParams {
  [key: string]: any
}

/**
 * 排序参数类型
 */
export interface SortParams {
  /** 排序字段 */
  field?: string
  /** 排序方向 */
  order?: 'ascend' | 'descend'
}

/**
 * 表格配置选项
 */
export interface UseTableOptions<T = any> {
  /** 初始页码 */
  initialPage?: number
  /** 初始每页数量 */
  initialPageSize?: number
  /** 初始搜索条件 */
  initialSearch?: SearchParams
  /** 初始排序 */
  initialSort?: SortParams
  /** 是否自动加载 */
  autoLoad?: boolean
  /** 请求函数 */
  requestFn?: (params: PageParams & SearchParams & SortParams) => Promise<any>
  /** 数据转换函数 */
  transform?: (data: any) => T[]
  /** 错误处理函数 */
  onError?: (error: Error) => void
}

/**
 * 使用表格的 Hook
 * @param options 配置选项
 * @returns 表格状态和方法
 */
export function useTable<T = any>(options: UseTableOptions<T> = {}) {
  const {
    initialPage = 1,
    initialPageSize = 10,
    initialSearch = {},
    initialSort = {},
    autoLoad = true,
    requestFn,
    transform,
    onError,
  } = options

  // 表格状态
  const state = reactive<TableState<T>>({
    data: [],
    total: 0,
    page: initialPage,
    pageSize: initialPageSize,
    totalPages: 0,
    loading: false,
    loaded: false,
    error: false,
    errorMessage: '',
  })

  // 搜索条件
  const searchParams = ref<SearchParams>({ ...initialSearch })

  // 排序参数
  const sortParams = ref<SortParams>({ ...initialSort })

  // 选择状态
  const selectedRowKeys = ref<(string | number)[]>([])
  const selectedRows = ref<T[]>([])

  // 计算属性
  const pagination = computed(() => ({
    current: state.page,
    pageSize: state.pageSize,
    total: state.total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number, range: [number, number]) =>
      `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
  }))

  const tableProps = computed(() => ({
    data: state.data,
    loading: state.loading,
    pagination: pagination.value,
    rowKey: 'id',
    rowSelection: {
      selectedRowKeys: selectedRowKeys.value,
      onChange: (keys: (string | number)[], rows: T[]) => {
        selectedRowKeys.value = keys
        selectedRows.value = rows
      },
    },
  }))

  /**
   * 加载数据
   */
  const loadData = async () => {
    if (!requestFn) return

    state.loading = true
    state.error = false
    state.errorMessage = ''

    try {
      const params = {
        page: state.page,
        pageSize: state.pageSize,
        ...searchParams.value,
        ...sortParams.value,
      }

      const response = await requestFn(params)
      
      if (response.success) {
        const result = response.data as PageResult<T>
        state.data = transform ? transform(result.list) : (result.list as any[])
        state.total = result.total
        state.totalPages = result.totalPages
        state.loaded = true
      } else {
        throw new Error(response.message || '加载数据失败')
      }
    } catch (error) {
      state.error = true
      state.errorMessage = error instanceof Error ? error.message : '加载数据失败'
      onError?.(error instanceof Error ? error : new Error('加载数据失败'))
    } finally {
      state.loading = false
    }
  }

  /**
   * 刷新数据
   */
  const refresh = () => {
    loadData()
  }

  /**
   * 重置表格
   */
  const reset = () => {
    state.page = initialPage
    state.pageSize = initialPageSize
    searchParams.value = { ...initialSearch }
    sortParams.value = { ...initialSort }
    selectedRowKeys.value = []
    selectedRows.value = []
    state.data = []
    state.total = 0
    state.totalPages = 0
    state.loaded = false
    state.error = false
    state.errorMessage = ''
  }

  /**
   * 搜索
   */
  const search = (params: SearchParams) => {
    searchParams.value = { ...searchParams.value, ...params }
    state.page = 1 // 重置到第一页
    loadData()
  }

  /**
   * 重置搜索
   */
  const resetSearch = () => {
    searchParams.value = { ...initialSearch }
    state.page = 1
    loadData()
  }

  /**
   * 排序
   */
  const sort = (field: string, order: 'ascend' | 'descend') => {
    sortParams.value = { field, order }
    loadData()
  }

  /**
   * 重置排序
   */
  const resetSort = () => {
    sortParams.value = { ...initialSort }
    loadData()
  }

  /**
   * 分页变化
   */
  const onPageChange = (page: number, pageSize: number) => {
    state.page = page
    state.pageSize = pageSize
    loadData()
  }

  /**
   * 设置数据
   */
  const setData = (data: T[], total: number) => {
    state.data = data as any[]
    state.total = total
    state.totalPages = Math.ceil(total / state.pageSize)
    state.loaded = true
    state.error = false
    state.errorMessage = ''
  }

  /**
   * 清空选择
   */
  const clearSelection = () => {
    selectedRowKeys.value = []
    selectedRows.value = []
  }

  // 监听分页变化
  watch([() => state.page, () => state.pageSize], () => {
    if (autoLoad) {
      loadData()
    }
  })

  // 自动加载
  if (autoLoad && requestFn) {
    loadData()
  }

  return {
    // 状态
    state,
    searchParams,
    sortParams,
    selectedRowKeys,
    selectedRows,
    
    // 计算属性
    pagination,
    tableProps,
    
    // 方法
    loadData,
    refresh,
    reset,
    search,
    resetSearch,
    sort,
    resetSort,
    onPageChange,
    setData,
    clearSelection,
  }
} 