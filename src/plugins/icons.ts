// 图标管理

import { type App } from "vue";
import * as Icons from "@element-plus/icons-vue";

// 定义需要全局注册的图标列表
const iconList = ["Edit", "Delete", "Search", "Refresh"];

export function registerIcons(app: App) {
  // 只注册需要的图标
  iconList.forEach((iconName) => {
    if (Icons[iconName as keyof typeof Icons]) {
      app.component(iconName, Icons[iconName as keyof typeof Icons]);
    }
  });
}
