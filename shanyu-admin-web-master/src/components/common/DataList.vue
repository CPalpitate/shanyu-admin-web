<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'

interface FetchResult<T = any> {
  list: T[]
  total: number
}

const props = defineProps<{
  columns: DataTableColumns<any>
  fetchData: (params: { query: string; page: number; pageSize: number }) => Promise<FetchResult>
}>()

const query = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const data = ref<any[]>([])
const loading = ref(false)

const load = async () => {
  loading.value = true
  try {
    const res = await props.fetchData({ query: query.value, page: page.value, pageSize: pageSize.value })
    data.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  page.value = 1
  load()
}

watch(page, load)
watch(pageSize, () => {
  page.value = 1
  load()
})

onMounted(load)
</script>

<template>
  <div class="data-list flex flex-col gap-4">
    <search-bar v-model="query" @search="handleSearch" />
    <n-data-table :columns="columns" :data="data" :loading="loading" />
    <pagination
      class="self-end"
      :page="page"
      :page-size="pageSize"
      :page-count="Math.max(1, Math.ceil(total / pageSize))"
      @update:page="(p:number)=>page = p"
      @update:page-size="(s:number)=>pageSize = s"
    />
  </div>
</template>

<style scoped>
</style>
