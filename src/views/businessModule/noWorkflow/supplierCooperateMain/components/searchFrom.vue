<template>
   <div style="display: flex;position: relative;padding-right:10px" class="grid-search-form">
      <el-popover
        placement="top-start"
        trigger="hover" 
        content="显示/隐藏更多搜索条件">
        <i slot="reference" class="search-icon-hide el-icon-s-fold popover__reference"  @click="handelIsOpen"></i>
      </el-popover>
      <el-form ref="dataForm" :model="formData" label-width="120px" inline class="dataForm">
        <row-layout row-layout :cols="3" cell="1-1-1" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="单据编号：">
            <el-input class="business-input" placeholder="请输入" size="small" v-model="formData.code" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_2" label="主合同编号：">
            <el-input class="business-input" placeholder="请输入" size="small" v-model="formData.contractOutMainCode" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_3" label="主合同名称：">
            <el-input class="business-input" placeholder="请输入" size="small" v-model="formData.contractOutMainName" clearable></el-input>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="项目编号：">
            <el-input class="business-input" placeholder="请输入" size="small" v-model="formData.constructArchiveMainCode" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_2" label="项目名称：">
            <el-input class="business-input" placeholder="请输入" size="small" v-model="formData.constructArchiveMainName" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_3" label="乙方：">
            <el-input class="business-input" placeholder="请输入" size="small" v-model="formData.contractPartyBName" clearable></el-input>
          </el-form-item>
        </row-layout>
        <row-layout v-if="isOpen" :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="甲方：">
            <el-input class="business-input" placeholder="请输入" size="small" v-model="formData.contractPartyAName" clearable></el-input>
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
export default {
  name: 'searchFrom',
  components: { RowLayout },
  data() { 
    return {
      marginStyle: 'margin:0;',
      isOpen: false,
      formData: {
        code: '', // 单据编号
        contractOutMainCode: '',  // 主合同编号
        contractOutMainName: '',  // 主合同名称
        constructArchiveMainCode: '',  //	项目编号
        constructArchiveMainName: '',   // 项目名称
        contractPartyAName: '',   // 乙方
        contractPartyBName: '',   // 甲方
      },
    }
  },
  methods: {
    // 切换状态
    handelIsOpen(){
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
    btnclick(data){
      this.clearFormData();
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('../../../style/form.scss');
  .dataForm {
    flex: 1;
  }
  .expans-more {
    margin-left: 15px;
    cursor: pointer;
    font-size: 10px;
    color: #0D1126;
  }

  .el-form-item__content .el-input-group {
    vertical-align: middle;
  }

  ::v-deep .el-form-item__label{
    font-family: PingFang SC;
    font-weight: 500;
    color: #56576C;
  }

  .el-form-item{
   width: 100%;
  }

  ::v-deep .el-form-item__content{
    width: calc(100% - 156px);
    text-align: left;
  }

  ::v-deep .el-select {
    width: calc(100%);
  }

  ::v-deep .el-select>.el-input{
    height: 32px;
  }

  ::v-deep .el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner{
    width:100%;
  }
</style>