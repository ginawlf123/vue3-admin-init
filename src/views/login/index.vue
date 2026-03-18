<template>
  <div class="login-container">
    <el-row>
      <el-col :span="12" :xs="0">
        <el-image :src="loginLeftImg" alt="login" class="login-left-img" fit="scale-down" />
      </el-col>
      <el-col :span="12" :xs="24">
        <div class="login-form">
          <div class="login-right-title">
            <h1>欢迎登录</h1>
          </div>
          <el-form :model="form" :rules="rules" ref="formRef">
            <el-form-item prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名" size="large" clearable></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="form.password" placeholder="请输入密码" type="password" show-password size="large" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="form.remember">记住我</el-checkbox>
            </el-form-item>
          </el-form>
          <div class="login-form-button">
            <el-button type="primary" :loading="loginLoading" @click="login" size="large" style="width: 100%">登录</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { getRememberedCredentials, saveCredentials } from '@/utils/encrypt'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const form = ref({
  username: '',
  password: '',
  remember: false
})
const rules = ref<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

// 引入本地图片：使用 new URL 方式
const loginLeftImg = ref(new URL('@/assets/images/login-left.png', import.meta.url).href)

const loginLoading = ref(false)

const login = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      loginLoading.value = true
      userStore.login({ account: form.value.username, password: form.value.password })
        .then(() => {
          loginLoading.value = false
          saveCredentials(form.value.username, form.value.password, form.value.remember)
          ElMessage.success('登录成功')
          router.push('/')
        })
        .catch(() => {
          loginLoading.value = false
        })
    }
  })
}

onMounted(() => {
  const rememberedCredentials = getRememberedCredentials()
  if (rememberedCredentials) {
    form.value.username = rememberedCredentials.account
    form.value.password = rememberedCredentials.password
    form.value.remember = true
  }
})
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  // 背景装饰元素
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: rotate 20s linear infinite;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -30%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
    animation: rotate 25s linear infinite reverse;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .el-row {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    border-radius: 16px;
    overflow: hidden;
    background: #fff;
    animation: fadeInUp 0.6s ease-out;
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

  .login-left-img {
    width: 100%;
    height: 100%;
    min-height: 600px;
    object-fit: cover;
    display: block;
  }

  .login-form {
    padding: 60px 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 600px;
    background: #fff;

    @media (max-width: 768px) {
      padding: 40px 30px;
      min-height: auto;
    }

    .login-right-title {
      margin-bottom: 40px;
      text-align: center;

      h1 {
        font-size: 32px;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: 1px;
        animation: fadeIn 0.8s ease-out;

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      }
    }

    :deep(.el-form) {
      .el-form-item {
        margin-bottom: 24px;

        &:last-of-type {
          margin-bottom: 20px;
        }

        .el-form-item__label {
          font-weight: 500;
          color: #333;
        }
      }

      .el-input {
        .el-input__wrapper {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;

          &:hover {
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
          }

          &.is-focus {
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          }
        }

        .el-input__inner {
          font-size: 14px;
          color: #333;

          &::placeholder {
            color: #999;
          }
        }
      }

      .el-checkbox {
        .el-checkbox__label {
          color: #666;
          font-size: 14px;
        }

        .el-checkbox__input.is-checked .el-checkbox__inner {
          background-color: #667eea;
          border-color: #667eea;
        }
      }
    }

    .login-form-button {
      margin-top: 10px;

      :deep(.el-button) {
        height: 48px;
        font-size: 16px;
        font-weight: 500;
        border-radius: 8px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }

        &:active {
          transform: translateY(0);
        }

        &.is-loading {
          opacity: 0.8;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .login-container {
    padding: 20px;

    .el-row {
      border-radius: 12px;
    }

    .login-left-img {
      display: none;
    }

    .login-form {
      .login-right-title h1 {
        font-size: 28px;
      }
    }
  }
}

// 暗色模式适配（可选）
@media (prefers-color-scheme: dark) {
  .login-container {
    .login-form {
      background: #1a1a1a;

      .login-right-title h1 {
        color: #fff;
      }

      :deep(.el-form) {
        .el-input {
          .el-input__wrapper {
            background-color: #2a2a2a;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          }

          .el-input__inner {
            color: #fff;

            &::placeholder {
              color: #666;
            }
          }
        }
      }
    }
  }
}
</style>
