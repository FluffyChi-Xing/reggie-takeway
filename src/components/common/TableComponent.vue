<script setup>
//table template data structure
const props = defineProps({
  data: [],
  stripe: Boolean,
  select: Boolean,
  highLight: Boolean,
  labels: [],
  canEdit: Boolean,
  isFixed: String,
  secret: Number,
  currentChange: function () {},
  editRow: function () {},
  deleteRow: function () {},
  frozenDish: function () {},
  finish: function () {},
  wantCancel: function () {},
  unSale: Boolean,
  needDel: Boolean,
  isFinish: Boolean,
  cancel: Boolean,
})
</script>

<template>
  <div class="w-full h-auto relative block overflow-hidden">
    <el-table
        :data="props.data"
        :stripe="props.stripe"
        :highlight-current-row="props.highLight"
        @current-change="props.currentChange"
        style="width: 100%"
    >
      <el-table-column type="selection" v-show="props.select" />
      <el-table-column
          v-for="item in props.labels"
          :key="item"
          :type="item.type === true ? 'expand' : ''"
          :label="item.label"
          :prop="item.prop"
          width="200px"
      >
        <template v-if="item.type === true" #default="scope">
          <div class="w-full h-auto relative block p-4">
            <p class="w-full h-auto leading-[20px] whitespace-pre-line text-ellipsis overflow-hidden">
              <img
                  :src="scope.row.image"
                  :alt="scope.row.name"
                  class="w-[100px] h-[100px] cursor-pointer relative block object-contain"
                  loading="lazy"
                  onerror="this.src=`src/assets/image/oops.jpg`"
              >
            </p>
            <p>{{ scope.row.description }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column :fixed="props.isFixed" label="操作" width="200px">
        <el-button type="text" style="color: red" size="small" v-if="!needDel" @click="props.deleteRow">删除</el-button>
        <el-button type="text" size="small" v-show="props.canEdit" @click="props.editRow">修改</el-button>
        <el-button type="text" size="small" @click="props.frozenDish" v-show="props.unSale">冻结</el-button>
        <el-button type="text" size="small" @click="props.finish" v-if="isFinish">销单</el-button>
        <el-button type="text" style="color: red" size="small" @click="props.wantCancel" v-if="cancel">取消</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>

</style>