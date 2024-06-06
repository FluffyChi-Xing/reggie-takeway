<script setup>
import { ref } from "vue";
import TopBanner from "@/components/common/TopBanner.vue";
import { reactive } from "vue";
import TableComponent from "@/components/common/TableComponent.vue";
import axios from "axios";
import {ElMessage} from "element-plus";
import { onMounted } from "vue";

//title
const title = ref('订单管理')

//value
const value = ref()

//table
const table = reactive({
  labels: [
    {
      label: 'id',
      prop: 'id'
    },
    {
      label: '订单状态',
      prop: 'status',
    },
    {
      label: '手机号',
      prop: 'phone',
    },
    {
      label: '用户名',
      prop: 'username',
    },
    {
      label: '地址',
      prop: 'address',
    },
    {
      label: '下单时间',
      prop: 'order_time',
    },
    {
      label: '金额',
      prop: 'amount',
    }
  ],
  data: [],
  select: false,
  highLight: true,
  stripe: true,
  isFixed: 'right',
  needDel: true,
  isFinish: true,
  cancel: true,
})

//拉取数据
//pageNo
const pageNo = ref(1)
//pageSize
const pageSize = 5;
//totalCount
const totalCount = ref()
const pullData = () =>{
  //获取access
  const access = localStorage.getItem('access').toString();
  axios.get(`http://localhost:3000/order/pull?pageNo=${pageNo.value}&pageSize=${pageSize}`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  }).then((res) => {
    if (res.data.code === 200) {
      res.data.data.forEach((item) =>{
        if (item.status === 1) {
          item.status = '配送中'
        }
        if (item.status === 0){
          item.status = '已送达'
        }
        if (item.status === -1) {
          item.status = '订单已取消'
        }
        table.data.push(item)
      })
      totalCount.value = (res.data.count / pageSize) * 10;
      ElMessage({
        type: "success",
        message: '拉取成功',
      })
    } else {
      ElMessage({
        type: "warning",
        message: `错误 ${res.data.messages}`,
      })
    }
  }).catch((err) => {
    console.log(err);
  })
}
//pagination change the page
const changePage = (current) => {
  pageNo.value = current
  //清空table.data
  table.data = []
  //重新拉取
  pullData()
}

//search order
const searchOrder = () => {
  if (value.value) {
    //获取access
    const access = localStorage.getItem('access').toString()
    axios.get(`http://localhost:3000/order/search?id=${value.value}`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }).then((res) => {
      if (res.data.code === 200) {
        //清空table.data
        table.data = []
        res.data.data.forEach((item) => {
          if (item.status === 1) {
            item.status = '派送中'
          }
          if (item.status === 0) {
            item.status = '已送达'
          }
          if (item.status === -1) {
            item.status = '订单已取消'
          }
          table.data.push(item)
        })
      } else {
        ElMessage({
          type: "warning",
          message: res.data.message,
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  } else {
    ElMessage({
      type: "warning",
      message: '订单id不能为空',
    })
  }
}
//销单
const currentRow = ref()
const employee_id = ref(1)
const finish = () => {
  if (currentRow.value && employee_id.value) {
    //获取access
    const access = localStorage.getItem('access').toString();
    axios.get(`http://localhost:3000/order/finish?id=${currentRow.value.id}&employee_id=${employee_id.value}`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }).then((res) => {
      if (res.data.code === 200) {
        //情况table.data
        table.data = []
        //重新拉取
        pullData()
        ElMessage({
          type: "info",
          message: res.data.message,
        })
      } else {
        ElMessage({
          type: "warning",
          message: res.data.message,
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  }
}
//refresh
const refresh = () => {
  table.data = []
  pullData()
}
//current change
const currentChange = (current) => {
  currentRow.value = current
}
//取消接单
const cancelOrder = () => {
  //access
  const access = localStorage.getItem('access').toString();
  axios.post('http://localhost:3000/order/cancel', {
    order_id: currentRow.value.id,
  }, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  }).then((res) => {
    if (res.data.code === 200) {
      table.data = []
      pullData()
      ElMessage({
        type: "info",
        message: res.data.message,
      })
    } else {
      ElMessage({
        type: "warning",
        message: res.data.message,
      })
    }
  }).catch((err) => {
    console.log(err)
  })
}


//om
onMounted(() => {
  pullData()
})
</script>

<template>
  <div class="w-full h-full relative block bg-[#d3d3d3] overflow-hidden">
    <!-- top title banner -->
    <div class="w-full h-14 absolute top-0 left-0 z-[399] bg-white shadow-md block">
      <TopBanner :title="title" />
    </div>
    <!-- page main body -->
    <div style="height: calc(100% - 56px)" class="w-full relative block mt-14 p-4">
      <!-- top search input -->
      <div class="w-full h-[70px] relative block mb-4">
        <el-card
            class="w-full h-full"
        >
          <div class="w-full h-8 relative flex">
            <el-input style="width: 240px" v-model="value" placeholder="请输入订单号..." clearable prefix-icon="Files" />
            <!-- search button -->
            <el-button @click="searchOrder" type="primary" class="ml-4" icon="Plus">搜索</el-button>
            <!-- refresh -->
            <el-button
                style="background-color: #1f1800;border: none" type="primary"
                icon="Refresh"
                class="ml-4"
                @click="refresh"
            >
              刷新
            </el-button>
          </div>
        </el-card>
      </div>
      <!-- table main body -->
      <div style="height: calc(100% - 112px)" class="w-full relative block p-4 bg-white">
        <!-- table -->
        <div style="height: calc(100% - 56px)" class="w-full max-h-[473px] relative overflow-y-scroll block">
          <TableComponent
              :labels="table.labels"
              :data="table.data"
              :is-fixed="table.isFixed"
              :stripe="table.stripe"
              :select="table.select"
              :high-light="table.highLight"
              :need-del="table.needDel"
              :is-finish="table.isFinish"
              :cancel="table.cancel"
              :finish="finish"
              :current-change="currentChange"
              :want-cancel="cancelOrder"
          />
        </div>
        <!-- pagination -->
        <div class="w-full h-14 relative flex justify-center">
          <el-pagination @current-change="changePage" layout="prev, pager, next" :total="totalCount" class="w-auto h-auto my-auto" />
        </div>
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