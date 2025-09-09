<template>
  <n-form
    ref="formRef"
    :model="inner"
    :label-width="labelWidth"
    :label-placement="labelPlacement"
    :size="size"
    :show-feedback="false"
    @submit.prevent="handleSubmit"
  >
    <div class="flex flex-wrap items-start gap-x-3 gap-y-3">
      <template v-for="field in visibleSchemas" :key="field.key">
        <div v-if="isFieldVisible(field)" class="shrink-0" :style="fieldStyle(field)">
          <n-form-item :label="field.label" :path="field.key">
            <slot
              v-if="field.type === 'slot' && field.slot"
              :name="field.slot"
              :model="inner"
              :field="field"
            />
            <component
              :is="resolveComponent(field)"
              v-else
              v-model:value="inner[field.key]"
              v-bind="field.props"
              :placeholder="field.placeholder"
              :options="Array.isArray(field.options) ? field.options : selectOptions[field.key]"
              :type="datePickerType(field)"
              class="w-full"
              @update:value="() => emitChange(field.key)"
            />
          </n-form-item>
        </div>
      </template>

      <div class="ml-auto shrink-0" :style="actionStyle">
        <div class="flex items-center justify-end w-full whitespace-nowrap">
          <n-space :size="12" align="center" :wrap="false">
            <n-button
              v-if="collapsible && overflowCount > 0"
              quaternary
              size="small"
              @click="toggleCollapse"
            >
              {{ collapsed ? `更多筛选${overflowCount ? `(${overflowCount})` : ''}` : '收起筛选' }}
            </n-button>

            <slot name="actions-left" />

            <span class="inline-block h-4 w-px bg-[var(--divider-color,#e5e7eb)] mx-1" />

            <n-button :disabled="loading" @click="handleReset">{{ resetText }}</n-button>
            <n-button type="primary" :loading="loading" attr-type="submit">{{
              submitText
            }}</n-button>
          </n-space>
        </div>
      </div>
    </div>
  </n-form>
</template>

<script setup lang="ts">
/**
 * SearchBar（Flex 版）
 * - 功能：通用搜索栏，支持 input/select/date/daterange/slot，异步下拉，折叠/展开，回车提交，按像素控制每个控件宽度
 * - 布局：flex-wrap；每个字段通过 schema.width/grow/minWidth 精确控制宽度；按钮区通过 actionWidth 固定宽度并始终靠右
 *
 * 用法要点：
 * 1) v-model 传入对象，schema 定义字段；字段值通过 v-model:value 绑定到 inner[field.key]
 * 2) 重置时遵循组件“清空语义”：input->''；select 单选->null / 多选->[]；date/daterange->null；若配置 defaultValue 则回默认值
 * 3) 下拉 options 支持静态数组或异步函数（挂载时预加载）
 * 4) 折叠：collapsible=true 时，折叠状态仅显示前 maxVisibleCount（粗略按 4 列估算）
 */

import { computed, onMounted, reactive, ref, watch } from 'vue'
import type { FormInst } from 'naive-ui'
import { NButton, NDatePicker, NForm, NFormItem, NInput, NSelect, NSpace } from 'naive-ui'

/** 控件类型 */
export type FieldType = 'input' | 'select' | 'daterange' | 'date' | 'slot'

/** 字段 schema 描述 */
export interface FieldSchema {
  /** 绑定的键名，需唯一 */
  key: string
  /** 表单项标签 */
  label: string
  /** 控件类型 */
  type: FieldType

  /** 固定宽度；数字自动转 px，或直接传 '240px'/'16rem' */
  width?: number | string
  /** 是否允许伸展占满剩余空间（常用于关键词输入） */
  grow?: boolean
  /** grow=true 时的最小宽度，避免被挤太窄 */
  minWidth?: number | string

  /** 占位提示 */
  placeholder?: string
  /**
   * 透传到具体控件的属性。
   * 说明：
   *  - NSelect：可传 multiple、clearable、valueField/labelField 等
   *  - NDatePicker：可传 valueFormat（脚本对象写法）/ 'value-format'（模板写法）
   */
  props?: Record<string, any>
  /** 默认值（初始化/重置时使用；若不设则按“清空语义”处理） */
  defaultValue?: any
  /** 显隐控制：布尔或 (model) => boolean，可做级联 */
  visible?: boolean | ((model: Record<string, any>) => boolean)
  /** 下拉选项：静态数组或异步函数 */
  options?:
    | Array<{ label: string; value: any }>
    | (() => Promise<Array<{ label: string; value: any }>>)
  /** 自定义插槽名（type='slot' 时生效） */
  slot?: string
}

/**
 * Props：
 * - modelValue：受控数据对象
 * - schema：字段定义
 * - labelWidth/labelPlacement/size：表单观感
 * - submitText/resetText/loading：按钮文案与状态
 * - collapsible/collapsedRows：折叠控制（预览行数*4 粗估）
 * - actionWidth：右侧按钮区宽度（固定像素/长度）
 */
const props = withDefaults(
  defineProps<{
    modelValue: Record<string, any>
    schema: FieldSchema[]
    labelWidth?: number
    labelPlacement?: 'top' | 'left'
    size?: 'small' | 'medium' | 'large'
    submitText?: string
    resetText?: string
    loading?: boolean
    collapsible?: boolean
    collapsedRows?: number
    actionWidth?: number | string
  }>(),
  {
    labelWidth: 90,
    labelPlacement: 'left',
    size: 'medium',
    submitText: '查询',
    resetText: '重置',
    loading: false,
    collapsible: false,
    collapsedRows: 1,
    actionWidth: 260,
  },
)

/**
 * Emits：
 * - update:modelValue：同步内部变更给父组件
 * - submit：点击查询或回车提交
 * - reset：点击重置
 * - change：任意字段变更
 */
const emits = defineEmits<{
  (e: 'update:modelValue', v: Record<string, any>): void
  (e: 'submit', v: Record<string, any>): void
  (e: 'reset', v: Record<string, any>): void
  (e: 'change', v: Record<string, any>, key?: string): void
}>()

/** NForm 实例引用（可用于清空校验等） */
const formRef = ref<FormInst | null>(null)

/** 受控内部模型（保持同一引用，便于校验与 v-model 同步） */
const inner = reactive<Record<string, any>>({})

/** 初始化模型：先写 defaultValue，再覆盖外部 v-model 传入值 */
const initModel = () => {
  props.schema.forEach((f) => {
    if (f.defaultValue !== undefined) inner[f.key] = cloneDeep(f.defaultValue)
  })
  Object.assign(inner, cloneDeep(props.modelValue || {}))
}

/** 轻量深拷贝（JSON 方案够用且无第三方依赖） */
function cloneDeep<T>(obj: T): T {
  return obj == null ? obj : JSON.parse(JSON.stringify(obj))
}

/** 内部变更 -> 同步到父组件（v-model） */
watch(
  () => inner,
  () => {
    emits('update:modelValue', cloneDeep(inner))
  },
  { deep: true },
)

/** 外部 v-model 变更 -> 覆盖内部（保持单一数据源） */
watch(
  () => props.modelValue,
  (nv) => {
    Object.assign(inner, cloneDeep(nv || {}))
  },
  { deep: true },
)

/** 按字段缓存下拉选项 */
const selectOptions = reactive<Record<string, Array<{ label: string; value: any }>>>({})

/** 若 options 是函数则执行一次并缓存；数组则直接使用 */
async function ensureOptionsLoaded(field: FieldSchema) {
  if (field.type !== 'select') return
  if (Array.isArray(field.options)) {
    selectOptions[field.key] = field.options
    return
  }
  if (typeof field.options === 'function') {
    const data = await field.options()
    selectOptions[field.key] = data || []
  }
}

/** 挂载时初始化与预加载下拉 */
onMounted(async () => {
  initModel()
  await Promise.all(props.schema.map(ensureOptionsLoaded))
})

watch(
    () => props.schema.map(f => ({ key: f.key, options: f.options })),
    async () => {
      await Promise.all(props.schema.map(ensureOptionsLoaded))
    },
    { deep: true }
)

/** 折叠状态（collapsible=false 时无效） */
const collapsed = ref(true)

/** 切换折叠 */
const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}

/** 折叠时的最大可见数量（粗略：每行 4 个） */
const maxVisibleCount = computed(() => {
  if (!props.collapsible) return Infinity
  const perRow = 4
  return (props.collapsedRows || 1) * perRow
})

/** 超出数量（用于“更多筛选(N)”） */
const overflowCount = computed(() => {
  return Math.max(0, props.schema.filter(isFieldVisible).length - maxVisibleCount.value)
})

/** 实际渲染的 schema 列表：折叠只截取前 maxVisibleCount */
const visibleSchemas = computed(() => {
  const list = props.schema.filter(isFieldVisible)
  if (!props.collapsible) return list
  return collapsed.value ? list.slice(0, maxVisibleCount.value) : list
})

/** 判断字段是否可见（支持布尔或函数） */
function isFieldVisible(field: FieldSchema) {
  if (typeof field.visible === 'boolean') return field.visible
  if (typeof field.visible === 'function') return field.visible(inner)
  return true
}

/** 根据类型返回具体控件 */
function resolveComponent(field: FieldSchema) {
  switch (field.type) {
    case 'input':
      return NInput
    case 'select':
      return NSelect
    case 'date':
    case 'daterange':
      return NDatePicker
    default:
      return 'div'
  }
}

/** 日期控件的 type（可通过 field.props.type 覆盖） */
function datePickerType(field: FieldSchema) {
  if (field.type === 'date') return field.props?.type ?? 'date'
  if (field.type === 'daterange') return field.props?.type ?? 'daterange'
  return undefined
}

/** 某字段值变化时触发（父组件可据此做联动） */
function emitChange(key?: string) {
  emits('change', cloneDeep(inner), key)
}

/** 提交：原生 submit 流程被 @submit.prevent 拦截到这里 */
async function handleSubmit() {
  emits('submit', cloneDeep(inner))
}

/** 清空策略：若有 defaultValue 用默认值，否则按组件“清空语义” */
function resolveEmptyByType(field: FieldSchema) {
  if (field.defaultValue !== undefined) return cloneDeep(field.defaultValue)
  switch (field.type) {
    case 'input':
      return ''
    case 'select':
      return field.props?.multiple ? [] : null
    case 'date':
    case 'daterange':
      return null
    case 'slot':
    default:
      return undefined
  }
}

/** 重置：覆盖 inner 为清空/默认值，并清理校验状态 */
function handleReset() {
  const resetObj: Record<string, any> = {}
  props.schema.forEach((f) => {
    resetObj[f.key] = resolveEmptyByType(f)
  })
  Object.keys(inner).forEach((k) => delete inner[k])
  Object.assign(inner, resetObj)
  formRef.value?.restoreValidation?.()
  emits('reset', cloneDeep(inner))
}

/** 常见控件的默认宽度 */
const defaultWidths: Record<FieldType, number> = {
  input: 280,
  select: 200,
  date: 220,
  daterange: 360,
  slot: 240,
}

/** 转 CSS 长度字符串 */
function toPx(v?: number | string) {
  if (v === undefined || v === null) return undefined
  return typeof v === 'number' ? `${v}px` : v
}

/** 单个字段容器样式：固定或可伸展两种策略 */
function fieldStyle(field: FieldSchema) {
  const basis = toPx(field.width ?? defaultWidths[field.type] ?? 240)
  if (field.grow) {
    const minW = toPx(field.minWidth ?? basis ?? 0)
    return {
      flex: `1 1 ${basis ?? '240px'}`,
      minWidth: minW,
      maxWidth: '100%',
    }
  }
  return {
    flex: `0 0 ${basis ?? '240px'}`,
    width: basis,
    maxWidth: '100%',
  }
}

/** 右侧按钮区样式：固定宽度，避免抖动 */
const actionStyle = computed(() => {
  const w = props.actionWidth
  // 传 'max-content' 或 'auto' 时，操作区宽度跟内容走；整块作为一个 flex item
  if (w === 'max-content' || w === 'auto') {
    return { flex: '0 0 auto', width: 'max-content' }
  }
  const px = toPx(w)
  return { flex: `0 0 ${px}`, width: px, maxWidth: '100%' }
})

/** 获取当前值（深拷贝，避免外部误改内部） */
function getValues() {
  return cloneDeep(inner)
}

/** 批量回填/设置值（部分字段） */
function setValues(v: Record<string, any>) {
  Object.assign(inner, cloneDeep(v || {}))
}

/** 暴露方法给父组件（通过 ref 调用） */
defineExpose({ getValues, setValues, handleSubmit, handleReset })
</script>

<style scoped></style>
