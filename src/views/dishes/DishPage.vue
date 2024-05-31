<script setup>
import { ref } from "vue";
import { reactive } from "vue";
import axios from "axios";
import TopBanner from "@/components/common/TopBanner.vue";
import TableComponent from "@/components/common/TableComponent.vue";
import {ElMessage} from "element-plus";

//拉取菜单数据

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
      label: '介绍',
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
      image: 'https://img95.699pic.com/photo/50171/9675.jpg_wh860.jpg',
      info: 'ohqwufhwuhfwqhfuiwbfhbwvbwivbibwiuvbiqwbvuiwbvibwqivbwubvub'
    },
    {
      id: 2,
      name: '宫保鸡丁',
      price: 35,
      time: '2024-04-15',
      status: '起售',
      flavor: '川菜',
      image: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.Bj936iOmWVSxWOYXL8l5IQHaEK?rs=1&pid=ImgDetMain',
      info: 'ohqwufhwuhfwqhfuiwbfhbwvbwivbibwiuvbiqwbvuiwbvibwqivbwubvub'
    },
    {
      id: 3,
      name: '金钱蛋',
      price: 45,
      time: '2024-04-15',
      status: '停售',
      flavor: '川菜',
      image: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.3eu6oMWw89b8TuJfEJV_PgHaE8?rs=1&pid=ImgDetMain',
      info: 'ohqwufhwuhfwqhfuiwbfhbwvbwivbibwiuvbiqwbvuiwbvibwqivbwubvub'
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
          'sW2XV%2fBj0XeI5ZAYNKmreohuJibPd58lDWFg%3d&risl=&pid=ImgRaw&r=0',
      info: 'ohqwufhwuhfwqhfuiwbfhbwvbwivbibwiuvbiqwbvuiwbvibwqivbwubvub'
    },
    {
      id: 5,
      name: '糖醋里脊',
      price: 45,
      time: '2024-04-15',
      status: '起售',
      flavor: '川菜',
      image: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.1gBW9nY2DyXqJJSN3YgdIQHaE1?rs=1&pid=ImgDetMain',
      info: 'ohqwufhwuhfwqhfuiwbfhbwvbwivbibwiuvbiqwbvuiwbvibwqivbwubvub'
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
  image: [],
  status: true,
})

//菜品图片上传业务逻辑
const fileRef = ref()
const imageName = ref()
//获取上传签名

//生成文件名作为key
const generateFileName = (ossData, file) => {
  const suffix = file.name.slice(file.name.lastIndexOf('.'));
  const filename = form.name + '-' + form.price + '-' + form.flavor + '-' + Date.now() + suffix;
  imageName.value = filename
  const dir = ossData.dir
  return dir + filename;
}

//获取图片
const getImage = (file,fileList) => {
  form.image = fileList
}

//使用oss上传图片
const handleUpload = async () => {
  if (form.name !== '' && form.flavor !== '') {
    //上传图片到oss
    await axios.get('http://localhost:3000/oss/signature').then(async (res) => {
      ElMessage({
        type: "info",
        message: res.data.message
      })
      const ossData = res.data;
      const file = form.image[0]
      const key = generateFileName(ossData, file)

      const formData = new FormData()

      // 注意参数的顺序，key 必须是第一位，表示OSS存储文件的路径
      formData.append('key', key)
      formData.append('OSSAccessKeyId', ossData.accessId)
      formData.append('policy', ossData.policy)
      formData.append('signature', ossData.signature)
      // 文件上传成功默认返回 204 状态码，可根据需要修改为 200
      formData.append('success_action_status', '200')
      // file 必须放在最后一位
      formData.append('file', form.image[0].raw)

      await axios.post(ossData.host, formData).then((res) => {
        if (res.status === 200) {
          ElMessage({
            type: "info",
            message: '上传成功'
          })
        }
      }).catch((err) => {
        console.log(err)
      })
      //将oss图片访问链接与其他数据发给后端持久化
      await axios.post('http://localhost:3000/dish/create', {
        name: form.name,
        price: form.price,
        sort: 1,
        code: Date.now(),
        image: `${ossData.host} / ${ossData.dir} ${imageName.value}`,
        description: '',
        category_id: 114514,
        status: 1,
      }, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
              'eyJ1c2VybmFtZSI6InhpYW9taW5nIiwicGFzc3dvcmQiOiIxMTQ1MTQi' +
              'LCJpYXQiOjE3MTcxNTkwNzYsImV4cCI6MTcxNzE2MDg3Nn0.bU3EKKCYw' +
              'zvkboGJbmDY7iotkWtZrJI_D2xsUQ-2Cnk'
        }
      }).then((res) => {
        ElMessage({
          type: "success",
          message: res.data.message
        })
      }).catch((err) => {
        ElMessage({
          type: "warning",
          message: err.data.message
        })
      })
    }).catch((err) => {
      console.log(err)
    })
  } else {
    ElMessage({
      type: "warning",
      message: '请输入相关信息',
    })
  }
}
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
            <el-upload
                ref="fileRef"
                action="#"
                :auto-upload="false"
                :limit="1"
                show-file-list
                :on-change="getImage"
                accept=".jpg,.png"
                :file-list="form.image"
            >
              <el-button type="primary">上传图片</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="w-full" icon="Plus" @click="handleUpload">添加</el-button>
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