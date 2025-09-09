
<template>
  <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div
        v-for="(b, i) in blobs"
        :key="i"
        class="floating-blob"
        :style="{
        width: b.size + 'px',
        height: b.size + 'px',
        top: b.top,
        left: b.left,
        background: b.color,
        filter: 'blur(120px)',
        mixBlendMode: 'screen',
        opacity: '0.5',
        borderRadius: '50%',
        position: 'absolute',
        animation: b.anim,
        '--x-move': `${b.x}px`,
        '--y-move': `${b.y}px`,
        '--scale': b.scale
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const colors = [
  '#FF6EC7', '#6EB5FF', '#6EFFB5', '#FFE56E',
  '#FF6E6E', '#A98BFF', '#00E3E3', '#F08080'
]
const blobCount = 5
const blobs = ref<{size: number, color: string, top: string, left: string, anim: string, x: number, y: number, scale: number, duration: number}[]>([])

onMounted(() => {
  const list = []
  for (let i = 0; i < blobCount; i++) {
    // 粒子直径（像素）
    const size = Math.floor(Math.random() * 500) + 400
    const color = colors[Math.floor(Math.random() * colors.length)]
    // 初始位置（百分比）
    const top = `${Math.random() * 100}%`
    const left = `${Math.random() * 100}%`
    // 运动范围（像素）
    // -800 ~ +800 px，决定"最远可移动距离"（调大更飘逸，调小更内敛）
    const x = Math.random() * 1000 - 800
    const y = Math.random() * 1000 - 800
    const scale = 1.2 + Math.random() * 1.3
    // 动画时长（秒）
    const duration = 10 + Math.random() * 10

    list.push({
      size, color, top, left, x, y, scale, duration,
      anim: `float-blob ${duration}s ease-in-out infinite`
    })
  }
  blobs.value = list
})
</script>

<style>
@keyframes float-blob {
  0% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(var(--x-move), var(--y-move)) scale(var(--scale));
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}
</style>
