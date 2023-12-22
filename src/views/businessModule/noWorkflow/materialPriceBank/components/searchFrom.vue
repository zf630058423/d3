<template>
   <div class="search-form" style="position:relative">
      <span @click="unfold">
        <i class="search-icon-hide el-icon-s-fold el-popover__reference" aria-describedby="el-popover-4200" tabindex="0"></i>
      </span>
      <el-form ref="dataForm" :model="formDataPop" label-width="130px" inline>
        <row-layout row-layout :cols="3" cell="1-1-1">
          <el-form-item slot="col_1" prop="contractPartyBName" label="供应商：">
            <el-input v-model="formDataPop.contractPartyBName" class="business-input" size="small" placeholder="请输入" clearable/>
          </el-form-item>
          <el-form-item slot="col_2" prop="name" label="材料名称：">
            <el-input v-model="formDataPop.name" class="business-input" size="small" placeholder="请输入" clearable/>
          </el-form-item>
          <el-form-item slot="col_3" prop="constructionUnitName" label="管理部门：">
            <el-input v-model="formDataPop.constructionUnitName" class="business-input" size="small" placeholder="请输入" clearable/>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3" cell="1-1-1">
          <el-form-item slot="col_1" prop="specification" label="规格/型号：">
            <el-input v-model="formDataPop.specification" class="business-input" size="small" placeholder="请输入" clearable/>
          </el-form-item>
          <el-form-item slot="col_2" prop="brand" label="品牌：">
            <el-input v-model="formDataPop.brand" class="business-input" size="small" placeholder="请输入" clearable/>
          </el-form-item>
          <el-form-item slot="col_3" prop="createTime" label="采购日期：" clearable>
            <el-date-picker
              v-model="formDataPop.createTime"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              size="small"
              class="business-input"
            >
            </el-date-picker>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3" cell="1-1-1" v-if="fold">
          <el-form-item slot="col_1" prop="constructArchiveMainCode" label="项目编号：">
            <el-input v-model="formDataPop.constructArchiveMainCode" class="business-input" size="small" placeholder="请输入" clearable/>
          </el-form-item>
          <el-form-item slot="col_2" label="项目名称：" prop="constructArchiveMainName">
            <el-input v-model="formDataPop.constructArchiveMainName" class="business-input" size="small" placeholder="请输入" clearable/>
          </el-form-item>
          <el-form-item slot="col_3" prop="code" label="合同编号：">
            <el-input v-model="formDataPop.code" class="business-input" size="small" placeholder="请输入" clearable/>
          </el-form-item>
        </row-layout>
      </el-form>
   </div>
</template>

<script>
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
export default {
  name: 'searchFrom',
  components: { RowLayout, SelectDialog },
  props: {
    type: {
      type: String,
      default: ""
    },
    formData: {
      type: Object,
      default: () => { }
    }
  },
  data() { 
    return {
      formDataPop: this.formData,   // 处理父子组件渲染报错问题
      fold: false,  // 是否展开
      periodOfValidityStart: '',
      periodofvalidityend: '',
    }
  },
  watch:{
    formData:{
      handler(newValue){
        this.formDataPop = newValue;
      },
      deep:true,
      immediate:true 
    },
  },
  methods: {
    // 展开 折叠
    unfold(){
      this.fold = !this.fold;
    },
    clearFormData() { 
      this.formData = {};
    },
    btnclick(data){
      this.clearFormData();
    }
  }
}
</script>

<style lang="scss" scoped>
.search-form{
  width: auto;
  min-width: 100%;
  .search-icon-hide.el-icon-s-fold {
    padding: 3px;
    position: absolute;
    left: 0px;
    top: -16px;
    font-size: 20px;
    color: #006eff;
    border-radius: 20%;
    cursor: pointer;
    z-index: 1000;
    width: 20px;
    height: 21px;
  }
}
::v-deep .el-form-item__content{
  width: 300px;
}
.business-input{
  height: 32px;
  line-height: 32px;
  width: 100%;
}
::v-deep .el-input__inner{
  height: 32px;
  line-height: 32px;
}
.el-form-item{
  margin-bottom: 10px;
  margin-right: 15px;
}
.el-form-item__content .el-input-group {
  vertical-align: middle;
}
::v-deep .el-form-item__label{
  font-family: PingFang SC;
  font-weight: 500;
  color: #56576C;
}
.el-input.advanceFund{
  width: 45%;
}
</style>