<template>
  <div>
    <!-- 这些都会自动导入，不需要 import -->
    <el-button type="primary" @click="showMsg">按钮</el-button>
    <el-input v-model="text" />
    <el-icon><Edit /></el-icon>
    <Iconfont type="fushi" :size="20" color="#333" />
  </div>
</template>

<script setup lang="ts">
const text = ref<string>("");

// ElMessage 也会自动导入
const showMsg = () => {
  console.log(text.value);
  ElMessage.success("成功了！");
};
</script>

<style scoped lang="scss"></style>
