/**
 * 环境变量工具类
 * 统一管理所有环境变量，提供类型安全和便捷方法
 */
export const envConfig = {
  // 应用信息
  app: {
    title: import.meta.env.VITE_APP_TITLE,
  },

  // API 配置
  api: {
    // 基础路径（开发环境: /dev-api, 生产环境: /pro-api）
    baseURL: import.meta.env.VITE_API_BASE_URL,
    // 代理前缀（同上）
    proxyPrefix: import.meta.env.VITE_API_PROXY_PREFIX,

    /**
     * 构建完整API路径
     * @param path API路径，如 '/users'
     * @returns 完整路径，如 '/dev-api/users'
     */
    buildUrl(path: string): string {
      const base = this.baseURL.replace(/\/$/, "");
      const cleanPath = path.replace(/^\//, "");
      return `${base}/${cleanPath}`;
    },

    /**
     * 获取当前环境的完整请求URL（用于调试）
     * @param path API路径
     * @returns 完整URL，如 'http://localhost:5173/dev-api/users'
     */
    getFullUrl(path: string): string {
      const origin = window.location.origin;
      const apiPath = this.buildUrl(path);
      return `${origin}${apiPath}`;
    },
  },

  // 功能开关
  features: {
    debug: import.meta.env.VITE_ENABLE_DEBUG,
    mock: import.meta.env.VITE_ENABLE_MOCK,
  },

  // 环境判断
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,

  // API前缀标识
  apiPrefix: import.meta.env.VITE_API_BASE_URL,

  /**
   * 检查当前是否是开发环境API
   */
  isDevApi: import.meta.env.VITE_API_BASE_URL === "/dev-api",

  /**
   * 检查当前是否是生产环境API
   */
  isProdApi: import.meta.env.VITE_API_BASE_URL === "/pro-api",
};

// 开发环境打印配置信息
// if (envConfig.features.debug) {
//   console.log("📦 当前环境配置:", {
//     mode: envConfig.mode,
//     apiPrefix: envConfig.apiPrefix,
//     isDev: envConfig.isDev,
//     isProd: envConfig.isProd,
//     features: envConfig.features,
//   });
// }
