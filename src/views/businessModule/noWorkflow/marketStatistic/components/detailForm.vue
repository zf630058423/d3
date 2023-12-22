<template>
  <div style="display: flex;position: relative;" class="grid-search-form">
    <el-popover
        placement="top-start"
        trigger="hover"
        content="显示/隐藏更多搜索条件">
        <i slot="reference" class="search-icon-hide el-icon-s-fold popover__reference"  @click="handelIsOpen"></i>
      </el-popover>
    <el-form :model="formData" label-width="154px" inline ref="form">
      <div v-if="isOpen">
        <row-layout :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="项目编号：" prop="projectNo" class="default-label">
            <el-input size="small" v-model="formData.projectNo" clearable placeholder="请输入项目编号"></el-input>
        </el-form-item>
        <el-form-item slot="col_2" label="业务单元：" prop="marketUnit" class="default-label">
            <el-input size="small" v-model="formData.marketUnit" clearable placeholder="请输入业务单元"></el-input>
        </el-form-item>
        <el-form-item slot="col_3" label="跟进人：" prop="follower" class="default-label">
            <el-input size="small" v-model="formData.follower" clearable placeholder="请输入跟进人"></el-input>
        </el-form-item>
        </row-layout>
        <row-layout :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="客户：" prop="customer" class="default-label">
              <el-input size="small" v-model="formData.customer" clearable placeholder="请输入客户"></el-input>
          </el-form-item>
          <el-form-item slot="col_2" label="项目负责人：" prop="projectLeader" class="default-label">
              <el-input  size="small" v-model="formData.projectLeader" clearable placeholder="项目负责人"></el-input>
          </el-form-item>
          <el-form-item slot="col_3" label="立项类型：" prop="marketType" class="default-label">
            <el-select v-model="formData.marketType" clearable placeholder="请选择" size="small">
              <el-option
                v-for="(item,index) in projectApprovalTypeList"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="是否预选承包商入库：" prop="isContractor" class="default-label">
                  <div>
                    <el-radio v-model="formData.isContractor" label="1">是</el-radio>
                    <el-radio v-model="formData.isContractor" label="0">否</el-radio>
                  </div>
                </el-form-item>
                <el-form-item slot="col_2" label="产品线：" prop="productLine" class="default-label">
                  <select-dialog :width="900" :height="360" :modelData="productLineModel" @updateValue="productLineUpdate" :value="formData.productLine" dynamicModel="customDialog"></select-dialog>
                </el-form-item>
                <el-form-item slot="col_3" label="招投标形式：" prop="bidForm" class="default-label">
                  <el-select v-model="formData.bidForm" clearable placeholder="请选择" size="small">
                    <el-option
                      v-for="item in attractFormTenderList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
        </row-layout>
        <row-layout :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="项目地址（省-市）：" prop="address" class="default-label">
                  <el-input  size="small" v-model="formData.address" clearable placeholder="请输入项目地址"></el-input>
                </el-form-item>
                <el-form-item slot="col_2" label="项目当前状态：" prop="marketStatus" class="default-label">
                  <el-select v-model="formData.marketStatus" clearable placeholder="请选择" size="small">
                    <el-option
                      v-for="item in projectCurrentStatusList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item slot="col_3" label="关闭状态：" prop="closeState" class="default-label">
                  <el-select v-model="formData.closeState" clearable placeholder="请选择" size="small">
                    <el-option
                      v-for="item in inactiveStateList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
        </row-layout>
        <row-layout :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="关闭原因：" prop="closeReason" class="default-label">
                  <el-select v-model="formData.closeReason" clearable placeholder="请选择" size="small">
                    <el-option
                      v-for="item in closeReaseList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item slot="col_2" label="未中标原因：" prop="loseBidReason" class="default-label">
                  <el-select v-model="formData.loseBidReason" clearable placeholder="请选择" size="small">
                    <el-option
                      v-for="item in closeReaseList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item slot="col_3" label="是否后补流程：" prop="isAfterProcess" class="default-label">
                  <div>
                    <el-radio v-model="formData.isAfterProcess" label="1">是</el-radio>
                    <el-radio v-model="formData.isAfterProcess" label="0">否</el-radio>
                  </div>
                </el-form-item> 
        </row-layout>
        <row-layout :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="当前流程：" prop="currentNode" class="default-label">
                  <el-select v-model="formData.currentNode" clearable placeholder="请选择" size="small">
                    <el-option
                      v-for="item in currentProcessList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item slot="col_2" label="标前评审结果：" prop="preBidReview" class="default-label">
                  <div>
                    <el-radio v-model="formData.preBidReview" label="1">同意投标</el-radio>
                    <el-radio v-model="formData.preBidReview" label="0">不同意投标</el-radio>
                  </div>
                </el-form-item> 
                <el-form-item slot="col_3" label="资格预审文件审批结果：" prop="bidQualificationReview" class="default-label">
                  <div>
                    <el-radio v-model="formData.bidQualificationReview" label="1">同意</el-radio>
                    <el-radio v-model="formData.bidQualificationReview" label="0">不同意</el-radio>
                  </div>
                </el-form-item> 
        </row-layout>
        <row-layout :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="投标文件评审结果：" prop="bidDocumentReview" class="default-label">
                  <div>
                    <el-radio v-model="formData.bidDocumentReview" label="1">同意</el-radio>
                    <el-radio v-model="formData.bidDocumentReview" label="0">不同意</el-radio>
                  </div>
                </el-form-item>
                <el-form-item slot="col_2" label="是否中标：" prop="isWinBid" class="default-label">
                  <div>
                    <el-radio v-model="formData.isWinBid" label="1">是</el-radio>
                    <el-radio v-model="formData.isWinBid" label="0">否</el-radio>
                  </div>
                </el-form-item>
                <el-form-item slot="col_3"></el-form-item>
        </row-layout>
        <row-layout :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="投标截止时间：" prop="bidDeadline" class="default-label">
                  <el-date-picker size="small" v-model="bidDeadlineDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
                </el-form-item>
                <el-form-item slot="col_2" label="关闭时间：" prop="closeTime" class="default-label">
                  <el-date-picker size="small" v-model="cloaseDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
                </el-form-item>
                <el-form-item slot="col_3" :label="'营销立项/预选承包商  \n入库审批通过时间：'" prop="marketFinishTime" class="fold-label">
                  <el-date-picker size="small" v-model="processFinishedTimeItemDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
                </el-form-item>
        </row-layout>
        <row-layout :cols="3" :marginStyle="marginStyle">
                <el-form-item slot="col_1" label="标前评审审批通过时间：" prop="preBidFinishTime" class="default-label">
                  <el-date-picker size="small" v-model="processFinishedTimePreBidDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
                </el-form-item>
                <el-form-item slot="col_2" :label="'投标文件评审/资格预审  \n文件审批通过时间：'" prop="bidFinishTime" class="fold-label">
                  <el-date-picker size="small" v-model="processFinishedTimeBidDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
                </el-form-item>
                <el-form-item slot="col_3" label="开标结果审批通过时间：" prop="bidResultFinishTime" class="default-label">
                  <el-date-picker size="small" v-model="processFinishedTimeBidResultDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" :picker-options="pickerOptions" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
                </el-form-item> 
        </row-layout>
      </div>
      <row-layout :cols="3" :marginStyle="marginStyle">
        <el-form-item slot="col_1" label="立项编号：" prop="marketCode" class="default-label">
                  <el-input size="small" v-model="formData.marketCode" clearable placeholder="请输入立项编号"></el-input>
                </el-form-item>
                <el-form-item slot="col_2" label="合同编号：" prop="contractCode" class="default-label">
                  <el-input size="small" v-model="formData.contractCode" clearable placeholder="请输入合同编号"></el-input>
                </el-form-item>
                <el-form-item slot="col_3" label="项目名称：" prop="marketName" class="default-label">
                  <el-input size="small" v-model="formData.marketName" clearable placeholder="请输入项目名称"></el-input>
                </el-form-item>
      </row-layout>
      <row-layout :cols="3" :marginStyle="marginStyle">
        <el-form-item slot="col_1" label="业务中心：" prop="marketCenter" class="default-label">
                  <el-input size="small" v-model="formData.marketCenter" clearable placeholder="请输入业务中心"></el-input>
                </el-form-item>
                <el-form-item slot="col_2" label="">
                  <el-button type="primary" size="small" class="fa fa-search" @click="searchFn">查询</el-button>
                  <el-button size="small" icon="el-icon-refresh-left" class="fa" @click="resetFn">重置</el-button>
                  <!-- <el-button type="primary" size="small" class="fa" @click="exportFn">导出</el-button> -->
                  <!-- <span v-if="!isOpen" class="expans-more" @click="handelIsOpen">展开 <i class="icon icon-arrow-down-bold"></i></span>
                  <span v-else class="expans-more" @click="handelIsOpen">收起 <i class="icon icon-arrow-up-bold"></i></span> -->
                </el-form-item>
                <el-form-item slot="col_3"></el-form-item>
      </row-layout>
    </el-form>
  </div>
</template>
<script>
import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import { getProductlineList } from '@/Api/marketBid.js';
import { getCurrentDateTime } from '../detailColumn';
import { ATTRACT_TENDER_LIST, CLOSE_STATE_LIST, CLOSE_REASE_LIST, PROJECT_STATUS_LIST, PROCESS_LIST, APPROVAL_TYPE, INCOMING_TYPE,PRODUCTLINE_MODEL } from '../../../enum/param';

export default {
  components:{ SelectDialog, RowLayout },
  data() { 
    return {
      marginStyle: 'margin:0;',
      productLineModel:PRODUCTLINE_MODEL,  //产品线弹框
      formData: {
        marketCode: '',  //立项编号
        constructCode: '',  //项目编号
        contractCode:'',  //合同编号
        marketName: '',  //项目名称
        marketCenter: '',  //业务中心
        marketUnit: '',  //业务单元
        projectLeader: '',  //项目负责人
        customer:'',   //客户
        marketType: '',  //立项类型
        isContractor: '',  //是否预选承包商入库
        productLine: '', //产品线
        bidForm: '',  //招投标形式
        address: '',  //项目地址
        marketStatus: '',  //项目当前状态
        // districtScope: '',  //入库片区范围
        closeState: '',  //关闭状态
        closeReason: '',  //关闭原因
        loseBidReason: '',  //未中标原因
        isAfterProcess: '',  //是否后补流程
        follower: '',  //跟进人
        currentNode: '',  //当前流程
        preBidReview: '',  //标前评审结果
        bidQualificationReview: '', //资格预审文件审批结果
        bidDocumentReview: '',  //投标文件评审结果
        isWinBid: '',  //是否中标
        bidDeadline:'', //投标截止时间 
        closeTime: '',  //关闭时间
        marketFinishTime: '',  //营销立项/预选承包商入库审批通过时间
        preBidFinishTime: '',  //标前评审审批通过时间 
        bidFinishTime: '', //投标文件评审/资格预审文件审批通过时间
        bidResultFinishTime: '',  //开标结果审批通过时间
      },
      attractFormTenderList: ATTRACT_TENDER_LIST,  //招投标形式
      inactiveStateList: CLOSE_STATE_LIST,  //关闭状态
      closeReaseList: CLOSE_REASE_LIST,  //关闭原因,
      projectCurrentStatusList: PROJECT_STATUS_LIST,  //项目当前状态
      currentProcessList:PROCESS_LIST,   //当前流程
      productLineList: [],  //产品线
      projectApprovalTypeList: APPROVAL_TYPE,//立项类型
      incomingTypeList:INCOMING_TYPE,  //入库类型
      isOpen: false,
      bidDeadlineDate: [],  //投标截止时间
      cloaseDate: [],  //关闭时间
      processFinishedTimeItemDate: [],  //营销立项/预选承包商入库审批通过时间
      processFinishedTimePreBidDate: [],   //标前评审 审批通过时间
      processFinishedTimeBidDate: [],   //投标文件评审/资格预审文件审批通过时间
      processFinishedTimeBidResultDate: [],  //开标结果审批通过时间
      pickerOptions: {
        disabledDate(time) { 
          return time.getTime() < new Date('2021-12-31').getTime()
        }
      }
    }
  },
  created() { 
    // this.getProductlineData();
  },
  methods: {
    productLineUpdate(data) {
      this.formData.productLine = data[0].name;
     },
    //产品线查找
    async getProductlineData() { 
      const dataParam = { productline: '' };
      let { data } = await getProductlineList(dataParam);
      this.productLineList = data;
    },
    // 切换状态
    handelIsOpen(){
      this.isOpen = !this.isOpen;
    },
    searchFn() {
      let { bidDeadlineDate, cloaseDate, processFinishedTimeItemDate, processFinishedTimePreBidDate, processFinishedTimeBidDate, processFinishedTimeBidResultDate} = this;
      let dataParams = {
        ...this.formData,
        closeTime: getCurrentDateTime(cloaseDate), //关闭时间
        marketFinishTime:getCurrentDateTime(processFinishedTimeItemDate),  //营销立项/预选承包商入库审批通过时间
        preBidFinishTime: getCurrentDateTime(processFinishedTimePreBidDate), //标前评审审批通过时间 
        bidFinishTime: getCurrentDateTime(processFinishedTimeBidDate),  //投标文件评审/资格预审文件审批通过时间
        bidResultFinishTime:getCurrentDateTime(processFinishedTimeBidResultDate),  //开标结果审批通过时间
        bidDeadlineEndDate: getCurrentDateTime(bidDeadlineDate),//投标截止时间 - 结束
      }
      this.$emit('search',dataParams)
    },
    exportFn() { 
      this.$emit('exportExcel',this.formData)
    },
    paramsData() { 
      return this.formData;
    },
    resetFn() { 
      this.formData = {};
      this.bidDeadlineDate = [];
      this.cloaseDate = [];
      this.processFinishedTimeItemDate = [];
      this.processFinishedTimePreBidDate = [];
      this.processFinishedTimeBidDate = [];
      this.processFinishedTimeBidResultDate = [];
      this.$emit('search', this.formData)
    }
  }
}
</script>
<style scoped lang="scss">
@import url('../../../style/form.scss');

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