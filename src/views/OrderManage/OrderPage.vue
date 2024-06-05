<script setup>
import { ref } from "vue";
import TopBanner from "@/components/common/TopBanner.vue";
import { reactive } from "vue";
import TableComponent from "@/components/common/TableComponent.vue";

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
      prop: 'time',
    },
    {
      label: '金额',
      prop: 'cost',
    }
  ],
  data: [
    {
      id: 1,
      username: '张三',
      phone: '99677890o0',
      cost: 76,
      time: '2024-05-30',
      address: '翻斗大街15号楼1001室',
      status: '派送中'
    },
    {
      id: 2,
      username: '李四',
      phone: '99677890o0',
      cost: 76,
      time: '2024-05-30',
      address: '翻斗大街15号楼1001室',
      status: '派送中'
    },
    {
      id: 3,
      username: '王五',
      phone: '99677890o0',
      cost: 76,
      time: '2024-05-30',
      address: '翻斗大街15号楼1001室',
      status: '已送达'
    },
    {
      id: 4,
      username: '赵六',
      phone: '99677890o0',
      cost: 76,
      time: '2024-05-30',
      address: '翻斗大街15号楼1001室',
      status: '已送达'
    },
    {
      id: 5,
      username: '鬼脚七',
      phone: '99677890o0',
      cost: 76,
      time: '2024-05-30',
      address: '翻斗大街15号楼1001室',
      status: '派送中'
    }
  ],
  canEdit: true,
  select: false,
  highLight: true,
  stripe: true,
  isFixed: 'right',
})

//拉取数据
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
            <el-button type="primary" class="ml-4" icon="Plus">搜索</el-button>
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
              :can-edit="table.canEdit"
          />
        </div>
        <!-- pagination -->
        <div class="w-full h-14 relative flex justify-center">
          <el-pagination layout="prev, pager, next" :total="50" class="w-auto h-auto my-auto" />
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