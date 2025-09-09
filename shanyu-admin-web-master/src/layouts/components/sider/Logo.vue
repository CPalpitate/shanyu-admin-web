
<script setup lang="ts">

import {useAppStore} from '@/store'
import { Icon } from '@iconify/vue'

const router = useRouter()
const appStore = useAppStore()

const name = import.meta.env.VITE_APP_TITLE
</script>

<template>
  <div
      class="h-60px text-xl flex-center cursor-pointer gap-2 p-x-2"
      @click="router.push('/')"
  >
    <Icon icon="mdi:vuejs" class="text-1.5em" />
    <span
        v-show="!appStore.getSidesCollapsed"
        class="text-ellipsis overflow-hidden whitespace-nowrap"
    >{{ name }}</span>
  </div>
</template>

<style scoped></style>

