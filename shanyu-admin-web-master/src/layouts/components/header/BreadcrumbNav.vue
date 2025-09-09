<template>
  <n-breadcrumb separator="/">
    <!-- 首页面包屑，点击跳转到首页 -->
    <n-breadcrumb-item class="cursor-pointer hover:text-primary" @click="goHome">首页</n-breadcrumb-item>
    <!-- 动态生成的面包屑，点击跳转到对应页面 -->
    <n-breadcrumb-item
      v-for="item in crumbs"
      :key="item.path"
      class="cursor-pointer hover:text-primary"
      @click="handleCrumbClick(item.path)"
    >
      {{ item.label }}
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

// 计算当前路由的面包屑数组
const crumbs = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  return segments.map((_, i) => {
    // 拼接每一级的完整路径
    const fullPath = '/' + segments.slice(0, i + 1).join('/')
    // 获取路由元信息中的标题
    const meta = router.getRoutes().find(r => r.path === fullPath)?.meta
    return {
      path: fullPath,
      label: (meta && meta.title) || segments[i],
    }
  })
})

// 跳转到首页
function goHome() {
  if (route.path !== '/') {
    router.push('/')
  }
}

// 跳转到对应面包屑页面
function handleCrumbClick(path: string) {
  if (route.path !== path) {
    router.push(path)
  }
}
</script>