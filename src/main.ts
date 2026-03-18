import { createPinia } from "pinia";
import { createApp } from "vue";
// 导入持久化插件，用于将Pinia的状态持久化到本地存储（自动同步到 localStorage）
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import App from "./App.vue";
import router from "./router";

// 使用了 unplugin-vue-components 插件，它会自动按需导入 Element Plus 组件和样式
// 注意：不需要全量导入 CSS，插件会根据使用的组件自动按需导入样式
// 如果遇到样式问题，可以取消下面的注释来全量导入（但会增加打包体积）
// import "element-plus/dist/index.css";

// 引入模板的全局的样式
import "@/styles/index.scss";

// 必须在 SvgIcon 组件之前引入 SVG 图标注册脚本
import "virtual:svg-icons-register";

// 封装的自定义 SVG 图标组件
import SvgIcon from "@/components/SvgIcon.vue";

// 封装自定义组件使用iconfont图标
import Iconfont from "@/components/Iconfont.vue";

// 权限守卫
import { setupPermission } from "@/router/permission";

// 主题管理
import { useThemeStore } from "@/stores/theme";

// 导入图标注册函数
import { registerIcons } from "./plugins/icons";

const app = createApp(App);
const pinia = createPinia();
// 注册持久化插件
pinia.use(piniaPluginPersistedstate);

// 注册全局组件
app.component("SvgIcon", SvgIcon);
app.component("Iconfont", Iconfont);

// 注册 Element Plus 图标
registerIcons(app);

// 使用插件
app.use(pinia);
app.use(router);

// 初始化权限守卫（必须在 app.use(pinia) 之后）
setupPermission(router);

// 初始化主题（必须在 app.use(pinia) 之后）
const themeStore = useThemeStore();
themeStore.initTheme();

app.mount("#app");
