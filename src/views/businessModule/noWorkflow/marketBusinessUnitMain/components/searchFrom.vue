<template>
    <list-search-form @handelIsOpen="handelIsOpen" @search="searchFn" @reset="resetFn">
      <template slot="form">
        <el-form :model="formData" label-width="115px" inline ref="form">
          <row-layout :cols="3" cell="1-1-1" :marginStyle="marginStyle">
            <el-form-item slot="col_1" label="业务单元：" prop="businessUnit">
              <el-input class="business-input" v-model="formData.businessUnit" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></el-input>
            </el-form-item>
            <el-form-item slot="col_2" label="所属业务中心：" prop="affiliatedBusinessCenter">
              <el-input class="business-input" v-model="formData.affiliatedBusinessCenter" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></el-input>
            </el-form-item>
            <el-form-item slot="col_3" label="组织编码：" prop="organizationalCode">
              <el-input class="business-input" v-model="formData.organizationalCode" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></el-input>
            </el-form-item>
          </row-layout>
          <row-layout :cols="3" cell="1-1-1" :marginStyle="marginStyle">
            <el-form-item slot="col_1" label="1.0业务单元编码：" prop="businessUnitCodeOne">
              <el-input class="business-input" v-model="formData.businessUnitCodeOne" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></el-input>
            </el-form-item>
            <el-form-item slot="col_2" label="关联部门：" prop="associatedDept">
              <el-input class="business-input" v-model="formData.associatedDept" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></el-input>
            </el-form-item>
            <el-form-item slot="col_3" label="财务组织：" prop="financialOrganizations">
              <el-input class="business-input" v-model="formData.financialOrganizations" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></el-input>
            </el-form-item>
          </row-layout>
          <row-layout v-if="isOpen" :cols="3" cell="1-1-1" :marginStyle="marginStyle">
            <el-form-item slot="col_1" label="启用状态：" prop="enableState">
              <el-radio-group v-model="formData.enableState">
                <el-radio v-for="item in disableData" :key="item.label" :label="item.label">{{ item.name }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </row-layout>
        </el-form>
      </template>
    </list-search-form>
</template>

<script>
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import ListSearchForm from '@/components/basic/fromLayout/listSearchForm.vue';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';

export default {
  name: 'searchFrom',
  components: { RowLayout, ListSearchForm },
  data() { 
    return {
      marginStyle: 'margin:4px 0;',
      formData: {
        businessUnit: '', //业务单元
        affiliatedBusinessCenter: '',  //所属业务中心
        organizationalCode: '',  //组织编码
        businessUnitCodeOne: '',  //	1.0业务单元编码
        associatedDept: '',  //关闭部门
        financialOrganizations: '',  //财务组织
        enableState:'',  //启用状态
      },
      isOpen: false,
      disableData: [
        { label: 1, name: '启用' },
        { label: 0, name: '禁用'}
      ],
      msgTip: RuleRequired.tipMsg,
    }
  },
  methods: {
    handelIsOpen() { 
      this.isOpen = !this.isOpen;
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
    //新增
    addFn() {
      let queryData = {
          code:'marketBusinessUnitMain',
          path:'/marketBusinessUnitMain/businessUnitList',
          encode:'marketBusinessUnitMain',
          myId: '',
          formAction: 'add',
          title: '业务单元',
          modelName: 'base',  // business
          isInterface:true,  //为true不用自己写保存接口
          fullDev: true  //全开发页面
      }
      this.$router.push({ path: '/noWorkflowForm', query: queryData })
    },
    getFormData() { 
      return this.formData;
    },
    //导出
    exportFn() {
      this.$emit('exportExcel',this.formData)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../style/form.scss';
@import "../../../style/searchForm.scss";
.search-form{
  width: auto;
  min-width: 100%;
}

::v-deep .el-input__inner{
  height: 32px;
  line-height: 32px;
}
.el-form-item{
    margin-bottom: 0;
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