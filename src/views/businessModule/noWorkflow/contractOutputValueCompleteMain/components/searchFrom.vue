<template>
   <div class="search-form">
      <el-form ref="dataForm" :model="formDataPop" label-width="120px" inline>
        <!-- <row-layout row-layout :cols="3" cell="1-1-1">
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
          </el-radio-group>
          </el-form-item>
        </row-layout> -->
        <row-layout :cols="3">
          <el-form-item slot="col_1" prop="currentPeriod" label="所属月份：">
            <el-date-picker v-model="formDataPop.currentPeriod" value-format="yyyy-MM" type="month" placeholder="选择月份"></el-date-picker>
          </el-form-item>
          <el-form-item slot="col_2" prop="constructUnitName" label="管理部门：">
            <el-input v-model="formDataPop.constructUnitName" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_3" label="" prop="">
          </el-form-item>
        </row-layout>
      </el-form>
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
      this.clearFormData();
      this.$emit('search',this.formDataPop)
    },
    clearFormData() { 
      this.formData = {};
    }
  }
}
</script>

<style lang="scss" scoped>
// @import url('../../../style/form.scss');
.search-form{
  width: auto;
  min-width: 100%;
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