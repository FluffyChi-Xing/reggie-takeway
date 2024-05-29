<script setup>
import { useCounterStore } from "@/stores/counter.js";
import { ref } from "vue";
import { useRouter } from "vue-router";
import {Expand, Fold} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";

//admin
const user = ref('admin')
//router
const router = useRouter()

//store
const store = useCounterStore()

//icon
const icon = ref(Fold)

//isLoading
const isLoading = ref(false)

//isShow
const isShow = ref(false)

//change icons
const changIcon = () => {
  store.collapse = !store.collapse;
  switch (store.collapse) {
    case true:
      icon.value = Expand
          break;
    case false:
      icon.value = Fold
          break;
  }
}

//exit
const exit = () => {
  isLoading.value = true
  setTimeout(() => {
    router.replace('/login')
    ElMessage({
      type: "info",
      message: '退出登录'
    })
    isLoading.value = false
  },3000)
}

const props = defineProps({
  title: String,
})
</script>

<template>
  <div class="w-full h-full relative px-4 flex overflow-hidden">
    <!-- collapse button -->
    <div class="w-14 h-14 relative block mr-4">
      <el-button @click="changIcon" :icon="icon" style="width: 56px;height: 56px;border: none;outline: none" />
    </div>
    <!-- title -->
    <div class="w-auto h-full relative flex justify-center font-bold leading-[56px] text-[15px] text-black">
      {{ props.title }}
    </div>
    <!-- exit button -->
    <div class="w-auto h-full relative flex justify-center px-3 ml-auto">
      <el-button @click="isShow = true" type="text" icon="SwitchButton" class="my-auto">退出 {{user}}</el-button>
    </div>
    <!-- el dialog -->
    <el-dialog
        title="再次确认"
        width="500px"
        draggable
        v-model="isShow"
    >
      <div class="w-full h-auto p-4 relative flex justify-center">
        <el-form
            label-width="auto"
        >
          <el-form-item label="是否退出">
            <el-button @click="exit" type="danger" icon="SwitchButton" :loading="isLoading">退出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="isShow = false" type="info" icon="CircleClose">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>

</style>