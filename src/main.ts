import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

// 使用了 unplugin-vue-components 插件，它会自动按需导入 Element Plus组件，查看文件vite.config.ts
// 只需引入 Element Plus 样式
import "element-plus/dist/index.css";

// 引入模板的全局的样式
import "@/styles/index.scss";

// 必须在 SvgIcon 组件之前引入 SVG 图标注册脚本
import "virtual:svg-icons-register";

// 封装的自定义 SVG 图标组件
import SvgIcon from "@/components/SvgIcon.vue";

// 封装自定义组件使用iconfont图标
import Iconfont from "@/components/Iconfont.vue";

// 导入图标注册函数
import { registerIcons } from "./plugins/icons";

const app = createApp(App);

// 注册全局组件
app.component("SvgIcon", SvgIcon);
app.component("Iconfont", Iconfont);

// 注册 Element Plus 图标
registerIcons(app);

// 使用插件
app.use(createPinia());
app.use(router);

app.mount("#app");
