<script setup>
import { reactive } from "vue";
import { ref } from "vue";
import {ElMessage} from "element-plus";
import { useRouter } from "vue-router";
import axios from "axios";

//router
const router = useRouter()

//form
const form = reactive({
  username: '',
  password: ''
})

//登录处理函数
const login = async (username, password) => {
  await axios.post('http://8.130.35.251:3005/employee/login', {
    username: username,
    password: password,
  }, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    }
  }).then((res) => {
    if (res.data.code === 200) {
      ElMessage({
        type: "success",
        message: res.data.message,
      })
      isLoading.value = false
      //本地保存access token 和 refresh token
      localStorage.setItem('access', res.data.data.accessToken);
      localStorage.setItem('refresh',res.data.data.refreshToken);
      //跳转目标页
      router.replace('/')
    } else {
      ElMessage({
        type: "warning",
        message: res.data.message
      })
      isLoading.value = false
    }
  }).catch((err) => {
    console.log(err)
  })
}


//is loading
const isLoading = ref(false)

//submit
const submitLogin = async () => {
  try {
    if (form.username !== '' && form.password !== '') {
      isLoading.value = true
      await login(form.username, form.password)
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