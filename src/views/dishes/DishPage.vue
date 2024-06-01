<script setup>
import { ref } from "vue";
import { reactive } from "vue";
import axios from "axios";
import TopBanner from "@/components/common/TopBanner.vue";
import TableComponent from "@/components/common/TableComponent.vue";
import {ElMessage} from "element-plus";
import { onMounted } from "vue";
//拉取菜单数据
//定义分页查询的基本数据
const pageNo = ref(1)
const pageSize = 5

//页面总数量
const totalCount = ref()

//换页函数
const changePage = (current) => {
  pageNo.value = current
  //清空data
  table.data = []
  //重新拉取
  pullData()
}



const pullData = () => {
  //提取accessToken
  const access = localStorage.getItem('access').toString()
  axios.get(`http://localhost:3000/dish/pull?pageNo=${pageNo.value}&pageSize=${pageSize}`, {
    headers: {
      Authorization: `Bearer ${access}`
    }
  }).then((res) => {
    if (res.data.code === 200) {
      ElMessage({
        type: "success",
        message: res.data.message,
      })
      res.data.data.forEach((item) => {
        if (item.status === 1) {
          item.status = '已上架'
        } else {
          item.status = '已下架'
        }
        table.data.push(item)
      })
      totalCount.value = (res.data.count / pageSize) * 10
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

//title
const title = ref('菜品管理')

//value
const value = ref()

//table structure
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
      prop: 'update_time'
    },
    {
      label: '售价',
      prop: 'price'
    }
  ],
  data: [],
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
  description: '',
  status: true,
  code: 114514,
  sort: 1,
  category_id: 123,
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
  const access = localStorage.getItem('access').toString()
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
        image: `${ossData.host}/${ossData.dir}${imageName.value}`,
        description: form.description,
        category_id: 114514,
        status: 1,
      }, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${access}`
        }
      }).then((res) => {
        ElMessage({
          type: "success",
          message: res.data.message
        })
        isShow.value = false
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
//根据菜名查询菜品
const searchByName = () => {
  if (value.value) {
    //提取access
    const access = localStorage.getItem('access').toString()
    axios.get(`http://localhost:3000/dish/search?name=${value.value}`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }).then((res) => {
      if (res.data.code === 200) {
        ElMessage({
          type: "success",
          message: res.data.message,
        })
        //清空table data
        table.data = []
        table.data.push(res.data.data)
      } else {
        ElMessage({
          type: "warning",
          message: res.data.message,
        })
      }
    })
  } else {
    ElMessage({
      type: "warning",
      message: '菜品名不可为空'
    })
  }
}



//om
onMounted(() => {
  pullData()
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
            <el-button type="primary" icon="Search" class="ml-4" @click="searchByName">搜索</el-button>
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
          <el-pagination @current-change="changePage" layout="prev, pager, next" :total="totalCount" class="w-auto h-auto my-auto" />
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
          <el-form-item label="描述">
            <el-input v-model="form.description" clearable placeholder="请输入菜品描述" maxlength="120" show-word-limit />
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