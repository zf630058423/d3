<template>
   <div class="search-form">
     <div style="display: flex;padding: 10px">
      <el-form ref="dataForm" :model="formData" label-width="120px" style="flex: 1" label-position="right" >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item  label="项目编号：" >
              <el-input class="business-input" v-model="formData.constructArchiveMainCode" clearable style="width: 100%" placeholder="请输入" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称：">
              <el-input class="business-input" v-model="formData.constructArchiveMainName" clearable style="width: 100%" placeholder="请输入" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="劳务分包合同编号：">
              <el-input class="business-input" v-model="formData.laborSubContractCode" clearable style="width: 100%" placeholder="请输入" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="劳务分包合同名称：">
              <el-input class="business-input" v-model="formData.laborSubContractName" clearable style="width: 100%" placeholder="请输入" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="班组合同编号：">
              <el-input class="business-input" v-model="formData.teamContractCode" clearable style="width: 100%" placeholder="请输入，以','分隔进行多个编号查询" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="班组合同名称：">
              <el-input class="business-input" v-model="formData.teamContractName" clearable style="width: 100%" placeholder="请输入" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
       <div style="margin-top: 5px;margin-left:20px">
         <el-button type="primary" size="small" class="fa fa-search" @click="searchFn">查询</el-button>
         <el-button type="primary" size="small" class="fa" @click="resetFn">重置</el-button>
       </div>
     </div>

   </div>
</template>

<script>
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import { getDataDictByConfigType } from '@/Api/dataDict.js'
export default {
  name: 'searchFrom',
  components: { RowLayout },
  data() {
    return {
      formData: {
        "constructArchiveMainCode": "",
        "constructArchiveMainName": "",
        "laborSubContractCode": "",
        "laborSubContractName": "",
        "teamContractCode": "",
        "teamContractName": ""
      }
    }
  },
  created(){
  },
  methods: {
    changeCompanyType() {
      this.$refs['dataForm'].clearValidate()
    },
    //查询
    searchFn() {
      let parm = Object.toClone(this.formData);
      this.$emit('searchForm-click',parm)
    },
    //重置
    resetFn() {
      this.clearFormData();
      this.$emit('searchForm-click',this.formData)
    },
    clearFormData() {
      this.formData = {};
    },
  }
}
</script>

<style lang="scss" scoped>
// @import url('../../../style/form.scss');
.search-form{
  width: auto;
  min-width: 100%;
}

.business-input{
  height: 32px;
  line-height: 32px;
  width: 250px;
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
</style>
