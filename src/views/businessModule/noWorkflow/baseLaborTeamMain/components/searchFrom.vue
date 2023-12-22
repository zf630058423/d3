<template>
   <div class="search-form" style="position:relative">
      <span @click="unfold">
        <i class="search-icon-hide el-icon-s-fold el-popover__reference" aria-describedby="el-popover-4200" tabindex="0"></i>
      </span>
      <el-form ref="dataForm" :model="formDataPop" label-width="110px" inline class="dataForm">
        <row-layout row-layout :cols="3" cell="1-1-1">
          <el-form-item slot="col_1" label="单据编号：" prop="code">
            <el-input class="business-input" v-model="formDataPop.code" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_2" label="班组长姓名：" prop="teamLeader">
            <el-input class="business-input" v-model="formDataPop.teamLeader" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_3" label="身份证号：" prop="idCard">
            <el-input class="business-input" v-model="formDataPop.idCard" clearable></el-input>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3">
          <el-form-item slot="col_1" prop="teamGrade" label="班组评级：">
            <el-radio-group v-model="formDataPop.teamGrade">
              <el-radio label="0">A优秀</el-radio>
              <el-radio label="1">B合格</el-radio>
              <el-radio label="2">C预警</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item slot="col_2" label="是否实名：" prop="whetherRealName">
            <el-radio-group v-model="formDataPop.whetherRealName">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
              <!-- <el-radio label="0">全部</el-radio> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item slot="col_3" label="班组工种：" prop="teamWorkType">
            <el-input class="business-input" v-model="formDataPop.teamWorkType" clearable></el-input>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3" v-if="fold">
          <el-form-item slot="col_1" prop="contactTel" label="联系电话：">
            <el-input type="number" v-model="formDataPop.contactTel" class="business-input" size="small" placeholder="请输入" :disabled="disableStatus('contactPersonTel')" maxlength="20" clearable/>
          </el-form-item>
          <el-form-item slot="col_2" prop="excelOrSimilarProject" label="擅长或类似项目：">
            <el-input class="business-input" v-model="formDataPop.excelOrSimilarProject" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_3" prop="contactPerson" label="编制人：">
            <el-input v-model="formDataPop.contactPerson" class="business-input" size="small" placeholder="请输入" :disabled="disableStatus('contactPerson')" maxlength="30" clearable/>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3" v-if="fold">
          <el-form-item slot="col_1" prop="confirmTeamGrade" label="确认班组评级：">
            <el-radio-group v-model="formDataPop.confirmTeamGrade">
              <el-radio label="0">A优秀</el-radio>
              <el-radio label="1">B合格</el-radio>
              <el-radio label="2">C预警</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item slot="col_2" prop="confirmTeamWorkType" label="确认班组工种：">
            <el-input class="business-input" v-model="formDataPop.confirmTeamWorkType" clearable></el-input>
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
  props: {
    formData: {
      type: Object,
      default: () => { }
    }
  },
  data() { 
    return {
      formDataPop: this.formData,   // 处理父子组件渲染报错问题
      fold: false,  // 是否展开
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
  computed: {
    //判断状态
    disableStatus({ type }) { 
      return (text) => {
        if (type === 'add' && !readonlyFiled[text]) {
          return false;
        } else if (type == 'edit') {
          return readonlyFiled[text] ? readonlyFiled[text] : false;
        } else if (type == 'detail') { 
          return true;
        }
      }
    },
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
      this.$emit('search',this.formDataPop)
    },
    clearFormData() { 
      this.formData = {};
    },
    btnclick(){   // 自定义按钮 删除后重置事件
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