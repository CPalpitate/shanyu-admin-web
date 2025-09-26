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

    <n-card size="small" title="角色列表">
      <template #header-extra>
        <n-space :size="8">
          <n-button type="primary" @click="openCreate">新增角色</n-button>
        </n-space>
      </template>

      <DataTable
          :data="pagedRoles"
          :columns="columns"
          :loading="loading"
          :total="total"
          :page="page"
          :page-size="pageSize"
          row-key="id"
          :scroll-x="900"
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
        :title="formMode === 'create' ? '新增角色' : '编辑角色'"
        :mask-closable="false"
        :auto-focus="false"
        :style="{ width: '520px', maxWidth: '92vw' }"
    >
      <n-form
          ref="formRef"
          :model="formModel"
          :rules="rules"
          label-placement="left"
          :label-width="90"
          @submit.prevent
      >
        <n-form-item label="角色名称" path="name">
          <n-input v-model:value="formModel.name" placeholder="如：系统管理员" />
        </n-form-item>

        <n-form-item label="角色标识" path="code">
          <n-input v-model:value="formModel.code" placeholder="如：ROLE_ADMIN" />
        </n-form-item>

        <n-form-item label="数据范围" path="dataScope">
          <n-select
              v-model:value="formModel.dataScope"
              :options="dataScopeOptions"
              placeholder="请选择数据范围"
          />
        </n-form-item>

        <n-form-item label="启用状态" path="status">
          <n-switch v-model:value="formModel.status">
            <template #checked>启用</template>
            <template #unchecked>停用</template>
          </n-switch>
        </n-form-item>

        <n-form-item label="角色说明" path="description">
          <n-input
              v-model:value="formModel.description"
              type="textarea"
              rows="3"
              placeholder="请输入角色说明"
          />
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

    <n-drawer v-model:show="showDrawer" :width="420">
      <n-drawer-content title="分配菜单权限">
        <n-tree
            v-model:checked-keys="checkedPermissionKeys"
            :data="permissionTree"
            checkable
            cascade
            block-line
            :default-expand-all="true"
        />
        <template #footer>
          <n-space justify="end">
            <n-button @click="showDrawer = false">取消</n-button>
            <n-button type="primary" @click="saveAssignedMenus">保存</n-button>
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { DataTable, SearchBar } from '@/components/business'
import type { FieldSchema } from '@/components/business'
import type { DataTableColumns, FormInst, FormRules, TreeOption } from 'naive-ui'
import { useDialog, useMessage } from 'naive-ui'
import { computed, h, reactive, ref, watch } from 'vue'
import { NButton, NSpace, NSwitch, NTag } from 'naive-ui'

interface RoleRecord {
  id: string
  name: string
  code: string
  status: boolean
  description: string
  dataScope: string
  menuCount: number
  userCount: number
  updatedAt: string
}

interface RoleFormModel {
  id: string | null
  name: string
  code: string
  status: boolean
  description: string
  dataScope: string
}

const msg = useMessage()
const dialog = useDialog()

const loading = ref(false)
const saving = ref(false)

const initialRoles: RoleRecord[] = [
  {
    id: '1',
    name: '系统管理员',
    code: 'ROLE_ADMIN',
    status: true,
    description: '拥有系统全部权限，负责平台配置与账户管理',
    dataScope: '全部数据权限',
    menuCount: 48,
    userCount: 2,
    updatedAt: '2024-04-12 09:30'
  },
  {
    id: '2',
    name: '业务经理',
    code: 'ROLE_MANAGER',
    status: true,
    description: '可查看全部业务数据并进行审批',
    dataScope: '本部门及下级',
    menuCount: 28,
    userCount: 6,
    updatedAt: '2024-03-28 14:22'
  },
  {
    id: '3',
    name: '内容运营',
    code: 'ROLE_OPERATOR',
    status: true,
    description: '负责内容发布、审核与菜单维护',
    dataScope: '本部门数据',
    menuCount: 18,
    userCount: 4,
    updatedAt: '2024-03-16 11:18'
  },
  {
    id: '4',
    name: '访客账号',
    code: 'ROLE_GUEST',
    status: false,
    description: '仅可查看基础数据，禁止修改',
    dataScope: '自定义数据范围',
    menuCount: 6,
    userCount: 10,
    updatedAt: '2024-02-01 08:05'
  }
]

const roles = ref<RoleRecord[]>([...initialRoles])

const query = ref({
  keyword: '',
  status: null as boolean | null
})

const schema = computed<FieldSchema[]>(() => [
  {
    key: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '角色名称 / 标识',
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
  }
])

const page = ref(1)
const pageSize = ref(10)
const sorter = ref<{ field: keyof RoleRecord; order: 'ascend' | 'descend' } | null>(null)

const filteredRoles = computed(() => {
  return roles.value.filter((item) => {
    const keyword = query.value.keyword.trim().toLowerCase()
    const matchKeyword = keyword
      ? [item.name, item.code].some((text) => String(text).toLowerCase().includes(keyword))
      : true
    const matchStatus =
      query.value.status === null ? true : item.status === query.value.status
    return matchKeyword && matchStatus
  })
})

const sortedRoles = computed(() => {
  const list = [...filteredRoles.value]
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

const total = computed(() => sortedRoles.value.length)

const pagedRoles = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return sortedRoles.value.slice(start, start + pageSize.value)
})

const columns: DataTableColumns<RoleRecord> = [
  {
    title: '角色名称',
    key: 'name',
    minWidth: 180,
    ellipsis: { tooltip: true }
  },
  {
    title: '标识',
    key: 'code',
    minWidth: 140,
    ellipsis: { tooltip: true }
  },
  {
    title: '数据范围',
    key: 'dataScope',
    minWidth: 180,
    ellipsis: { tooltip: true }
  },
  {
    title: '菜单数量',
    key: 'menuCount',
    width: 120,
    align: 'center',
    sorter: 'default',
    render: (row) => h(NTag, { type: 'success', bordered: false }, { default: () => row.menuCount })
  },
  {
    title: '用户数量',
    key: 'userCount',
    width: 120,
    align: 'center',
    sorter: 'default',
    render: (row) => h(NTag, { type: 'info', bordered: false }, { default: () => row.userCount })
  },
  {
    title: '最近更新时间',
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
    width: 240,
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
              { size: 'small', type: 'info', tertiary: true, onClick: () => openAssignMenus(row) },
              { default: () => '分配菜单' }
            ),
            h(
              NButton,
              { size: 'small', type: 'error', tertiary: true, onClick: () => removeRole(row) },
              { default: () => '删除' }
            )
          ]
        }
      )
  }
]

function handleTableChange(payload: { page: number; pageSize: number; sortField?: string; sortOrder?: 'ascend' | 'descend' | undefined }) {
  page.value = payload.page
  pageSize.value = payload.pageSize
  if (payload.sortField && payload.sortOrder) {
    sorter.value = { field: payload.sortField as keyof RoleRecord, order: payload.sortOrder }
  } else {
    sorter.value = null
  }
}

function handleRefresh() {
  msg.success('已刷新示例数据')
}

function onSearch() {
  page.value = 1
}

function onReset() {
  query.value = {
    keyword: '',
    status: null
  }
  page.value = 1
}

function toggleStatus(row: RoleRecord, val: boolean) {
  row.status = val
  msg.success(`已${val ? '启用' : '停用'}角色「${row.name}」`)
}

const showForm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const formRef = ref<FormInst | null>(null)
const formModel = reactive<RoleFormModel>(createEmptyRoleForm())

const dataScopeOptions = [
  { label: '全部数据权限', value: '全部数据权限' },
  { label: '本部门及下级', value: '本部门及下级' },
  { label: '本部门数据', value: '本部门数据' },
  { label: '仅本人数据', value: '仅本人数据' },
  { label: '自定义数据范围', value: '自定义数据范围' }
]

const rules: FormRules = {
  name: { required: true, message: '请输入角色名称', trigger: ['blur', 'input'] },
  code: { required: true, message: '请输入角色标识', trigger: ['blur', 'input'] },
  dataScope: { required: true, message: '请选择数据范围', trigger: ['change'] }
}

function createEmptyRoleForm(): RoleFormModel {
  return {
    id: null,
    name: '',
    code: '',
    status: true,
    description: '',
    dataScope: '本部门数据'
  }
}

function openCreate() {
  formMode.value = 'create'
  Object.assign(formModel, createEmptyRoleForm())
  showForm.value = true
}

function openEdit(row: RoleRecord) {
  formMode.value = 'edit'
  Object.assign(formModel, {
    id: row.id,
    name: row.name,
    code: row.code,
    status: row.status,
    description: row.description,
    dataScope: row.dataScope
  })
  showForm.value = true
}

async function submitForm() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    if (formMode.value === 'create') {
      const newRole: RoleRecord = {
        id: Date.now().toString(),
        name: formModel.name,
        code: formModel.code,
        status: formModel.status,
        description: formModel.description,
        dataScope: formModel.dataScope,
        menuCount: Math.ceil(Math.random() * 30 + 5),
        userCount: Math.ceil(Math.random() * 8),
        updatedAt: new Date().toLocaleString()
      }
      roles.value = [newRole, ...roles.value]
      msg.success('新增角色成功（示例数据）')
    } else if (formModel.id) {
      roles.value = roles.value.map((item) => {
        if (item.id !== formModel.id) return item
        return {
          ...item,
          name: formModel.name,
          code: formModel.code,
          status: formModel.status,
          description: formModel.description,
          dataScope: formModel.dataScope,
          updatedAt: new Date().toLocaleString()
        }
      })
      msg.success('保存角色成功（示例数据）')
    }
    showForm.value = false
  } finally {
    saving.value = false
  }
}

function removeRole(row: RoleRecord) {
  dialog.warning({
    title: '提示',
    content: `确认删除角色「${row.name}」吗？该操作仅演示，数据会立即移除。`,
    positiveText: '确认删除',
    negativeText: '取消',
    onPositiveClick: () => {
      roles.value = roles.value.filter((item) => item.id !== row.id)
      msg.success('删除成功（示例数据）')
    }
  })
}

const permissionTree = ref<TreeOption[]>([
  {
    key: 'dashboard',
    label: 'Dashboard',
    children: [
      { key: 'dashboard:view', label: '查看仪表盘' }
    ]
  },
  {
    key: 'users',
    label: '用户管理',
    children: [
      { key: 'users:list', label: '查看用户' },
      { key: 'users:create', label: '新增用户' },
      { key: 'users:reset', label: '重置密码' }
    ]
  },
  {
    key: 'settings',
    label: '系统设置',
    children: [
      {
        key: 'settings:codegen',
        label: '代码生成',
        children: [
          { key: 'settings:codegen:list', label: '查看列表' },
          { key: 'settings:codegen:download', label: '生成代码' }
        ]
      },
      {
        key: 'settings:menu',
        label: '菜单管理',
        children: [
          { key: 'settings:menu:list', label: '查看菜单' },
          { key: 'settings:menu:create', label: '新增菜单' },
          { key: 'settings:menu:delete', label: '删除菜单' }
        ]
      },
      {
        key: 'settings:role',
        label: '角色管理',
        children: [
          { key: 'settings:role:list', label: '查看角色' },
          { key: 'settings:role:update', label: '编辑角色' }
        ]
      }
    ]
  }
])

const showDrawer = ref(false)
const checkedPermissionKeys = ref<string[]>([])

function openAssignMenus(row: RoleRecord) {
  showDrawer.value = true
  checkedPermissionKeys.value = generateMockPermission(row)
  msg.info(`正在为「${row.name}」分配菜单（示例）`)
}

function generateMockPermission(row: RoleRecord) {
  if (row.code === 'ROLE_ADMIN') {
    return permissionTree.value.flatMap((node) => collectKeys(node))
  }
  if (row.code === 'ROLE_MANAGER') {
    return permissionTree.value
      .flatMap((node) => collectKeys(node))
      .filter((key) => !String(key).startsWith('settings:menu'))
  }
  if (row.code === 'ROLE_OPERATOR') {
    return ['dashboard', 'dashboard:view', 'settings:menu', 'settings:menu:list']
  }
  return ['dashboard']
}

function collectKeys(node: TreeOption): string[] {
  const children = Array.isArray(node.children) ? node.children : []
  return [String(node.key), ...children.flatMap((child) => collectKeys(child as TreeOption))]
}

function saveAssignedMenus() {
  msg.success('保存成功（示例数据）')
  showDrawer.value = false
}

function closeForm() {
  showForm.value = false
}

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
