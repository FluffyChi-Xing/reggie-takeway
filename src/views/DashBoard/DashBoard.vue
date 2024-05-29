<script setup>
import { ref } from "vue";
import TopBanner from "@/components/common/TopBanner.vue";

//title
const title = ref('仪表盘')
</script>

<template>
  <div class="w-full h-full relative block overflow-hidden">
    <!-- top nav banner -->
    <div class="w-full h-14 relative flex bg-white z-[399] shadow-md overflow-hidden">
      <TopBanner :title="title" />
    </div>
    <!-- page body -->
    <div style="height: calc(100% - 56px)" class="w-full p-4 bg-[#d3d3d3] relative block overflow-hidden">
      <!-- top function button -->
      <div class="w-full h-14 relative block mb-4">
        <el-card
            class="w-full h-full"
        >

        </el-card>
      </div>
      <div class="w-full h-full relative block bg-white">

      </div>
    </div>
  </div>
</template>

<style scoped>

</style>