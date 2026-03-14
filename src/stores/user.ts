import { ref } from "vue";
import router from "@/router";

export const UserStore = defineStore("user", () => {
  const token = ref<string>(localStorage.getItem("token") || "");

  /**
   * 登出
   */
  const logout = () => {
    // 清除状态
    token.value = "";

    // 清除存储
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    // 跳转到登录页
    router.push("/login");
  };

  return {
    token,
    logout,
  };
});
