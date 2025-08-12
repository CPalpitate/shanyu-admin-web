<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
}>(), {
  modelValue: '',
  placeholder: '请输入关键词'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
}>()

const inputValue = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val)
})

const handleSearch = () => {
  emit('search')
}
</script>

<template>
  <n-input
    v-model:value="inputValue"
    :placeholder="placeholder"
    clearable
    class="max-w-64"
    @keyup.enter="handleSearch"
  >
    <template #suffix>
      <n-button text @click="handleSearch">搜索</n-button>
    </template>
  </n-input>
</template>

<style scoped>
</style>
