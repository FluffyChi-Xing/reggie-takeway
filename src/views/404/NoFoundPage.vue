<script setup>
import { useRouter } from "vue-router";
import {ElMessage} from "element-plus";

const router = useRouter()

//go back
const goBack = () => {
  router.replace('/')
  ElMessage({
    type: "info",
    message: '首页',
  })
}
</script>

<template>
  <div class="w-screen h-screen relative flex justify-center overflow-hidden">
    <!-- 404 img -->
    <div class="w-2/3 h-[400px] relative flex my-auto">
      <div class="w-1/2 h-full relative block">
        <img src="../../assets/image/404.png" alt="" class="w-full h-full relative block">
      </div>
      <div class="w-1/2 h-full relative block">
        <img src="../../assets/image/404-cloud.png" alt="" class="w-full h-full relative block">
        <el-button @click="goBack" type="primary" round size="large" class="w-auto h-auto absolute right-0 top-[50%]">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.el-button {
  background-color: #FFC300;
  border: none;
}
</style>