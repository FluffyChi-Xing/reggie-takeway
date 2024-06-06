<script setup>
import { ref } from "vue";
import TopBanner from "@/components/common/TopBanner.vue";
import { reactive } from "vue";
import axios from "axios";
import TableComponent from "@/components/common/TableComponent.vue";
import { onMounted } from "vue";
import {ElMessage} from "element-plus";

//title
const title = ref('职工管理')

//value
const value = ref()

//pagination
const pagination = ref()

//分页拉取职工数据
const pageSize = 5
const pageNo = ref(1)
//table
const table = reactive({
  labels: [
    {
      label: '职工姓名',
      prop: 'username',
    },
    {
      label: '权限',
      prop: 'name',
    },
    {
      label: '职工手机号',
      prop: 'phone',
    },
    {
      label: '密码',
      prop: 'password',
    },
    {
      label: '身份证ID',
      prop: 'id_number',
    },
    {
      label: '状态',
      prop: 'status',
    },
    {
      label: '性别',
      prop: 'sex',
    }
  ],
  data: [],
  highLight: true,
  select: false,
  canEdit: true,
  stripe: true,
  isFixed: 'right',
  unSale: true,
})

//pull
const pullData = () => {
  //获取access
  const access = localStorage.getItem('access').toString()
  axios.get(`http://localhost:3000/employee/pull?pageNo=${pageNo.value}&pageSize=${pageSize}`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  }).then((res) => {
    const list = ref([])
    if (res.data.code === 200) {
      pagination.value = (res.data.data.count / pageSize) * 10;
      res.data.data.result.forEach((item) => {
        const result = reactive({
          username: '',
          password: '',
          status: '',
          id_number: '',
          phone: '',
          sex: '',
          name: '',
        });
        result.username = item.username;
        result.password = item.password;
        result.phone = item.phone;
        result.id_number = item.id_number;
        result.name = item.name;
        if (item.status === 1) {
          result.status = '正常'
        } else {
          result.status = '冻结'
        }
        if (item.sex === '1') {
          result.sex = '男'
        } else {
          result.sex = '女'
        }
        list.value.push(result)
      })
      table.data = list.value;
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

//current pageNo
const currentNo = ref()
const currentChange = (current) => {
  currentNo.value = current
}
const changePage = (current) => {
  pageNo.value = current
  //清空table.data
  table.data = []
  //重新拉取
  pullData()
}

//根据用户名查询用户
const searchOne = () => {
  if (value.value) {
    //获取access
    const access = localStorage.getItem('access').toString()
    axios.get(`http://localhost:3000/employee/search?name=${value.value}`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }).then((res) => {
      if (res.data.code === 200) {
        ElMessage({
          type: "success",
          message: res.data.message,
        });
        //清空table.data
        table.data = []
        //vo
        const vo = reactive({
          id: 0,
          name: '',
          username: '',
          password: '',
          phone: '',
          sex: '',
          id_number: '',
          status: '',
        })
        const list = ref([])
        res.data.data.forEach((item) => {
          vo.id = item.id;
          vo.name = item.name;
          vo.username = item.username;
          vo.password = item.password;
          vo.phone = item.phone;
          vo.id_number = item.id_number;
          if (item.sex === '1') {
            vo.sex = '男'
          } else {
            vo.sex = '女'
          }
          if (item.status === 1) {
            vo.status = '正常'
          } else {
            vo.status = '冻结'
          }
         list.value.push(vo)
          console.log(vo)
        })
        table.data = list.value
      } else {
        ElMessage({
          type: "warning",
          message: res.data.message,
        });
      }
    })
  } else {
    ElMessage({
      type: "warning",
      message: '请先输入要查询的用户名',
    })
  }
}

//冻结用户权限
const frozen = () => {
  if (currentNo.value.username) {
    //获取access
    const access = localStorage.getItem('access').toString()
    axios.get(`http://localhost:3000/employee/frozen?user=${currentNo.value.username}`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }).then((res) => {
      if (res.data.code === 200) {
        ElMessage({
          type: "success",
          message: res.data.message,
        })
        //清空table.data
        table.data = []
        //重新拉取
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
  } else {
    ElMessage({
      type: "warning",
      message: '请先选择要冻结的用户',
    })
  }
}

//修改职工信息
const canShow = ref(false)
//update row form
const updateEmployee = reactive({
  username: '',
  name: '',
  password: '',
  id_number: '',
  phone: '',
  sex: 1,
  status: '1',
})
//employee's name
const names = ref([
  {
    label: '管理员',
    value: '管理员',
  },
  {
    label: '超级管理员',
    value: '超级管理员',
  }
])
const editShow = () => {
 if (currentNo.value.username) {
   canShow.value = true
   updateEmployee.username = currentNo.value.username;
  if (currentNo.value.status === '正常') {
    updateEmployee.status = '1';
  }
  if (currentNo.value.status === '冻结') {
    updateEmployee.status = '0';
  }
 } else {
   ElMessage({
     type: "warning",
     message: '请先选择要修改的行',
   })
 }
}
//submit
const updateSubmit = () => {
  if (updateEmployee.username) {
    //获取access
    const access = localStorage.getItem('access').toString()
    axios.post('http://localhost:3000/employee/update', {
      username: updateEmployee.username,
      password: updateEmployee.password,
      phone: updateEmployee.phone,
      sex: updateEmployee.sex.toString(),
      name: updateEmployee.name,
      id_number: updateEmployee.id_number,
      status: Number(updateEmployee.status),
    }, {
      headers: {
        Authorization: `Bearer ${access}`
      },
    }).then((res) => {
      if (res.data.code === 200) {
        ElMessage({
          type: "success",
          message: res.data.message,
        })
        //清空table.data
        table.data = []
        //重新拉取
        pullData()
        canShow.value = false
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


//is show
const isShow = ref(false)


//add form
const addForm = reactive({
  username: '',
  name: '',
  password: '',
  frozen: '1',
  isRoot: 1,
  id_number: '',
  phone: '',
  sex: 1,
})

//add submit
const addSubmit = () => {
  //获取access
  const access = localStorage.getItem('access').toString()
  if (addForm.isRoot === 1) {
    addForm.name = '管理员'
  } else {
    addForm.name = '超级管理员'
  }
  axios.post('http://localhost:3000/employee/add', {
    username: addForm.username,
    name: addForm.name,
    password: addForm.password,
    sex: addForm.sex.toString(),
    status: Number(addForm.frozen),
    id_number: addForm.id_number,
    phone: addForm.phone,
  }, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  }).then((res) => {
    if (res.data.code === 200) {
      ElMessage({
        type: "success",
        message: res.data.message,
      })
      //清空table.data
      table.data = []
      //重新拉取
      pullData()
      isShow.value = false
    } else {
      ElMessage({
        type: "warning",
        message: res.data.message,
      })
    }
  }).catch((err) => {
    console.log(err)
    ElMessage({
      type: "warning",
      message: '参数不能为空',
    })
  })
}

//om
onMounted(() => {
  pullData()
})
</script>

<template>
  <div class="w-full h-full relative block bg-[#d3d3d3] overflow-hidden">
    <!-- top banner -->
    <div class="w-full h-14 absolute block z-[399] shadow-md bg-white overflow-hidden">
      <TopBanner :title="title" />
    </div>
    <!-- manage page body -->
    <div style="height: calc(100% - 56px)" class="w-full relative p-4 block mt-14">
      <!-- top function banner -->
      <div class="w-full h-[70px] relative block mb-4">
        <el-card
            class="w-full h-full"
        >
          <div class="w-full h-8 relative flex overflow-hidden">
            <!-- search input -->
            <el-input v-model="value" placeholder="请输入职工名..." clearable prefix-icon="User" style="width: 240px" />
            <!-- search button -->
            <el-button @click="searchOne" type="primary" class="ml-4" icon="Search">
              搜索
            </el-button>
            <!-- refresh data -->
            <el-button
                style="background-color: #1f1800;border: none"
                type="primary" icon="Refresh"
                @click="pullData"
                class="ml-4">
              刷新
            </el-button>
            <!-- add new employee button -->
            <div class="w-auto h-full relative block ml-auto">
              <el-button @click="isShow = true" type="primary">
                添加新员工
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
      <!-- table body -->
      <div style="height: calc(100% - 90px)" class="w-full relative p-4 block bg-white">
        <!-- table -->
        <div style="height: calc(100% - 56px)" class="w-full max-h-[473px] relative block overflow-y-scroll">
          <TableComponent
              :labels="table.labels"
              :data="table.data"
              :can-edit="table.canEdit"
              :select="table.select"
              :stripe="table.stripe"
              :is-fixed="table.isFixed"
              :high-light="table.highLight"
              :current-change="currentChange"
              :un-sale="table.unSale"
              :frozen-dish="frozen"
              :edit-row="editShow"
          />
        </div>
        <!-- pagination -->
        <div class="w-full h-14 relative flex justify-center">
          <el-pagination @current-change="changePage" layout="prev, pager, next" :total="pagination" class="w-auto h-auto my-auto" />
        </div>
      </div>
    </div>
    <!-- el-dialog -->
    <el-dialog
        title="添加新职工"
        width="500px"
        v-model="isShow"
        draggable
    >
      <div class="w-full h-auto relative block">
        <el-form
            v-model="addForm"
            label-width="auto"
        >
          <el-form-item label="职工姓名">
            <el-input
                v-model="addForm.username"
                placeholder="请输入职工姓名"
                prefix-icon="User"
                clearable
            />
          </el-form-item>
          <el-form-item label="密码">
            <el-input
                type="password"
                v-model="addForm.password"
                placeholder="请输入密码"
                prefix-icon="Lock"
                clearable
                show-password
            />
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input
                v-model="addForm.id_number"
                clearable
                prefix-icon="More"
                maxlength="18"
                show-word-limit
                placeholder="请输入身份证号"
            />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input
                v-model="addForm.phone"
                clearable
                placeholder="请输入手机号"
                prefix-icon="Iphone"
                maxlength="11"
                show-word-limit
            />
          </el-form-item>
          <el-form-item label="职工权限">
            <el-radio-group v-model="addForm.isRoot">
              <el-radio :value="1">管理员</el-radio>
              <el-radio :value="2">超级管理员</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="addForm.sex">
              <el-radio :value="1">男</el-radio>
              <el-radio :value="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否冻结">
            <el-switch
                v-model="addForm.frozen"
                active-value="1"
                inactive-value="2"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                active-action-icon="Unlock"
                inactive-action-icon="Lock"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="addSubmit" type="primary" icon="Plus">
          确认添加
        </el-button>
        <el-button @click="isShow = false" type="info" icon="CircleClose">
          取消
        </el-button>
      </template>
    </el-dialog>
    <!-- edit employee el-dialog -->
    <el-dialog
        title="更改职工信息"
        width="500px"
        v-model="canShow"
        draggable
    >
      <div class="w-full h-auto relative block">
        <el-form
            label-width="auto"
            v-model="updateEmployee"
        >
          <el-form-item label="用户名">
            <el-input v-model="updateEmployee.username" prefix-icon="User" disabled />
          </el-form-item>
          <el-form-item label="权限">
            <el-select
                placeholder="请选择用户权限"
                v-model="updateEmployee.name"
            >
              <el-option
                  v-for="item in names"
                  :key="item"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="密码">
            <el-input
                v-model="updateEmployee.password"
                type="password"
                clearable
                placeholder="请输入密码"
                show-password
                prefix-icon="Lock"
            />
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input
                v-model="updateEmployee.id_number"
                placeholder="请输入身份证号"
                clearable
                maxlength="18"
                show-word-limit
                prefix-icon="Files"
            />
          </el-form-item>
          <el-form-item label="电话号">
            <el-input
                v-model="updateEmployee.phone"
                placeholder="请输入电话号"
                clearable
                maxlength="11"
                show-word-limit
                prefix-icon="Iphone"
            />
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="updateEmployee.sex">
              <el-radio :value="1">
                男
              </el-radio>
              <el-radio :value="2">
                女
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch
                v-model="updateEmployee.status"
                active-value="1"
                inactive-value="0"
                active-action-icon="Unlock"
                inactive-action-icon="Lock"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="updateSubmit" type="primary" icon="Upload">
          确认修改
        </el-button>
        <el-button @click="canShow = false" type="primary" icon="CircleClose">
          取消
        </el-button>
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