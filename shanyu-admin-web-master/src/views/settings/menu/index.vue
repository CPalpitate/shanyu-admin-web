<template>
  <div class="p-4 space-y-4">
    <SearchBar
        v-model="query"
        :schema="schema"
        :loading="loading"
        :collapsible="false"
        action-width="max-content"
        @submit="onSearch"
        @reset="onReset"
    />

    <n-card size="small" title="菜单列表">
      <template #header-extra>
        <n-space :size="8">
          <n-button type="primary" @click="openCreate">新增菜单</n-button>
        </n-space>
      </template>

      <DataTable
          :data="pagedMenus"
          :columns="columns"
          :loading="loading"
          :total="total"
          :page="page"
          :page-size="pageSize"
          row-key="id"
          :scroll-x="960"
          :page-sizes="[10, 20, 50]"
          @change="handleTableChange"
          @update:page="(val) => (page = val)"
          @update:page-size="(val) => (pageSize = val)"
          @refresh="handleRefresh"
      />
    </n-card>

    <n-modal
        v-model:show="showForm"
        preset="card"
        :title="formMode === 'create' ? '新增菜单' : '编辑菜单'"
        :mask-closable="false"
        :auto-focus="false"
        :style="{ width: '560px', maxWidth: '92vw' }"
    >
      <n-form
          ref="formRef"
          :model="formModel"
          label-placement="left"
          :label-width="90"
          :rules="rules"
          @submit.prevent
      >
        <n-form-item label="菜单名称" path="name">
          <n-input v-model:value="formModel.name" placeholder="请输入菜单名称" />
        </n-form-item>

        <n-form-item label="路由路径" path="path">
          <n-input v-model:value="formModel.path" placeholder="如：/settings/menu" />
        </n-form-item>

        <n-form-item label="菜单类型" path="type">
          <n-select v-model:value="formModel.type" :options="menuTypeOptions" placeholder="请选择菜单类型" />
        </n-form-item>

        <n-form-item label="上级菜单" path="parentId">
          <n-select
              v-model:value="formModel.parentId"
              :options="parentOptions"
              placeholder="默认顶级"
              clearable
          />
        </n-form-item>

        <n-form-item label="图标" path="icon">
          <n-input v-model:value="formModel.icon" placeholder="如：mdi:view-dashboard" />
        </n-form-item>

        <n-form-item label="排序值" path="order">
          <n-input-number v-model:value="formModel.order" :min="0" :step="1" placeholder="排序值" />
        </n-form-item>

        <n-form-item label="权限标识" path="permission">
          <n-input v-model:value="formModel.permission" placeholder="如：system:menu:list" />
        </n-form-item>

        <n-form-item label="启用状态" path="status">
          <n-switch v-model:value="formModel.status">
            <template #checked>启用</template>
            <template #unchecked>停用</template>
          </n-switch>
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="closeForm">取消</n-button>
          <n-button type="primary" :loading="saving" @click="submitForm">
            {{ formMode === 'create' ? '新增' : '保存' }}
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { DataTable, SearchBar } from '@/components/business'
import type { FieldSchema } from '@/components/business'
import type { DataTableColumns, FormInst, FormRules } from 'naive-ui'
import { useDialog, useMessage } from 'naive-ui'
import { computed, h, reactive, ref, watch } from 'vue'
import { NButton, NSpace, NSwitch, NTag } from 'naive-ui'

interface MenuRecord {
  id: string
  name: string
  type: 'directory' | 'menu' | 'button'
  path: string
  icon: string
  status: boolean
  order: number
  parentId: string | null
  parentName?: string | null
  permission?: string
  updatedAt: string
}

interface MenuFormModel {
  id: string | null
  name: string
  type: MenuRecord['type']
  path: string
  icon: string
  status: boolean
  order: number
  parentId: string | null
  permission: string
}

// 全局提示 & 弹窗实例
const msg = useMessage()
const dialog = useDialog()

// 列表加载 / 弹窗提交的状态位
const loading = ref(false)
const saving = ref(false)

// --------------------------- 假数据：用于支撑页面展示 ---------------------------
const initialMenus: MenuRecord[] = [
  {
    id: '1',
    name: '系统管理',
    type: 'directory',
    path: '/settings',
    icon: 'bx:cog',
    status: true,
    order: 1,
    parentId: null,
    parentName: null,
    permission: 'system:settings:view',
    updatedAt: '2024-04-12 10:22'
  },
  {
    id: '1-1',
    name: '代码生成',
    type: 'menu',
    path: '/settings/codegen',
    icon: 'mdi:code-tags',
    status: true,
    order: 10,
    parentId: '1',
    parentName: '系统管理',
    permission: 'system:codegen:list',
    updatedAt: '2024-04-10 16:05'
  },
  {
    id: '1-2',
    name: '菜单管理',
    type: 'menu',
    path: '/settings/menu',
    icon: 'mdi:list-box-outline',
    status: true,
    order: 20,
    parentId: '1',
    parentName: '系统管理',
    permission: 'system:menu:list',
    updatedAt: '2024-04-15 09:18'
  },
  {
    id: '1-2-1',
    name: '新增菜单',
    type: 'button',
    path: '',
    icon: '',
    status: true,
    order: 210,
    parentId: '1-2',
    parentName: '菜单管理',
    permission: 'system:menu:create',
    updatedAt: '2024-04-15 09:18'
  },
  {
    id: '1-2-2',
    name: '删除菜单',
    type: 'button',
    path: '',
    icon: '',
    status: false,
    order: 220,
    parentId: '1-2',
    parentName: '菜单管理',
    permission: 'system:menu:delete',
    updatedAt: '2024-03-20 11:40'
  },
  {
    id: '1-3',
    name: '角色管理',
    type: 'menu',
    path: '/settings/role',
    icon: 'mdi:account-details-outline',
    status: true,
    order: 30,
    parentId: '1',
    parentName: '系统管理',
    permission: 'system:role:list',
    updatedAt: '2024-03-02 08:32'
  }
]

// 模拟接口返回的菜单列表
const menus = ref<MenuRecord[]>([...initialMenus])

// 搜索表单模型
const query = ref({
  keyword: '',
  status: null as boolean | null,
  type: null as MenuRecord['type'] | null
})

// 搜索表单 schema：由业务组件根据 schema 渲染输入控件
const schema = computed<FieldSchema[]>(() => [
  {
    key: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '名称 / 路由 / 权限标识',
    grow: true,
    minWidth: 220
  },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    width: 160,
    options: [
      { label: '启用', value: true },
      { label: '停用', value: false }
    ]
  },
  {
    key: 'type',
    label: '菜单类型',
    type: 'select',
    width: 180,
    options: [
      { label: '目录', value: 'directory' },
      { label: '菜单', value: 'menu' },
      { label: '按钮', value: 'button' }
    ]
  }
])

// 当前页码 / 每页数量
const page = ref(1)
const pageSize = ref(10)

// 记录表格当前的排序字段
const sorter = ref<{ field: keyof MenuRecord; order: 'ascend' | 'descend' } | null>(null)

// 根据搜索条件过滤列表数据
const filteredMenus = computed(() => {
  return menus.value.filter((item) => {
    const keyword = query.value.keyword.trim().toLowerCase()
    const matchKeyword = keyword
      ? [item.name, item.path, item.permission].some((text) =>
          String(text ?? '').toLowerCase().includes(keyword)
        )
      : true
    const matchStatus =
      query.value.status === null ? true : item.status === query.value.status
    const matchType = query.value.type ? item.type === query.value.type : true
    return matchKeyword && matchStatus && matchType
  })
})

// 根据 sorter 设置对筛选后的数据进行排序
const sortedMenus = computed(() => {
  const list = [...filteredMenus.value]
  const currentSorter = sorter.value
  if (currentSorter?.field && currentSorter.order) {
    const { field, order } = currentSorter
    const factor = order === 'ascend' ? 1 : -1
    list.sort((a, b) => {
      const av = a[field]
      const bv = b[field]
      if (typeof av === 'number' && typeof bv === 'number') {
        return (av - bv) * factor
      }
      return String(av ?? '').localeCompare(String(bv ?? ''), 'zh-CN') * factor
    })
  }
  return list
})

// 计算总条数与分页后的数据
const total = computed(() => sortedMenus.value.length)

const pagedMenus = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return sortedMenus.value.slice(start, start + pageSize.value)
})

const menuTypeLabel: Record<MenuRecord['type'], string> = {
  directory: '目录',
  menu: '菜单',
  button: '按钮'
}

const menuTagType: Record<MenuRecord['type'], 'default' | 'success' | 'warning'> = {
  directory: 'default',
  menu: 'success',
  button: 'warning'
}

// Naive UI 表格列配置
const columns: DataTableColumns<MenuRecord> = [
  {
    title: '菜单名称',
    key: 'name',
    minWidth: 180,
    ellipsis: { tooltip: true }
  },
  {
    title: '类型',
    key: 'type',
    width: 120,
    sorter: 'default',
    render: (row) =>
      h(
        NTag,
        { type: menuTagType[row.type], round: true, bordered: false },
        { default: () => menuTypeLabel[row.type] }
      )
  },
  {
    title: '路由路径',
    key: 'path',
    minWidth: 200,
    ellipsis: { tooltip: true }
  },
  {
    title: '权限标识',
    key: 'permission',
    minWidth: 200,
    ellipsis: { tooltip: true }
  },
  {
    title: '上级菜单',
    key: 'parentName',
    minWidth: 160,
    render: (row) => row.parentName || '-'
  },
  {
    title: '排序值',
    key: 'order',
    width: 100,
    align: 'center',
    sorter: 'default'
  },
  {
    title: '更新时间',
    key: 'updatedAt',
    width: 180,
    sorter: 'default'
  },
  {
    title: '状态',
    key: 'status',
    width: 140,
    render: (row) =>
      h(
        NSwitch,
        {
          value: row.status,
          'onUpdate:value': (val: boolean) => toggleStatus(row, val)
        },
        {
          checked: () => '启用',
          unchecked: () => '停用'
        }
      )
  },
  {
    title: '操作',
    key: 'actions',
    width: 220,
    render: (row) =>
      h(
        NSpace,
        { size: 8 },
        {
          default: () => [
            h(
              NButton,
              { size: 'small', type: 'primary', tertiary: true, onClick: () => openEdit(row) },
              { default: () => '编辑' }
            ),
            h(
              NButton,
              { size: 'small', type: 'info', tertiary: true, onClick: () => duplicateMenu(row) },
              { default: () => '复制' }
            ),
            h(
              NButton,
              { size: 'small', type: 'error', tertiary: true, onClick: () => removeMenu(row) },
              { default: () => '删除' }
            )
          ]
        }
      )
  }
]

// 表格分页/排序回调：同步维护页码与排序参数
function handleTableChange(payload: { page: number; pageSize: number; sortField?: string; sortOrder?: 'ascend' | 'descend' | undefined }) {
  page.value = payload.page
  pageSize.value = payload.pageSize
  if (payload.sortField && payload.sortOrder) {
    sorter.value = { field: payload.sortField as keyof MenuRecord, order: payload.sortOrder }
  } else {
    sorter.value = null
  }
}

// 模拟刷新接口
function handleRefresh() {
  msg.success('已刷新示例数据')
}

// 搜索时重置到第一页
function onSearch() {
  page.value = 1
}

// 重置搜索表单
function onReset() {
  query.value = {
    keyword: '',
    status: null,
    type: null
  }
  page.value = 1
}

// 切换菜单启用状态
function toggleStatus(row: MenuRecord, val: boolean) {
  row.status = val
  msg.success(`已${val ? '启用' : '停用'}「${row.name}」`)
}

const showForm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const formRef = ref<FormInst | null>(null)
const formModel = reactive<MenuFormModel>(createEmptyForm())

// 表单下拉选项
const menuTypeOptions = [
  { label: '目录', value: 'directory' },
  { label: '菜单', value: 'menu' },
  { label: '按钮', value: 'button' }
]

// 表单校验规则
const rules: FormRules = {
  name: { required: true, message: '请输入菜单名称', trigger: ['blur', 'input'] },
  type: { required: true, message: '请选择菜单类型', trigger: ['change'] },
  path: {
    validator: (_rule, value) => {
      if (formModel.type !== 'button' && !value) return new Error('请输入路由路径')
      return true
    },
    trigger: ['blur', 'input']
  }
}

// 上级菜单下拉：过滤掉按钮类型和自身
const parentOptions = computed(() =>
  menus.value
    .filter((item) => item.type !== 'button' && item.id !== formModel.id)
    .map((item) => ({ label: item.name, value: item.id }))
)

// 创建空表单模型
function createEmptyForm(): MenuFormModel {
  return {
    id: null,
    name: '',
    type: 'menu',
    path: '',
    icon: '',
    status: true,
    order: 10,
    parentId: '1',
    permission: ''
  }
}

// 打开新增弹窗
function openCreate() {
  formMode.value = 'create'
  Object.assign(formModel, createEmptyForm())
  showForm.value = true
}

// 打开编辑弹窗并回填数据
function openEdit(row: MenuRecord) {
  formMode.value = 'edit'
  Object.assign(formModel, {
    id: row.id,
    name: row.name,
    type: row.type,
    path: row.path,
    icon: row.icon,
    status: row.status,
    order: row.order,
    parentId: row.parentId,
    permission: row.permission || ''
  })
  showForm.value = true
}

// 复制一条菜单，快速体验批量操作
function duplicateMenu(row: MenuRecord) {
  const copy = { ...row, id: `${row.id}-copy`, name: `${row.name}（副本）`, updatedAt: new Date().toLocaleString() }
  menus.value = [copy, ...menus.value]
  msg.success(`已复制「${row.name}」`)
}

function closeForm() {
  showForm.value = false
}

// 校验并保存表单（纯前端示例）
async function submitForm() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    if (formMode.value === 'create') {
      const newMenu: MenuRecord = {
        id: Date.now().toString(),
        name: formModel.name,
        type: formModel.type,
        path: formModel.type === 'button' ? '' : formModel.path,
        icon: formModel.icon,
        status: formModel.status,
        order: formModel.order,
        parentId: formModel.parentId,
        parentName: menus.value.find((item) => item.id === formModel.parentId)?.name ?? null,
        permission: formModel.permission || undefined,
        updatedAt: new Date().toLocaleString()
      }
      menus.value = [newMenu, ...menus.value]
      msg.success('新增菜单成功（示例数据）')
    } else if (formModel.id) {
      menus.value = menus.value.map((item) => {
        if (item.id !== formModel.id) return item
        return {
          ...item,
          name: formModel.name,
          type: formModel.type,
          path: formModel.type === 'button' ? '' : formModel.path,
          icon: formModel.icon,
          status: formModel.status,
          order: formModel.order,
          parentId: formModel.parentId,
          parentName: menus.value.find((menu) => menu.id === formModel.parentId)?.name ?? null,
          permission: formModel.permission || undefined,
          updatedAt: new Date().toLocaleString()
        }
      })
      msg.success('保存菜单成功（示例数据）')
    }
    showForm.value = false
  } finally {
    saving.value = false
  }
}

// 删除菜单（示例中直接在前端数组移除）
function removeMenu(row: MenuRecord) {
  dialog.warning({
    title: '提示',
    content: `确认删除「${row.name}」吗？该操作仅演示，数据会立即移除。`,
    positiveText: '确认删除',
    negativeText: '取消',
    onPositiveClick: () => {
      menus.value = menus.value.filter((item) => item.id !== row.id)
      msg.success('删除成功（示例数据）')
    }
  })
}

// 监听查询条件，变更时自动回到第一页
watch(
  () => query.value,
  () => {
    page.value = 1
  },
  { deep: true }
)
</script>

<style scoped>
</style>
