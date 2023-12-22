<template>
   <div style="display: flex;position: relative;padding-right:10px" class="grid-search-form">
      <el-form ref="dataForm" :model="formData" label-width="120px" inline class="dataForm">
        <row-layout row-layout :cols="3" cell="1-1-1" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="项目编号：">
            <el-input class="business-input" placeholder="请输入" v-model="formData.constructArchiveMainCode" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_2" label="项目名称：">
            <el-input class="business-input" placeholder="请输入" v-model="formData.constructArchiveMainName" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_3" label="管理部门：">
            <el-input class="business-input" placeholder="请输入" v-model="formData.constructionUnitName" clearable></el-input>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="项目负责人：">
            <el-input class="business-input" placeholder="请输入"  v-model="formData.projectManagerName" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_2" label="最近上传人：">
            <el-input class="business-input" placeholder="请输入"  v-model="formData.createUserName" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_3" label="最近上传日期：">
            <el-input class="business-input" placeholder="请输入"  v-model="formData.createTime" clearable></el-input>
          </el-form-item>
        </row-layout>
      </el-form>
      <div class="buttonGroup">
        <el-button type="primary" size="small" class="fa fa-search" @click="searchFn">查询</el-button>
        <el-button size="small" @click="resetFn" class="fa fa-undo">重置</el-button>
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
        constructArchiveMainCode: '', // 项目编号
        constructArchiveMainName: '',  // 项目名称
        constructionUnitName: '',  // 管理部门
        projectManagerName: '',  //	项项目负责人
        createUserName: '',   // 最近上传人
        createTime: '',   // 最近上传日期
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