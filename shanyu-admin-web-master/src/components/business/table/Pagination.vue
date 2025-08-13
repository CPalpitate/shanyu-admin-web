<script setup lang="ts">
const props = withDefaults(defineProps<{
  page: number
  pageSize: number
  pageCount: number
}>(), {
  page: 1,
  pageSize: 10,
  pageCount: 1
})

const emit = defineEmits<{
  (e: 'update:page', value: number): void
  (e: 'update:pageSize', value: number): void
}>()

const pageRef = computed({
  get: () => props.page,
  set: (val: number) => emit('update:page', val)
})

const pageSizeRef = computed({
  get: () => props.pageSize,
  set: (val: number) => emit('update:pageSize', val)
})
</script>

<template>
  <n-pagination
    v-model:page="pageRef"
    v-model:page-size="pageSizeRef"
    :page-count="pageCount"
    show-size-picker
    show-quick-jumper
    :page-sizes="[10,20,50,100]"
  />
</template>

<style scoped>
</style>
