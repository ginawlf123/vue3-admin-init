import { existsSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

// 自动导入插件
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";

// SVG 图标支持（用于 Iconfont）
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const apiPrefix = env.VITE_API_PROXY_PREFIX || "/dev-api";

  return {
    plugins: [
      vue(),
      // Vue DevTools 仅在开发环境启用，生产构建时自动禁用（插件内部会自动检测）
      ...(mode === 'development' ? [vueDevTools()] : []),

      // 自动导入 API
      AutoImport({
        imports: ["vue", "vue-router", "pinia"], // 自动导入的 API 来源
        resolvers: [ElementPlusResolver()], // 第三方库的解析器
        dts: "src/auto-imports.d.ts", // 生成类型声明文件的位置
        eslintrc: {
          enabled: true, // 生成 ESLint 配置
          filepath: "./.eslintrc-auto-import.json", // 建议明确指定生成路径
          globalsPropValue: true, // 声明为可写全局变量
        },
      }),

      // 自动导入组件
      Components({
        resolvers: [
          ElementPlusResolver({
            importStyle: "sass", // 如果使用 sass 主题
          }),
        ],
        dts: "src/components.d.ts",
        include: [/\.vue$/, /\.vue\?vue/], // 确保 Vue 文件被正确处理（图标组件通过 AutoImport 处理）
        extensions: ["vue"], // 明确文件扩展名
        dirs: ["src/components"], // 指定全局组件目录
      }),

      // SVG 图标支持（用于 Iconfont）
      // 仅在图标目录存在时启用，避免目录不存在时报错
      (() => {
        const iconDir = path.resolve(process.cwd(), "src/assets/icons");
        if (existsSync(iconDir)) {
          return createSvgIconsPlugin({
            iconDirs: [iconDir],
            symbolId: "icon-[dir]-[name]",
          });
        }
        return null;
      })(),
    ].filter(Boolean), // 过滤掉 null 和 false 的插件
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    // sass全局变量的配置
    css: {
      preprocessorOptions: {
        scss: {
          // 自动注入全局变量文件
          additionalData: `@use "@/styles/variables.scss" as *;`,
          api: "modern-compiler", // 使用新版 Sass 编译器
        },
      },
    },
    // 开发服务器配置
    server: {
      port: 5173, // Vite 的默认端口就是 5173，如果 5173 被占用，Vite 会自动递增到 5174、5175...，可以修改与后端地址的端口一致
      open: true, // 启动开发服务器后，自动在浏览器打开应用
      proxy: {
        [apiPrefix]: {
          target: "http://localhost:3000", // 后端地址
          changeOrigin: true, // 解决跨域
          rewrite: (path) => path.replace(new RegExp(`^${apiPrefix}`), ""), // 去掉前缀
        },
      },
    },
    // 生产构建配置
    build: {
      target: "es2015",
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: false,
      minify: "esbuild",
      cssMinify: true,

      // 代码分割配置
      rollupOptions: {
        output: {
          // 手动分包
          manualChunks: (id) => {
            // Vue 核心库
            if (
              id.includes("node_modules/vue") ||
              id.includes("node_modules/vue-router") ||
              id.includes("node_modules/pinia")
            ) {
              return "vendor-vue";
            }
            // Element Plus 拆分（避免循环依赖，只拆分样式和图标）
            if (
              id.includes("node_modules/element-plus") ||
              id.includes("node_modules/@element-plus")
            ) {
              // Element Plus 样式文件单独拆分
              if (id.includes("element-plus/theme-chalk") || id.includes(".css")) {
                return "vendor-element-style";
              }
              // Element Plus 图标库单独拆分（图标库体积较大且独立）
              if (id.includes("@element-plus/icons-vue") || id.includes("element-plus/icons")) {
                return "vendor-element-icons";
              }
              // Element Plus 组件库保持在一个 chunk 中，避免循环依赖
              // 虽然单个文件可能较大，但避免了组件间的循环依赖问题
              return "vendor-element";
            }
            // 工具库（仅包含已安装的包）
            if (id.includes("node_modules/axios")) {
              return "vendor-utils";
            }
            // 其他 node_modules 中的包
            if (id.includes("node_modules")) {
              return "vendor-other";
            }
          },

          // 文件命名优化
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",

          // 静态资源分类
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name || "";
            const ext = name.split(".").pop() || "";

            // 图片资源
            if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/i.test(name)) {
              return "assets/images/[name]-[hash].[ext]";
            }

            // 字体资源
            if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
              return "assets/fonts/[name]-[hash].[ext]";
            }

            // 媒体资源
            if (/\.(mp4|webm|ogg|mp3|wav)$/i.test(name)) {
              return "assets/media/[name]-[hash].[ext]";
            }

            // CSS 资源
            if (/\.css$/i.test(name)) {
              return "assets/css/[name]-[hash].[ext]";
            }

            // 默认
            return "assets/[ext]/[name]-[hash].[ext]";
          },
        },
      },

      // 分块大小警告阈值（提高阈值，因为 Element Plus 本身较大，但已通过拆分优化）
      chunkSizeWarningLimit: 1000, // 1MB，Element Plus 拆分后单个 chunk 应该小于此值
    },
  };
});
