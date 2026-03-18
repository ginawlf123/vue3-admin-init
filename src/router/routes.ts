// 对外暴露配置路由（常量路由）
export const constantRoute = [
  {
    path: "/",
    name: "Layout",
    component: () => import("@/layout/index.vue"),
    // 子路由
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: "首页",
          requiresAuth: true,
        },
      },
      {
        path: "/seetting-account",
        name: "SeettingAccount",
        component: () => import("@/views/seetting-account/index.vue"),
        meta: {
          title: "个人中心",
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: "/login",
    name: "Login", // 登录页
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
      requiresAuth: false,
    },
  },
  {
    path: "/404",
    name: "404", // 404访问页面
    component: () => import("@/views/404/index.vue"),
    meta: {
      title: "404",
      requiresAuth: false,
    },
  },
  {
    path: "/:pathMatch(.*)*", // 任意路由，如果没有匹配上会重定向404
    name: "Any",
    redirect: "/404",
  },
];
