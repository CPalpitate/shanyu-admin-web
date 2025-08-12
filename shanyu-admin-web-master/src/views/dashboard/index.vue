<template>
  <div class="w-full box-border">
    <!-- 数据卡片网格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full">
      <!-- 总用户数卡片 -->
      <n-card class="card-base card-hover">
        <div class="flex items-center justify-between">
          <div>
            <p class="stat-title">总用户数</p>
            <div class="stat-value text-blue-600">
              {{ formatNumber(userCount) }}
            </div>
          </div>
          <div class="icon-blue icon-large">
            <Icon icon="bx:user" />
          </div>
        </div>
      </n-card>
      <!-- 今日访问 -->
      <n-card class="card-base card-hover">
        <div class="flex items-center justify-between">
          <div>
            <p class="stat-title">今日访问</p>
            <div class="stat-value text-green-600">
              {{ formatNumber(todayVisits) }}
            </div>
          </div>
          <div class="icon-green icon-large">
            <Icon icon="bx:trending-up" />
          </div>
        </div>
      </n-card>
      <!-- 订单数量 -->
      <n-card class="card-base card-hover">
        <div class="flex items-center justify-between">
          <div>
            <p class="stat-title">订单数量</p>
            <div class="stat-value text-orange-600">
              {{ formatNumber(orderCount) }}
            </div>
          </div>
          <div class="icon-orange icon-large">
            <Icon icon="bx:shopping-bag" />
          </div>
        </div>
      </n-card>
      <!-- 收入统计 -->
      <n-card class="card-base card-hover">
        <div class="flex items-center justify-between">
          <div>
            <p class="stat-title">总收入</p>
            <div class="stat-value text-purple-600">
              ¥{{ formatNumber(revenue) }}
            </div>
          </div>
          <div class="icon-purple icon-large">
            <Icon icon="bx:dollar-circle" />
          </div>
        </div>
      </n-card>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mb-8">
      <n-card title="访问趋势" class="chart-card">
        <div class="h-64 flex-center text-gray-500">
          <div class="text-center">
            <Icon icon="bx:bar-chart-alt-2" class="text-4xl mb-2" />
            <p>图表区域（可集成 ECharts 等图表库）</p>
          </div>
        </div>
      </n-card>
      <n-card title="用户分布" class="chart-card">
        <div class="h-64 flex-center text-gray-500">
          <div class="text-center">
            <Icon icon="bx:pie-chart-alt-2" class="text-4xl mb-2" />
            <p>饼图区域</p>
          </div>
        </div>
      </n-card>
    </div>

    <!-- 最近活动 -->
    <n-card title="最近活动" class="mb-8">
      <div class="space-y-4">
        <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon :icon="activity.icon" class="text-blue-600" />
          </div>
          <div class="flex-1">
            <p class="font-medium">{{ activity.title }}</p>
            <p class="text-sm text-gray-500">{{ activity.description }}</p>
          </div>
          <span class="text-sm text-gray-400">{{ activity.time }}</span>
        </div>
      </div>
    </n-card>

    <!-- 数据表格 -->
    <n-card title="用户数据" class="mb-8">
      <n-data-table
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        :bordered="false"
      />
    </n-card>

    <!-- 统计卡片网格 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <n-card v-for="stat in statistics" :key="stat.id" class="text-center">
        <div class="mb-4">
          <Icon :icon="stat.icon" class="text-4xl" :class="stat.color" />
        </div>
        <h3 class="text-2xl font-bold mb-2">{{ stat.value }}</h3>
        <p class="text-gray-600">{{ stat.label }}</p>
        <div class="mt-2 text-sm" :class="stat.trend > 0 ? 'text-green-600' : 'text-red-600'">
          <Icon :icon="stat.trend > 0 ? 'bx:trending-up' : 'bx:trending-down'" class="inline mr-1" />
          {{ Math.abs(stat.trend) }}%
        </div>
      </n-card>
    </div>

    <!-- 长文本内容 -->
    <n-card title="系统说明" class="mb-8">
      <div class="prose max-w-none">
        <h3>系统概述</h3>
        <p>这是一个现代化的管理后台系统，采用 Vue 3 + TypeScript + Naive UI 构建。系统具有以下特点：</p>
        <ul>
          <li>响应式设计，支持多种设备</li>
          <li>模块化架构，易于维护和扩展</li>
          <li>丰富的组件库，提升开发效率</li>
          <li>完善的权限管理系统</li>
        </ul>
        
        <h3>技术栈</h3>
        <p>前端技术栈包括：</p>
        <ul>
          <li>Vue 3 - 渐进式 JavaScript 框架</li>
          <li>TypeScript - 类型安全的 JavaScript 超集</li>
          <li>Naive UI - Vue 3 组件库</li>
          <li>Vite - 下一代前端构建工具</li>
          <li>UnoCSS - 原子化 CSS 引擎</li>
        </ul>

        <h3>功能特性</h3>
        <p>系统提供以下核心功能：</p>
        <ul>
          <li>用户管理 - 支持用户的增删改查</li>
          <li>权限控制 - 基于角色的访问控制</li>
          <li>数据统计 - 实时数据展示和分析</li>
          <li>系统设置 - 灵活的配置管理</li>
        </ul>

        <h3>部署说明</h3>
        <p>系统支持多种部署方式：</p>
        <ul>
          <li>Docker 容器化部署</li>
          <li>传统服务器部署</li>
          <li>云平台部署</li>
        </ul>
      </div>
    </n-card>

    <!-- 更多内容区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <n-card title="快速操作">
        <div class="grid grid-cols-2 gap-4">
          <n-button v-for="action in quickActions" :key="action.id" type="primary" ghost>
            <template #icon>
              <Icon :icon="action.icon" />
            </template>
            {{ action.label }}
          </n-button>
        </div>
      </n-card>
      
      <n-card title="系统状态">
        <div class="space-y-3">
          <div v-for="status in systemStatus" :key="status.id" class="flex justify-between items-center">
            <span>{{ status.name }}</span>
            <n-tag :type="status.status === 'normal' ? 'success' : 'error'">
              {{ status.status === 'normal' ? '正常' : '异常' }}
            </n-tag>
          </div>
        </div>
      </n-card>
    </div>

    <!-- 底部内容 -->
    <n-card title="更新日志" class="mb-8">
      <div class="space-y-4">
        <div v-for="log in updateLogs" :key="log.id" class="border-l-4 border-blue-500 pl-4">
          <div class="flex justify-between items-start">
            <h4 class="font-medium">{{ log.version }}</h4>
            <span class="text-sm text-gray-500">{{ log.date }}</span>
          </div>
          <p class="text-gray-600 mt-1">{{ log.description }}</p>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

// 数据状态
const userCount = ref(0)
const todayVisits = ref(0)
const orderCount = ref(0)
const revenue = ref(0)

// 目标数值
const targetUserCount = 12345
const targetTodayVisits = 2345
const targetOrderCount = 5678
const targetRevenue = 98765

// 最近活动数据
const recentActivities = ref([
  { id: 1, icon: 'bx:user-plus', title: '新用户注册', description: '用户张三完成了注册', time: '2分钟前' },
  { id: 2, icon: 'bx:shopping-cart', title: '新订单', description: '订单 #12345 已创建', time: '5分钟前' },
  { id: 3, icon: 'bx:message', title: '系统消息', description: '系统维护通知已发送', time: '10分钟前' },
  { id: 4, icon: 'bx:download', title: '数据导出', description: '用户数据导出完成', time: '15分钟前' },
  { id: 5, icon: 'bx:upload', title: '文件上传', description: '配置文件上传成功', time: '20分钟前' },
])

// 表格数据
const columns = [
  { title: '用户ID', key: 'id' },
  { title: '用户名', key: 'username' },
  { title: '邮箱', key: 'email' },
  { title: '注册时间', key: 'registerTime' },
  { title: '状态', key: 'status' },
]

const tableData = ref([
  { id: 1, username: '张三', email: 'zhangsan@example.com', registerTime: '2024-01-15', status: '活跃' },
  { id: 2, username: '李四', email: 'lisi@example.com', registerTime: '2024-01-14', status: '活跃' },
  { id: 3, username: '王五', email: 'wangwu@example.com', registerTime: '2024-01-13', status: '非活跃' },
  { id: 4, username: '赵六', email: 'zhaoliu@example.com', registerTime: '2024-01-12', status: '活跃' },
  { id: 5, username: '钱七', email: 'qianqi@example.com', registerTime: '2024-01-11', status: '活跃' },
  { id: 6, username: '孙八', email: 'sunba@example.com', registerTime: '2024-01-10', status: '非活跃' },
  { id: 7, username: '周九', email: 'zhoujiu@example.com', registerTime: '2024-01-09', status: '活跃' },
  { id: 8, username: '吴十', email: 'wushi@example.com', registerTime: '2024-01-08', status: '活跃' },
])

const pagination = {
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 40],
  onChange: (page: number) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  },
}

// 统计数据
const statistics = ref([
  { id: 1, icon: 'bx:users', value: '1,234', label: '活跃用户', trend: 12, color: 'text-blue-600' },
  { id: 2, icon: 'bx:chart-line', value: '89%', label: '系统性能', trend: 5, color: 'text-green-600' },
  { id: 3, icon: 'bx:server', value: '99.9%', label: '服务可用性', trend: -2, color: 'text-orange-600' },
])

// 快速操作
const quickActions = ref([
  { id: 1, icon: 'bx:user-plus', label: '添加用户' },
  { id: 2, icon: 'bx:download', label: '导出数据' },
  { id: 3, icon: 'bx:settings', label: '系统设置' },
  { id: 4, icon: 'bx:help-circle', label: '帮助文档' },
])

// 系统状态
const systemStatus = ref([
  { id: 1, name: 'Web服务器', status: 'normal' },
  { id: 2, name: '数据库', status: 'normal' },
  { id: 3, name: '缓存服务', status: 'normal' },
  { id: 4, name: '文件存储', status: 'error' },
])

// 更新日志
const updateLogs = ref([
  { id: 1, version: 'v1.2.0', date: '2024-01-15', description: '新增用户管理功能，优化系统性能' },
  { id: 2, version: 'v1.1.5', date: '2024-01-10', description: '修复已知问题，提升用户体验' },
  { id: 3, version: 'v1.1.0', date: '2024-01-05', description: '新增数据统计功能，完善权限系统' },
  { id: 4, version: 'v1.0.0', date: '2024-01-01', description: '系统正式发布，基础功能完善' },
])

// 数字格式化函数
function formatNumber(num: number): string {
  return num.toLocaleString()
}

// 数字动画函数
function animateNumber(current: Ref<number>, target: number, duration: number = 2000) {
  const start = current.value
  const startTime = Date.now()

  function update() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    // 使用缓动函数
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    current.value = Math.floor(start + (target - start) * easeOutQuart)
    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      current.value = target
    }
  }
  requestAnimationFrame(update)
}

// 页面加载时启动动画
onMounted(() => {
  setTimeout(() => {
    animateNumber(userCount, targetUserCount)
    animateNumber(todayVisits, targetTodayVisits)
    animateNumber(orderCount, targetOrderCount)
    animateNumber(revenue, targetRevenue)
  }, 300)
})
</script>

<style scoped>
.card-base {
  @apply transition-all duration-300 ease-in-out;
}

.card-hover:hover {
  @apply transform -translate-y-1 shadow-lg;
}

.stat-title {
  @apply text-sm text-gray-600 mb-1;
}

.stat-value {
  @apply text-2xl font-bold;
}

.icon-large {
  @apply text-3xl;
}

.icon-blue {
  @apply text-blue-600;
}

.icon-green {
  @apply text-green-600;
}

.icon-orange {
  @apply text-orange-600;
}

.icon-purple {
  @apply text-purple-600;
}

.chart-card {
  @apply transition-all duration-300;
}

.chart-card:hover {
  @apply shadow-lg;
}

.flex-center {
  @apply flex items-center justify-center;
}
</style> 