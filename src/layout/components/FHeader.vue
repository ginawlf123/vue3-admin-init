<template>
  <div class="f-header-container">
    <div class="header-left">
      <!-- 菜单折叠按钮 -->
      <div class="collapse-btn">
        <el-icon
          :size="20"
          class="collapse-icon"
          @click="handleToggleCollapse"
        >
          <Fold v-if="!props.isCollapse" />
          <Expand v-else />
        </el-icon>
      </div>
      <!-- Logo 区域 -->
      <div class="logo-container">
        <img
          v-if="logoUrl"
          :src="logoUrl"
          alt="Logo"
          class="logo-img"
        />
        <span class="logo-text">系统管理平台</span>
      </div>
    </div>

    <div class="header-right">
      <!-- 暗色/亮色模式切换按钮 -->
      <div class="header-action-item">
        <el-tooltip
          :content="themeStore.themeMode === 'dark' ? '切换到亮色模式' : '切换到暗色模式'"
          placement="bottom"
        >
          <el-icon
            :size="20"
            class="action-icon"
            @click="handleToggleTheme"
          >
            <Sunny v-if="themeStore.themeMode === 'dark'" />
            <Moon v-else />
          </el-icon>
        </el-tooltip>
      </div>

      <!-- 全屏按钮 -->
      <div class="header-action-item">
        <el-tooltip
          :content="isFullscreen ? '退出全屏' : '全屏'"
          placement="bottom"
        >
          <el-icon
            :size="20"
            class="action-icon"
            @click="toggleFullscreen"
          >
            <FullScreen v-if="!isFullscreen" />
            <Aim v-else />
          </el-icon>
        </el-tooltip>
      </div>

      <!-- 用户信息 -->
      <el-dropdown
        trigger="click"
        @command="handleUserCommand"
      >
        <div class="user-info">
          <el-avatar
            :size="32"
            :src="userAvatar"
          >
            <el-icon><User /></el-icon>
          </el-avatar>
          <span class="username">{{ username }}</span>
          <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              <span>个人中心</span>
            </el-dropdown-item>
            <el-dropdown-item
              divided
              command="logout"
            >
              <el-icon><SwitchButton /></el-icon>
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from "@/stores/theme";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const themeStore = useThemeStore();

const userInfo = computed(() => userStore.userInfo);

const router = useRouter();

// 接收外部传入的折叠状态
const props = defineProps<{
  isCollapse: boolean;
}>();

// 定义事件
const emit = defineEmits<{
  "update:isCollapse": [value: boolean];
}>();

// Logo 地址（可以从配置中获取）
const logoUrl = ref("");

// 用户名和头像（后续可以从 store 中获取）
const username = ref("管理员");
const userAvatar = ref("");

// 全屏状态
const isFullscreen = ref(false);

// 切换菜单折叠
const handleToggleCollapse = () => {
  emit("update:isCollapse", !props.isCollapse);
};

// 全屏切换
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
};

// 监听全屏状态变化
document.addEventListener("fullscreenchange", () => {
  isFullscreen.value = !!document.fullscreenElement;
});

// 切换暗色/亮色模式
const handleToggleTheme = () => {
  themeStore.toggleTheme();
};

// 用户下拉菜单操作
const handleUserCommand = (command: string) => {
  switch (command) {
    case "profile":
      router.push("/seetting-account");
      break;
    case "logout":
      // 显示二次确认对话框
      ElMessageBox.confirm("确定要退出登录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          // 用户确认，执行退出登录
          userStore.logout();
        })
        .catch(() => {
          // 用户取消，不做任何操作
        });
      break;
  }
};
</script>

<style scoped lang="scss">
.f-header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
  background: var(--header-bg);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  transition: background-color 0.3s;

  :deep(.dark) & {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 200px;

    .collapse-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.3s;

      &:hover {
        background-color: #f5f5f5;
      }

      .collapse-icon {
        color: var(--text-color-secondary);
        transition: color 0.3s;

        &:hover {
          color: var(--el-color-primary);
        }
      }
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: opacity 0.3s;

      &:hover {
        opacity: 0.8;
      }

      .logo-img {
        height: 32px;
        width: auto;
      }

      .logo-text {
        font-size: 18px;
        font-weight: 600;
        color: var(--el-color-primary);
        white-space: nowrap;
        transition: color 0.3s;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 200px;
    justify-content: flex-end;

    .header-action-item {
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: color 0.3s;

      .action-icon {
        color: var(--text-color-secondary);
        transition: color 0.3s;

        &:hover {
          color: var(--el-color-primary);
        }
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #f5f5f5;
      }

      .username {
        font-size: 14px;
        color: var(--text-color);
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: color 0.3s;
      }

      .dropdown-icon {
        font-size: 12px;
        color: var(--text-color-secondary);
        transition: transform 0.3s, color 0.3s;
      }
    }
  }
}

// 下拉菜单样式优化
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>