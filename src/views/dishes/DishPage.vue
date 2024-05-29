<script setup>
import { ref } from "vue";
import { reactive } from "vue";
import TopBanner from "@/components/common/TopBanner.vue";
import TableComponent from "@/components/common/TableComponent.vue";

//title
const title = ref('菜品管理')

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
      label: '菜品名称',
      prop: 'name'
    },
    {
      label: '菜品分类',
      prop: 'flavor'
    },
    {
      label: '售卖状态',
      prop: 'status'
    },
    {
      label: '图片',
      prop: 'image',
      type: true,
    },
    {
      label: '最后修改时间',
      prop: 'time'
    },
    {
      label: '售价',
      prop: 'price'
    }
  ],
  data: [
    {
      id: 1,
      name: '水煮肉片',
      price: 79,
      time: '2024-04-15',
      status: '起售',
      flavor: '川菜',
      image: 'https://img95.699pic.com/photo/50171/9675.jpg_wh860.jpg'
    },
    {
      id: 2,
      name: '宫保鸡丁',
      price: 35,
      time: '2024-04-15',
      status: '起售',
      flavor: '川菜',
      image: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.Bj936iOmWVSxWOYXL8l5IQHaEK?rs=1&pid=ImgDetMain'
    },
    {
      id: 3,
      name: '金钱蛋',
      price: 45,
      time: '2024-04-15',
      status: '停售',
      flavor: '川菜',
      image: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.3eu6oMWw89b8TuJfEJV_PgHaE8?rs=1&pid=ImgDetMain'
    },
    {
      id: 4,
      name: '九转大肠',
      price: 79,
      time: '2024-04-15',
      status: '起售',
      flavor: '鲁菜',
      image: 'https://ts1.cn.mm.bing.net/th/id/R-C.49ecf688950caf1f1' +
          'c243cf4c816c0d1?rik=mtkZln0XLEFYKA&riu=http%3a%2f%2fpic.ntimg' +
          '.cn%2ffile%2f20150318%2f19948422_093402464000_2.jpg&ehk=DSuuS9l' +
          'sW2XV%2fBj0XeI5ZAYNKmreohuJibPd58lDWFg%3d&risl=&pid=ImgRaw&r=0'
    },
    {
      id: 5,
      name: '糖醋里脊',
      price: 45,
      time: '2024-04-15',
      status: '起售',
      flavor: '川菜',
      image: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.1gBW9nY2DyXqJJSN3YgdIQHaE1?rs=1&pid=ImgDetMain'
    }
  ],
  highLight: true,
  isFixed: 'right',
  stripe: true,
  select: false,
  canEdit: true,
  unSale: true,
})

//isShow
const isShow = ref(false)

//flavors
const flavors = [
  {
    label: '川菜',
    value: '川菜'
  },
  {
    label: '鲁菜',
    value: '鲁菜'
  },
  {
    label: '粤菜',
    value: '粤菜'
  },
  {
    label: '清真',
    value: '清真'
  }
]
//form
const form = reactive({
  name: '',
  price: 0,
  flavor: '',
  image: '',
  status: true,
})
</script>

<template>
  <div class="w-full h-full relative block bg-[#d3d3d3] overflow-hidden">
    <!-- top banner -->
    <div class="w-full h-14 relative flex bg-white z-[399] shadow-md overflow-hidden">
      <TopBanner :title="title" />
    </div>
    <!-- page body -->
    <div style="height: calc(100% - 75px)" class="w-full p-4 bg-[#d3d3d3] relative block overflow-hidden">
      <!-- top function button -->
      <div class="w-full h-[70px] relative block mb-4">
        <el-card
            class="w-full h-full"
        >
          <div class="w-full h-[32px] relative flex">
            <!-- search banner -->
            <el-input v-model="value" placeholder="请输入菜品名称..." clearable prefix-icon="Dish" style="width: 240px"/>
            <!-- search button -->
            <el-button type="primary" icon="Search" class="ml-4">搜索</el-button>
            <!-- add dishes -->
            <div class="w-auto h-full relative block ml-auto">
              <el-button @click="isShow = true" type="primary" icon="Plus">添加菜品</el-button>
            </div>
          </div>
        </el-card>
      </div>
      <div class="w-full h-full p-4 relative block bg-white">
        <div style="height: calc(100% - 112px)" class="w-full max-h-[478px] relative block overflow-y-scroll">
          <TableComponent
              :labels="table.labels"
              :is-fixed="table.isFixed"
              :high-light="table.highLight"
              :data="table.data"
              :stripe="table.stripe"
              :select="table.select"
              :can-edit="table.canEdit"
              :un-sale="table.unSale"
          />
        </div>
        <!-- pagination -->
        <div class="w-full h-14 relative flex justify-center px-4">
          <el-pagination layout="prev, pager, next" :total="50" class="w-auto h-auto my-auto" />
        </div>
      </div>
    </div>
    <!-- el dialog -->
    <el-dialog
        title="添加菜品"
        width="500px"
        draggable
        v-model="isShow"
    >
      <div class="w-full h-auto p-4 relative block">
        <el-form
            v-model="form"
            label-width="auto"
        >
          <el-form-item label="菜品名称">
            <el-input v-model="form.name" placeholder="请输入菜品名称" prefix-icon="Dish" clearable />
          </el-form-item>
          <el-form-item label="售价">
            <el-input v-model="form.price" placeholder="请输入售价" prefix-icon="Ticket" clearable />
          </el-form-item>
          <el-form-item label="风味">
            <el-select
                placeholder="请选择菜品口味"
                v-model="form.flavor"
            >
              <el-option v-for="item in flavors" :key="item" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否起售">
            <el-switch
                v-model="form.status"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
          </el-form-item>
          <el-form-item label="图片">
            <el-upload v-model="form.image">
              <el-button type="primary">上传图片</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="w-full" icon="Plus">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button type="info" @click="isShow = false" icon="CircleClose">取消</el-button>
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