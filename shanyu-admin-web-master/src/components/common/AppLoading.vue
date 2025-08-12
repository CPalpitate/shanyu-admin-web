<template>
  <div class="loading-overlay" :style="overlayStyle">
    <div class="spinner" :style="spinnerStyle">
      <div class="arc arc1" />
      <div class="arc arc2" />
      <div class="arc arc3" />
    </div>
    <p v-if="message" class="loading-text">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  /** 加载提示文字，默认不显示 */
  message?: string
  /** 背景不透明度，0~1 之间，默认 0.4 */
  overlayOpacity?: number
  /** 整体尺寸，单位 px，默认 80 */
  size?: number
}>()

const message = computed(() => props.message ?? '')
const overlayOpacity = computed(() => props.overlayOpacity ?? 0.4)
const spinnerSize = computed(() => props.size ?? 80)

// 样式注入
const overlayStyle = computed(() => ({
  '--overlay-opacity': overlayOpacity.value,
}))
const spinnerStyle = computed(() => ({
  width: `${spinnerSize.value}px`,
  height: `${spinnerSize.value}px`,
}))
</script>

<style scoped>
.loading-overlay {
  --overlay-opacity: 0.4;
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, var(--overlay-opacity, 0.4));
  backdrop-filter: blur(10px);
  z-index: 9999;
}

.spinner {
  position: relative;
}

.arc {
  position: absolute;
  /*线条粗细*/
  border: 3px solid transparent;
  border-radius: 50%;
}

.arc1 {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-top-color: #FF5F57;
  animation: spin 1.6s linear infinite;
}

.arc2 {
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  border-right-color: #FFBD2E;
  animation: spin 1.2s linear reverse infinite;
}

.arc3 {
  top: 20%;
  left: 20%;
  width: 60%;
  height: 60%;
  border-bottom-color: #28C840;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 16px;
  font-size: 1rem;
  color: #555;
}
</style>
