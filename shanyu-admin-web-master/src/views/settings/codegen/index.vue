<template>
  <div class="p-4 space-y-4">
    <!-- 查询区 -->
    <SearchBar
        v-model="query"
        :schema="schema"
        :collapsible="false"
        action-width="max-content"
        :loading="loading"
        @submit="onSearch"
        @reset="onReset"
    >
      <template #actions-left>
        <n-button
            type="primary"
            :disabled="!checkedTableNames.length"
            @click="openGenModal"
        >
          生成代码（{{ checkedTableNames.length }}）
        </n-button>
      </template>
    </SearchBar>

    <!-- 表列表卡片 -->
    <n-card size="small" title="表列表">
      <template #header-extra>
        <n-space :size="8">
          <n-button
              size="small"
              tertiary
              :disabled="!checkedTableNames.length"
              @click="clearSelection"
          >
            清空选择
          </n-button>
        </n-space>
      </template>

      <!-- 方式A：纯展示 DataTable -->
      <DataTable
          v-model:page="page"
          v-model:page-size="pageSize"
          v-model:sorter="sorter"
          v-model:checked-row-keys="checkedTableNames"
          :columns="columns"
          :data="rows"
          :total="total"
          :loading="loading"
          :checkable="true"
          :show-index="true"
          :page-sizes="[10, 20, 50, 100]"
          size="medium"
          row-key="tableName"
          :scroll-x="900"
          :resizable="true"
          @change="fetch"
          @refresh="fetch"
      />
    </n-card>

    <!-- 生成代码弹窗 -->
    <n-modal
        v-model:show="showGen"
        preset="card"
        title="生成配置"
        :mask-closable="false"
        :auto-focus="false"
        :style="{ width: '880px', maxWidth: '92vw', maxHeight: '88vh', borderRadius: '12px' }"
    >
      <div style="max-height: calc(80vh - 24px); overflow: auto">
        <n-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-placement="left"
            :label-width="100"
            :size="formSize"
            @submit.prevent
        >
          <n-form-item label="库名" path="schemaName">
            <n-select
                v-model:value="form.schemaName"
                :options="dbOptions"
                placeholder="请选择库名"
                clearable
            />
          </n-form-item>

          <n-form-item label="作者" path="author">
            <n-input v-model:value="form.author" placeholder="如：Zhang San"/>
          </n-form-item>

          <n-form-item label="业务注释" path="comment">
            <n-input v-model:value="form.comment" placeholder="如：用户管理模块"/>
          </n-form-item>

          <n-form-item label="顶级包名" path="packageName">
            <n-input v-model:value="form.packageName" placeholder="如：com.example.app"/>
          </n-form-item>

          <n-form-item label="模块名" path="moduleName">
            <n-input v-model:value="form.moduleName" placeholder="如：system"/>
          </n-form-item>

          <n-form-item label="实体父类" path="baseEntityFqn">
            <n-input v-model:value="form.baseEntityFqn" placeholder="可留空：读取默认配置"/>
          </n-form-item>

          <n-form-item label="父类公共字段" path="superEntityColumns">
            <n-input
                v-model:value="form.superEntityColumns"
                placeholder="逗号分隔，如：id,createdAt,updatedAt"
            />
          </n-form-item>

          <n-form-item label="移除表前缀" path="tablePrefix">
            <n-input v-model:value="form.tablePrefix" placeholder="如：sys_, t_"/>
          </n-form-item>

          <n-form-item label="启用 Lombok" path="enableLombok">
            <n-switch v-model:value="form.enableLombok"/>
          </n-form-item>

          <n-form-item label="Rest 风格" path="enableRestStyle">
            <n-switch v-model:value="form.enableRestStyle"/>
          </n-form-item>

          <n-alert type="info" class="mb-3">已选择表：{{ checkedTableNames.length }} 个</n-alert>

          <n-space justify="end">
            <n-button @click="closeGenModal">取消</n-button>
            <n-button type="primary" :loading="downloading" @click="handleDownload">
              生成并下载
            </n-button>
          </n-space>
        </n-form>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import {codegenApi} from '@/api'
import type {
  CodeGenRequest,
  CodegenTable,
  CodegenTableFilter,
  PageQuery,
  OrderItem
} from '@/api/types'
import type {FieldSchema} from '@/components/business'
import {DataTable, SearchBar} from '@/components/business'
import type {DataTableColumns, DataTableSortState, FormInst, FormRules} from 'naive-ui'

const msg = useMessage()

/** 查询模型：SearchBar 的 v-model */
interface QueryModel {
  schemaName: string | null
  tableName: string
}

const query = ref<QueryModel>({schemaName: null, tableName: ''})

/** 库名下拉（首次进入页面自动加载） */
const dbOptions = ref<Array<{ label: string; value: string }>>([])
const loadingDBs = ref(false)

async function loadDatabases() {
  if (loadingDBs.value) return
  loadingDBs.value = true
  try {
    const res = await codegenApi.getDatabases() // Promise<R<string[]>>
    const arr = Array.isArray(res.data) ? res.data : []
    dbOptions.value = arr.map((v) => ({label: v, value: v}))
    if (!query.value.schemaName && arr.length) query.value.schemaName = arr[0]
  } catch (e: any) {
    msg.error(e?.message || '加载库名失败')
  } finally {
    loadingDBs.value = false
  }
}

/** SearchBar 字段描述 */
const schema = computed<FieldSchema[]>(() => [
  {key: 'schemaName', label: '库名', type: 'select', width: 300, props: {clearable: true}, options: dbOptions.value},
  {key: 'tableName', label: '表名', type: 'input', width: 240, placeholder: '支持模糊匹配'}
])

/** 表格列：去掉库名，改用“表描述” */
const columns: DataTableColumns<CodegenTable> = [
  {title: '表名', key: 'tableName', minWidth: 200, ellipsis: {tooltip: true}, resizable: true},
  {title: '表描述', key: 'tableComment', width: 240, resizable: true, ellipsis: {tooltip: true}},
  {title: '引擎', key: 'engine', width: 120, resizable: true},
  {title: '创建时间', key: 'createTime', width: 240}
]

/** 列表状态 */
const rows = ref<CodegenTable[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const sorter = ref<DataTableSortState | null>(null)
const checkedTableNames = ref<string[]>([])

/** Naive sorter -> 后端 orders（使用你声明里的 OrderItem） */
function toOrders(s: DataTableSortState | null): OrderItem[] | undefined {
  if (!s?.columnKey || !s.order) return
  const col = String(s.columnKey)
  return [{column: col, asc: s.order === 'ascend'}]
}

/** 查询 / 重置 */
function onSearch() {
  if (loading.value) return
  page.value = 1
  fetch()
}

function onReset() {
  if (loading.value) return
  query.value = {schemaName: null, tableName: ''}
  page.value = 1
  fetch()
}

/** 清空选择 */
function clearSelection() {
  checkedTableNames.value = []
}

/** 拉取表数据（分页） */
async function fetch() {
  if (loading.value) return
  loading.value = true
  try {
    const params: PageQuery<CodegenTableFilter> = {
      current: page.value,
      size: pageSize.value,
      dbName: query.value.schemaName ?? undefined,
      tableName: query.value.tableName || undefined,
      orders: toOrders(sorter.value)
    }
    const res = await codegenApi.getTables(params) // Promise<R<PageResult<CodegenTable>>>
    const pageData = res.data
    rows.value = Array.isArray(pageData?.records) ? pageData.records : []
    total.value = Number(pageData?.total ?? 0)
  } catch (e: any) {
    msg.error(e?.message || '加载表列表失败')
  } finally {
    loading.value = false
  }
}

/** 生成并下载 —— 使用你定义的 CodeGenRequest（comment 是 string） */
const formSize: 'small' | 'medium' | 'large' = 'medium'
const formRef = ref<FormInst | null>(null)
const form = ref<CodeGenRequest>({
  schemaName: '',       // 类型为 string，这里用空串占位；打开弹窗时同步查询区
  tableNames: [],
  author: '',
  comment: '',          // string
  packageName: '',
  moduleName: '',
  baseEntityFqn: '',
  superEntityColumns: '',
  tablePrefix: '',
  enableLombok: true,
  enableRestStyle: true
})

/** 校验规则：comment 字符串必填 */
const rules: FormRules = {
  schemaName: {required: true, message: '请选择库名', trigger: ['change', 'blur']},
  author: {required: true, message: '请输入作者', trigger: ['input', 'blur']},
  comment: {required: true, message: '请输入业务注释', trigger: ['input', 'blur']},
  packageName: {required: true, message: '请输入顶级包名', trigger: ['input', 'blur']},
  moduleName: {required: true, message: '请输入模块名', trigger: ['input', 'blur']}
}

const showGen = ref(false)
const downloading = ref(false)

/** 打开弹窗：先做“至少选择一个表”的校验 */
function openGenModal() {
  if (!checkedTableNames.value.length) {
    msg.warning('请至少选择一个表')
    return
  }
  form.value.schemaName = query.value.schemaName || ''
  form.value.tableNames = checkedTableNames.value.slice()
  showGen.value = true
}

function closeGenModal() {
  showGen.value = false
}

async function handleDownload() {
  form.value.tableNames = checkedTableNames.value.slice()

  const ok = await new Promise<boolean>((resolve) => {
    formRef.value?.validate((err) => resolve(!err))
  })
  if (!ok) return
  if (!form.value.tableNames.length) return msg.warning('请至少选择一个表') // 兜底

  downloading.value = true
  try {
    await codegenApi.downloadCodeZip(form.value)
    msg.success('开始下载')
    showGen.value = false
  } catch (e: any) {
    msg.error(e?.message || '下载失败')
  } finally {
    downloading.value = false
  }
}

/** 首次加载：进入页面自动拉库名 + 列表 */
onMounted(async () => {
  await loadDatabases()
  await fetch()
})
</script>
