<script setup>
import { ref } from "vue";
import TopBanner from "@/components/common/TopBanner.vue";
import { reactive } from "vue";
import { onMounted } from "vue";
import TableComponent from "@/components/common/TableComponent.vue";
import axios from "axios";
import {ElMessage} from "element-plus";
import {ossUploadService} from "@/utils/oss-upload.service.js";
import {Unlock} from "@element-plus/icons-vue";

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
  unSale: false,
})

//pull data
const pageNo = ref(1);
const pageSize = 5;
const pagination = ref()
const pullData = () => {
  //获取access
  const access = localStorage.getItem('access').toString()
  //axios
  axios.get(`http://8.130.35.251:3005/set-meal/pull?pageNo=${pageNo.value}&pageSize=${pageSize}`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  }).then((res) => {
    if (res.data.code === 200) {
      res.data.data.forEach((item) => {
        if (item.status === 1) {
          item.status = '已上架'
        } else {
          item.status = '未上架'
        }
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
const selection = ref()
const getCate = () => {
  //获取access
  const access = localStorage.getItem('access').toString()
  axios.get('http://8.130.35.251:3005/category/findAll', {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  }).then((res) => {
    if (res.data.code === 200) {
      selection.value = res.data.data;
    }
  }).catch((err) => {
    console.log(err);
  })
}

//edit form
const editForm = reactive({
  name: '',
  price: 0,
  category: '',
  status: '1',
  image: [],
  description: '',
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
    axios.get(`http://8.130.35.251:3005/set-meal/search?id=${value.value}`, {
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
//新建set meal
const fileRef = ref()
const getImage = (file,fileList) => {
  editForm.image = fileList
}
const imageName = ref()
//获取上传签名

//生成文件名作为key
const generateFileName = (ossData, file) => {
  const suffix = file.name.slice(file.name.lastIndexOf('.'));
  const filename = editForm.name + '-' + editForm.price + '-' + editForm.category + '-' + Date.now() + suffix;
  imageName.value = filename
  const dir = ossData.dir
  return dir + filename;
}
//新增set meal function
const createMeal = async (ossData) => {
  //获取access
  const access = localStorage.getItem('access').toString()
  await axios.post('http://8.130.35.251:3005/set-meal/create', {
    status: editForm.status,
    name: editForm.name,
    category_id: editForm.category,
    description: editForm.description,
    price: editForm.price,
    image: `${ossData.host}/${ossData.dir}${imageName.value}`,
    create_user: 1,
    update_user: 1,
  }, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${access}`,
    },
  }).then((res) => {
    if (res.data.code === 200) {
      ElMessage({
        type: "success",
        message: res.data.message,
      })
      //clear
      table.data = []
      //pull
      pullData()
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
//submit
const handelSubmit = async () => {
  await ossUploadService(editForm, createMeal, generateFileName);
  isShow.value = false
}
//current change
//delete set meal
const mealName = ref()
//delete row
const deleteRow = () => {
  if (mealName.value.name) {
    //get access
    const access = localStorage.getItem('access').toString()
    axios.get(`http://8.130.35.251:3005/set-meal/delete?name=${mealName.value.name}`, {
      headers: {
        Authorization: `Bearer ${access}`
      },
    }).then((res) =>{
      if (res.data.code === 200) {
        //clear table.data
        table.data = []
        //pull
        pullData()
        //message
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
      message: '请选择要删除的行',
    })
  }
}
//edit row ref
const editShow = ref(false)
//edit row
const formEdit = reactive({
  name: '',
  image: [],
  status: '1',
  flavor: '',
  price: 0,
  description: '',
})
const changeRow = ref()
//edit row
const editRow = () => {
  editShow.value = true
}
const changeCurrent = (current) => {
  mealName.value = current
  formEdit.name = mealName.value.name
  formEdit.price = mealName.value.price
  formEdit.description = mealName.value.description
  if (mealName.value.status === '已上架') {
    formEdit.status = '1'
  } else {
    formEdit.status = '0'
  }
}
const changeImage = (file, fileList) =>{
  formEdit.image = fileList
}
//submit update
const submitChange = async (ossData) => {
  if (formEdit.name) {
    //access
    const access = localStorage.getItem('access').toString();
    await axios.post('http://8.130.35.251:3005/set-meal/update', {
      name: formEdit.name,
      price: formEdit.price,
      category_id: formEdit.flavor,
      description: formEdit.description,
      status: Number(formEdit.status),
      image: `${ossData.host}/${ossData.dir}${imageName.value}`,
    }, {
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then((res) => {
      if (res.data.code === 200) {
        //clear table.data
        table.data = []
        //pull
        pullData()
        //message
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
}
//handle update
const handleUpdate = async () => {
  await ossUploadService( formEdit, submitChange, generateFileName);
  editShow.value = false
}

//om
onMounted(() => {
  pullData()
  getCate()
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
              :current-change="changeCurrent"
              :delete-row="deleteRow"
              :edit-row="editRow"
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
        draggable
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
          <el-form-item label="简介">
            <el-input
                v-model="editForm.description"
                placeholder="请输入简介"
                prefix-icon="Document"
                clearable
                maxlength="120"
                show-word-limit
            />
          </el-form-item>
          <el-form-item label="套餐分类">
            <el-select
                v-model="editForm.category"
                placeholder="请选择套餐分类"
            >
              <el-option v-for="item in selection" :key="item" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="套餐图片">
            <el-upload
                ref="fileRef"
                action="#"
                :auto-upload="false"
                :multiple="false"
                limit="1"
                show-file-list
                accept=".jpg,.png"
                :file-list="editForm.image"
                :on-change="getImage"
            >
              <el-button type="primary" icon="Upload">上传图片</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="是否起售">
            <el-switch
                size="default"
                v-model="editForm.status"
                :active-value="1"
                :inactive-value="0"
                :active-action-icon="Unlock"
                :inactive-action-icon="Lock"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="handelSubmit" type="primary" icon="Plus">确认添加</el-button>
        <el-button type="info" icon="CircleClose" @click="isShow = false">取消</el-button>
      </template>
    </el-dialog>
    <!-- el-dialog 修改套餐 -->
    <el-dialog
        title="修改套餐"
        v-model="editShow"
        draggable
        width="500px"
    >
      <div class="w-full h-auto relative block">
        <el-form
            label-width="auto"
            v-model="formEdit"
        >
          <el-form-item label="套餐名">
            <el-input v-model="formEdit.name" disabled prefix-icon="User" />
          </el-form-item>
          <el-form-item label="价格">
            <el-input v-model="formEdit.price" clearable placeholder="请输入价格" prefix-icon="Ticket"  />
          </el-form-item>
          <el-form-item label="简介">
            <el-input
                v-model="formEdit.description"
                placeholder="请输入简介"
                clearable
                prefix-icon="Document"
                maxlength="120"
                show-word-limit
            />
          </el-form-item>
          <el-form-item label="分类">
            <el-select
                v-model="formEdit.flavor"
                placeholder="请选择套餐分类"
            >
              <el-option
                  v-for="item in selection"
                  :key="item"
                  :label="item.name"
                  :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="上传图片">
            <el-upload
                ref="changeRow"
                action="#"
                :auto-upload="false"
                :multiple="false"
                limit="1"
                show-file-list
                accept=".jpg,.png"
                :file-list="formEdit.image"
                :on-change="changeImage"
            >
              <el-button type="primary" icon="Upload">上传图片</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch
                v-model="formEdit.status"
                :active-action-icon="Unlock"
                :inactive-action-icon="Lock"
                :active-value="1"
                :inactive-value="0"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button type="primary" icon="Upload" @click="handleUpdate">确认</el-button>
        <el-button type="primary" icon="CircleClose" @click="editShow = false">取消</el-button>
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