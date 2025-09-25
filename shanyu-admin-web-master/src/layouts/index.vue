<template>
  <!--
    动态布局渲染
    根据appStore中的layoutMode动态渲染不同的布局组件
    - component + :is 是Vue的动态组件语法，可以根据变量切换不同的组件
    - layoutMap[appStore.layoutMode]从映射表中获取对应的布局组件
    - 当用户在设置中切换布局模式时，这里会自动更新显示对应的布局
  -->
  <component :is="layoutMap['leftMenu']" />
</template>

<script setup lang="ts">
// 导入三种不同的布局组件
import LeftMenuLayout from './LeftMenuLayout.vue' // 左侧菜单布局

// 创建布局组件映射表，根据配置的layoutMode选择对应的布局组件
const layoutMap = {
  leftMenu: LeftMenuLayout, // 侧边栏菜单模式：菜单在左侧
}
</script>

