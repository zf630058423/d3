<template>
   <div style="display: flex;position: relative;padding-right:10px" class="grid-search-form">
      <el-popover
        placement="top-start"
        trigger="hover" 
        content="显示/隐藏更多搜索条件">
        <i slot="reference" class="search-icon-hide el-icon-s-fold popover__reference"  @click="handelIsOpen"></i>
      </el-popover>
      <el-form ref="dataForm" :model="formData" label-width="150px" inline class="dataForm">
        <row-layout row-layout :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="业务中心：">
            <selector-dialog :model-data="marketBusinessMainDialog" :value="formData.marketCenterName" dynamic-model="customDialog" 
              @updateValue="updateMarketBusinessMainValue($event,'marketCenterName')"></selector-dialog>
          </el-form-item>
          <el-form-item slot="col_2" label="业务单元：">
            <selector-dialog :model-data="marketBusinessMainDialog" :value="formData.marketUnitName" dynamic-model="customDialog" 
              @updateValue="updateMarketBusinessMainValue($event,'marketUnitName')"></selector-dialog>
          </el-form-item>
          <el-form-item slot="col_3" label="施工单位：">
            <el-input class="business-input" size="small" placeholder="请输入" v-model="formData.contractOutMainName" clearable></el-input>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="立项编号：">
            <el-input class="business-input" size="small" placeholder="请输入"  v-model="formData.marketCode" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_2" label="项目编号：">
            <el-input class="business-input" size="small" placeholder="请输入"  v-model="formData.constructArchiveMainCode" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_3" label="合同编号：">
            <el-input class="business-input" size="small" placeholder="请输入"  v-model="formData.contractInCode" clearable></el-input>
          </el-form-item>
        </row-layout>
        <row-layout v-if="isOpen" :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="项目负责人：">
            <el-input class="business-input" size="small" placeholder="请输入"  v-model="formData.projectManagerName" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_2" label="累计项目进度(%)：">
            <el-input class="business-input" size="small" placeholder="请输入"  v-model="formData.projectSchedule" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_3" label="施工许可证/项目开工令：">
            <el-radio-group v-model="formData.haveConstructionPermit">
              <el-radio v-for="(item,index) in haveConstructionPermitOptions" :key="index" :value="item.configName" :label="item.configName">{{ item.configName }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </row-layout>
        <row-layout v-if="isOpen" :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="客户：">
            <el-input class="business-input" size="small" placeholder="请输入"  v-model="formData.customerName" clearable></el-input>
          </el-form-item>
          <el-form-item slot="col_2" label="项目状态：">
            <el-select class="business-input" v-model="formData.projectStatus" placeholder="请选择" size="small" clearable>
              <el-option v-for="(item,index) in projectStatusOptions" :key="index" :label="item.configName" :value="item.configName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item slot="col_3" label="项目所属阶段：">
            <el-select class="business-input" v-model="formData.projectPhase" placeholder="请选择" size="small" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item,index) in projectPhaseOptions" :key="index" :label="item.configName" :value="item.configValue"></el-option>
            </el-select>
          </el-form-item>
        </row-layout>
        <row-layout v-if="isOpen" :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="企业类型：">
            <el-select class="business-input" v-model="formData.companyType" placeholder="请选择" size="small" clearable>
              <el-option v-for="(item,index) in companyTypeOptions" :key="index" :label="item.configName" :value="item.configName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item slot="col_2" label="合同金额有变更：">
            <el-select class="business-input" v-model="formData.isChange" placeholder="请选择" size="small" clearable>
              <el-option v-for="(item,index) in isChangeOptions" :key="index" :label="item.configName" :value="item.configValue"></el-option>
            </el-select>
          </el-form-item>
        </row-layout>
      </el-form>
      <div class="buttonGroup">
        <el-button type="primary" size="small" class="fa fa-search" @click="searchFn">查询</el-button>
        <el-button size="small" class="el-btn fa fa-undo" @click="resetFn">重置</el-button>
      </div>
   </div>
</template>

<script>
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
export default {
  name: 'searchFrom',
  components: { RowLayout, selectorDialog },
  data() { 
    return {
      marginStyle: 'margin:0;',
      isOpen: false,
      formData: {
        marketCenterName: '', // 业务中心
        marketUnitName: '',  // 业务单元
        contractOutMainName: '',  // 施工单位
        marketCode: '',  //	立项编号
        constructArchiveMainCode: '',   // 项目编号
        contractInCode: '',   // 合同编号
        contractPartyBName: '',   // 甲方
        projectManagerName: '',   // 项目负责人
        projectSchedule: '',   // 累计项目进度
        haveConstructionPermit: '',   // 施工许可证/项目开工令
        customerName: '',   // 客户
        projectStatus: '',   // 项目状态
        projectPhase: '',   // 项目所属阶段
        companyType: '',   // 企业类型
        isChange: '',   // 合同金额有变更
      },
      haveConstructionPermitOptions: [{
        configName: '已归档',
        configValue: '1'
      },{
        configName: '未规档',
        configValue: '2'
      }],
      projectStatusOptions: [],
      projectPhaseOptions: [],
      companyTypeOptions: [],
      isChangeOptions: [{
        configName: '全部',
        configValue: ''
      },{
        configName: '有',
        configValue: '有'
      },{
        configName: '无',
        configValue: '无'
      }],
      marketBusinessMainDialog: { code: 'YingXiaoLiXiang', customDialog: 'YingXiaoLiXiang', isSetHead: 1, parm:{isMulti:true}, initailData: [] },
    }
  },
  mounted() {
    this.getDataDictByConfigType()
  },
  methods: {
    /**
     * 营销立项字段
     */
    updateMarketBusinessMainValue(data,fieldName) {
      const marketCenterName = [];
      const marketUnitName = [];
      data.forEach(e=>{
        if(e.affiliatedBusinessCenterName) marketCenterName.push(e.affiliatedBusinessCenterName)
        if(e.businessUnit) marketUnitName.push(e.businessUnit)
      })
      
      if(fieldName == 'marketCenterName') this.formData.marketCenterName = marketCenterName.toString();
      if(fieldName == 'marketUnitName') this.formData.marketUnitName = marketUnitName.toString();
    },
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
      this.formData = {
        marketCenterName: '', // 业务中心
        marketUnitName: '',  // 业务单元
        contractOutMainName: '',  // 施工单位
        marketCode: '',  //	立项编号
        constructArchiveMainCode: '',   // 项目编号
        contractInCode: '',   // 合同编号
        contractPartyBName: '',   // 甲方
        projectManagerName: '',   // 项目负责人
        projectSchedule: '',   // 累计项目进度
        haveConstructionPermit: '',   // 施工许可证/项目开工令
        customerName: '',   // 客户
        projectStatus: '',   // 项目状态
        projectPhase: '',   // 项目所属阶段
        companyType: '',   // 企业类型
        isChange: '',   // 合同金额有变更
      };
    },
    btnclick(data){
      this.clearFormData();
    },
    /**
     * 初始化字典
     */
    async getDataDictByConfigType() {
      const res = await getDataDictByConfigType({ params: { configTypes: '企业类型,项目所属阶段(台账),项目状态' }})
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '企业类型':
              this.companyTypeOptions = ele.dataDict;
              break;
            case '项目所属阶段(台账)':
              this.projectPhaseOptions = ele.dataDict;
              break;
            case '项目状态':
              this.projectStatusOptions = ele.dataDict;
              break;
            default:
              break;
          }
        });
      }
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