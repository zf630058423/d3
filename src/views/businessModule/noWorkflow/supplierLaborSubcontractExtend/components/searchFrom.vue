<template>
   <div class="search-form">
      <el-form ref="dataForm" :model="formData" label-width="120px" inline class="dataForm">
        <row-layout row-layout :cols="3" cell="1-1-1">
          <el-form-item slot="col_1" label="劳务分包商编号：" prop="code">
            <el-input class="business-input" v-model="formData.code" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_2" label="分包商名称：" prop="customerName">
            <el-input class="business-input" v-model="formData.customerName" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_3" label="是否战略客户：" prop="strategiccustomerornot">
            <el-radio-group v-model="formData.strategiccustomerornot">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
              <el-radio label="">全部</el-radio>
            </el-radio-group>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3">
          <el-form-item slot="col_1" label="统一社会信用代码：" prop="taxRegistrationNum">
            <el-input class="business-input" v-model="formData.taxRegistrationNum" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_2" label="供应商性质：" prop="natureOfSupplier">
            <el-select class="business-input" v-model="formData.natureOfSupplier" placeholder="请选择" size="nomal" @change="changeCompanyType" clearable>
              <el-option v-for="(item,index) in natureofSupplier" :key="index" :label="item.configName" :value="item.configValue"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item slot="col_3">
            <el-button type="primary" size="small" class="fa fa-search" @click="searchFn">查询</el-button>
            <el-button type="primary" size="small" class="fa" @click="resetFn">重置</el-button>
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
    }
  },
  data() { 
    return {
      formData: {
        code: '', // 劳务分包商编号
        customerName: '',  // 分包商名称
        strategiccustomerornot: undefined,  // 是否战略客户
        taxRegistrationNum: '',  //	统一社会信用代码
        natureOfSupplier: '',  // 供应商性质
      },
      disableData: [
        { label: 1, name: '是' },
        { label: 0, name: '否'}
      ],
      natureofSupplier: [
        {configName:'内部',configValue:'1'},
        {configName:'外部',configValue:'0'},
      ],
    }
  },
  methods: {
    changeCompanyType() {
      this.$refs['dataForm'].clearValidate(['taxRegistrationNum', 'businessTime', 'regFound', 'legalbody', 'customerStatus'])
    },
    //查询
    searchFn() { 
      this.$emit('search',this.formData)
    },
    //重置
    resetFn() { 
      this.clearFormData();
      this.$emit('search',this.formData)
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