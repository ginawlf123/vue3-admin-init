<template>
  <el-container class="layout-container">
    <!-- 顶部区域 -->
    <el-header class="layout-header">
      <FHeader
        :is-collapse="isCollapse"
        @update:is-collapse="isCollapse = $event"
      />
    </el-header>
    <el-container class="layout-body">
      <!-- 左侧导航区域 -->
      <el-aside
        class="layout-aside"
        :class="{ 'el-aside--collapse': isCollapse }"
      >
        <FMenu :is-collapse="isCollapse" />
      </el-aside>
      <!-- 主要内容区域 -->
      <el-main class="layout-main">
        <div class="main-content">
          <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FHeader from "./components/FHeader.vue";
import FMenu from "./components/FMenu.vue";

// 菜单折叠状态
const isCollapse = ref(false);
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
  overflow: hidden;
  background: var(--bg-color);
}

.layout-header {
  height: 64px !important;
  padding: 0;
  background: var(--header-bg);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 1000;
  transition: background-color 0.3s;

  :deep(.dark) & {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }
}

.layout-body {
  height: calc(100vh - 74px);
  margin-top: 10px;
  overflow: hidden;
}

.layout-aside {
  width: 240px !important;
  margin-right: 15px;
  background: var(--header-bg);
  transition: width 0.3s, background-color 0.3s;
  overflow: hidden;

  // 折叠状态下的宽度
  &.el-aside--collapse {
    width: 64px !important;
  }
}

.layout-main {
  padding: 0;
  background: var(--main-bg);
  overflow: hidden;
  position: relative;
  transition: background-color 0.3s;

  .main-content {
    height: 100%;
    padding: 16px;
    overflow-y: auto;
    overflow-x: hidden;

    // 自定义滚动条样式
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 4px;

      &:hover {
        background: rgba(0, 0, 0, 0.3);
      }
    }

    :deep(.dark) & {
      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);

        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      }
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }
}

// 页面切换动画
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>