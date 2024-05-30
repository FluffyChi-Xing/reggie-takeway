<script setup>
import { ref } from "vue";
import TopBanner from "@/components/common/TopBanner.vue";
import { reactive } from "vue";
import TableComponent from "@/components/common/TableComponent.vue";

//title
const title = ref('职工管理')

//value
const value = ref()

//table
const table = reactive({
  labels: [
    {
      label: '职工姓名',
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
      label: '是否冻结',
      prop: 'frozen',
    },
    {
      label: 'id',
      prop: 'id',
    },
  ],
  data: [
    {
      id: 1,
      name: '张三',
      phone: '12133341211',
      password: '114514',
      frozen: '否'
    },
    {
      id: 2,
      name: '李四',
      phone: '12133341211',
      password: '114514',
      frozen: '否'
    },
    {
      id: 3,
      name: '王二麻子',
      phone: '12133341211',
      password: '114514',
      frozen: '是'
    },
    {
      id: 4,
      name: '王五',
      phone: '12133341211',
      password: '114514',
      frozen: '否'
    },
    {
      id: 5,
      name: '赵六',
      phone: '12133341211',
      password: '114514',
      frozen: '否'
    }
  ],
  highLight: true,
  select: false,
  canEdit: true,
  stripe: true,
  isFixed: 'right',
})

//is show
const isShow = ref(false)


//add form
const addForm = reactive({
  name: '',
  password: '',
  frozen: false,
  isRoot: ref(1)
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
            <el-button type="primary" class="ml-4" icon="Search">
              搜索
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
            <el-input v-model="addForm.name" placeholder="请输入职工姓名" prefix-icon="User" clearable />
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="addForm.password" placeholder="请输入密码" prefix-icon="Lock" clearable show-password />
          </el-form-item>
          <el-form-item label="职工权限">
            <el-radio-group v-model="addForm.isRoot">
              <el-radio :value="1">用户</el-radio>
              <el-radio :value="2">管理员</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否冻结">
            <el-switch
                v-model="addForm.frozen"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Plus">确认添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="isShow = false" type="info" icon="CircleClose">
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