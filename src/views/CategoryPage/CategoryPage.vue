<script setup>
import { reactive, ref } from "vue";
import TopBanner from "@/components/common/TopBanner.vue";
import TableComponent from "@/components/common/TableComponent.vue";

//title
const title = ref('分类管理')

const table = reactive({
  labels: [
    {
      label: '分类名称',
      prop: 'name',
    },
    {
      label: '分类类型',
      prop: 'type',
    },
    {
      label: '修改时间',
      prop: 'time',
    },
    {
      label: '排序',
      prop: 'sort'
    }
  ],
  data: [
    {
      id: 1,
      name: '儿童套餐一',
      time: '2024-08-13',
      type: '套餐',
      sort: '1'
    },
    {
      id: 2,
      name: '儿童套餐二',
      time: '2024-08-13',
      type: '套餐',
      sort: '2'
    },
    {
      id: 3,
      name: '川菜',
      time: '2024-08-13',
      type: '菜品',
      sort: '1'
    },
    {
      id: 4,
      name: '儿童套餐三',
      time: '2024-08-13',
      type: '套餐',
      sort: '1'
    },
    {
      id: 5,
      name: '儿童套餐五',
      time: '2024-08-13',
      type: '套餐',
      sort: '1'
    }
  ],
  canEdit: true,
  highLight: true,
  select: false,
  stripe: true,
  isFixed: 'right',
})
</script>

<template>
  <div class="w-full h-full relative block bg-[#d3d3d3] overflow-hidden">
    <!-- top nav banner -->
    <div class="w-full h-14 absolute block top-0 left-0 bg-white z-[399] shadow-md">
      <TopBanner :title="title" />
    </div>
    <!-- table main body -->
    <div style="height: calc(100% - 56px)" class="w-full relative block mt-14 p-4">
      <!-- top function buttons -->
      <div class="w-full h-[70px] relative block mb-4">
        <el-card
            class="w-full h-full"
        >
          <div class="w-full h-8 relative flex">
            <!-- add dish cate -->
            <el-button style="background-color: #FFC300;border: none" type="primary" icon="Plus">
              添加菜品分类
            </el-button>
            <!-- add set meal cate -->
            <el-button style="background-color: #1f1800;border: none" type="info" icon="Plus" class="ml-4">
              添加套餐分类
            </el-button>
          </div>
        </el-card>
      </div>
      <!-- table main body -->
      <div style="height: calc(100% - 112px)" class="w-full relative block p-4 bg-white">
        <!-- table body -->
        <div style="height: calc(100% - 56px)" class="w-full max-h-[473px] relative block">
          <TableComponent
              :labels="table.labels"
              :data="table.data"
              :can-edit="table.canEdit"
              :select="table.select"
              :high-light="table.highLight"
              :stripe="table.stripe"
              :is-fixed="table.isFixed"
          />
        </div>
        <!-- table pagination -->
        <div class="w-full h-14 relative flex justify-center">
          <el-pagination layout="prev, pager, next" :total="50" class="w-auto h-auto my-auto" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>