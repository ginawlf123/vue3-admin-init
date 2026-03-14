<template>
  <svg
    :class="['svg-icon', className]"
    aria-hidden="true"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  iconClass: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "currentColor",
  },
  size: {
    type: [Number, String],
    default: 20,
  },
});

const iconName = computed(() => `#icon-${props.iconClass}`);
</script>

<style scoped>
.svg-icon {
  position: relative;
  fill: currentColor;
  vertical-align: middle;
}
</style>
