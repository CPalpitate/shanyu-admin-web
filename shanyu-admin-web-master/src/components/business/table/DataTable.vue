<template>
  <div class="w-full h-full flex flex-col">
    <!-- 工具栏（左右插槽；右侧常放按钮；支持换行） -->
    <div
      v-if="$slots['toolbar-left'] || $slots['toolbar-right']"
      class="mb-3 flex flex-wrap items-center justify-between gap-2"
    >
      <div class="flex items-center gap-2">
        <slot name="toolbar-left" />
      </div>
      <div class="flex items-center gap-2">
        <slot name="toolbar-right" />
        <!-- 统一刷新按钮：交给父组件自行拉数 -->
        <n-button tertiary @click="$emit('refresh')">刷新</n-button>
      </div>
    </div>

    <!-- 表格主体（纯展示，不发请求） -->
    <n-data-table
      class="flex-1 min-h-0"
      :columns="computedColumns"
      :data="data"
      :loading="loading"
      :striped="striped"
      :bordered="bordered"
      :size="size"
      :row-key="rowKeyComputed"
      :checked-row-keys="localCheckedRowKeys"
      :scroll-x="scrollX"
      :max-height="maxHeight"
      :virtual-scroll="virtualScroll"
      :remote="true"
      :resizable="resizable"
      @update:checked-row-keys="onUpdateCheckedKeys"
      @update:sorter="handleSorter"
    >
      <template #empty>
        <n-empty description="暂无数据" />
      </template>
    </n-data-table>

    <!-- 分页器（受控） -->
    <div class="mt-3 flex items-center justify-end">
      <n-pagination
        :page="page"
        :page-size="pageSize"
        :item-count="total"
        :page-sizes="pageSizes"
        :show-size-picker="showSizePicker"
        :show-quick-jumper="showQuickJumper"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * DataTableView（纯展示组件）
 * - 不发请求；只关心展示与交互。
 * - 接收 data/total/page/pageSize/loading 等受控属性。
 * - 用户翻页/改每页数/排序时，仅 emit 'change' 事件，交给父组件去拉数。
 * - 支持：序号列、选择列、列宽拖拽、虚拟滚动、工具栏插槽等。
 */

import { computed, ref, watch } from 'vue'
import type { DataTableColumns, DataTableRowKey, DataTableSortState } from 'naive-ui'

type Row = Record<string, any>
type Order = 'ascend' | 'descend' | undefined

const props = withDefaults(
  defineProps<{
    /** 表格列配置（Naive UI 原生） */
    columns: DataTableColumns<any>
    /** 数据列表（父组件给） */
    data: Row[]
    /** 总条数（父组件给） */
    total: number
    /** 当前页（受控） */
    page: number
    /** 每页条数（受控） */
    pageSize: number
    /** 加载状态（父组件给） */
    loading?: boolean

    /** 列表展示类属性 */
    rowKey?: ((row: Row) => DataTableRowKey) | string
    showIndex?: boolean
    checkable?: boolean
    checkedRowKeys?: DataTableRowKey[]

    /** Naive UI 外观/滚动属性 */
    striped?: boolean
    bordered?: boolean
    size?: 'small' | 'medium' | 'large'
    scrollX?: number | string
    maxHeight?: number | string
    virtualScroll?: boolean
    resizable?: boolean

    /** 分页器外观 */
    pageSizes?: number[]
    showSizePicker?: boolean
    showQuickJumper?: boolean
  }>(),
  {
    data: () => [],
    total: 0,
    page: 1,
    pageSize: 10,
    loading: false,

    rowKey: 'id',
    showIndex: true,
    checkable: false,
    checkedRowKeys: () => [],

    striped: true,
    bordered: true,
    size: 'medium',
    scrollX: '',
    maxHeight: '',
    virtualScroll: false,
    resizable: true,

    pageSizes: () => [10, 20, 30, 50, 100],
    showSizePicker: true,
    showQuickJumper: true,
  },
)

const emit = defineEmits<{
  /** 支持 v-model:page / v-model:pageSize / v-model:sorter / v-model:checkedRowKeys */
  (e: 'update:page', v: number): void
  (e: 'update:pageSize', v: number): void
  (e: 'update:sorter', v: DataTableSortState | null): void
  (e: 'update:checkedRowKeys', v: DataTableRowKey[]): void
  /**
   * 统一“变更”事件：当页码、每页数、排序改变时触发，交给父组件去调用你集中管理的 API 拉数
   * payload: { page, pageSize, sortField?: string, sortOrder?: 'ascend'|'descend'|undefined }
   */
  (
    e: 'change',
    payload: { page: number; pageSize: number; sortField?: string; sortOrder?: Order },
  ): void
  /** 点击刷新（交给父组件拉数即可） */
  (e: 'refresh'): void
}>()

/** 勾选：内部维护但受控同步 */
const localCheckedRowKeys = ref<DataTableRowKey[]>(props.checkedRowKeys)
watch(
  () => props.checkedRowKeys,
  (v) => {
    localCheckedRowKeys.value = Array.isArray(v) ? v : []
  },
)

/** 行键：兼容字符串 key 或函数 */
const rowKeyComputed = computed(() => {
  if (typeof props.rowKey === 'function') return props.rowKey
  const key = props.rowKey || 'id'
  return (row: Row) => row[key] as DataTableRowKey
})

/** 自动注入序号列 + 选择列（可选） */
const computedColumns = computed<DataTableColumns<any>>(() => {
  const cols: any[] = [...props.columns]
  if (props.showIndex) {
    cols.unshift({
      title: '序号',
      key: '__index',
      width: 60,
      align: 'center',
      render: (_row: any, rowIndex: number) => (props.page - 1) * props.pageSize + rowIndex + 1,
    })
  }
  if (props.checkable) cols.unshift({ type: 'selection' })
  return cols as DataTableColumns<any>
})

/** 将 sorter 归一化后派发 'change' */
function normalized(sorter: DataTableSortState | null) {
  return {
    page: props.page,
    pageSize: props.pageSize,
    sortField: sorter?.columnKey as string | undefined,
    sortOrder: sorter?.order as Order,
  }
}

/** 分页/每页数/排序变化时，仅派发事件，父组件负责调用 API */
function handlePageChange(p: number) {
  emit('update:page', p)
  emit('change', { ...normalized(null), page: p })
}

function handlePageSizeChange(ps: number) {
  emit('update:pageSize', ps)
  emit('change', { ...normalized(null), pageSize: ps })
}

function handleSorter(s: DataTableSortState | null) {
  emit('update:sorter', s)
  emit('change', normalized(s))
}

function onUpdateCheckedKeys(keys: DataTableRowKey[]) {
  localCheckedRowKeys.value = keys
  emit('update:checkedRowKeys', keys)
}
</script>
