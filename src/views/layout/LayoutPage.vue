<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import SideMenu from "@/components/layout/SideMenu.vue";
import { useCounterStore } from "@/stores/counter.js";
import {onMounted} from "vue";
import {watch} from "vue";

//store
const store = useCounterStore()

//route
const route = useRoute()

//default width
const width = ref('200px')

//change width
const changeWidth = () => {
  switch (store.collapse) {
    case true:
      width.value = '60px'
          break;
    case false:
      width.value = '200px'
          break;
  }
}

//watch
watch(() => store.collapse, () => {
  changeWidth()
})
//om
onMounted(() => {
  changeWidth()
})
</script>

<template>
  <div class="w-screen h-screen relative block overflow-hidden">
    <el-container class="w-full h-full">
      <el-aside :width="width" class="animation">
        <!--  menu  -->
        <SideMenu />
      </el-aside>
      <el-main style="padding: 0">
        <!-- router view -->
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.animation {
  transition: 0.3s all ease-in-out;
}
</style>