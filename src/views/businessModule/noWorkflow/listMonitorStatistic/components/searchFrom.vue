<template>
   <div class="search-form" style="position:relative">
      <span @click="unfold">
        <i class="search-icon-hide el-icon-s-fold el-popover__reference" aria-describedby="el-popover-4200" tabindex="0"></i>
      </span>
      <el-form ref="dataForm" :model="formDataPop" label-width="100px" inline>
        <row-layout row-layout :cols="3" cell="1-1-1">
          <el-form-item slot="col_1" label="年份：" prop="currentPeriodYear" :rules="[{ required: true, message: '请选择年份', trigger: 'blur' }]">
            <el-date-picker
              v-model="formDataPop.currentPeriodYear"
              style="width: 250px"
              type="year"
              value-format="yyyy"
              size="small"
              placeholder="选择年份">
            </el-date-picker>
          </el-form-item>
          <el-form-item slot="col_2" prop="constructCode" label="项目编号：">
            <!-- <select-dialog :disabled="true" :isLinkBtn="false" :width="900" :height="360" :modelData="projectModel" :value="formDataPop.constructCode" @updateValue="projectUpdate" dynamicModel="customDialog"></select-dialog> -->
            <el-input v-model="formDataPop.constructCode" class="business-input" size="small" placeholder="请输入" clearable/>
          </el-form-item>
          <el-form-item slot="col_3" prop="constructName" label="项目名称：">
            <el-input v-model="formDataPop.constructName" class="business-input" size="small" placeholder="请输入" clearable/>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3" cell="1-1-1">
          <el-form-item slot="col_1" prop="constructionUnitName" label="管理部门：">
            <el-input v-model="formDataPop.constructionUnitName" class="business-input" size="small" placeholder="请输入" clearable/>
          </el-form-item>
          <el-form-item slot="col_2" prop="projectStatus" label="项目状态：">
            <el-select v-model="formDataPop.projectStatus" class="business-input" size="small" placeholder="请选择" clearable>
              <el-option v-for="(item,index) in projectStatusList" :key="index" :label="item.configName" :value="item.configValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item slot="col_3" prop="currentPeriodMonth" label="未报产值月份：">
            <el-date-picker v-model="formDataPop.currentPeriodMonth"
              type="monthrange"
              format="MM"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              align="right"
              size="small"
              placeholder="选择月份"
              popper-class="w-month-range"
              class="business-input"
              clearable
            >
            </el-date-picker>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3" cell="1-1-1" v-if="fold">
          <el-form-item slot="col_1" prop="projectManagerName" label="项目负责人：">
            <el-input v-model="formDataPop.projectManagerName" class="business-input" size="small" placeholder="请输入" clearable/>
          </el-form-item>
          <el-form-item slot="col_2" label="查询内容：" prop="monitorType">
            <el-select class="business-input" v-model="formDataPop.monitorType" placeholder="请选择" size="nomal" clearable>
              <el-option v-for="(item,index) in monitorTypelist" :key="index" :label="item.configName" :value="item.configValue"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item slot="col_3" prop="" label="">
          </el-form-item> -->
        </row-layout>
      </el-form>
   </div>
</template>

<script>
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
import { XiangMuBianHao_MODEL } from '@/views/businessModule/enum/param';
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
      periodOfValidityStart: '',
      periodofvalidityend: '',
      monitorTypelist: [
        {configName:'上报产值',configValue:'1'},  // monitorType
        {configName:'累计确认产值',configValue:'2'},
      ],
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
    // 'formDataPop.currentPeriodMonth':{
    //   handler(newValue){
    //     if(newValue){
    //       this.formDataPop.periodMonthStart = newValue[0];
    //       this.formDataPop.periodMonthend = newValue[1];
    //     }
    //   },
    //   deep:true,
    //   immediate:true
    // },
  },
  methods: {
    // 项目编号
    projectUpdate(data){ 
      this.$emit('projectUpdate', data)
    },
    // 展开 折叠
    unfold(){
      this.fold = !this.fold;
    },
    //  垫资能力-最低值
    numInput(field) {
      if (!this[field]) {
        this[field] = '';
        return
      }
      this[field] = this[field].replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/,'$1').replace(/[-|+]/g, ''); // 只能输入保留2位小数的正数
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
  width: 45%;
}
</style>

<style lang="scss"> 
// 未报产值月份 日期控件-隐藏年份
.w-month-range {
  .el-picker-panel__body {
    .el-date-range-picker__header {
      display: none !important;
    }
  }
}
</style>