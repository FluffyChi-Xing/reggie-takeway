<script setup>
import { ref } from "vue";
import TopBanner from "@/components/common/TopBanner.vue";
import { reactive } from "vue";
import { onMounted } from "vue";
import TableComponent from "@/components/common/TableComponent.vue";
import axios from "axios";
import {ElMessage} from "element-plus";

//title
const title = ref('套餐管理')

//value
const value = ref()

//table
const table = reactive({
  labels: [
    {
      label: '套餐名称',
      prop: 'name'
    },
    {
      label: '图片',
      type: true,
      prop: 'image'
    },
    {
      label: '售价',
      prop: 'price'
    },
    {
      label: '分类',
      prop: 'category'
    },
    {
      label: '状态',
      prop: 'status'
    },
    {
      label: '创建者',
      prop: 'create',
    },
    {
      label: '最后修改时间',
      prop: 'update_time'
    }
  ],
  data: [],
  highLight: true,
  select: false,
  isFixed: 'right',
  stripe: true,
  canEdit: true,
  unSale: true,
})

//pull data
const pageNo = ref(1);
const pageSize = 5;
const pagination = ref()
const pullData = () => {
  //获取access
  const access = localStorage.getItem('access').toString()
  //axios
  axios.get(`http://localhost:3000/set-meal/pull?pageNo=${pageNo.value}&pageSize=${pageSize}`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  }).then((res) => {
    if (res.data.code === 200) {
      res.data.data.forEach((item) => {
        table.data.push(item)
      })
      pagination.value = (res.data.count / pageSize) * 10;
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
}

//selection
const selection = ref([
  {
    label: '儿童套餐',
    value: '儿童套餐'
  },
  {
    label: '成人餐',
    value: '成人餐'
  }
])

//edit form
const editForm = reactive({
  name: '',
  price: 0,
  category: '',
  isSale: true,
  image: ''
})

//isShow
const isShow = ref(false)
//refresh
const refresh = () => {
  //clear
  table.data = []
  //pull
  pullData()
}
//search set-meal
const searchOne = () => {
  if (value.value) {
    //获取access
    const access = localStorage.getItem('access').toString();
    axios.get('http://localhost:3000/set-meal/search?id=1', {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }).then((res) => {
      if (res.data.code === 200) {
        //clear
        table.data = []
        //pull
        table.data = res.data.data
        ElMessage({
          type: "success",
          message: '查询成功',
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
  } else {
    ElMessage({
      type: "warning",
      message: '查询不可为空',
    })
  }
}

//om
onMounted(() => {
  pullData()
})
</script>

<template>
  <!-- 套餐管理 -->
  <div class="w-full h-full relative block bg-[#d3d3d3] overflow-hidden">
    <!-- top banner -->
    <div class="w-full h-14 relative flex bg-white mb-4 z-[399] shadow-md overflow-hidden">
      <TopBanner :title="title" />
    </div>
    <!-- set meal main body -->
    <div style="height: calc(100% - 56px)" class="w-full relative p-4 block  overflow-hidden">
      <!-- top function banner -->
      <div class="w-full h-[70px] relative block">
        <el-card
            class="w-full h-full"
        >
          <div class="w-full h-8 relative flex">
            <!-- search input -->
            <el-input v-model="value" style="width: 240px" clearable prefix-icon="Box" placeholder="请输入套餐名..." />
            <!-- search submit button -->
            <el-button @click="searchOne" icon="Search" type="primary" class="ml-4">搜索</el-button>
            <!-- refresh -->
            <el-button @click="refresh" icon="Refresh" type="primary" class="ml-4">刷新</el-button>
            <!-- add set meal button -->
            <div class="w-auto h-full relative block ml-auto">
              <el-button
                  @click="isShow = true"
                  type="primary"
                  icon="Plus"
                  style="background-color: #1f1800;border: none"
              >
                添加套餐
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
      <!-- main body -->
      <div style="height: calc(100% - 112px)" class="w-full relative block mt-4 bg-white overflow-hidden">
        <!-- table -->
        <div style="height: calc(100% - 56px)" class="w-full max-h-[473px] relative block overflow-y-scroll">
          <TableComponent
              :labels="table.labels"
              :data="table.data"
              :select="table.select"
              :high-light="table.highLight"
              :is-fixed="table.isFixed"
              :stripe="table.stripe"
              :can-edit="table.canEdit"
              :un-sale="table.unSale"
          />
        </div>
        <!-- pagination -->
        <div class="w-full h-14 relative flex justify-center">
          <el-pagination layout="prev, pager, next" :total="pagination" class="w-auto h-auto my-auto" />
        </div>
      </div>
    </div>
    <!-- el-dialog -->
    <el-dialog
        title="添加套餐"
        width="500px"
        v-model="isShow"
    >
      <div class="w-full h-auto relative block">
        <el-form
            v-model="editForm"
            label-width="auto"
        >
          <el-form-item label="套餐名">
            <el-input v-model="editForm.name" placeholder="请输入套餐名" prefix-icon="Box" clearable />
          </el-form-item>
          <el-form-item label="套餐价格">
            <el-input v-model="editForm.price" placeholder="请输入售价" prefix-icon="Ticket" clearable />
          </el-form-item>
          <el-form-item label="套餐分类">
            <el-select
                v-model="editForm.category"
                placeholder="请选择套餐分类"
            >
              <el-option v-for="item in selection" :key="item" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="套餐图片">
            <el-upload
                v-model="editForm.image"
                :multiple="false"
                show-file-list
            >
              <el-button type="primary" icon="Upload">上传图片</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="是否起售">
            <el-switch
                size="default"
                v-model="editForm.isSale"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Plus">确认添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button type="info" icon="CircleClose" @click="isShow = false">取消</el-button>
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