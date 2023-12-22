<template>
   <div class="search-form">
      <el-form ref="dataForm" :model="formDataPop" label-width="120px" inline class="dataForm">
        <row-layout row-layout :cols="3" cell="1-1-1">
          <el-form-item slot="col_1" label="供应商编号：" prop="code">
            <el-input class="business-input" v-model="formDataPop.code" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_2" label="供应商名称：" prop="name">
            <el-input class="business-input" v-model="formDataPop.name" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_3" label="启用状态：" prop="enableState">
            <el-radio-group v-model="formDataPop.enableState">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
            <el-radio label="">全部</el-radio>
          </el-radio-group>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3">
          <el-form-item slot="col_1" label="统一社会信用代码：" prop="taxRegistrationNum">
            <el-input class="business-input" v-model="formDataPop.taxRegistrationNum" clearable></el-input>
          </el-form-item>
          <!-- <el-form-item slot="col_2" label="供应商类别：" prop="customerCategory">
            <el-select class="business-input" v-model="formDataPop.customerCategory" placeholder="请选择" size="nomal" @change="changeCompanyType" clearable>
              <el-option v-for="(item,index) in customerCategorylist" :key="index" :label="item.configName" :value="item.configValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item slot="col_3" label="黑名单状态：" prop="blackListStatus">
            <el-select class="business-input" v-model="formDataPop.blackListStatus" placeholder="请选择" size="nomal" @change="changeCompanyType" clearable>
              <el-option v-for="(item,index) in blackListStatusList" :key="index" :label="item.configName" :value="item.configValue"></el-option>
            </el-select>
          </el-form-item> -->
        </row-layout>
        <!-- <row-layout :cols="1" >
          <el-form-item slot="col_1">
            <el-button type="primary" size="small" class="fa fa-search" @click="searchFn">查询</el-button>
            <el-button type="primary" size="small" class="fa" @click="resetFn">重置</el-button>
          </el-form-item>
        </row-layout> -->
      </el-form>
      <div class="buttonGroup">
        <el-button type="primary" size="small" class="fa fa-search" @click="searchFn">查询</el-button>
        <el-button type="primary" size="small" class="fa" @click="resetFn">重置</el-button>
      </div>
   </div>
</template>

<script>
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';

export default {
  name: 'searchFrom',
  components: { RowLayout },
  props: {
    formSupplierdata: {
      type: Object,
      default: () => { }
    },
    formData: {
      type: Object,
      default: () => { }
    }
  },
  data() { 
    return {
      // formData: {
      //   code: '', // 供应商编号
      //   name: '',  // 供应商名称
      //   enableState: '',  // 启用状态
      //   taxRegistrationNum: '',  //	统一社会信用代码
      //   customerCategory: '',   // 供应商类别
      //   blackListStatus: '',   // 黑名单状态
      // },
      formDataPop: this.formData,   // 处理父子组件渲染报错问题
      disableData: [
        { label: 1, name: '是' },
        { label: 0, name: '否'}
      ],
      customerCategorylist: [
        {configName:'酒店类/宾馆',configValue:'1'},
        {configName:'外部',configValue:'0'},
      ],
      blackListStatusList: [
        {configName:'黑名单',configValue:'1'},
        {configName:'白名单',configValue:'0'},
      ],
    }
  },
  watch:{
    formData:{
      handler(newValue,oldVal){
        this.formDataPop = newValue;
      },
      deep:true,
      immediate:true
    }
  },
  methods: {
    changeCompanyType() {
      this.$refs['dataForm'].clearValidate(['taxRegistrationNum', 'businessTime', 'regFound', 'legalbody', 'customerStatus'])
    },
    //查询
    searchFn() { 
      this.$emit('search',this.formDataPop)
    },
    //重置
    resetFn() { 
      this.formDataPop = {};
      this.$emit('search', this.formDataPop)
    },
    clearFormData() { 
      this.formData = {};
    },
    btnclick(){
      this.clearFormData();
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
  font-size: 12px;
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