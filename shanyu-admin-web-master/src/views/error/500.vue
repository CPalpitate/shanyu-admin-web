<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}

const reload = () => {
  window.location.reload()
}
</script>

<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-image">500</div>
      <div class="error-title">服务器错误</div>
      <div class="error-desc">抱歉，服务器出现了问题，请稍后再试</div>
      <div class="error-actions">
        <n-button type="primary" @click="goHome">回到首页</n-button>
        <n-button @click="reload" class="ml-4">重新加载</n-button>
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
  color: #e6a23c;
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