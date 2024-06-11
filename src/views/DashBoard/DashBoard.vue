<script setup>
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons-vue';
import { ref } from "vue";
import axios from "axios";
import TopBanner from "@/components/common/TopBanner.vue";
import { onMounted } from "vue";
import router from "@/router/index.js";
import {ElMessage} from "element-plus";
//今日营业额
const amount = ref()

//title
const title = ref('仪表盘')

//拉取今日菜品数据
const todayDish = ref()
//下架菜品数量
const unSold = ref()
const getDishNumber = () => {
  //提取access token
  const access = localStorage.getItem('access');
  axios.get('http://8.130.35.251:3005/dish/number', {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  }).then((res) => {
    if (res.data.code === 200) {
      todayDish.value = res.data.data.sold
      unSold.value = res.data.data.unBuying
    }
  }).catch((err) => {
    console.log(err)
  })
}

//quick start
const quick = ref([
  {
    name: '菜品管理',
    route: '/dish',
  },
  {
    name: '职工管理',
    route: '/employee',
  },
  {
    name: '套餐管理',
    route: '/set',
  },
  {
    name: '展示页',
    route: '/',
  }
])
//jump to function
const jumpTo = (item) => {
  router.push(item.route)
  ElMessage({
    type: "info",
    message: item.name,
  })
}

//获取营业额
const getAmount = () => {
  //获取access
  const access = localStorage.getItem('access').toString()
  axios.get('http://8.130.35.251:3005/employee/amount?employee_id=1', {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  }).then((res) => {
    if (res.data.code === 200) {
      localStorage.setItem('today_amount', res.data.data.amount);
    }
  }).catch((err) => {
    console.log(err)
  })
}
const initAmount = () => {
  amount.value = Number(localStorage.getItem('today_amount').toString())
}

//om
onMounted(() => {
  getDishNumber()
  getAmount()
  initAmount()
})
</script>

<template>
  <div class="w-full h-full relative block overflow-hidden">
    <!-- top nav banner -->
    <div class="w-full h-14 relative flex bg-white z-[399] shadow-md overflow-hidden">
      <TopBanner :title="title" />
    </div>
    <!-- page body -->
    <div style="height: calc(100% - 56px)" class="w-full p-4 bg-[#d3d3d3] relative block overflow-hidden">
      <!-- welcome title -->
      <div class="w-full h-[70px] relative block mb-4">
        <el-card
            class="w-full h-full"
        >
          <div class="w-full h-8 relative flex overflow-hidden">
            <!-- admin name -->
            <div class="w-auto h-full relative block px-4 leading-8 text-center text-black font-bold text-[15px]">
              欢迎登录瑞吉外卖后台管理系统: admin~
            </div>
            <!-- role name -->
            <div class="w-auto h-full relative block text-[15px] text-black font-bold leading-8 text-center ml-auto">
              您现在的身份是: 管理员
            </div>
          </div>
        </el-card>
      </div>
      <!-- statistic area -->
      <div style="height: calc(100% - 86px)" class="w-full relative p-4 grid grid-cols-2 grid-rows-2 gap-3">
        <!-- dish statistic number -->
        <div class="w-full h-full relative cursor-pointer block">
          <el-card
              class="w-full h-full relative hov-shadow"
          >
            <div class="w-full h-[210px] relative block">
              <!-- 今日总共上架菜品数量 -->
              <div class="w-full h-1/2 relative flex justify-center">
                <a-statistic
                    title="今日上架菜品总数统计"
                    :value="todayDish"
                    style="margin-right: auto"
                >
                  <template #suffix>
                    <span>种</span>
                  </template>
                </a-statistic>
              </div>
              <!-- 相较于昨天菜品数量变化量 -->
              <div class="w-full h-1/2 relative flex justify-center">
                <a-statistic
                    :value="unSold"
                    title="相较于昨日"
                    suffix="种"
                    style="margin-right: auto"
                    :value-style="{ color: '#cf1322' }"
                >
                  <template #prefix>
                    <arrow-down-outlined />
                  </template>
                </a-statistic>
              </div>
            </div>
          </el-card>
        </div>
        <!-- flexibility router area -->
        <div class="w-full h-full relative block">
          <el-card
              class="w-full h-full hov-shadow"
          >
            <div class="w-full h-[160px] relative flex justify-between">
              <el-button v-for="item in quick" :key="item" @click="jumpTo(item)" class="my-auto mr-4" type="primary" plain icon="Position">
                {{ item.name }}
              </el-button>
            </div>
            <template #header>
              <span class="text-black font-bold">快捷开始/便捷导航</span>
            </template>
          </el-card>
        </div>
        <!-- today order number -->
        <div class="w-full h-full relative block cursor-pointer">
          <el-card
              class="w-full h-full hov-shadow"
          >
            <div class="w-full h-[210px] relative block">
              <div class="w-full h-1/2 relative flex justify-start">
                <a-statistic
                    title="今日订单数"
                    :value="120"
                    suffix="单"
                />
              </div>
              <div class="w-full h-1/2 relative flex justify-start">
                <a-statistic
                    title="相较昨日"
                    :value="23"
                    :value-style="{ color: '#00b40b'}"
                    suffix="单"
                >
                  <template #prefix>
                    <arrow-up-outlined />
                  </template>
                </a-statistic>
              </div>
            </div>
          </el-card>
        </div>
        <!-- today sold money -->
        <div class="w-full h-full relative block cursor-pointer">
          <el-card
              class="w-full h-full hov-shadow"
          >
            <div class="w-full h-[210px] relative block">
              <div class="w-full h-1/2 relative flex justify-start">
                <a-statistic
                    title="今日营业额"
                    :value="amount"
                    suffix="¥"
                />
              </div>
              <div class="w-full h-1/2 relative flex justify-start">
                <a-statistic
                    title="相较昨日"
                    :value="345.5"
                    :value-style="{ color: '#00b40b'}"
                    suffix="¥"
                >
                  <template #prefix>
                    <arrow-up-outlined />
                  </template>
                </a-statistic>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hov-shadow {
  box-shadow: none;
  transition: all 0.25s ease-in-out;
}
.hov-shadow:hover {
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
  rgba(0, 0, 0, 0.12) 0px -12px 30px,
  rgba(0, 0, 0, 0.12) 0px 4px 6px,
  rgba(0, 0, 0, 0.17) 0px 12px 13px,
  rgba(0, 0, 0, 0.09) 0px -3px 5px;
}
</style>