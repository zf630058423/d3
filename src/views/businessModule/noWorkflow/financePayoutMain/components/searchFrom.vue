<template>
   <div class="search-form" style="position:relative">
      <span @click="unfold">
        <i class="search-icon-hide el-icon-s-fold el-popover__reference" aria-describedby="el-popover-4200" tabindex="0"></i>
      </span>
      <el-form ref="dataForm" :model="formData" label-width="120px" inline class="dataForm">
        <row-layout row-layout :cols="3" cell="1-1-1">
          <el-form-item slot="col_1" label="单据编号：" prop="code">
            <el-input class="business-input" v-model="formData.code" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_2" label="立项编号：" prop="marketMainCode">
            <el-input class="business-input" v-model="formData.marketMainCode" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_3" label="项目编号：" prop="constructArchiveMainCode">
            <el-input class="business-input" v-model="formData.constructArchiveMainCode" clearable></el-input>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3">
          <el-form-item slot="col_1" label="付款财务组织：" prop="paymentFinanceOrgName">
            <el-input class="business-input" v-model="formData.paymentFinanceOrgName" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_2" prop="createUserName" label="编制人：">
            <el-input v-model="formData.createUserName" class="business-input" size="small" placeholder="请输入" clearable/>
          </el-form-item>
          <el-form-item slot="col_3" label="菜单名：" prop="moduleType">
            <el-input class="business-input" v-model="formData.moduleType" clearable></el-input>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3" v-if="fold">
          <el-form-item slot="col_1" prop="createTime" label="编制日期：">
            <!-- <el-date-picker v-model="formData.createTime" type="datetime" placeholder="选择日期时间"></el-date-picker> -->
            <el-date-picker 
              v-model="createTime"
              type="daterange"
              range-separator="—"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="business-input"
              align="right"
              size="small"
            >
            </el-date-picker>
        </el-form-item>
        </row-layout>
      </el-form>
      <div class="buttonGroup">
        <el-button type="primary" size="small" class="fa fa-search" @click="searchFn">查询</el-button>
        <el-button type="primary" size="small" class="fa" @click="resetFn">重置</el-button>
      </div>
   </div>
</template>

<script>
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import moment from 'moment';

export default {
  name: 'searchFrom',
  components: { RowLayout },
  props: {
    formSupplierdata: {
      type: Object,
      default: () => { }
    }
  },
  data() { 
    return {
      formData: {
        code: '', // 单据编号
        marketMainCode: '', // 立项编号
        constructArchiveMainCode: '', // 项目编号
        paymentFinanceOrgName: '', // 付款财务组织
        moduleType: '', // 菜单名
        createUserName: '', // 编制人
        createTime: '', // 编制日期
      },
      createTime: [],
      fold: false,  // 是否展开
    }
  },
  methods: {
    changeCompanyType() {
      this.$refs['dataForm'].clearValidate(['taxRegistrationNum', 'businessTime', 'regFound', 'legalbody', 'customerStatus'])
    },
    //查询
    searchFn() { 
      if(this.createTime.length){ 
        this.createTime = this.createTime.map(el=>{
          el = moment(el).format("YYYY-MM-DD") || '';
          return el;
        })
        this.formData.createTime = this.createTime.join(',');
      }
      this.$emit('search',this.formData)
    },
    //重置
    resetFn() { 
      this.clearFormData();
      this.$emit('search',this.formData)
    },
    clearFormData() { 
      this.createTime = [];
      this.formData = {};
    },
    btnclick(data){
      this.clearFormData();
    },
    // 展开 折叠
    unfold(){
      this.fold = !this.fold;
    }
  }
}
</script>

<style lang="scss" scoped>
// @import url('../../../style/form.scss');
.search-form{
  display: flex;
  width: auto;
  min-width: 100%;
  padding: 10px;
  .search-icon-hide.el-icon-s-fold {
    padding: 3px;
    position: absolute;
    left: 0px;
    top: 0px;
    font-size: 20px;
    color: #006eff;
    border-radius: 20%;
    cursor: pointer;
    z-index: 1000;
    width: 20px;
    height: 21px;
  }
  .dataForm{
    flex: 1;
    padding-left: 40px;
    ::v-deep .form-layout-row {
      margin: 0 !important;
      .el-col {
        padding-left: 20px !important;
      }
    }
  }
  .buttonGroup{
    margin-left: 20px;
  }
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
  width: 100%;
}
::v-deep .el-form--inline .el-form-item__content {
  width: calc(100% - 120px) !important;
}
.el-form-item__content .el-input-group {
  vertical-align: middle;
}
::v-deep .el-form-item__label{
  font-family: PingFang SC;
  font-weight: 500;
  color: #56576C;
  text-align: right;
  padding-right: 0;
}
</style>