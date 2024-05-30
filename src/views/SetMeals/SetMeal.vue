<script setup>
import { ref } from "vue";
import TopBanner from "@/components/common/TopBanner.vue";
import { reactive } from "vue";
import TableComponent from "@/components/common/TableComponent.vue";

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
      label: '最后修改时间',
      prop: 'time'
    }
  ],
  data: [
    {
      id: 1,
      name: '儿童套餐一',
      image: 'https://picsum.photos/200/300?1',
      price: 120,
      status: '销售中',
      category: '儿童餐',
      time: '2023-02-13'
    },
    {
      id: 2,
      name: '儿童套餐二',
      image: 'https://picsum.photos/200/300?2',
      price: 120,
      status: '销售中',
      category: '儿童餐',
      time: '2023-02-13'
    },
    {
      id: 3,
      name: '儿童套餐三',
      image: 'https://picsum.photos/200/300?3',
      price: 120,
      status: '销售中',
      category: '儿童餐',
      time: '2023-02-13'
    },
    {
      id: 4,
      name: '儿童套餐四',
      image: 'https://picsum.photos/200/300?4',
      price: 120,
      status: '销售中',
      category: '儿童餐',
      time: '2023-02-13'
    },
    {
      id: 5,
      name: '儿童套餐五',
      image: 'https://picsum.photos/200/300?5',
      price: 120,
      status: '销售中',
      category: '儿童餐',
      time: '2023-02-13'
    }
  ],
  highLight: true,
  select: false,
  isFixed: 'right',
  stripe: true,
  canEdit: true,
  unSale: true,
})

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
            <el-button icon="Search" type="primary" class="ml-4">搜索</el-button>
            <!-- add set meal button -->
            <div class="w-auto h-full relative block ml-auto">
              <el-button @click="isShow = true" type="primary" icon="Plus">添加套餐</el-button>
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
          <el-pagination layout="prev, pager, next" :total="50" class="w-auto h-auto my-auto" />
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