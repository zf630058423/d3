<template>
   <div class="search-form" style="position:relative">
      <span @click="unfold">
        <i class="search-icon-hide el-icon-s-fold el-popover__reference" aria-describedby="el-popover-4200" tabindex="0"></i>
      </span>
      <el-form ref="searchForm" :model="formDataPop" label-width="216px" inline>
        <row-layout :cols="3">
          <el-form-item slot="col_1" prop="constructCode" label="项目编号：">
            <!-- <select-dialog :width="900" :height="360" :modelData="projectModel" :value="formDataPop.constructCode" @updateValue="projectUpdate" dynamicModel="customDialog"></select-dialog> -->
            <el-input v-model="formDataPop.constructCode" class="business-input" size="small" placeholder="请输入" clearable/>
          </el-form-item>
          <el-form-item slot="col_2" prop="constructName" label="项目名称：">
            <el-input v-model="formDataPop.constructName" class="business-input" size="small" placeholder="请输入" clearable/>
          </el-form-item>
          <el-form-item slot="col_3" prop="totalConfirmImageProgress" label="累计申报施工产值形象(%)：">
            <el-input v-model="formDataPop.totalConfirmLow" size="small" placeholder="请输入" class="advanceFund" @input="numInput('totalConfirmLow')" clearable/><span class="separator">——</span>
            <el-input v-model="formDataPop.totalConfirmHigh" size="small" placeholder="请输入" class="advanceFund" @input="numInput('totalConfirmHigh')" clearable/>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3">
          <el-form-item slot="col_1" prop="constructionUnitName" label="管理部门：">
            <el-input v-model="formDataPop.constructionUnitName" class="business-input" size="small" placeholder="请输入" clearable/>
          </el-form-item>
          <el-form-item slot="col_2" prop="contractInEndDate" label="合同竣工日期：" clearable>
            <el-date-picker
              v-model="formDataPop.contractInEndDate"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              size="small"
              class="business-input"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item slot="col_3" prop="totalReportImageProgress" label="累计确认产值形象进度(%)：">
            <el-input v-model="formDataPop.totalReportLow" size="small" placeholder="请输入" class="advanceFund" @input="numInput('totalReportLow')" clearable/><span class="separator">——</span>
            <el-input v-model="formDataPop.totalReportHigh" size="small" placeholder="请输入" class="advanceFund" @input="numInput('totalReportHigh')" clearable/>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3" v-if="fold">
          <el-form-item slot="col_1" prop="projectManagerName" label="项目负责人：">
            <el-input v-model="formDataPop.projectManagerName" class="business-input" size="small" placeholder="请输入" clearable/>
          </el-form-item>
          <el-form-item slot="col_2" prop="projectStatus" label="项目状态：">
            <el-select v-model="formDataPop.projectStatus" class="business-input" size="small" placeholder="请选择" clearable>
              <el-option v-for="(item,index) in projectStatusList" :key="index" :label="item.configName" :value="item.configValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item slot="col_3" prop="" label="">
          </el-form-item>
        </row-layout>
        <!-- <row-layout :cols="1" >
          <el-form-item slot="col_1">
            <el-button type="primary" size="small" class="fa fa-search" @click="searchFn">查询</el-button>
            <el-button type="primary" size="small" class="fa" @click="resetFn">重置</el-button>
          </el-form-item>
        </row-layout> -->
      </el-form>
   </div>
</template>

<script>
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
import { XiangMuBianHao_MODEL } from '@/views/businessModule/enum/param';
import service from "@/utils/services";
export default {
  name: 'searchFrom',
  components: { RowLayout, SelectDialog },
  props: {
    type: {
      type: String,
      default: ""
    },
    formData: {
      type: Object,
      default: () => { }
    }
  },
  data() { 
    return {
      projectModel: XiangMuBianHao_MODEL,  // 项目编号 弹窗
      formDataPop: this.formData,   // 处理父子组件渲染报错问题
      fold: false,  // 是否展开
      totalConfirmLow: '',    // 累计申报施工产值形象(%) - 最低
      totalConfirmHigh: '',   // 累计申报施工产值形象(%) - 最高
      totalReportLow: '',    // 甲方/监理累计申报施工产值形象(%) - 最低
      totalReportHigh: '',   // 甲方/监理累计申报施工产值形象(%) - 最高
      periodOfValidityStart: '',
      periodofvalidityend: '',
      projectStatusList: [
        {configName:'未开工',configValue:'1'},
        {configName:'在建中',configValue:'2'},
        {configName:'停工中',configValue:'3'},
        {configName:'施工终止',configValue:'4'},
        {configName:'合格',configValue:'5'},
        {configName:'已完工',configValue:'6'},
        {configName:'已竣工',configValue:'7'},
        {configName:'已审定',configValue:'8'},
        {configName:'已关闭',configValue:'9'}
      ],
    }
  },
  watch:{
    formData:{
      handler(newValue){
        this.formDataPop = newValue;
      },
      deep:true,
      immediate:true
    },
  },
  methods: {
    // 项目编号
    projectUpdate(data){ 
      console.log(data,'项目编号');
      this.formData.constructCode = data[0].code;
      this.formData.constructName = data[0].name; // contractInEndDate
      // this.formData.constructId = data[0].id;
      this.formData.constructionUnitName = data[0].deptId;
      this.formData.projectManagerName = data[0].projectManagerName;
      // this.formData.projectStatus = this.getStatus(data[0].projectStatusId);
      this.formData.contractInEndDate = data[0].contractInEndDate;
    },
    // 转换状态
    getStatus(status) {
      switch (status) {
        case '1':
          return '未开工'
          break
        case '2':
          return '在建中'
          break
        case '3':
          return '停工中'
          break
        case '4':
          return '施工终止'
          break
        case '5':
          return '合格'
          break
        case '6':
          return '已完工'
          break
        case '7':
          return '已竣工'
          break
        case '8':
          return '已审定'
          break
        case '9':
          return '已关闭'
          break
      }
      return ''
    },
    // 展开 折叠
    unfold(){
      this.fold = !this.fold;
    },
    //  垫资能力-最低值
    numInput(field) {
      if (!this.formDataPop[field]) {
        this.formDataPop[field] = '';
        return
      }
      this.formDataPop[field] = this.formDataPop[field].replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/,'$1').replace(/[-|+]/g, ''); // 只能输入保留2位小数的正数
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
.search-form{
  width: auto;
  min-width: 100%;
  .search-icon-hide.el-icon-s-fold {
    padding: 3px;
    position: absolute;
    left: 0px;
    top: -16px;
    font-size: 20px;
    color: #006eff;
    border-radius: 20%;
    cursor: pointer;
    z-index: 1000;
    width: 20px;
    height: 21px;
  }
}
::v-deep .el-form-item__content{
  width: 250px;
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
}
.el-form-item__content .el-input-group {
  vertical-align: middle;
}
::v-deep .el-form-item__label{
  font-family: PingFang SC;
  font-weight: 500;
  color: #56576C;
}
.el-input.advanceFund{
  width: calc(50% - 18px);
}
.separator{
  display: inline-block;
  width: 36px;
  text-align: center;
  padding: 0 2px;
}
</style>