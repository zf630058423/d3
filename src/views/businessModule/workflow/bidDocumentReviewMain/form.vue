<template>
  <!-- 投标文件评审 -->
  <div v-loading="loading" class="flow-form">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" :disabled="setting.readonly" label-width="155px">
      <row-layout title="基本信息" :cols="3">
        <el-form-item slot="col_1" label="单据编号：">
          <el-input v-model="dataForm.code" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" prop="marketMainCode" label="立项编号：">
          <select-dialog :disabled="true" :btnDisabled="setting.readonly" :modelData="marketModel" :width="900"
                         :height="360" @updateValue="marketUpdate"
                         :value="dataForm.marketMainCode || msgTip.SELECT_PLACEHOLDER"
                         dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="marketUnitName" label="业务单元：">
          <el-input v-model="dataForm.marketUnitName" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER"/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="客户：">
          <el-link type="primary" :underline="true" v-if="dataForm.customerMainName" style="line-height: 16px" @click="handelCustomerMainNameLink">{{dataForm.customerMainName}}</el-link>
          <span class="font13" v-else>{{msgTip.AUTO_PLACEHOLDER}}</span>
          <span v-if="getCustomerAndProjectLeaderInfo.isForewarningCustomer">
             <el-popover placement="top-start" title="提示" width="400" trigger="hover"
               :content="msgInfo+' '+setResonVal(getCustomerAndProjectLeaderInfo.customerForewarningReason)">
               <span slot="reference" class="el-icon-warning" style="color: #ed4014;font-size: 20px;padding-left:10px"></span>
            </el-popover>
          </span>
        </el-form-item>
        <el-form-item slot="col_2" prop="marketMainName" label="立项名称：">
          <el-input v-model="dataForm.marketMainName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
        </el-form-item>
        <el-form-item slot="col_3" label="业务中心：">
          <el-input v-model="dataForm.marketCenterName" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER"/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="跟进人：">
          <el-input v-model="dataForm.follower" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER"/>
        </el-form-item>
        <el-form-item slot="col_2" label="项目介绍人：">
          <span class="font13">{{dataForm.projectLeader || msgTip.AUTO_PLACEHOLDER}}</span>
          <span v-if="getCustomerAndProjectLeaderInfo.isForewarningProjectLeader">
            <el-popover placement="top-start" title="提示" width="400" trigger="hover"
                        :content="msgInfo2+' '+setResonVal(getCustomerAndProjectLeaderInfo.projectLeaderForewarningReason)">
               <span slot="reference" class="el-icon-warning" style="color: #ed4014;font-size: 20px;padding-left:10px"></span>
            </el-popover>
          </span>
        </el-form-item>
        <el-form-item slot="col_3" label="已完成流程：">
          <el-button type="text" @click="handelOpenPages2" :disabled="false">标前评审</el-button>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" v-if="dataForm.isContractor == 0">
        <el-form-item slot="col_1" label="产品线：">
          <el-input v-model="dataForm.productLineName" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER"/>
        </el-form-item>
        <el-form-item slot="col_2" label="建设面积(㎡)：">
          <el-input v-model="dataForm.builtArea" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER"/>
        </el-form-item>
        <el-form-item slot="col_3" label="招投标形式：">
          <el-select v-model="dataForm.bidForm" :placeholder="msgTip.AUTO_PLACEHOLDER" size="small" style="width: 100%"
                     disabled>
            <el-option v-for="(item,index) in bidFormArray" :key="index" :label="item.configName"
                       :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="立项类型：">
          <el-select v-model="dataForm.projectType" :placeholder="msgTip.AUTO_PLACEHOLDER" style="width: 100%" disabled size="small">
            <el-option v-for="(item,index) in marketTypeArray" :key="index" :label="item.configName" :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" label="入库片区范围：" v-if="dataForm.isContractor == 1">
          <el-input v-model="dataForm.districtScope" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER"/>
        </el-form-item>
        <el-form-item slot="col_2" label="项目地址(省-市)：" v-else>
          <el-input v-model="dataForm.projectAddress" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER"/>
        </el-form-item>
        <el-form-item slot="col_3" label="入库片区：" v-if="dataForm.isContractor == 1">
          <el-input v-model="dataForm.depositdistrict" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
        </el-form-item>
        <el-form-item slot="col_3" label="详情地址：" v-else>
          <el-input v-model="dataForm.detailAddress" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="isContractor" label="是否预选承包商：">
          <el-radio-group v-model="dataForm.isContractor" disabled>
            <el-radio v-for="(item,index) in radioData" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2" title="评审信息">
        <el-form-item slot="col_1" prop="isMakeAmendFlowPath" label="是否后补流程：">
          <el-radio-group v-model="dataForm.isMakeAmendFlowPath" :disabled="isFlowPathByBiddeadline">
            <el-radio v-for="(item,index) in radioData" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" prop="isAgainBid" label="是否投标/回标：">
          <el-radio-group v-model="dataForm.isAgainBid" @change="changeIsAgainBid">
            <el-radio v-for="(item,index) in isagainbidArray" :label="item.configValue" :key="index">
              {{item.configName}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2">
        <el-form-item slot="col_1" prop="isHiddenLabel" label="技术标是否为暗标："
                      v-if="dataForm.isContractor == 1?false:showByIsAgainBid?true:false">
          <el-radio-group v-model="dataForm.isHiddenLabel" disabled>
            <el-radio v-for="(item,index) in radioData" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" prop="changeContent" label="变化内容："
                      v-if="showByIsAgainBid && dataForm.isAgainBid == 2">
          <el-checkbox-group v-model="dataForm.changeContent">
            <el-checkbox v-for="(item,index) in changeContentArray" :label="item.configValue" :key="index">
              {{item.configName}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" v-if="dataForm.isContractor == 0 && showByIsAgainBid">
        <el-form-item slot="col_1" label="是否多标段：">
          <el-radio-group v-model="dataForm.isMultiPleiot" @change="changeIsMultiPleiot($event)" disabled>
            <el-radio v-for="(item,index) in radioData" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2"  label="是否兼投兼中：">
          <el-radio-group v-model="dataForm.isInvestAndInvest" @change="changeIsInvestAndInvest($event)" disabled>
            <el-radio v-for="(item,index) in radioData" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>


      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="estimateBidAmount" label="预估投标金额(元)：" v-if="showByIsAgainBid">
          <amount-input v-model="dataForm.estimateBidAmount" :placeholder="msgTip.AUTO_PLACEHOLDER"
                        disabled></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" prop="useSeal" label="印章使用：">
          <el-checkbox-group v-model="dataForm.useSeal">
            <el-checkbox v-for="(item,index) in useSealArray" :label="item.configValue" :key="index">
              {{item.configName}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item slot="col_3" prop="needLicence" label="需建造师：" v-if="showByIsAgainBid">
          <el-radio-group v-model="dataForm.needLicence" :disabled="dataForm.bidForm == 1">
            <el-radio v-for="(item,index) in radioData2" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>

      </row-layout>
      <row-layout :cols="3" v-if="showByIsAgainBid">
        <el-form-item slot="col_1" prop="bidPrice" label="实际投标报价(元)：">
          <amount-input v-model="dataForm.bidPrice" :placeholder="msgTip.ENTER_PLACEHOLDER" @change="changeBidPrice"></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" prop="isHasControlPrice" label="是否有控制价：">
          <el-radio-group v-model="dataForm.isHasControlPrice">
            <el-radio v-for="(item,index) in radioData" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" prop="licenceName" label="建造师：" v-if="dataForm.needLicence == 1">
          <select-dialog :disabled="false" :btnDisabled="setting.readonly" :modelData="marketModel" :width="900"
                         :height="360" @updateValue="licenceNameUpdate"
                         :value="dataForm.licenceName || msgTip.SELECT_PLACEHOLDER"
                         dynamicModel="selectUsers"></select-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" v-if="showByIsAgainBid && dataForm.isContractor == 0">
        <el-form-item slot="col_1" prop="singleBidAmount" label="单标段投标金额(元)：" label-width="175px">
          <template slot="label">
            单标段投标金额(元)：
            <el-popover placement="top-start" title="提示：" width="300" trigger="hover" :content="noteText">
              <i slot="reference" class="el-icon-question" style="color:#E6A23C;margin-right: 1px"></i>
            </el-popover>
          </template>
          <amount-input v-model="dataForm.singleBidAmount" :placeholder="msgTip.ENTER_PLACEHOLDER"
                        :disabled="singleBidAmountDisable"></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" prop="lowerPoint" label="下浮点数(%)：" v-if="dataForm.isHasControlPrice == 1">
          <percentage-input v-model="dataForm.lowerPoint" :placeholder="msgTip.ENTER_PLACEHOLDER"></percentage-input>
        </el-form-item>
        <el-form-item slot="col_3" prop="isProjectManagerDefence" label="需建造师答辩：" v-if="dataForm.needLicence == 1">
          <el-radio-group v-model="dataForm.isProjectManagerDefence">
            <el-radio v-for="(item,index) in radioData2" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>

      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="targetProfitRate" label="投标利润率（%）：" v-if="showByIsAgainBid">
          <percentage-input v-model="dataForm.targetProfitRate"
                            :placeholder="msgTip.ENTER_PLACEHOLDER"></percentage-input>
        </el-form-item>
        <el-form-item slot="col_2" prop="bidDeadLine" label="投标截止时间：">
          <el-date-picker v-model="dataForm.bidDeadLine" type="datetime" size="small" @change="changeDataTime($event)"
                          value-format="yyyy-MM-dd hh:mm:ss"
                          :placeholder="msgTip.SELECT_PLACEHOLDER"></el-date-picker>
        </el-form-item>
      </row-layout>

      <row-layout :cols="3" v-if="showByIsAgainBid">
        <el-form-item slot="col_1" prop="isPlatformPerformance" label="四库一平台业绩：">
          <el-radio-group v-model="dataForm.isPlatformPerformance" disabled>
            <el-radio v-for="(item,index) in radioData2" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" label="是否公示业绩：">
          <el-radio-group v-model="dataForm.isPublicityAchievement" disabled>
            <el-radio v-for="(item,index) in radioData" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" label="是否公示五大员：">
          <el-radio-group v-model="dataForm.isPublicityFiveMember" disabled>
            <el-radio v-for="(item,index) in radioData" :label="item.label" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2" v-if="showByIsAgainBid">
        <el-form-item slot="col_1" label="投标文件编制机构：">
          <el-col :span="20">
            <select-dialog :disabled="true" :btnDisabled="setting.readonly" :width="900" :height="360"
                           :modelData="teamModel" @updateValue="bidCenterManagerOpinionUpdate"
                           :value="dataForm.bidCenterManagerOpinion || msgTip.SELECT_PLACEHOLDER"
                           dynamicModel="customDialog"></select-dialog>

          </el-col>
          <el-col :span="4">
            <el-button type="text" @click="handelOpenPages">新增</el-button>
          </el-col>
        </el-form-item>
        <el-form-item slot="col_2" prop="riskItem" label="风险项：">
          <el-checkbox-group v-model="dataForm.riskItem">
            <el-checkbox v-for="(item,index) in riskItemArray" :label="item.configValue" :key="index">
              {{item.configName}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" v-if="showByIsAgainBid">
        <el-form-item slot="col_1" label="风险内容：">
          <el-input type="textarea" :placeholder="msgTip.ENTER_PLACEHOLDER" :autosize="{ minRows: 5}"
                    v-model="dataForm.riskcontent"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" v-if="showByIsAgainBid">
        <el-form-item slot="col_1" label="其他说明：">
          <el-input type="textarea" :placeholder="msgTip.ENTER_PLACEHOLDER" :autosize="{ minRows: 5}"
                    v-model="dataForm.otherinstructions"></el-input>
        </el-form-item>
      </row-layout>
      <form-title :title="'评审意见'" v-if="wfContext.WorkflowInstinceState > 1"></form-title>
      <row-layout :cols="1" v-if="wfContext.WorkflowInstinceState == 3">
        <el-form-item slot="col_1" label="评审结果：">
          <el-radio-group v-model="dataForm.reviewResult">
            <el-radio v-for="(item,index) in reviewResultArray" :label="item.configValue" :key="index">
              {{item.configName}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <el-form label-width="160px" :model="dataForm" :disabled="isAble" ref="dataForm2" :rules="dataRule">
      <row-layout :cols="3" cell="1-2" v-if="wfContext.CurrentActivityName == '投标管理部投标专员'">
        <el-form-item slot="col_1" label="投标管理部投标专员：" prop="biddingCenterAgreeBid">
          <el-select v-model="dataForm.biddingCenterAgreeBid" :placeholder="msgTip.SELECT_PLACEHOLDER"
                     style="width: 100%" size="small">
            <el-option v-for="(item,index) in reviewResultArray" :key="index" :label="item.configName"
                       :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" label="" label-width="0">
          <el-input :placeholder="placeholderText" v-model="dataForm.biddingCenterOpinion"
                    maxlength="500"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2" v-if="wfContext.CurrentActivityName == '投标管理部投标经理'">
        <el-form-item slot="col_1" label="投标管理部投标经理：" prop="bidCenterManagerAgreeBid">
          <el-select v-model="dataForm.bidCenterManagerAgreeBid" :placeholder="msgTip.SELECT_PLACEHOLDER"
                     style="width: 100%" size="small">
            <el-option v-for="(item,index) in reviewResultArray" :key="index" :label="item.configName"
                       :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" label="" label-width="0">
          <el-input :placeholder="placeholderText" v-model="dataForm.bidCenterManagerOpinion"
                    maxlength="500"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2" v-if="wfContext.CurrentActivityName == '投标管理部负责人'">
        <el-form-item slot="col_1" label="投标管理部负责人：" prop="bidCenterBidAgreeBid">
          <el-select v-model="dataForm.bidCenterBidAgreeBid" :placeholder="msgTip.SELECT_PLACEHOLDER"
                     style="width: 100%" size="small">
            <el-option v-for="(item,index) in reviewResultArray" :key="index" :label="item.configName"
                       :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" label="" label-width="0">
          <el-input :placeholder="placeholderText" v-model="dataForm.bidCenterBidOpinion"
                    maxlength="500"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2" v-if="wfContext.CurrentActivityName == '商务主管/经理'">
        <el-form-item slot="col_1" label="商务主管/经理：" prop="businessAgreeBid">
          <el-select v-model="dataForm.businessAgreeBid" :placeholder="msgTip.SELECT_PLACEHOLDER" style="width: 100%"
                     size="small">
            <el-option v-for="(item,index) in reviewResultArray" :key="index" :label="item.configName"
                       :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" label="" label-width="0">
          <el-input :placeholder="msgTip.ENTER_PLACEHOLDER" v-model="dataForm.businessOpinion"
                    maxlength="500"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2" v-if="wfContext.CurrentActivityName == '业务单元负责人'">
        <el-form-item slot="col_1" label="业务单元负责人：" prop="businessUnitLeaderAgreeBid">
          <el-select v-model="dataForm.businessUnitLeaderAgreeBid" :placeholder="msgTip.SELECT_PLACEHOLDER"
                     style="width: 100%" size="small">
            <el-option v-for="(item,index) in reviewResultArray" :key="index" :label="item.configName"
                       :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" label="" label-width="0">
          <el-input :placeholder="msgTip.ENTER_PLACEHOLDER" v-model="dataForm.businessUnitLeaderOpinion"
                    maxlength="500"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2" v-if="wfContext.CurrentActivityName == '业务中心负责人'">
        <el-form-item slot="col_1" label="业务中心负责人：" prop="centerBidAgreeBid">
          <el-select v-model="dataForm.centerBidAgreeBid" :placeholder="msgTip.SELECT_PLACEHOLDER" style="width: 100%"
                     size="small">
            <el-option v-for="(item,index) in reviewResultArray" :key="index" :label="item.configName"
                       :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" label="" label-width="0">
          <el-input :placeholder="msgTip.ENTER_PLACEHOLDER" v-model="dataForm.centerBidAgreeOpinion"
                    maxlength="500"></el-input>
        </el-form-item>
        <p v-show="dataForm.riskItem.length > 0">风险告知：本人知悉以上风险并已与项目团队沟通确认，同意投标，以上风险造成的影响本人承担连带责任。</p>
      </row-layout>
      <row-layout :cols="3" cell="1-2" v-if="wfContext.CurrentActivityName == '业务拓展部负责人'">
        <el-form-item slot="col_1" label="业务拓展部负责人：" prop="businessDevelopmentAgreeBid">
          <el-select v-model="dataForm.businessDevelopmentAgreeBid" :placeholder="msgTip.SELECT_PLACEHOLDER"
                     style="width: 100%" size="small">
            <el-option v-for="(item,index) in reviewResultArray" :key="index" :label="item.configName"
                       :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" label="" label-width="0">
          <el-input :placeholder="msgTip.ENTER_PLACEHOLDER" v-model="dataForm.businessDevelopmentOpinion"
                    maxlength="500"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2" v-if="wfContext.CurrentActivityName == '区域中心分管领导'">
        <el-form-item slot="col_1" label="区域中心分管领导：" prop="regionalCenterLeaderAgreeBid">
          <el-select v-model="dataForm.regionalCenterLeaderAgreeBid" :placeholder="msgTip.SELECT_PLACEHOLDER"
                     style="width: 100%" size="small">
            <el-option v-for="(item,index) in reviewResultArray" :key="index" :label="item.configName"
                       :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" label="" label-width="0">
          <el-input :placeholder="msgTip.ENTER_PLACEHOLDER" v-model="dataForm.regionalCenterLeaderOpinion"
                    maxlength="500"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2" v-if="wfContext.CurrentActivityName == '市场管理中心负责人'">
        <el-form-item slot="col_1" label="市场管理中心负责人：" prop="marketManagementCenterAgreeBid">
          <el-select v-model="dataForm.marketManagementCenterAgreeBid" :placeholder="msgTip.SELECT_PLACEHOLDER"
                     style="width: 100%" size="small" @change="changeCenterAgreeBid">
            <el-option v-for="(item,index) in reviewResultArray" :key="index" :label="item.configName"
                       :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" label="" label-width="0">
          <el-input :placeholder="msgTip.ENTER_PLACEHOLDER" v-model="dataForm.marketManagementCenterOpinion"
                    maxlength="500"></el-input>
        </el-form-item>
      </row-layout>
      </el-form>
      <row-layout title="附件" :cols="1">
        <el-form-item slot="col_1" prop="fileInfo" label="附件：">
          <uploader-file v-model="dataForm.fileInfo"></uploader-file>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" v-if="oIndex > 0">
        <el-form-item slot="col_1" prop="deadlineChangeFileInfo" label="截标时间变更文件：">
          <uploader-file v-model="dataForm.deadlineChangeFileInfo"></uploader-file>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-1-1">
        <el-form-item slot="col_1" prop="createUserName" label="编制人：">
          <span>{{dataForm.createUserName}}</span>
        </el-form-item>
        <el-form-item slot="col_2" prop="deptName" label="编制部门：">
          <span>{{dataForm.deptName}}</span>
        </el-form-item>
        <el-form-item slot="col_3" prop="createTime" label="编制时间：">
          <span>{{dataForm.createTime}}</span>
        </el-form-item>
      </row-layout>
    </el-form>
  </div>
</template>

<script>
  import FormTitle from '@/components/basic/formTitle/index.vue';
  import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
  import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
  import AmountInput from '@/components/basic/numberInput/amountInput.vue';
  import NumberInput from '@/components/basic/numberInput/index.vue';
  import PercentageInput from '@/components/basic/numberInput/percentageInput.vue';
  import CascSelect from '@/components/basic/cascSelect/index.vue';
  import UploaderFile from '@/components/basic/uploaderFile/index.vue';
  import {
    RADIO3_GROUP,
    RADIO2_GROUP,
    V_MARKET_MAIN_DOCUMENT_MODEL,
    BASE_BID_TEAM_LIBRARY_MODEL
  } from '@/views/businessModule/enum/param';
  import RuleRequired from '@/views/businessModule/enum/requiredMsg';
  import {getDataDictByConfigType} from '@/Api/dataDict.js'
  import {getDateJumpInfo} from '@/Api/contract/index.js'
  import {getCustomerAndProjectLeaderState,checkTenderDocumentReviewInfo} from '@/Api/bidDocumentReviewMain/index.js'
  import moment from 'moment'

  import comMixin from '../minix';
  /*投标文件评审*/
  export default {
    components: {
      FormTitle,
      RowLayout,
      SelectDialog,
      NumberInput,
      CascSelect,
      UploaderFile,
      AmountInput,
      PercentageInput
    },
    mixins: [comMixin],
    data() {
      return {
        marketModel: V_MARKET_MAIN_DOCUMENT_MODEL,  //标前评审
        noteText: '非兼投兼中项目填写标段较大的一个或最有希望中标的一个标段的金额；兼投兼中项目填写所有标段之合',
        teamModel: BASE_BID_TEAM_LIBRARY_MODEL,
        oIndex: 0, // 计数值
        rowObject: {},
        fileList: [],
        numVal: '100',
        msgInfo:'该客户状态已被市场综合部设为预警，请做好风险管控工作！预警原因：',
        msgInfo2:'该介绍人状态已被市场综合部设为预警，请做好风险管控工作！预警原因：',
        loading: false,
        formVisible: false,
        dialogVisible: false,
        showByIsAgainBid: true, // 根据是否投标/回标判断是否显示内容
        isFlowPathByBiddeadline: false, //根据投标截止时间设置是否编辑
        singleBidAmountDisable: false,
        isAble: false,
        radioData: RADIO3_GROUP,
        radioData2: RADIO2_GROUP,
        getCustomerAndProjectLeaderInfo: { // 获取客户和项目介绍人状态
          customerForewarningReason: '',
          isForewarningCustomer: false,
          isForewarningProjectLeader: false,
          projectLeaderForewarningReason: '',
        },
        dataForm: {
          advPayment: '',
          baseBidTeamLibraryMainId: '',
          baseBidTeamLibraryMainName: '',
          basisFile: '',
          bidCenterBidAgreeBid: '',
          bidCenterBidOpinion: '',
          bidCenterManagerAgreeBid: '',
          bidCenterManagerOpinion: '',
          bidDeadLine: '',
          bidForm: '',
          bidFormId: '',
          bidPreReviewMainId: '',
          bidPrice: '',
          bidSituation: '',
          biddingCenterAgreeBid: '',
          biddingCenterOpinion: '',
          builtArea: '',
          businessAgreeBid: '',
          businessDevelopmentAgreeBid: '',
          businessDevelopmentOpinion: '',
          businessOpinion: '',
          businessPromise: '',
          businessUnitLeaderAgreeBid: '',
          businessUnitLeaderOpinion: '',
          centerBidAgreeBid: '',
          centerBidAgreeOpinion: '',
          changeContent: [],
          code: '',
          comPayment: '',
          createTime: '',
          createUserId: '',
          createUserName: '',
          customerMainName: '',
          depositdistrict: '',
          deptId: '',
          deptName: '',
          detailAddress: '',
          districtScope: '',
          estimateBidAmount: '',
          estimatePrice: '',
          extendId: '',
          fileInfo: [],
          deadlineChangeFileInfo: [],
          financeManageCenterHeadAgreeBid: '',
          financeManageCenterHeadOpinion: '',
          follower: '',
          guaranteePeriod: '',
          id: '',
          isAgainBid: '',
          isContractor: '',
          isDel: '',
          isHasControlPrice: '',
          isHasEstimation: '',
          isHasProvisional: '',
          isHaveLicence: '',
          isHiddenLabel: '',
          isInvestAndInvest: '',
          isLegalPersonDefence: '',
          isMakeAmendFlowPath: '',
          isMultiPleiot: '',
          isOriginalCertificate: '',
          isPlatformPerformance: '',
          isProjectManagerDefence: '',
          isPublicityAchievement: '',
          isPublicityFiveMember: '',
          isRisk: '',
          jsonData: '',
          lastModifyTime: '',
          lastModifyUserId: '',
          lastModifyUserName: '',
          licenceId: '',
          licenceName: '',
          lowerPoint: '',
          marketCenterId: '',
          marketCenterName: '',
          marketMainCode: '',
          marketMainId: '',
          marketMainName: '',
          marketManagementCenterAgreeBid: '',
          marketManagementCenterOpinion: '',
          marketUnitId: '',
          marketUnitName: '',
          materialSupplyAByBAmount: '',
          materialSupplyBByAAmount: '',
          memo: '',
          name: '',
          needLicence: '',
          otherRisk: '',
          otherinstructions: '',
          proPayment: '',
          procInstState: '',
          projectCost: '',
          projectLeader: '',
          projectType: '',
          projectaddress: '',
          proportProgPayment: '',
          provisionalAmount: '',
          qualityStandard: '',
          regionalCenterLeaderAgreeBid: '',
          regionalCenterLeaderOpinion: '',
          relevantClauseRemark: '',
          relevantPrice: '',
          retMoney: '',
          reviewResult: '',
          riskItem: [],
          riskcontent: '',
          settlement: '',
          singleBidAmount: '',
          singleBidMoney: '',
          soloution: '',
          targetProfitRate: '',
          useSeal: [],
          wiid: ''
        },
        marketTypeArray: [],  //立项类型
        bidFormArray: [],  //招投标形式
        isagainbidArray: [],  //投标/回标
        marketCategoryArray: [],  //立项类别
        tenderDocumentDrawProvidArray: [],  //招标文件及图纸资料
        changeContentArray: [],  //变化内容
        useSealArray: [],  //印章使用
        riskItemArray: [],  //风险项
        reviewResultArray: [],  //评审结果
        marketStatusArray: [],  //项目当前状态
        placeholderText: '该项目投标报价人工、材料是/否适合市场常规水平，是否有不平衡报价', // 审批意见默认提示
        msgTip: RuleRequired.tipMsg,
        wfContext: '', // 流程信息
        getWild:'',// 标前评审wiid
        //添加必填项 字段
        //必填项字段
        dataRule: RuleRequired.dataRule(['marketMainCode', 'isMakeAmendFlowPath', 'isAgainBid', 'changeContent', 'isMultiPleiot','licenceName',
          'isInvestAndInvest', 'useSeal', 'needLicence', 'bidPrice', 'isHasControlPrice', 'singleBidAmount', 'isProjectManagerDefence',
          'biddingCenterAgreeBid','bidCenterManagerAgreeBid','bidCenterBidAgreeBid','businessAgreeBid','businessUnitLeaderAgreeBid',
          'centerBidAgreeBid','businessDevelopmentAgreeBid','regionalCenterLeaderAgreeBid','marketManagementCenterAgreeBid',
          'targetProfitRate', 'fileInfo','deadlineChangeFileInfo'])
      }
    },
    computed: {
      //索证时长
      lockTimeDisStatus({dataForm}) {
        return dataForm.isLock === 0 || dataForm.isLock === '';
      },
    },
    mounted() {

    },
    methods: {
      beforeInit() {
        this.isLockChange(this.dataForm.isLock);
        this.getDataDictByConfigType("立项类型,招投标形式,是否投标/回标,立项类别,招标文件及图纸资料,变化内容,印章使用,风险项,评审结果");
      },
      afterInit() {
        let {changeContent, riskItem, useSeal,projectType,bidDeadLine} = this.dataForm;
        this.dataForm.changeContent = this.valueFormat(changeContent);
        this.dataForm.riskItem = this.valueFormat(riskItem);
        this.dataForm.useSeal = this.valueFormat(useSeal);
        // this.dataForm.projectType = this.valueFormat(projectType);
        this.dataForm.bidDeadLine =  moment(new Date(bidDeadLine)).format('YYYY-MM-DD HH:mm:ss');
        this.wfContext = WFContext;
        // 获取获取客户和项目介绍人状态
        this.getCustomOrLeaderInfo();
      },
      // 字段格式化
      valueFormat(value) {
        if (value && typeof value == "string") {
          if (value.indexOf(',') !== -1) {
            return value.split(',');
          } else {
            return [...value];
          }
        } else {
          return [];
        }
      },
      // 是否投标/回标
      changeIsAgainBid() {
        var that = this;
        var val = that.dataForm.isAgainBid;
        if (val && (val == 3 || val == 4)) {
          that.showByIsAgainBid = false;
        } else {
          that.showByIsAgainBid = true;
        }
        this.$forceUpdate();
      },
      //是否索证 为是时 索证时长为必填 否则取消必填
      isLockChange(e) {
        let status = (e == 1) ? true : false;
        this.dataRule['lockTime'] = RuleRequired.curFiledRule(status);
      },
      //选择立项类型
      marketTypeChange(e) {
        this.$set(this.qualificationScopeModel.parm, 'varParams', [{key: 'project_type', value: e}]);
      },
      //招投标形式
      bidFormChange(e) {
        this.dataForm.bidForm = e;
      },
      // 投标截止时间
      changeDataTime(e) {
        this.dataForm.bidDeadLine = e;
        var msg = '投标截止日期变更需附件上传证明文件';
        FUI.Window.showMsg(msg, null, 3);
        this.oIndex++;
        if(e){
          this.vaildBiddeadline();
        }
        this.$forceUpdate();
      },
      // 是否兼投兼中
      changeIsInvestAndInvest(e) {
        var val = this.dataForm.isInvestAndInvest;
        if (val == 1) {
          this.dataForm.singleBidAmount = this.dataForm.bidPrice;
        }
        this.setSingleBidAmountDisable()
      },
      // 是否多投标段
      changeIsMultiPleiot(e) {
        var val = this.dataForm.isMultiPleiot;
        if (val == 1) {
          this.dataForm.singleBidAmount = '';
        } else {
          this.dataForm.singleBidAmount = this.dataForm.bidPrice;
        }
        this.setSingleBidAmountDisable()
      },
      //选择立项编号
      marketUpdate(data) {
        const {
          marketmaincode, marketmainname, marketmainid, projecttype, marketunitname, marketcentername, detailaddress,bidprereviewmainid,
          depositdistrict, follower, projectleader, ishiddenlabel, ispublicityachievement, biddeadline, isplatformperformance,
          ismultipleiot, ispublicityfivemembers, isinvestandinvest,marketunitid,marketcenterid,
          projectaddress, productlinename, customermainname, bidform, estimatebidamount, builtarea, iscontractor,wiid
        } = data[0];
        this.dataForm.marketMainCode = marketmaincode;
        this.dataForm.marketMainName = marketmainname;
        this.dataForm.marketMainId = marketmainid;
        this.dataForm.projectType = projecttype;
        this.dataForm.marketUnitName = marketunitname;
        this.dataForm.marketCenterName = marketcentername;
        this.dataForm.projectAddress = projectaddress;
        this.dataForm.productLineName = productlinename;
        this.dataForm.customerMainName = customermainname;
        this.dataForm.bidForm = bidform;
        this.dataForm.needLicence = bidform == 1 ? '1' : ''; // 需建造师
        this.dataForm.estimateBidAmount = (estimatebidamount) ? (estimatebidamount).toString() : '';
        this.dataForm.detailAddress = detailaddress;
        this.dataForm.depositdistrict = depositdistrict;
        this.dataForm.follower = follower;
        this.dataForm.projectLeader = projectleader;
        this.dataForm.builtArea = builtarea;
        this.dataForm.isContractor = iscontractor;
        this.dataForm.isHiddenLabel = ishiddenlabel;
        this.dataForm.isPublicityAchievement = ispublicityachievement;
        this.dataForm.bidDeadLine = biddeadline;
        this.dataForm.isPlatformPerformance = isplatformperformance;
        this.dataForm.isMultiPleiot = ismultipleiot;
        this.dataForm.isInvestAndInvest = isinvestandinvest;
        this.dataForm.isPublicityFiveMember = ispublicityfivemembers;
        this.dataForm.marketCenterId = marketcenterid;
        this.dataForm.marketUnitId = marketunitid;
        this.getWild = wiid;
        if (biddeadline) this.vaildBiddeadline();
        if (marketmainid) this.getCustomOrLeaderInfo();
        this.changeIsInvestAndInvest();
        this.changeIsMultiPleiot();
        this.setSingleBidAmountDisable();
        this.$forceUpdate()

      },
      // 根据投标截止时间设置是否后补流程
      vaildBiddeadline() {
        var startTime = this.dataForm.bidDeadLine; // 投标截止时间
        startTime = startTime.split(' ')[0];
        var endTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss'); // 当前时间
        var flag = Object.checkDateTime(startTime, endTime);
        if (flag == -1) {
          this.dataForm.isMakeAmendFlowPath = '1';
          this.isFlowPathByBiddeadline = true;
        } else {
          this.dataForm.isMakeAmendFlowPath = '';
          this.isFlowPathByBiddeadline = false
        }
      },
      // 根据是否多标段与是否兼投兼中，设置单标段投标金额（元）状态
      setSingleBidAmountDisable() {
        var val1 = this.dataForm.isInvestAndInvest; // 是否兼投兼中
        var val2 = this.dataForm.isMultiPleiot; // 是否多标段
        if (val2 == 0) {
          this.dataForm.singleBidAmount = this.dataForm.bidPrice; // 单标段投标金额(元)
          this.singleBidAmountDisable = true
        } else if (val1 == 1) {
          this.dataForm.singleBidAmount = this.dataForm.bidPrice; // 单标段投标金额(元)
          this.singleBidAmountDisable = true
        } else {
          this.dataForm.singleBidAmount = ''; // 单标段投标金额(元)
          this.singleBidAmountDisable = false;
        }


      },
      //投标文件编制机构
      bidCenterManagerOpinionUpdate(data) {
        const {teamName} = data[0];
        this.dataForm.bidCenterManagerOpinion = teamName;
      },
      // 市场管理中心负责人
      changeCenterAgreeBid() {
        this.dataForm.reviewResult = this.dataForm.marketManagementCenterAgreeBid;
      },
      async getDataDictByConfigType(configTypes) {
        const {data, success} = await getDataDictByConfigType({params: {configTypes: configTypes}});
        if (success) {
          if (data && data.length > 0) {
            this.marketTypeArray = data.find(item => item.dataDictType === '立项类型')?.dataDict || [];
            this.bidFormArray = data.find(item => item.dataDictType === '招投标形式')?.dataDict || [];
            this.isagainbidArray = data.find(item => item.dataDictType === '是否投标/回标')?.dataDict || [];
            this.marketStatusArray = data.find(item => item.dataDictType === '项目当前状态')?.dataDict || [];
            this.marketCategoryArray = data.find(item => item.dataDictType === '立项类别')?.dataDict || [];
            this.tenderDocumentDrawProvidArray = data.find(item => item.dataDictType === '招标文件及图纸资料')?.dataDict || [];
            this.changeContentArray = data.find(item => item.dataDictType === '变化内容')?.dataDict || [];
            this.useSealArray = data.find(item => item.dataDictType === '印章使用')?.dataDict || [];
            this.riskItemArray = data.find(item => item.dataDictType === '风险项')?.dataDict || [];
            this.reviewResultArray = data.find(item => item.dataDictType === '评审结果')?.dataDict || [];
          }
        }
      },
      // 选择建造师
      licenceNameUpdate(data) {
        if(data && data.length>0){
          this.dataForm.licenceName = data[0].realName;
          this.dataForm.licenceId = data[0].userId;
        }
      },
      //建造师要求
      constructorChange(e) {
        this.dataForm.constructorRequirement = e;
      },
      //立项类别
      marketCategoryChange(e) {
        this.dataForm.marketCategory = e;
      },
      // 点击打开【投标团队库】新增页面
      handelOpenPages() {
        var that = this;
        var appId = 'DN'; // 流程id
        var keyWord = 'baseBidTeamLibraryMain'; // 表单关键字
        var code = 'custGrid_BusinessSearch_TouBiaoTuanDuiKu'; // 菜单编码
        var wfAction = 0; // 表单状态
        var modelName = 'bid'; // 模块名
        var url = '/workflowForm?appId=' + appId + '&encode=' + keyWord + '&code=' + code;
        that.$router.push(url + '&formAction=' + wfAction + '&modelName=' + modelName)
      },
      // 点击打开【标前评审】详情页面
      handelOpenPages2() {
        if (!this.dataForm.marketMainCode) {
          FUI.Window.showMsg(myvm, '请先选择需要的立项');
          return false
        } else {
          // this.setlinkUrl();
          console.log('123');
        }
      },
      // 校验投标截止时间
      checkTime() {
        let that = this;
        let val1 = that.dataForm.isMakeAmendFlowPath; // 是否后补流程
        let val2 = that.dataForm.isAgainBid; // 是否投标、回标
        let time1 = that.dataForm.bidDeadLine; // 投标截止时间
        let time2 = that.dataForm.createTime; // 创建时间
        if (val1 == 0 && val2 == 1 && time1) {
          var flag = Object.checkDateTime(time2, time1);
          if (flag == 1 || flag == 0) {
            let msg = '提交流程时间晚于等于投标截止时间，请修改投标截止时间';
            FUI.Window.showMsg(msg);
            return false
          }
        }
      },
      // 获取获取客户和项目介绍人状态
      async getCustomOrLeaderInfo() {
        const {data} = await getCustomerAndProjectLeaderState(this.dataForm.marketMainId);
        if (data) {
          this.getCustomerAndProjectLeaderInfo = data;
        }
      },
      // 校验是否投标/回标的发起
      async vaildisAgainBid(){
        var that = this;
        let isAgainBid = that.dataForm.isAgainBid;
        if(isAgainBid){
          var parms = {
            id: that.dataForm.id,
            isAgainBid: that.dataForm.isAgainBid,
            marketMainId:  that.dataForm.marketMainId
          };
          const res = await checkTenderDocumentReviewInfo(parms);
          if(res.data){
            return true
          }else{
            let msg = '已存在 投标 的数据或是存在处于流程进行中的 回标/询标 数据，暂无法提交';
            FUI.Window.showMsg(msg);
            return false
          }
        }
      },
      // 表单校验事件
      validateForm() {
        const _this = this;
        if (_this.checkTime() === false) {
          return false
        }
        if(_this.vaildisAgainBid() === false){
          return false
        }
        let parm = Object.toClone(_this.dataForm);
        parm.changeContent = parm.changeContent.length === 0?'': (parm.changeContent).join(); //变化内容
        parm.riskItem = parm.riskItem.length === 0?'':(parm.riskItem).join(); // 风险项
        parm.useSeal = !parm.useSeal?'':parm.useSeal.length> 0?(parm.useSeal).join():''; // 印章使用
        parm.bidDeadLine = moment(new Date(parm.bidDeadLine)).format('YYYY-MM-DD HH:mm:ss');
        return new Promise(resolve => {
          var name = '';
          if(WFContext.WorkflowInstinceState == 2){
            name = 'dataForm2'
          }else{
            name = 'dataForm'
          }
          _this.$refs[name].validate(valid => {
            if (valid) {
              return resolve(parm);
            } else {
              return resolve(false)
            }
          })
        });
      },
      // 过滤返回值
      setResonVal(val){
        var str = val;
        if(!str){
          str = '暂无'
        }
        return str
      },
      /**
       * 获取表单数据
       */
      getDataForm() {
        const parm = JSON.parse(JSON.stringify(this.dataForm));
        parm.changeContent = parm.changeContent.length === 0?'': (parm.changeContent).join(); //变化内容
        parm.riskItem = parm.riskItem.length === 0?'':(parm.riskItem).join(); // 风险项
        parm.useSeal = !parm.useSeal?'':parm.useSeal.length> 0?(parm.useSeal).join():''; // 印章使用
        return parm;
      },
      /**
       * 客户链接
       * */
      async handelCustomerMainNameLink(){
        // var params = {
        //   rowId:'',
        //   appId:'BC',
        //   tableName:'customer_main'
        // };
        // const res = await getDateJumpInfo(params);
        // if(res.code === 200){
        //
        //
        // }
        // const queryData = {
        //   appId:'BC',
        //   encode:'customerMain',
        //   formAction:'3',
        //   code:'custGrid_BusinessSearch_KeHuXinXiDengJiDEMO',
        //   modelName:'customer',
        //   rowId:''
        // };
        // this.$router.push({ path: '/workflowForm', query: queryData })
      },
      // 实际投标报价
      changeBidPrice(){
        let amount = this.dataForm.bidPrice;
        let isMultiPleiot = this.dataForm.isMultiPleiot;
        if(isMultiPleiot && isMultiPleiot == 0){
          this.dataForm.singleBidAmount = amount;
        }
      },
      // 超链接拼接方法（有流程）
      async setlinkUrl() {
        var params = {
          rowId:this.dataForm.marketMainId ,
          appId:'BD',
          tableName:'bid_pre_review_main'
        };
        const res = await getDateJumpInfo(params);
        if(res.code === 200){
          var data = res.data;
          data.formAction = 3;
          // this.$router.push({ path: '/workflowForm',query:data});
          let url = __webpath + '/workflowForm?code=' + data.code + '&encode=' + data.enCode + '&rowId=' + data.rowId + '&modelName=' + data.modelName + '&formAction=' + data.formAction + '&appId=' + data.appId + '&wiid=' + data.wiid;
          window.open(url)
        }
        // let code = 'custGrid_BusinessSearch_BiaoQianPingShen'; // 标前评审菜单code
        // let appId = 'BD'; //流程应用id
        // let encode = 'bidPreReviewMain';//业务code
        // let rowId = this.dataForm.marketMainId;//主表id
        // let modelName = 'bid'; // 模块code
        // let formAction = 3; // 表单状态 默认 3
        // let wiid = this.getWild; // 流程id
        // let url = __webpath + '/workflowForm?code=' + code + '&encode=' + encode + '&rowId=' + rowId + '&modelName=' + modelName + '&formAction=' + formAction + '&appId=' + appId + '&wiid=' + wiid;
        // window.open(url)

      },
    }
  };
</script>

<style scoped lang="scss">

  .commponent-height {
    height: 32px;
    line-height: 32px;
  }

  .el-upload__prompt {
    color: #F56C6C;
    font-size: 14px;
    font-weight: normal;
    line-height: 25px;
  }

  ::v-deep .designPrice {
    .el-input-group__append {
      padding: 0 12px;
    }
  }


</style>
