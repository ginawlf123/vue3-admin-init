import { done, start } from "@/plugins/nprogress";
import { useUserStore } from "@/stores/user";

import type { Router } from "vue-router";

export function setupPermission(router: Router) {
  // 执行结果：
  // 1. 前置守卫 - 导航开始前
  // 2. 解析守卫 - 组件准备就绪
  // 3. 后置守卫 - 导航已完成

  // 1.全局前置守卫（导航开始前）
  // Vue Router 4 推荐使用返回值来代替调用 next()
  router.beforeEach((to, from) => {
    // 开始进度条
    start();

    // 在守卫执行时再取 store，确保 Pinia 已经激活
    const userStore = useUserStore();
    const token = userStore.token;

    // 页面是否需要登录
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

    // 如果未登录，且页面需要登录，则跳转到登录页
    if (requiresAuth && !token) {
      return { path: "/login" };
    }

    // 防止重复登录
    if (token && to.path === "/login") {
      return { path: from.path ? from.path : "/" };
    }

    // 如果用户登录了，自动获取用户信息，并存储在pinia中

    return true;
  });

  // 2. 解析守卫（组件准备就绪）
  router.beforeResolve((to, from) => {
    return true;
  });

  // 3.全局后置守卫（导航完成后执行）
  // 路由导航完成后执行的钩子函数，它的特点是无法改变导航本身，但可以做一些导航完成后的副作用操作
  // 实际应用场景：页面标题设置、页面访问统计、滚动行为回退、处理导航失败、加载状态结束
  router.afterEach((to, from, failure) => {
    // 完成进度条
    done();

    // 设置页面标题
    const title = to.meta.title as string;
    document.title = title ? `${title} - xx管理平台` : "xx管理平台";

    // 处理导航错误
    if (failure) {
      // 可以显示错误提示
      ElMessage.error("页面加载失败");
    }
  });
}
