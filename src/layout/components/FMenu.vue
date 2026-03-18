<template>
  <div class="f-menu-container">
    <!-- 菜单导航 -->
    <el-menu
      :default-active="activeMenu"
      :collapse="props.isCollapse"
      :unique-opened="true"
      :collapse-transition="false"
      router
      class="menu-nav"
    >
      <template
        v-for="item in menuList"
        :key="item.path"
      >
        <!-- 有子菜单 -->
        <el-sub-menu
          v-if="item.children && item.children.length > 0"
          :index="item.path"
        >
          <template #title>
            <el-icon v-if="item.icon">
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item
            v-for="child in item.children"
            :key="child.path"
            :index="child.path"
          >
            <el-icon v-if="child.icon">
              <component :is="child.icon" />
            </el-icon>
            <span>{{ child.title }}</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 无子菜单 -->
        <el-menu-item
          v-else
          :index="item.path"
        >
          <el-icon v-if="item.icon">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

// 接收外部传入的折叠状态
const props = defineProps<{
  isCollapse: boolean;
}>();

// 当前激活的菜单
const activeMenu = computed(() => route.path);

// 菜单项类型定义
interface MenuItem {
  path: string;
  title: string;
  children?: MenuItem[];
}

// 从路由获取菜单列表
const menuList = computed(() => {
  // 获取所有路由
  const routes = router.getRoutes();

  // 找到 Layout 路由（主布局路由）
  const layoutRoute = routes.find((r) => r.name === "Layout");

  if (!layoutRoute || !layoutRoute.children) {
    return [];
  }

  // 转换 Layout 的子路由为菜单项
  const menuItems: MenuItem[] = [];

  for (const child of layoutRoute.children) {
    // 检查是否需要显示在菜单中
    if (
      child.meta &&
      child.meta.hidden !== true &&
      child.meta.title
    ) {
      const menuItem: MenuItem = {
        path: child.path,
        title: child.meta.title as string,
      };

      // 处理子路由（如果有）
      if (child.children && child.children.length > 0) {
        const children: MenuItem[] = [];

        for (const subChild of child.children) {
          if (
            subChild.meta &&
            subChild.meta.hidden !== true &&
            subChild.meta.title
          ) {
            children.push({
              path: subChild.path,
              title: subChild.meta.title as string,
            });
          }
        }

        if (children.length > 0) {
          menuItem.children = children;
        }
      }

      menuItems.push(menuItem);
    }
  }

  return menuItems;
});
</script>

<style scoped lang="scss">
.f-menu-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--aside-bg);
  overflow: hidden;
  transition: background-color 0.3s;

  .menu-nav {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    border: none;
    background: var(--aside-bg);
    transition: background-color 0.3s;

    // 自定义滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.18);
      border-radius: 3px;

      &:hover {
        background: rgba(0, 0, 0, 0.28);
      }
    }

    /* 暗色模式下滚动条反色 */
    :global(.dark) & {
      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.22);

        &:hover {
          background: rgba(255, 255, 255, 0.32);
        }
      }
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }
}

// Element Plus 菜单样式覆盖
:deep(.el-menu) {
  background-color: var(--aside-bg);
  border-right: none;

  .el-menu-item {
    color: var(--text-color-secondary);
    height: 48px;
    line-height: 48px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.04) !important;
      color: var(--text-color);
    }

    &.is-active {
      background-color: var(--el-color-primary) !important;
      color: #fff;

      &::before {
        display: none;
      }
    }

    .el-icon {
      margin-right: 8px;
      font-size: 18px;
    }
  }

  .el-sub-menu {
    .el-sub-menu__title {
      color: var(--text-color-secondary);
      height: 48px;
      line-height: 48px;

      &:hover {
        background-color: rgba(0, 0, 0, 0.04) !important;
        color: var(--text-color);
      }

      .el-icon {
        margin-right: 8px;
        font-size: 18px;
      }
    }

    .el-menu {
      background-color: var(--bg-color-secondary);

      .el-menu-item {
        padding-left: 50px !important;

        &:hover {
          background-color: rgba(0, 0, 0, 0.04) !important;
        }

        &.is-active {
          background-color: var(--el-color-primary) !important;
        }
      }
    }
  }

  /* 暗色模式下 hover 背景反色 */
  :global(.dark) & {
    .el-menu-item:hover,
    .el-sub-menu__title:hover,
    .el-sub-menu .el-menu-item:hover {
      background-color: rgba(255, 255, 255, 0.06) !important;
    }
  }

  // 折叠状态下的样式
  &.el-menu--collapse {
    .el-menu-item,
    .el-sub-menu__title {
      padding: 0 20px !important;
      text-align: center;

      .el-icon {
        margin-right: 0;
      }
    }
  }
}
</style>