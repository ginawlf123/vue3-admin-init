import { createRouter, createWebHashHistory } from "vue-router";
import { constantRoute } from "@/router/routes";

const router = createRouter({
  history: createWebHashHistory(), // Hash 模式 , HTML5 模式：createWebHistory(import.meta.env.BASE_URL)
  routes: constantRoute,
  // 滚动行为：用来控制页面切换时滚动条的位置
  // 参数to 目标路由对象
  // 参数from 当前路由对象
  // 参数savedPosition 保存的滚动位置（仅当使用浏览器前进/后退时存在）
  scrollBehavior(to, from, savedPosition) {
    // 1. 如果有保存的位置（前进/后退）
    if (savedPosition) {
      return savedPosition; // 恢复到之前的滚动位置
    }

    // 2. 如果有锚点
    if (to.hash) {
      return {
        el: to.hash, // // 滚动到指定的元素
        behavior: "smooth", // // 平滑滚动效果
      };
    }

    // 3. 默认回到顶部
    return {
      top: 0,
      left: 0,
      behavior: "smooth", // 添加平滑滚动，体验更好
    };
  },
});

export default router;
