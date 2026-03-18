<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <!-- 404图片 -->
      <div class="image-wrapper">
        <img src="@/assets/images/404.png" alt="404" class="not-found-image" />
      </div>

      <!-- 提示文字 -->
      <div class="text-content">
        <h1 class="title">抱歉，您访问的页面不存在</h1>
        <p class="description">
          可能是网址输入错误，或者页面已被删除、移动
        </p>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="primary" size="large" @click="goHome">
          <el-icon style="margin-right: 6px"><House /></el-icon>
          返回首页
        </el-button>
        <el-button size="large" @click="goBack">
          <el-icon style="margin-right: 6px"><ArrowLeft /></el-icon>
          返回上一页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// useRouter 已通过 unplugin-auto-import 自动导入，无需手动导入
// House 和 ArrowLeft 图标已在 src/plugins/icons.ts 中全局注册，无需手动导入
const router = useRouter();

// 返回首页
const goHome = () => {
  router.push("/");
};

// 返回上一页
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push("/");
  }
};
</script>

<style scoped lang="scss">
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;

  .not-found-content {
    text-align: center;
    max-width: 600px;
    width: 100%;
    animation: fadeInUp 0.6s ease-out;
  }

  .image-wrapper {
    margin-bottom: 40px;
    animation: float 3s ease-in-out infinite;
  }

  .not-found-image {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
    filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1));
  }

  .text-content {
    margin-bottom: 40px;
  }

  .title {
    font-size: 32px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 16px 0;
    line-height: 1.4;
  }

  .description {
    font-size: 16px;
    color: #909399;
    margin: 0;
    line-height: 1.6;
  }

  .action-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
    
    .el-button + .el-button {
      margin-left: 0;
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    .title {
      font-size: 24px;
    }

    .description {
      font-size: 14px;
    }

    .action-buttons {
      flex-direction: column;
      align-items: stretch;

      :deep(.el-button) {
        width: 100%;
      }
    }

    .image-wrapper {
      margin-bottom: 30px;
    }

    .text-content {
      margin-bottom: 30px;
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>
