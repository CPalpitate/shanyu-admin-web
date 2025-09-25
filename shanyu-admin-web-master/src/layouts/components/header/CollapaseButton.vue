<template>
  <n-tooltip placement="bottom" trigger="hover">
    <template #trigger>
      <CommonWrapper class="cursor-pointer" @click="appStore.toggleSidesCollapsed()">
        <!-- 收起时显示左 → 用 right 图标反向效果 -->
        <IconFaAngleRight v-if="appStore.getSidesCollapsed" />
        <!-- 展开时显示右 → 也可再换成左箭头 -->
        <IconFaAngleLeft v-else/>
      </CommonWrapper>
    </template>
    <!-- 提示内容：国际化文案 -->
    <span>{{ $t('app.toggleSider') }}</span>
  </n-tooltip>
</template>

<script setup lang="ts">
import {useAppStore} from "@/store";

const appStore = useAppStore()
</script>

<style scoped>

</style>