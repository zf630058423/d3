<template>
   <div class="search-form">
     <div style="display: flex;padding: 10px">
      <el-form ref="dataForm" :model="formData" label-width="120px" style="flex: 1" label-position="right" >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="单据编号：">
              <el-input class="business-input" v-model="formData.code" clearable style="width: 100%" placeholder="请输入" size="small"></el-input>
            </el-form-item>
          </el-col>
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
            <el-form-item label="管理部门：">
              <el-input class="business-input" v-model="formData.constructionUnitName" clearable style="width: 100%" placeholder="请输入" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="完税凭证号：">
              <el-input class="business-input" v-model="formData.taxPaymentVoucherNo" clearable style="width: 100%" placeholder="请输入" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="纳税单位：">
              <el-input class="business-input" v-model="formData.taxUnitOrgName" clearable style="width: 100%" placeholder="请输入" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预缴所属期间：">
              <el-date-picker style="width: 100%" v-model="formData.prepaidPeriodTime" type="monthrange" size="small"
                              range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份"
                              value-format="yyyy-MM">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编制人：">
              <el-input class="business-input" v-model="formData.createUserName" clearable style="width: 100%" placeholder="请输入" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编制时间：">
              <el-date-picker style="width: 100%" v-model="formData.createTime" type="datetimerange" range-separator="至"
                              start-placeholder="开始日期" end-placeholder="结束日期" size="small" value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审批通过时间：">
              <el-date-picker style="width: 100%" v-model="formData.finishedTime" type="datetimerange" range-separator="至" start-placeholder="开始日期"
                              end-placeholder="结束日期" size="small" value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
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
        "code": "",
        "constructArchiveMainCode": "",
        "constructArchiveMainName": "",
        "constructionUnitName": "",
        "createTime": [],
        "createUserName": "",
        "finishedTime": [],
        "prepaidPeriodTime": [],
        "taxPaymentVoucherNo": "",
        "taxUnitOrgName": ""
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
      if(parm.createTime && parm.createTime.length > 0){
        parm.createTime = (parm.createTime).join();
      }else {
        parm.createTime = ''
      }
      if(parm.finishedTime && parm.finishedTime.length > 0){
        parm.finishedTime = (parm.finishedTime).join();
      }else {
        parm.finishedTime = ''
      }
      if(parm.prepaidPeriodTime && parm.prepaidPeriodTime.length > 0){
        parm.prepaidPeriodTime = (parm.prepaidPeriodTime).join();
      }else {
        parm.prepaidPeriodTime = ''
      }
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
