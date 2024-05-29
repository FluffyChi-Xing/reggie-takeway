<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from "vue-router";
import {ElMessage} from "element-plus";

//router
const router = useRouter()

interface RestaurantItem {
  value: string
  route: string
}

const state1 = ref('')

const restaurants = ref<RestaurantItem[]>([])
const querySearch = (queryString: string, cb: any) => {
  const results = queryString
      ? restaurants.value.filter(createFilter(queryString))
      : restaurants.value
  // call callback function to return suggestions
  cb(results)
}
const createFilter = (queryString: string) => {
  return (restaurant: RestaurantItem) => {
    return (
        restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}
const loadAll = () => {
  return [
    { value: '仪表盘', route: '/layout' },
    { value: '菜品管理', route: '/dish' },
    { value: '登录', route: '/login' },
  ]
}

const handleSelect = (item: RestaurantItem) => {
  router.push(item.route)
  ElMessage({
    type: "info",
    message: item.value
  })
}

//cards
const cards = ref([
  {
    title: '基于Vue 3.4实现',
    icon: 'src/assets/logo.svg'
  },
  {
    title: '后端基于Nest JS开发',
    icon: 'https://nestjs.com/logo-small-gradient.76616405.svg'
  },
  {
    title: 'CSS 处理基于TailwindCSS',
    icon: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.kxdTZKJV7_WvYzyUalankgHaHa?rs=1&pid=ImgDetMain'
  }
])

//quick start
const getStart = () => {
  router.replace('/layout')
  ElMessage({
    type: "info",
    message: '仪表盘',
  })
}

//om
onMounted(() => {
  restaurants.value = loadAll()
})
</script>

<template>
  <div class="w-screen h-screen relative block overflow-hidden">
    <!-- top banner --->
    <div class="w-full h-14 flex box-border z-[399] absolute top-0 left-0 nav-border px-10">
      <!-- nest logo -->
      <div class="w-14 h-14 relative block">
        <img src="https://nestjs.com/logo-small-gradient.76616405.svg" alt="" loading="lazy" class="w-full h-full relative block object-contain">
      </div>
      <!-- title -->
      <div class="w-auto h-full relative flex justify-center leading-[56px] text-black text-[15px] font-bold ml-4">
        瑞吉外卖 Nest版
      </div>
      <!-- auto search -->
      <div class="w-[240px] h-full relative flex justify-center ml-auto">
        <el-autocomplete
            v-model="state1"
            :fetch-suggestions="querySearch"
            clearable
            class="inline-input w-50 my-auto"
            placeholder="选择你要去的页面"
            @select="handleSelect"
        />
      </div>
    </div>
    <!-- main body -->
    <div style="height: calc(100% - 56px)" class="w-full mt-14 relative block p-4">
      <div class="w-2/3 h-full relative grid grid-rows-2 gap-3 mx-auto">
        <!-- title -->
        <div class="w-full h-full relative flex">
          <div class="w-1/2 h-full relative block">
            <!-- title -->
            <div style="height: calc(100% - 40px)" class="w-full relative block whitespace-pre-line text-ellipsis overflow-hidden">
              <p class="reggie-title text-[56px] leading-[64px] font-bold">瑞吉外卖</p>
              <p class="text-[#3c3c43] font-bold text-[56px] leading-[64px]">基于Nest后端开发版</p>
            </div>
            <!-- start -->
            <el-button @click="getStart" size="large" style="background: #EA284F;border-color: #f82852" type="primary" round>快速开始</el-button>
          </div>
          <div class="w-1/2 h-full relative flex justify-center">
            <!-- bg -->
            <div class="w-[300px] h-[300px] relative block nest-bg my-auto" />
            <img src="https://nestjs.com/logo-small-gradient.76616405.svg" alt="" loading="lazy" class="w-full h-full absolute block object-contain z-[199]">
          </div>
        </div>
        <!-- card -->
        <div class="w-full h-full relative grid grid-cols-3 gap-3">
          <div v-for="item in cards" :key="item" class="w-full reggie-card h-[140px] p-4 relative block rounded-[10px] box-border hover:shadow-md bg-[#F6F6F7] overflow-hidden">
            <!-- icon -->
            <div class="w-14 h-14 relative flex justify-center rounded-[5px] bg-[#E3E3E5] overflow-hidden">
              <img :src="item.icon" alt="" class="w-6 h-6 relative block my-auto object-contain" loading="lazy">
            </div>
            <!-- sub title -->
            <div class="w-full h-10 relative flex justify-start leading-[40px] font-bold text-[#3c3c43,]">
              {{ item.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-border {
  border-bottom: 1px solid #dedede;
}
.nest-bg {
  --vp-home-hero-image-background-image: linear-gradient( -45deg, #ea2862 30%, #ea284f);
  --vp-home-hero-image-filter: blur(72px);
  border-radius: 50%;
  background-image: var(--vp-home-hero-image-background-image);
  filter: var(--vp-home-hero-image-filter);
}
.reggie-title {
  --vp-home-hero-name-background: -webkit-linear-gradient( 120deg, #ea2862 -80%, #ea284f);
  --vp-home-hero-name-color: transparent;
  background: var(--vp-home-hero-name-background);
  background-clip: text;
  -webkit-text-fill-color: var(--vp-home-hero-name-color);
}
.reggie-card {
  transition: 0.25s all ease-in-out;
  border: 1px solid transparent;
}
.reggie-card:hover {
  border-color: #EA2862FF;
}
</style>