<template>
  <!-- n-menu 组件用于渲染侧边栏菜单，绑定当前激活菜单项，监听点击事件 -->
  <n-menu
      :value="activeKey"
      :collapsed-width="64"
      :collapsed-icon-size="20"
      :options="menuOptions"
      :collapsed="props.collapsed"
      :expanded-keys="expandedKeys"
      :accordion="true"
      @update:value="handleMenuClick"
      @update:expanded-keys="updateExpandedKeys"
  />
</template>

<script setup lang="ts">
import { ref, watch, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { type MenuOption, NIcon } from 'naive-ui'
import { Icon } from '@iconify/vue'

/**
 * 说明（推荐方案逻辑）：
 * 1) “默认子页”以路由 redirect 为准：点击父级或展开父级时，push 到父级 path（如 /settings），
 *    然后由该父级路由的 redirect（/settings → /settings/codegen）决定最终子页。
 * 2) 路由变化时：自动高亮 activeKey，并计算应该展开的父级链（手风琴）。
 */

// 接收父组件传递的 collapsed 属性，控制菜单收起/展开
const props = defineProps<{
  collapsed: boolean
}>()

// 获取当前路由对象
const route = useRoute()
// 获取路由跳转方法
const router = useRouter()
// 当前激活菜单项的 key
const activeKey = ref('')
// 当前展开的父级菜单项 key 数组（受控）
const expandedKeys = ref<string[]>([])

/* ---------------- 菜单数据 ---------------- */
const menuOptions: MenuOption[] = [
  {
    label: 'Dashboard', // 菜单显示名称
    key: '/dashboard',  // 路由路径
    icon: renderIcon('bx:atom'), // 菜单图标
  },
  {
    label: '用户管理',
    key: '/users',
    icon: renderIcon('bx:user'),
  },
  {
    label: '系统设置',
    key: '/settings',
    icon: renderIcon('bx:cog'),
    children: [
      { label: '代码生成', key: '/settings/codegen', icon: renderIcon('mdi:code-tags') },
      { label: '菜单管理', key: '/settings/authority/menu', icon: renderIcon('mdi:list-box-outline') },
      { label: '角色管理', key: '/settings/authority/role', icon: renderIcon('mdi:account-details-outline') },
    ]
  },
]

/* ---------------- 事件处理：点击与展开 ---------------- */

// 叶子或父级点击：统一 push 到该项 key
// 父级（如 /settings）将命中路由 redirect → /settings/codegen
function handleMenuClick(key: string) {
  router.push(key)
}

// 父级展开/收起：写回受控 expandedKeys；
// 若刚展开了某父级且当前不在该分组下，则 push 到“父级路径”（让路由 redirect 决定默认子页）
function updateExpandedKeys(val: string[]) {
  expandedKeys.value = val
  const parent = val[val.length - 1]
  if (parent && !route.path.startsWith(parent)) {
    router.push(parent)
  }
}

/* ---------------- 路由联动：自动高亮 & 自动展开 ---------------- */

watch(
    () => route.path,
    (path) => {
      // 高亮：优先精确匹配；否则回退到最近的父级 key
      activeKey.value = getBestMatchKey(path) || path

      // 计算并设置需要展开的父级链
      const key = getBestMatchKey(path)
      if (!key) {
        expandedKeys.value = []
        return
      }
      const chain = findKeyPath(menuOptions, key)
      if (!chain.length) {
        expandedKeys.value = []
        return
      }
      const last = chain[chain.length - 1]
      const lastOpt = getOptionByKey(menuOptions, last)
      const parents = chain.slice(0, -1)
      // 如果当前命中的是一个父级（带 children），也把它自身加入展开，确保能看到子项
      expandedKeys.value = lastOpt?.children?.length ? [...parents, last] : parents
    },
    { immediate: true }
)

/* ---------------- 工具方法：通用查找与匹配 ---------------- */

// 渲染菜单图标的辅助函数
function renderIcon(icon: string) {
  // 返回一个渲染函数，生成 NIcon 包裹的 Iconify 图标
  return () => h(NIcon, null, {
    default: () => h(Icon, { icon }),
  })
}

/** 在树形菜单中按 key 查找“从根到节点”的路径，如找不到返回 [] */
function findKeyPath(tree: MenuOption[], targetKey: string): string[] {
  const path: string[] = []
  function dfs(nodes: MenuOption[], stack: string[]): boolean {
    for (const n of nodes) {
      const next = [...stack, String(n.key)]
      if (n.key === targetKey) {
        path.push(...next)
        return true
      }
      if (n.children && dfs(n.children as MenuOption[], next)) return true
    }
    return false
  }
  dfs(tree, [])
  return path
}

/** 精确命中优先；否则找“前缀父级”（如 /a/b 的父是 /a） */
function getBestMatchKey(path: string): string | null {
  if (findKeyPath(menuOptions, path).length) return path
  const segs = path.split('/').filter(Boolean)
  while (segs.length) {
    const candidate = '/' + segs.join('/')
    if (findKeyPath(menuOptions, candidate).length) return candidate
    segs.pop()
  }
  return null
}

/** 按 key 在树里找到对应菜单项 */
function getOptionByKey(tree: MenuOption[], targetKey: string): MenuOption | null {
  for (const n of tree) {
    if (n.key === targetKey) return n
    if (n.children) {
      const hit = getOptionByKey(n.children as MenuOption[], targetKey)
      if (hit) return hit
    }
  }
  return null
}
</script>
