<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-image">404</div>
      <div class="error-title">页面未找到</div>
      <div class="error-desc">抱歉，您访问的页面不存在或已被删除</div>
      <div class="error-actions">
        <n-button type="primary" @click="goHome">回到首页</n-button>
        <n-button @click="goBack" class="ml-4">返回上页</n-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.error-content {
  text-align: center;
  padding: 30px;
}

.error-image {
  font-size: 120px;
  font-weight: bold;
  color: #409eff;
  line-height: 1.2;
  margin-bottom: 20px;
}

.error-title {
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
}

.error-desc {
  font-size: 16px;
  color: #606266;
  margin-bottom: 30px;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.ml-4 {
  margin-left: 16px;
}
</style> 