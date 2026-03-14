<template>
  <el-icon v-if="useElIcon" :size="size" :color="color" v-bind="$attrs">
    <i :class="iconClass"></i>
  </el-icon>
  <i v-else :class="iconClass" :style="iconStyle" v-bind="$attrs"></i>
</template>

<script setup lang="ts">
const props = defineProps({
  // 图标类型
  type: {
    type: String,
    required: true,
  },
  // 是否使用 el-icon 包装
  useElIcon: {
    type: Boolean,
    default: true,
  },
  // 大小（当 useElIcon=true 时传递给 el-icon）
  size: {
    type: [Number, String],
    default: undefined,
  },
  // 颜色（当 useElIcon=true 时传递给 el-icon）
  color: {
    type: String,
    default: undefined,
  },
});

const iconClass = computed(() => `iconfont icon-${props.type}`);

const iconStyle = computed(() => {
  if (props.useElIcon) return {};

  // 不使用 el-icon 时的样式
  const style: Record<string, string> = {}; // Record 是 TypeScript 的内置工具类型，Record<K, T> 表示：创建一个对象类型，键的类型是 K，值的类型是 T
  if (props.size) {
    style.fontSize =
      typeof props.size === "number" ? `${props.size}px` : props.size;
  }
  if (props.color) {
    style.color = props.color;
  }
  return style;
});
</script>
<style scoped lang="scss">
.el-icon .iconfont {
  // 确保 iconfont 图标在 el-icon 中垂直居中
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  line-height: 1;

  // 继承 el-icon 的颜色
  color: inherit;
  font-size: inherit;
}

// 如果你想要平滑动画
.el-icon {
  .iconfont {
    transition: all 0.3s;
  }

  &:hover .iconfont {
    transform: scale(1.1);
  }
}
</style>
