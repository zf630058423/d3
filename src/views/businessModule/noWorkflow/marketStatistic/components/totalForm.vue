<template>
  <!-- 营销投标台账总表头部筛选 -->
  <div style="display: flex;position: relative;" class="grid-search-form">
    <el-popover
        placement="top-start"
        trigger="hover"
        content="显示/隐藏更多搜索条件">
        <i slot="reference" class="search-icon-hide el-icon-s-fold popover__reference"  @click="handelIsOpen"></i>
      </el-popover>
  
    <el-form :model="formData" label-width="140px" inline ref="form">
      <div v-if="isOpen" >
        <row-layout :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="产品线：" prop="productLine">
              <select-dialog :width="900" :height="360" :modelData="productLineModel" @updateValue="productLineUpdate" :value="formData.productLine" dynamicModel="customDialog"></select-dialog>
            </el-form-item>
            <el-form-item slot="col_2" label="立项类型：" prop="marketType">
              <el-select v-model="formData.marketType" clearable placeholder="请选择" size="small">
                <el-option
                  v-for="(item,index) in projectApprovalTypeList"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item slot="col_3" label="是否中标：" prop="isWinBid">
              <span>
                <el-radio v-model="formData.isWinBid" label="1">是</el-radio>
                <el-radio v-model="formData.isWinBid" label="0">否</el-radio>
              </span>
            </el-form-item>
        </row-layout>
        <row-layout :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" label="项目地址（省-市）：" prop="address">
                    <el-input  size="small" v-model="formData.address" clearable placeholder="请输入项目地址"></el-input>
                  </el-form-item>
            <el-form-item slot="col_2" label="入库类型：" prop="depositType">
                    <el-select v-model="formData.depositType" clearable placeholder="请选择" size="small">
                      <el-option
                        v-for="(item,index) in incomingTypeList"
                        :key="index"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
            <el-form-item slot="col_3" label="是否为设计施工立项：" prop="isDesignConstruct">
                    <div>
                      <el-radio v-model="formData.isDesignConstruct" label="1">是</el-radio>
                      <el-radio v-model="formData.isDesignConstruct" label="0">否</el-radio>
                    </div>
                  </el-form-item>
        </row-layout>
        <row-layout :cols="3" :marginStyle="marginStyle">
          <el-form-item slot="col_1" :label="'营销立项审  \n核通过时间：'" prop="processFinishedTime" class="fold-label">
                    <el-date-picker size="small" style="width: cac(100% - 140px)" v-model="processFinishedTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
                  </el-form-item>
                  <el-form-item slot="col_2" :label="'标前评审审批  \n通过时间：'" prop="finishedTimePreBidDate" class="fold-label">
                    <el-date-picker size="small" v-model="finishedTimePreBidDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
                  </el-form-item>
                  <el-form-item slot="col_3" :label="'投标文件评审/资格  \n预审审批通过时间：'" prop="finishedTimeBidDate" class="fold-label">
                    <el-date-picker size="small" v-model="finishedTimeBidDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
                  </el-form-item>
        </row-layout>
        <row-layout :cols="3" :marginStyle="marginStyle">
                  <el-form-item slot="col_1" :label="'开标结果审  \n批通过时间：'" prop="finishedTimeBidResultDate" class="fold-label">
                    <el-date-picker size="small" v-model="finishedTimeBidResultDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
                  </el-form-item>
                  <el-form-item slot="col_2" label="预估投标时间：" prop="estimatedBiddingDate">
                    <el-date-picker size="small" v-model="estimatedBiddingDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
                  </el-form-item>

                  <el-form-item slot="col_3" label="投标截止时间：" prop="bidDeadlineDate">
                    <el-date-picker size="small" v-model="bidDeadlineDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
                  </el-form-item>
        </row-layout>
      </div>
      <row-layout :cols="3" :marginStyle="marginStyle">
        <el-form-item slot="col_1" label="业务单元：" prop="marketUnit">
                  <el-input  size="small" v-model="formData.marketUnit" clearable placeholder="请输入业务单元"></el-input>
                </el-form-item>
        <el-form-item slot="col_2" label="业务中心：" prop="marketCenter">
                  <el-input  size="small" v-model="formData.marketCenter" clearable placeholder="请输入业务中心"></el-input>
                </el-form-item>
        <el-form-item slot="col_3" label="项目介绍人：" prop="projectLeader">
                  <el-input  size="small" v-model="formData.projectLeader" clearable placeholder="请输入项目介绍人"></el-input>
                </el-form-item>
      </row-layout>
      <row-layout :cols="3" :marginStyle="marginStyle">
        <el-form-item slot="col_1" label="跟进人：" prop="follower">
                  <el-input  size="small" v-model="formData.follower" clearable placeholder="请输入跟进人"></el-input>
                </el-form-item>
                <el-form-item slot="col_2" label="招投标形式：" prop="bidForm">
                  <el-select v-model="formData.bidForm" clearable placeholder="请选择" size="small">
                    <el-option
                      v-for="item in attractFormTenderList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item slot="col_3">
                  <el-button type="primary" size="small" class="fa fa-search" @click="searchFn">查询</el-button>
                  <el-button size="small" icon="el-icon-refresh-left" class="fa" @click="resetFn">重置</el-button>
                </el-form-item>
      </row-layout>
    </el-form>
  </div>
</template>
<script>
import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import { getProductlineList } from '@/Api/marketBid.js';
import { ATTRACT_TENDER_LIST, CLOSE_STATE_LIST, APPROVAL_TYPE, INCOMING_TYPE, PRODUCTLINE_MODEL } from '../../../enum/param';

export default {
  components: {SelectDialog, RowLayout},
  data() { 
    return {
      marginStyle:'margin:0;',
      productLineModel:PRODUCTLINE_MODEL,  //产品线弹框
      formData: {
        marketUnit: '',  //业务单元
        marketCenter: '',  //业务中心
        projectLeader: '',  //项目介绍人
        follower: '',  //跟进人
        bidForm: '',  //招投标形式
        // offState: '',  //关闭状态
        productLine: '',  //产品线
        marketType: '',  //立项类型
        isWinBid: '', //是否中标
        address: '',  //项目地址
        depositType: '',  //入库类型
        isDesignConstruct: '',  //是否为设计施工立项
        marketFinishTime: '', //营销立项审核通过时间
        preBidFinishTime: '',  //标前评审流程审批 时间
        bidFinishTime: '',  // 投标文件评审/资格预审文件评审流程审批通过时间
        bidResultFinishTime: '',  //开标结果流程审批通过时间
        estimatBidDate:'', //预估投标时间
        bidDeadline:'', //投标截止时间
      },
      attractFormTenderList:ATTRACT_TENDER_LIST,  //招投标形式
      inactiveStateList: CLOSE_STATE_LIST,   //关闭状态
      productLineList: [],  ////产品线
      projectApprovalTypeList: APPROVAL_TYPE, //立项类型
      incomingTypeList:INCOMING_TYPE,  //入库类型
      isOpen: false,
      processFinishedTime: [],  //审核通过时间
      estimatedBiddingDate: [],  //预估投标时间
      bidDeadlineDate: [],  //投标截止时间
      finishedTimePreBidDate: [],  //标前评审审批通过时间
      finishedTimeBidDate: [],  //投标文件评审/资格预审审批通过时间
      finishedTimeBidResultDate: [],  //开标结果审批通过时间
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
    //产品线查找
    async getProductlineData() { 
      let dataParam = {
        productline:''
      }
      let { data } = await getProductlineList(dataParam);
      this.productLineList = data;
    },
    // 切换状态
    handelIsOpen(){
      this.isOpen = !this.isOpen;
      // this.$emit("open-form",this.isOpen)
    },
    productLineUpdate(data) {
      this.formData.productLine = data[0].name;
    },
    getMomentDate(arr) {
      return (arr && arr.length > 0) ? `${arr[0]},${arr[1]}` : '';
    },
    searchFn() {
      //营销立项审核通过时间
      this.formData.marketFinishTime = this.getMomentDate(this.processFinishedTime);
      //标前评审审核通过时间
      this.formData.preBidFinishTime = this.getMomentDate(this.finishedTimePreBidDate);
      //投标文件评审/资格预审文件评审流程审批通过时间
      this.formData.bidFinishTime = this.getMomentDate(this.finishedTimeBidDate);
      //开标结果审批通过时间
      this.formData.bidResultFinishTime = this.getMomentDate(this.finishedTimeBidResultDate);
      //预估投标时间
      this.formData.estimatBidDate = this.getMomentDate(this.estimatedBiddingDate);
      //投标截止时间
      this.formData.bidDeadline = this.getMomentDate(this.bidDeadline);
      this.$emit('search',this.formData)
    },
    resetFn() {
      this.formData = {};
      this.processFinishedTime = [];  //审核通过时间
      this.estimatedBiddingDate =[];  //预估投标时间
      this.bidDeadlineDate = [];  //投标截止时间
      this.finishedTimePreBidDate = []; //标前评审流程审时间
      this.finishedTimeBidDate = [];  //投标文件评审/资格预审文件评审流程审批通过时间
      this.finishedTimeBidResultDate = [];  //开标结果审批通过时间
      this.$emit('search',this.formData)
    },
    paramsData() { 
      return this.formData;
    },
    exportFn() { 
      this.$emit('exportExcel',this.formData)
    },
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

  .el-form-item{
   width: 100%;
  }

  .el-form-item__content .el-input-group {
    vertical-align: middle;
  }

  ::v-deep .el-form-item__label{
    font-family: PingFang SC;
    font-weight: 500;
    color: #56576C;
  }

  ::v-deep .el-form-item__content{
    width: calc(100% - 145px);
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