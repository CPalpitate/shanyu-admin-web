<template>
  <div class="p-6 flex flex-col gap-4">
    <h1 class="text-2xl font-bold">代码生成</h1>
    <data-list
      :columns="columns"
      :fetch-data="fetchData"
      search-label="库名/表名"
    />

  </div>
</template>

<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'

interface TableInfo {
  dbName: string
  tableName: string
}

const columns: DataTableColumns<TableInfo> = [
  { title: '库名', key: 'dbName' },
  { title: '表名', key: 'tableName' }
]

const mockData: TableInfo[] = [
  { dbName: 'system', tableName: 'users' },
  { dbName: 'system', tableName: 'roles' },
  { dbName: 'app', tableName: 'orders' },
  { dbName: 'app', tableName: 'products' },
  { dbName: 'analytics', tableName: 'events' },
  { dbName: 'analytics', tableName: 'metrics' },
  { dbName: 'archive', tableName: 'old_users' },
  { dbName: 'archive', tableName: 'old_orders' }
]

const fetchData = async ({ query, page, pageSize }: { query: string; page: number; pageSize: number }) => {
  let list = mockData.filter(
    item => item.dbName.includes(query) || item.tableName.includes(query)
  )
  const total = list.length
  list = list.slice((page - 1) * pageSize, page * pageSize)
  return {
    list,
    total
  }
}
</script>

<style scoped>
</style>
