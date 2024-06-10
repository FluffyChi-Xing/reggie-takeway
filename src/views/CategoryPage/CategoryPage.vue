<script setup>
import { reactive, ref } from "vue";
import TopBanner from "@/components/common/TopBanner.vue";
import TableComponent from "@/components/common/TableComponent.vue";
import axios from "axios";
import {ElMessage} from "element-plus";
import { onMounted } from "vue";

//title
const title = ref('分类管理')
const value = ref()

//pages
const pageNo = ref(1)
const pageSize = 5
const total = ref()

const table = reactive({
  labels: [
    {
      label: 'id',
      prop: 'id',
    },
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
      prop: 'update_time',
    },
    {
      label: '排序',
      prop: 'sort'
    }
  ],
  data: [],
  canEdit: true,
  highLight: true,
  select: false,
  stripe: true,
  isFixed: 'right',
})
//pull data
const pullData = () => {
  //access
  const access = localStorage.getItem('access').toString();
  axios.get(`http://localhost:3000/category/pull?pageNo=${pageNo.value}&pageSize=${pageSize}`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  }).then((res) => {
    if (res.data.code === 200) {
      table.data = res.data.data;
      total.value = (res.data.totalCount / pageSize) * 10;
      ElMessage({
        type: "success",
        message: res.data.message,
      })
    } else {
      ElMessage({
        type: "warning",
        message: res.data.message,
      })
    }
  }).catch((err) => {
    console.log(err);
  })
}
//change page
const changePage = (current) => {
  pageNo.value = current
  //clear table.data
  table.data = []
  //pull
  pullData()
}
//search category by id
const searchName = () => {
  if (value.value) {
    //access
    const access = localStorage.getItem('access').toString();
    axios.get(`http://localhost:3000/category/search?id=${value.value}`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }).then((res) => {
      if (res.data.code === 200) {
        //clear table.data
        table.data = []
        //pull
        table.data = res.data.data
        ElMessage({
          type: "success",
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
  } else {
    ElMessage({
      type: "warning",
      message: '请先输入分类名',
    })
  }
}
//refresh
const refresh = () => {
  //clear
  table.data = []
  //pageNo
  pageNo.value = 1
  //pull
  pullData()
}
//add dish category
const cateShow = ref(false)
const addForm = reactive({

})

//om
onMounted(() => {
  pullData()
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
            <!-- search flavor -->
            <!-- el-input -->
            <el-input
                style="width: 240px"
                v-model="value"
                placeholder="请输入分类id..."
                prefix-icon="Box"
                clearable
            />
            <el-button type="primary" icon="Search" class="ml-4" @click="searchName">搜索</el-button>
            <el-button type="primary" class="ml-4" icon="Refresh" @click="refresh">刷新</el-button>
            <div class="w-auto h-full relative flex justify-between ml-auto">
              <!-- add dish cate -->
              <el-button style="background-color: #1f1800;border: none" type="primary" icon="Plus">
                添加菜品分类
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
      <!-- table main body -->
      <div style="height: calc(100% - 112px)" class="w-full relative block p-4 bg-white">
        <!-- table body -->
        <div style="height: calc(100% - 56px)" class="w-full max-h-[473px] relative block overflow-y-scroll">
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
          <el-pagination @current-change="changePage" layout="prev, pager, next" :total="total" class="w-auto h-auto my-auto" />
        </div>
      </div>
    </div>
    <!-- add dish category -->
    <el-dialog
        title="添加菜品风味"
        draggable
        width="500px"
        v-model="cateShow"
    >
      <div class="w-full h-auto relative block">

      </div>
      <template #footer>
        <el-button type="primary" icon="Upload">确认</el-button>
        <el-button type="primary" icon="CircleClose" @click="cateShow = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.el-button {
  background-color: #FFC300;
  border: none;
}
</style>