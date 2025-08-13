<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
}>(), {
  modelValue: '',
  label: '搜索',
  placeholder: '请输入关键词'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
  (e: 'reset'): void
}>()

const inputValue = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val)
})

const handleSearch = () => {
  emit('search')
}

const handleReset = () => {
  emit('update:modelValue', '')
  emit('reset')
}
</script>

<template>
  <div class="search-bar flex items-center gap-2">
    <span>{{ label }}</span>
    <n-input
      v-model:value="inputValue"
      :placeholder="placeholder"
      clearable
      class="w-64"
      @keyup.enter="handleSearch"
    />
    <n-button type="primary" @click="handleSearch">搜索</n-button>
    <n-button @click="handleReset">重置</n-button>
  </div>
</template>

<style scoped>
.search-bar > span {
  white-space: nowrap;
}
</style>
