<script setup>
import { useRoute } from "vue-router";
import {Box, Dish, Files, Odometer, Ticket, User} from "@element-plus/icons-vue";
import { onMounted } from "vue";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useCounterStore } from "@/stores/counter.js";
import {ElMessage} from "element-plus";

//router
const router = useRouter()

//store
const store = useCounterStore()

//route
const route = useRoute();

//default active
const defaultActive = ref('1')

//function
const checkPath = (path) => {
  switch (path) {
    case '/layout':
      return '仪表盘'
    case '/dish':
      return '菜品管理'
  }
}
const jumpTo = (path) => {
  router.push(path)
  ElMessage({
    type: "success",
    message: checkPath(path),
  })
}

//route path 持久化
const checkRoute = () => {
  route.matched.forEach((item) => {
    switch (item.path) {
      case '/layout':
        defaultActive.value = '1'
            break;
      case '/dish':
        defaultActive.value = '2'
            break;
    }
  })
}

//om
onMounted(() => {
  checkRoute()
})
//watch
watch(() => route.fullPath, () => {
  checkRoute()
})
</script>

<template>
  <div class="w-auto h-full relative block">
    <el-menu
        active-text-color="#000"
        background-color="#303133"
        class="el-menu-vertical-demo"
        :default-active="defaultActive"
        text-color="#fff"
        style="height: 100%"
        :collapse="store.collapse"
    >
      <!-- title -->
      <el-menu-item class="bg-[#262628] mb-4 box-border title-border">
        <span class="mx-auto text-[15px] font-bold">瑞吉外卖</span>
      </el-menu-item>
      <el-menu-item index="1" @click="jumpTo('/layout')">
        <el-icon>
          <Odometer />
        </el-icon>
        <span>仪表盘</span>
      </el-menu-item>
      <el-menu-item index="2" @click="jumpTo('/dish')">
        <el-icon><Dish /></el-icon>
        <span>菜品管理</span>
      </el-menu-item>
      <el-menu-item index="3">
        <el-icon><Ticket /></el-icon>
        <span>套餐管理</span>
      </el-menu-item>
      <el-menu-item index="4">
        <el-icon><User /></el-icon>
        <span>职工管理</span>
      </el-menu-item>
      <el-menu-item index="5">
        <el-icon><Files /></el-icon>
        <span>订单管理</span>
      </el-menu-item>
      <el-menu-item index="6">
        <el-icon><Box /></el-icon>
        <span>分类管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
.el-menu-item.is-active {
  width: 90%;
  background-color: #ffd04b;
  border-radius: 0 20px 20px 0;
}
.title-border {
  border-bottom: 1px solid #222223;
}
</style>