<!-- AvatarDropdown.vue -->
<template>
  <n-dropdown
      trigger="click"
      :options="options"
      @select="handleSelect"
  >
    <!-- 这里是默认插槽，作为触发器 -->
    <n-avatar
        size="small"
        :src="user.avatarUrl"
        class="cursor-pointer"
    />
  </n-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/hooks/useAuth.ts'

const router = useRouter()

const { logout } = useAuth()

const user = ref({
  avatarUrl: '/assets/avatar.png',
})

const options = [
  { label: '个人中心', key: 'profile' },
  { label: '退出登录', key: 'logout' },
]

const handleSelect = async (key: string) => {
  if (key === 'profile') {
    await router.push('/profile')
  } else if (key === 'logout') {
    await logout()
  }
}

</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>