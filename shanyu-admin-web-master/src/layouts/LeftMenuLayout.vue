<template>
  <n-layout
      has-sider
      class="wh-full"
      embedded
  >
    <!-- 侧边栏 -->
    <n-layout-sider
        class="custom-sider shadow"
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :collapsed="userAppStore.getSidesCollapsed"
        :width="240"
        content-style="display: flex;flex-direction: column;min-height: 100%;"
    >
      <Logo/>
      <n-scrollbar style="flex-grow: 1; flex-shrink: 1; flex-basis: 0">
        <MainMenu :collapsed="userAppStore.getSidesCollapsed"/>
      </n-scrollbar>
    </n-layout-sider>

    <!-- 右侧 -->
    <n-layout
        class="h-full flex flex-col"
        content-style="display: flex;flex-direction: column;min-height:100%; padding-left: 0.75rem;"
        embedded
        :native-scrollbar="false"
    >

      <!-- 头部 -->
      <n-layout-header class="flex-none flex-between px-4 h-16 rounded-b-4 shadow mb-3">
        <!-- 左侧：折叠按钮 + 面包屑 -->
        <div class="flex items-center space-x-4">
          <CollapaseButton/>
          <BreadcrumbNav/>
        </div>

        <!-- 右侧：头像下拉 -->
        <div class="flex items-center space-x-4">
          <AvatarDropdown/>
        </div>
      </n-layout-header>

      <!-- 内容 -->
      <div class="flex-grow flex flex-col relative min-h-0">
        <n-layout-content
            position="absolute"
            :class="['rounded-4','shadow', userAppStore.pageScrollable ? 'overflow-auto' : 'overflow-hidden']"
        >
          <div class="p-5">
            <router-view/>
          </div>
          <BackToTop />
        </n-layout-content>
      </div>

      <!-- 页脚 -->
      <n-layout-footer class="flex-none text-center text-sm p-1">
        © 测试
      </n-layout-footer>

    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import {useAppStore} from "@/store";
import Logo from "@/layouts/components/sider/Logo.vue";
import MainMenu from "@/layouts/components/sider/MainMenu.vue";
import BreadcrumbNav from "@/layouts/components/header/BreadcrumbNav.vue";
import AvatarDropdown from "@/layouts/components/header/AvatarDropdown.vue";
import CollapaseButton from "@/layouts/components/header/CollapaseButton.vue";
import BackToTop from "@/components/common/BackToTop.vue"

const userAppStore = useAppStore();

</script>

<style scoped>
.custom-sider {
  border-radius: 0 20px 20px 0;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: perspective(1200px);
}
</style>