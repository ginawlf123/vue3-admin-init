import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPluginVue from "eslint-plugin-vue";
import eslintConfigPrettier from "eslint-config-prettier"; // 如果你用 Prettier
import fs from "fs"; // 新增

// 改为使用 fs 读取 JSON 文件
const autoImportGlobals = JSON.parse(
  fs.readFileSync(
    new URL("./.eslintrc-auto-import.json", import.meta.url),
    "utf-8",
  ),
);

export default [
  {
    ignores: ["dist/**", "node_modules/**"], // 忽略文件
  },

  // JavaScript 推荐配置
  eslint.configs.recommended,

  // TypeScript 推荐配置
  ...tseslint.configs.recommended,

  // Vue 推荐配置
  ...eslintPluginVue.configs["flat/recommended"],

  // 自定义配置
  {
    files: ["**/*.{js,mjs,cjs,ts,vue}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...autoImportGlobals.globals, // 加入自动导入的全局变量
      },
      parserOptions: {
        parser: tseslint.parser, // 使用 TypeScript 解析器
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"],
      },
    },
    rules: {
      // 自定义规则（按需调整）
      "vue/multi-word-component-names": "off", // 允许单文件组件名
      "@typescript-eslint/no-explicit-any": "warn", // any 类型给出警告
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },

  // Vue 文件特定配置
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },

  // 如果使用 Prettier，将这条放在最后（确保 Prettier 规则覆盖 ESLint 格式规则）
  eslintConfigPrettier,
];
