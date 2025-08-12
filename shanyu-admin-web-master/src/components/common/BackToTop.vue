<template>
  <n-back-top
      :visibility-height="visibilityHeight"
      :bottom="bottom"
      :right="right"
  >
    <n-button circle size="medium">
      <n-icon :size="20">
        <Icon :icon="icon"/>
      </n-icon>
    </n-button>
  </n-back-top>
</template>

<script setup lang="ts">
import {NBackTop, NButton, NIcon} from 'naive-ui'
import {Icon} from '@iconify/vue'

const {
  visibilityHeight = 200,
  bottom = 40,
  right = 40,
  icon = 'material-symbols:arrow-upward'
} = defineProps<{
  visibilityHeight?: number
  bottom?: number
  right?: number
  icon?: string
}>()
</script>

<style scoped>
/* 如果你觉得默认按钮背景与图标对比度不够，可以加一点背景色 */
.n-back-top .n-button {
  background-color: rgba(255, 255, 255, 0.9);
}

/* 鼠标悬浮时再放大一点 */
.n-back-top .n-button:hover {
  transform: scale(1.1);
  transition: transform 0.2s;
}
</style>
