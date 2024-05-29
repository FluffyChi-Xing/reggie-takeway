<script setup>
import { reactive } from "vue";
import { ref } from "vue";
import {ElMessage} from "element-plus";
import { useRouter } from "vue-router";

//router
const router = useRouter()

//form
const form = reactive({
  username: '',
  password: ''
})

//is loading
const isLoading = ref(false)

//submit
const submitLogin = () => {
  try {
    if (form.username !== '' && form.password !== '') {
      isLoading.value = true
      setTimeout(() => {
        router.replace('/')
        ElMessage({
          type: "success",
          message: '登陆成功'
        })
        isLoading.value = false
      },3000)
    } else {
      ElMessage({
        type: "warning",
        message: '用户名和密码不可为空',
      })
    }
  } catch (e) {
    ElMessage({
      type: "warning",
      message: '错误',
    })
  }
}
</script>

<template>
  <div class="w-screen h-screen relative grid grid-cols-4 overflow-hidden">
    <!-- left image -->
    <div class="w-full h-full col-span-3 login-bg" />
    <!-- right banner -->
    <div class="w-full h-full relative flex justify-center overflow-hidden">
      <div class="w-[300px] h-[400px] relative block my-auto px-4 py-14">
        <!-- logo image -->
        <div class="w-full h-14 relative px-4 flex justify-center">
          <img src="../../assets/image/logo.png" alt="" class="w-1/2 h-14 relative block object-contain">
        </div>
        <!-- login form -->
        <div class="w-auto h-full relative block mx-auto mt-4">
          <el-form
              v-model="form"
              label-width="auto"
          >
            <el-form-item label="用户名">
              <el-input v-model="form.username" clearable placeholder="请输入用户名" prefix-icon="User"/>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="form.password" clearable show-password type="password" prefix-icon="Lock" />
            </el-form-item>
            <el-form-item>
              <el-button @click="submitLogin" :loading="isLoading" type="primary" class="w-full" round>登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-bg {
  background-image: url("../../assets/image/login-l.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position-y: -100px;
}
.el-button {
  background-color: #FFC300;
}
</style>