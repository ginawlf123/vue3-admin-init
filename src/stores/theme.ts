// 主题管理 Store - 暗色/亮色模式

export type ThemeMode = "light" | "dark";

export const useThemeStore = defineStore(
  "theme",
  () => {
    // 当前主题模式
    const themeMode = ref<ThemeMode>("light");

    // 切换主题
    const toggleTheme = () => {
      themeMode.value = themeMode.value === "light" ? "dark" : "light";
      applyTheme(themeMode.value);
    };

    // 设置主题
    const setTheme = (mode: ThemeMode) => {
      themeMode.value = mode;
      applyTheme(mode);
    };

    // 应用主题到 DOM
    const applyTheme = (mode: ThemeMode) => {
      const html = document.documentElement;
      if (mode === "dark") {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    };

    // 初始化主题
    const initTheme = () => {
      applyTheme(themeMode.value);
    };

    return {
      themeMode,
      toggleTheme,
      setTheme,
      initTheme,
    };
  },
  {
    // 持久化配置
    persist: {
      key: "theme_store",
      storage: localStorage,
      pick: ["themeMode"],
    },
  }
);
