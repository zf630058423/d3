<template>
  <div class="form-layout">
    <form-title :title="title"></form-title>
    <div class="form-layout-row">
       <el-row :gutter="20" :key="index" v-for="(row,index) in rowObject">
        <el-col :span="col" :key="cIndex" v-for="(col, cIndex) in row.col">
          <div class="grid-content bg-purple">
            <span :slot="col.title"></span>
            <span :slot="col.compontent"></span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import FormTitle from '../formTitle/index.vue';
export default {
  components: { FormTitle },
  props: {
    title: {
      type: String,
      default: ''
    },
    rowObject: {
      type: Object,
      default: () => { }
    },
  },
  data() { 
    return {
      
    }
  }
}
</script>

<style lang="less" scoped>

.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .form-layout{

    .form-layout-row{
      margin: 16px;
    }
  }
</style>