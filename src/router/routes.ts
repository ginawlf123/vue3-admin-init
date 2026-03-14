// 对外暴露配置路由（常量路由）
export const constantRoute = [
  {
    path: "/login",
    name: "Login", // 登录页
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/home/index.vue"),
  },
  {
    path: "/404",
    name: "404", // 404访问页面
    component: () => import("@/views/404/index.vue"),
  },
  {
    path: "/:pathMatch(.*)*", // 任意路由，如果没有匹配上会重定向404
    name: "Any",
    redirect: "/404",
  },
];
