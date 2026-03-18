// 图标管理

import * as Icons from "@element-plus/icons-vue";
import { type App } from "vue";

// 定义需要全局注册的图标列表
const iconList = [
  "Edit",
  "Delete",
  "Search",
  "Refresh",
  "FullScreen",
  "Aim",
  "Bell",
  "User",
  "ArrowDown",
  "Setting",
  "SwitchButton",
  "Fold",
  "Expand",
  "HomeFilled",
  "Document",
  "DataAnalysis",
  "ShoppingBag",
  "Goods",
  "List",
  "Sunny",
  "Moon",
];

export function registerIcons(app: App) {
  // 只注册需要的图标
  iconList.forEach((iconName) => {
    if (Icons[iconName as keyof typeof Icons]) {
      app.component(iconName, Icons[iconName as keyof typeof Icons]);
    }
  });
}
