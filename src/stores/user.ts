import router from "@/router";
import type { UserInterface } from "@/types/user";

export const useUserStore = defineStore(
  "user",
  () => {
    const token = ref<string>("");
    const userInfo = ref<UserInterface | null>(null);
    const loginTime = ref<number>(0);

    // 是否登录
    const isLoggedIn = computed(() => !!token.value);

    // token是否过期（7天有效期）
    const isTokenExpired = computed(() => {
      if (!loginTime.value) return false;
      const expiredTime = 1000 * 60 * 60 * 24; // 7天
      return Date.now() - loginTime.value > expiredTime;
    });

    /**
     * 登录
     */
    const login = async (payload: { account: string; password: string }) => {
      console.log("payload", payload);
      token.value = "AHHngSgMjv3KU27X2BCeYbE";
      userInfo.value = { id: 1, name: "超级管理员" };
      loginTime.value = Date.now();
    };

    /**
     * 登出
     */
    const logout = () => {
      // 清除状态
      token.value = "";
      userInfo.value = null;
      loginTime.value = 0;

      // 跳转到登录页
      router.push("/login");
    };

    return {
      // state
      token,
      userInfo,
      loginTime,

      // getters
      isLoggedIn,
      isTokenExpired,

      // actions
      login,
      logout,
    };
  },
  {
    // ===== 持久化配置 =====
    // 使用 pinia-plugin-persistedstate 自动持久化到 localStorage
    persist: {
      key: "user_store", // 存储的 key，默认是 store id
      storage: localStorage, // 使用 localStorage（可选 sessionStorage）
      // 如果是 ^3.x，用 pick，旧版本常见的是 paths，所以会在 TS 里飘红
      pick: ["token", "userInfo", "loginTime"], // // 只持久化这些字段
    },
  }
);
