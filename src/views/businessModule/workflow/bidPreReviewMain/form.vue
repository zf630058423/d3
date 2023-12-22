<template>
  <!-- 标前评审 -->
  <div v-loading="loading">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      :disabled="setting.readonly"
      label-width="170px"
      class="new-data-form-css"
    >
      <row-layout :title="'基础信息'" :cols="3">
        <el-form-item slot="col_1" label="单据编号：">
          <el-input v-model="dataForm.code" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="projectCode" label="立项编号：">
          <selector-dialog :model-data="marketMainDialog" :value="dataForm.projectCode" dynamic-model="customDialog" @updateValue="updateMarketMainValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="业务单元：">
          <el-input v-model="dataForm.marketUnitName" size="small" placeholder="自动带出" :disabled="true" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="客户：">
          {{ dataForm.customerName || '自动带出' }}
          <el-popover
            v-if="dataForm.isForewarningCustomer"
            placement="top-start"
            width="200"
            title="该客户状态已被市场综合部设为预警，请做好风险管控工作！"
            trigger="hover"
            :content="`预警原因：${dataForm.customerForewarningReason||'暂无'}`"
          >
            <span slot="reference" class="el-icon-warning" style="font-size:20px;color:red"></span>
          </el-popover>
        </el-form-item>
        <el-form-item slot="col_2" label="立项名称：">
          <el-input v-model="dataForm.projectName" size="small" placeholder="自动带出" :disabled="true" />
        </el-form-item>
        <el-form-item slot="col_3" label="业务中心：">
          <el-input v-model="dataForm.marketCenterName" size="small" placeholder="自动带出" :disabled="true" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="跟进人：">
          <el-input v-model="dataForm.followerName" size="small" placeholder="自动带出" :disabled="true" />
        </el-form-item>
        <el-form-item slot="col_2" label="项目介绍人：">
          {{ dataForm.projectLeaderName || '自动带出' }}
          <el-popover
            v-if="dataForm.isForewarningProjectLeader"
            placement="top-start"
            width="200"
            title="该介绍人状态已被市场综合部设为预警，请做好风险管控工作！"
            trigger="hover"
            :content="`预警原因：${dataForm.projectLeaderForewarningReason||'暂无'}`"
          >
            <span slot="reference" class="el-icon-warning" style="font-size:20px;color:red"></span>
          </el-popover>
        </el-form-item>
        <el-form-item slot="col_3" label="客户合作记录：">
          <el-radio-group v-model="dataForm.isCooperationCustomer" :disabled="true">
            <el-radio v-for="(item,index) in radioOptions2" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="是否预选承包商：">
          <el-radio-group v-model="dataForm.isContractor" :disabled="true">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" label="招投标形式：">
          <el-select v-model="dataForm.bidForm" placeholder="请选择" disabled style="width:100%">
            <el-option v-for="(item,index) in bidFormOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_3" label="项目介绍人合作记录：">
          <el-radio-group v-model="dataForm.isCooperationProjectLeader" :disabled="true">
            <el-radio v-for="(item,index) in radioOptions2" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="立项类型：">
          <el-select v-model="dataForm.projectType" placeholder="自动带出" disabled style="width:100%">
            <el-option v-for="(item,index) in projectTypeOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dataForm.isContractor!=1" slot="col_2" prop="builtArea" label="建筑面积(㎡)：">
          <el-input v-model="dataForm.builtArea" size="small" placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="dataForm.isContractor!=1" slot="col_3" label="产品线：">
          <el-input v-model="dataForm.productLineName" size="small" placeholder="自动带出" :disabled="true" />
        </el-form-item>
      </row-layout>
      <row-layout v-if="dataForm.isContractor!=1" :cols="3" cell="1-2">
        <el-form-item slot="col_1" label="资质范围：">
          <el-input v-model="dataForm.qualificationScope" size="small" placeholder="自动带出" :disabled="true" />
        </el-form-item>
        <el-form-item slot="col_2" label="建筑高度(米)：">
          <el-input v-model="dataForm.buildHeight" size="small" placeholder="如招标文件未体现高度，填写未涉及，否则依据招标文件填写" />
        </el-form-item>
      </row-layout>
      <form-title :title="'投标信息'"></form-title>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="estimateBidAmount" label="预估投标金额(元)：">
          <amountInput v-model="dataForm.estimateBidAmount" />
        </el-form-item>
        <el-form-item v-if="dataForm.isContractor!=1" slot="col_2" prop="isMultiPleiot" label="是否多标段：">
          <el-radio-group v-model="dataForm.isMultiPleiot">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="dataForm.isContractor!=1&&dataForm.isMultiPleiot==1" slot="col_3" prop="isInvestandInvest" label="是否兼投兼中：">
          <el-radio-group v-model="dataForm.isInvestandInvest">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout v-if="dataForm.isContractor!=1" :cols="3">
        <el-form-item slot="col_1" prop="duration" label="工期(天)：">
          <el-input v-model="dataForm.duration" type="number" size="small" placeholder="请输入" />
        </el-form-item>
        <el-form-item slot="col_2" prop="isModelHouses" label="是否样板房：">
          <el-radio-group v-model="dataForm.isModelHouses">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" prop="isPublicityAchievement" label="是否公示业绩：">
          <el-radio-group v-model="dataForm.isPublicityAchievement">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout v-if="dataForm.isContractor!=1" :cols="3">
        <el-form-item slot="col_1" prop="isPlatformPerformance" label="四库一平台业绩：">
          <el-radio-group v-model="dataForm.isPlatformPerformance">
            <el-radio v-for="(item,index) in radioOptions3" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" prop="isHiddenLabel" label="技术标是否为暗标：">
          <el-radio-group v-model="dataForm.isHiddenLabel">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" prop="isPublicityFivemembers" label="是否公示五大员：">
          <el-radio-group v-model="dataForm.isPublicityFivemembers">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="bidDeadLine" label="投标截止时间：">
          <el-date-picker
            v-model="dataForm.bidDeadLine"
            type="datetime"
            placeholder="请选择"
            size="small"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item slot="col_2" prop="contractType" label="合同类型：">
          <el-select v-model="dataForm.contractType" placeholder="请选择" style="width:100%">
            <el-option v-for="(item,index) in contractTypeOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2">
        <el-form-item slot="col_1" label="项目地址（省-市）：">
          <el-input v-model="dataForm.address" size="small" placeholder="自动带出" :disabled="true" />
        </el-form-item>
        <el-form-item slot="col_2" label="招标代理机构：">
          <el-input v-model="dataForm.bidAgency" size="small" placeholder="请输入" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="详细地址：">
          <el-input v-model="dataForm.detailAddress" size="small" placeholder="自动带出" :disabled="true" />
        </el-form-item>
        <el-form-item slot="col_2" prop="isHouseOffset" label="是否以房抵款：">
          <el-radio-group v-model="dataForm.isHouseOffset">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="isRequired('isHouseOffset', 'houseOffsetRatio')" slot="col_3" prop="houseOffsetRatio" label="以房抵款比例(%)：">
          <percentageInput v-model="dataForm.houseOffsetRatio" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="isBottomLine" label="是否触碰营销底限：">
          <el-radio-group v-model="dataForm.isBottomLine">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" prop="isNonCashPay" label="是否非现金支付：">
          <el-radio-group v-model="dataForm.isNonCashPay">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="isRequired('isNonCashPay', 'nonCashPayRatio')" slot="col_3" prop="nonCashPayRatio" label="非现金支付比例（%）：">
          <percentageInput v-model="dataForm.nonCashPayRatio" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="depositPayment" label="投标保证金支付方式：">
          <el-select v-model="dataForm.depositPayment" placeholder="请选择" style="width:100%" @change="changeDepositPayment">
            <el-option v-for="(item,index) in depositPaymentOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" prop="payForBid" label="投标保证金（元）：">
          <amountInput v-model="dataForm.payForBid" />
        </el-form-item>
        <el-form-item v-if="isRequired('isNonCashPay', 'nonCashPayMode')" slot="col_3" prop="nonCashPayMode" label="具体非现金支付方式：">
          <el-input v-model="dataForm.nonCashPayMode" size="small" placeholder="此处依据招标文件填写如保理、ABS、商票等" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="bidSecurity" label="投标保函：">
          <numberInput
            v-model="dataForm.bidSecurity"
            placeholder="请填写数字"
          />
        </el-form-item>
        <el-form-item slot="col_2" label="履约保证金支付方式：">
          <el-select v-model="dataForm.performanceBondPay" placeholder="请选择" style="width:100%" @change="changePerformanceBondPay">
            <el-option v-for="(item,index) in performanceBondPayOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_3" prop="performanceBond" label="履约保证金/保函：">
          <el-input v-model="dataForm.performanceBond" size="small" placeholder="请填写金额（元）或金额比例（%）" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item v-if="isRequired('isNonCashPay', 'subsidyRate')" slot="col_3" prop="subsidyRate" label="票据补贴利率（%）：">
          <percentageInput v-model="dataForm.subsidyRate" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="bidEvaluationWay" label="评标办法：">
          <div class="input-row">
            <el-radio-group v-model="dataForm.bidEvaluationWay">
              <el-radio v-for="(item,index) in bidEvaluationWayOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
            </el-radio-group>
            <el-input v-show="dataForm.bidEvaluationWay==-1" v-model="dataForm.bidEvaluationOther" size="small" placeholder="请输入" />
          </div>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="specialDoc" label="特殊证件需求：">
          <div class="input-row">
            <el-checkbox-group v-model="dataForm.specialDoc">
              <el-checkbox v-for="(item,index) in specialDocOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-checkbox>
            </el-checkbox-group>
            <el-input v-if="dataForm.specialDoc.indexOf('-1')!=-1" v-model="dataForm.specialDocOther" size="small" placeholder="请输入" />
          </div>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="bidSituation" label="招标文件及图纸资料：">
          <div class="input-row">
            <el-checkbox-group v-model="dataForm.bidSituation">
              <el-checkbox v-for="(item,index) in bidSituationOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-checkbox>
            </el-checkbox-group>
            <el-input v-if="dataForm.bidSituation.indexOf('-1')!=-1" v-model="dataForm.bidSituationOther" size="small" placeholder="请输入" />
          </div>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="successCaliBratFlow" label="开中标及定标流程：">
          <el-input v-model="dataForm.successCaliBratFlow" type="textarea" :autosize="{ minRows: 6}" size="small" placeholder="至少4个汉字，至多500汉字" maxlength="500" />
        </el-form-item>
      </row-layout>
      <row-layout v-if="dataForm.isContractor!=1" :cols="1">
        <el-form-item slot="col_1" prop="marketBottomLine" label="招标文件要求提供的项目管理班组及其要求的条款：">
          <el-input v-model="dataForm.marketBottomLine" type="textarea" :autosize="{ minRows: 6}" size="small" placeholder="至少15个汉字，至多500汉字" maxlength="500" />
        </el-form-item>
      </row-layout>
      <row-layout v-if="dataForm.isContractor!=1" :cols="1">
        <el-form-item slot="col_1" prop="breachDuty" label="重点要求及违约责任：">
          <el-input v-model="dataForm.breachDuty" type="textarea" :autosize="{ minRows: 6}" size="small" placeholder="至少15个汉字，至多500汉字" maxlength="500" />
        </el-form-item>
      </row-layout>
      <row-layout v-if="dataForm.isContractor!=1" :cols="1">
        <el-form-item slot="col_1" prop="settleStyleExplain" label="结算方式说明：">
          <el-input v-model="dataForm.settleStyleExplain" type="textarea" :autosize="{ minRows: 6}" size="small" placeholder="至少15个汉字，至多500汉字" maxlength="500" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="otherInstructions" label="其他说明（含创优计划）：">
          <el-input v-model="dataForm.otherInstructions" type="textarea" :autosize="{ minRows: 6}" size="small" placeholder="请输入" maxlength="500" />
        </el-form-item>
      </row-layout>
      <form-title :title="'招标文件支付条款'"></form-title>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="prePayment" label="预付款(%)：">
          <percentageInput v-model="dataForm.prePayment" />
        </el-form-item>
        <el-form-item slot="col_2" label="进度款(%)：">
          <percentageInput v-model="dataForm.proPayment" />
        </el-form-item>
        <el-form-item slot="col_3" prop="completedPayment" label="完工款(%)：">
          <percentageInput v-model="dataForm.completedPayment" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="settlement" label="结算款(%)：">
          <percentageInput v-model="dataForm.settlement" />
        </el-form-item>
        <el-form-item slot="col_2" prop="retmoney" label="质保金(%)：">
          <percentageInput v-model="dataForm.retmoney" />
        </el-form-item>
      </row-layout>
      <form-title :title="'进度款(%)-按节点收款'"></form-title>
      <div>
        <el-button type="primary" size="small" @click="addReviewProgressDetail">新增</el-button>
      </div>
      <el-table :data="dataForm.bidPreReviewProgressDetail" class="f2bpmui-datagrid-vuetable" border>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="节点内容">
          <template slot-scope="scope">
            <el-input v-model="scope.row.nodeContent" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="进度款（%）">
          <template slot-scope="scope">
            <percentageInput v-model="scope.row.proportProgPayment" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="delReviewProgressDetail(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <form-title :title="'评审意见'"></form-title>
      <el-form :disabled="(WFContext.JumpToTaskId||pageBaseInfo.workflowInstinceState==2)?false:setting.readonly"
        ref="reviewForm" :rules="dataRule" :model="dataForm">
        <row-layout :cols="3">
          <el-form-item slot="col_1" label="评审结果：" label-width="190px">
            <el-radio-group v-model="dataForm.reviewResult" :disabled="true">
              <el-radio v-for="(item,index) in auditResultOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </row-layout>
        <row-layout v-if="isShowAduit('业务单元负责人')||dataForm.businessUnitLeaderResult||currentActivityName=='结束'" :cols="1">
          <el-form-item slot="col_1" prop="businessUnitLeaderResult" label="业务单元负责人意见：" label-width="190px">
            <div class="input-row">
              <el-select :disabled="!isShowAduit('业务单元负责人')" style="width:150px" v-model="dataForm.businessUnitLeaderResult" placeholder="请选择">
                <el-option v-for="(item,index) in auditResultOptions" :key="index" :value="item.configValue" :label="item.configName">
                  {{ item.configName }}
                </el-option>
              </el-select>
              <el-input :disabled="!isShowAduit('业务单元负责人')" v-model="dataForm.businessUnitLeaderRemark" size="small" placeholder="请重点审核表单填写信息及上传资料的真实性，项目介绍人信誉等" />
            </div>
          </el-form-item>
        </row-layout>
        <row-layout v-if="isShowAduit('业务发展部负责人')||dataForm.businessDevelopmentResult||currentActivityName=='结束'" :cols="1">
          <el-form-item slot="col_1" prop="businessDevelopmentResult" label="业务发展部负责人意见：" label-width="190px">
            <div class="input-row">
              <el-select :disabled="!isShowAduit('业务发展部负责人')" style="width:150px" v-model="dataForm.businessDevelopmentResult" placeholder="请选择">
                <el-option v-for="(item,index) in auditResultOptions" :key="index" :value="item.configValue" :label="item.configName">
                  {{ item.configName }}
                </el-option>
              </el-select>
              <el-input :disabled="!isShowAduit('业务发展部负责人')" v-model="dataForm.businessDevelopmentRemark" size="small" placeholder="请重点审核表单填写信息及上传资料的真实性，项目介绍人信誉等" />
            </div>
          </el-form-item>
        </row-layout>
        <row-layout v-if="isShowAduit('业务中心负责人')||dataForm.businessCentreLeaderResult||currentActivityName=='结束'" :cols="1">
          <el-form-item slot="col_1"  prop="businessCentreLeaderResult" label="业务中心负责人意见：" label-width="190px">
            <div class="input-row">
              <el-select :disabled="!isShowAduit('业务中心负责人')" style="width:150px" v-model="dataForm.businessCentreLeaderResult" placeholder="请选择">
                <el-option v-for="(item,index) in auditResultOptions" :key="index" :value="item.configValue" :label="item.configName">
                  {{ item.configName }}
                </el-option>
              </el-select>
              <el-input :disabled="!isShowAduit('业务中心负责人')" v-model="dataForm.businessCentreLeaderRemark" size="small" placeholder="请重点审核表单填写信息及上传资料的真实性，项目介绍人信誉等" />
            </div>
          </el-form-item>
        </row-layout>
        <row-layout v-if="isShowAduit('审计法务中心,法务经理')||dataForm.auditLegalCenterResult||currentActivityName=='结束'" :cols="1">
          <el-form-item slot="col_1" prop="auditLegalCenterResult" label="审计法务中心意见：" label-width="190px">
            <div class="input-row">
              <el-select :disabled="!isShowAduit('审计法务中心,法务经理')" style="width:150px" v-model="dataForm.auditLegalCenterResult" placeholder="请选择">
                <el-option v-for="(item,index) in auditResultOptions" :key="index" :value="item.configValue" :label="item.configName">
                  {{ item.configName }}
                </el-option>
              </el-select>
              <el-input :disabled="!isShowAduit('审计法务中心,法务经理')" v-model="dataForm.auditLegalCenterRemark" size="small" placeholder="请重点审核客户资信是否符合营销底限并评审招标文件及合同的条款是否合法" />
            </div>
          </el-form-item>
        </row-layout>
        <row-layout v-if="isShowAduit('财务管理中心负责人')||dataForm.financialManagementResult||currentActivityName=='结束'" :cols="1">
          <el-form-item slot="col_1" prop="financialManagementResult" label="财务管理中心负责人意见：" label-width="190px">
            <div class="input-row">
              <el-select :disabled="!isShowAduit('财务管理中心负责人')" style="width:150px" v-model="dataForm.financialManagementResult" placeholder="请选择">
                <el-option v-for="(item,index) in auditResultOptions" :key="index" :value="item.configValue" :label="item.configName">
                  {{ item.configName }}
                </el-option>
              </el-select>
              <el-input :disabled="!isShowAduit('财务管理中心负责人')" v-model="dataForm.financialManagementRemark" size="small" placeholder="请重点审核付款方式、结算方式是否符合营销底限；客户及项目介绍人过往履约情况" />
            </div>
          </el-form-item>
        </row-layout>
        <row-layout v-if="isShowAduit('投标管理部投标专员,投标管理部投标经理')||dataForm.bidManageDepartResult||currentActivityName=='结束'" :cols="1">
          <el-form-item slot="col_1" prop="bidManageDepartResult" label="投标管理部专员/经理意见：" label-width="190px">
            <div class="input-row">
              <el-select :disabled="!isShowAduit('投标管理部投标专员,投标管理部投标经理')" style="width:150px" v-model="dataForm.bidManageDepartResult" placeholder="请选择">
                <el-option v-for="(item,index) in auditResultOptions" :key="index" :value="item.configValue" :label="item.configName">
                  {{ item.configName }}
                </el-option>
              </el-select>
              <el-input :disabled="!isShowAduit('投标管理部投标专员,投标管理部投标经理')" v-model="dataForm.bidManageDepartRemark" size="small" placeholder="请重点从投标角度审核是否符合营销底限；表单及附件上传是否符合要求，客户以往价格水平等" />
            </div>
          </el-form-item>
        </row-layout>
        <row-layout v-if="isShowAduit('投标管理部负责人')||dataForm.bidManageLeaderResult||currentActivityName=='结束'" :cols="1">
          <el-form-item slot="col_1" prop="bidManageLeaderResult" label="投标管理部负责人意见：" label-width="190px">
            <div class="input-row">
              <el-select :disabled="!isShowAduit('投标管理部负责人')" style="width:150px" v-model="dataForm.bidManageLeaderResult" placeholder="请选择">
                <el-option v-for="(item,index) in auditResultOptions" :key="index" :value="item.configValue" :label="item.configName">
                  {{ item.configName }}
                </el-option>
              </el-select>
              <el-input :disabled="!isShowAduit('投标管理部负责人')" v-model="dataForm.bidManageLeaderRemark" size="small" placeholder="请重点从投标角度审核是否符合营销底限；表单及附件上传是否符合要求，客户以往价格水平等" />
            </div>
          </el-form-item>
        </row-layout>
        <row-layout v-if="isShowAduit('区域中心分管领导')||dataForm.regionalCenterLeaderResult||currentActivityName=='结束'" :cols="1">
          <el-form-item slot="col_1" prop="regionalCenterLeaderResult" label="区域中心分管领导意见：" label-width="190px">
            <div class="input-row">
              <el-select :disabled="!isShowAduit('区域中心分管领导')" style="width:150px" v-model="dataForm.regionalCenterLeaderResult" placeholder="请选择">
                <el-option v-for="(item,index) in auditResultOptions" :key="index" :value="item.configValue" :label="item.configName">
                  {{ item.configName }}
                </el-option>
              </el-select>
              <el-input :disabled="!isShowAduit('区域中心分管领导')" v-model="dataForm.regionalCenterLeaderRemark" size="small" placeholder="请输入" />
            </div>
          </el-form-item>
        </row-layout>
        <row-layout v-if="isShowAduit('市场管理中心负责人')||dataForm.marketManagementCenterResult||currentActivityName=='结束'" :cols="1">
          <el-form-item slot="col_1" prop="marketManagementCenterResult" label="市场管理中心负责人意见：" label-width="190px">
            <div class="input-row">
              <el-select :disabled="!isShowAduit('市场管理中心负责人')" style="width:150px" v-model="dataForm.marketManagementCenterResult" placeholder="请选择">
                <el-option v-for="(item,index) in auditResultOptions" :key="index" :value="item.configValue" :label="item.configName">
                  {{ item.configName }}
                </el-option>
              </el-select>
              <el-input :disabled="!isShowAduit('市场管理中心负责人')" v-model="dataForm.marketManagementCenterRemark" size="small" placeholder="请输入" />
            </div>
          </el-form-item>
        </row-layout>
      </el-form>
      <form-title :title="'附件'"></form-title>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="fileInfo" label="附件文件：">
          <update-files v-model="dataForm.fileInfo"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="编制人：">
          <span>{{ dataForm.createUserName }}</span>
        </el-form-item>
        <el-form-item slot="col_2" label="编制人部门：">
          <span>{{ dataForm.deptName }}</span>
        </el-form-item>
        <el-form-item slot="col_3" label="编制时间：">
          <span>{{ dataForm.createTime }}</span>
        </el-form-item>
      </row-layout>
    </el-form>
    <el-dialog
      title="提醒"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>客户状态修改，需填写修改原因。</span>
      <el-form>
        <el-form-item label="客户状态修改原因" prop="modifyReason">
          <el-input
            v-model="form.modifyReason"
            type="textarea"
            :autosize="{ minRows: 5}"
            size="small"
            placeholder="请输入客户状态修改原因"
            :rules="{ required: true, message: '必填项不能为空', trigger: 'blur' }"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import comMixin from '../minix';
import FormTitle from '@/components/basic/formTitle/index.vue';
import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import numberInput from '@/components/basic/numberInput/index.vue';
import amountInput from '@/components/basic/numberInput/amountInput.vue';
import percentageInput from '@/components/basic/numberInput/percentageInput.vue';
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import tools from '@/utils/fun.js';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import { checkProjectDetail } from '@/Api/workflowBusssion/bidReview.js'
const requiredArray = ['marketMainName', 'projectCode', 'builtArea', 'estimateBidAmount', 'isMultiPleiot',
  'isInvestandInvest', 'duration', 'isModelHouses', 'isPublicityAchievement', 'isPlatformPerformance',
  'isHiddenLabel', 'isPublicityFivemembers', 'bidDeadLine', 'contractType', 'isHouseOffset',
  'isBottomLine', 'isNonCashPay', 'payForBid' ,'depositPayment', 'bidEvaluationWay', 'specialDoc',
  'bidSituation', 'successCaliBratFlow', 'marketBottomLine', 'breachDuty', 'settleStyleExplain', 'performanceBond',
  'prePayment', 'completedPayment', 'settlement', 'retmoney', 'bidSecurity', 'businessUnitLeaderResult', 'fileInfo',
  'businessDevelopmentResult','businessCentreLeaderResult','auditLegalCenterResult', 'financialManagementResult',
  'bidManageDepartResult', 'bidManageLeaderResult', 'regionalCenterLeaderResult', 'marketManagementCenterResult'];
export default {
  components: { numberInput, FormTitle, selectorDialog, RowLayout, amountInput, percentageInput, updateFiles },
  mixins: [comMixin],
  data() {
    return {
      loading: false,
      formVisible: false,
      dialogVisible: false,
      radioOptions: [{
        configName: '是',
        configValue: '1'
      }, {
        configName: '否',
        configValue: '0'
      }],
      radioOptions2: [{
        configName: '有',
        configValue: '1'
      }, {
        configName: '无',
        configValue: '0'
      }],
      radioOptions3: [{
        configName: '需要',
        configValue: '1'
      }, {
        configName: '不需要',
        configValue: '0'
      }],
      dataForm: {
        code: '',
        projectCode: '',
        marketUnitName: '',
        successCaliBratFlow: '',
        isForewarningCustomer: '',
        customerForewarningReason: '',
        projectName: '',
        marketCenterName: '',
        followerName: '',
        projectLeaderName: '',
        isForewarningProjectLeader: '',
        projectLeaderForewarningReason: '',
        isCooperationCustomer: '',
        isContractor: '',
        bidForm: '',
        isCooperationProjectLeader: '',
        projectType: '',
        builtArea: '',
        productLineName: '',
        qualificationScope: '',
        buildHeight: '',
        estimateBidAmount: '',
        isMultiPleiot: '',
        isInvestandInvest: '',
        duration: '',
        isModelHouses: '',
        isPublicityAchievement: '',
        isPlatformPerformance: '',
        isHiddenLabel: '',
        isPublicityFivemembers: '',
        bidDeadLine: '',
        payForBid: '',
        marketBottomLine: '',
        breachDuty: '',
        contractType: '',
        address: '',
        bidAgency: '',
        detailAddress: '',
        isHouseOffset: '',
        houseOffsetRatio: '',
        isBottomLine: '',
        isNonCashPay: '',
        nonCashPayRatio: '',
        nonCashPayMode: '',
        depositPayment: '',
        performanceBond: '',
        performanceBondPay: '',
        subsidyRate: '',
        bidSecurity: '',
        bidEvaluationWay: '',
        successCaliBratFlow: '',
        settleStyleExplain: '',
        otherInstructions: '',
        prePayment: '',
        proPayment: '',
        completedPayment: '',
        settlement: '',
        retmoney: '',
        bidEvaluationOther: '',
        specialDocOther: '',
        bidSituationOther: '',
        specialDoc: [],
        fileInfo: [],
        bidSituation: [],
        bidPreReviewProgressDetail: []
      },
      reviewResultList: [{
        name: '业务单元负责人',
        result:'businessUnitLeaderResult',
        remark:'businessUnitLeaderRemark'
      },{
        name: '业务发展部负责人',
        result:'businessDevelopmentResult',
        remark:'businessDevelopmentRemark'
      },{
        name: '业务中心负责人',
        result:'businessCentreLeaderResult',
        remark:'businessCentreLeaderRemark'
      },{
        name: '审计法务中心,法务经理',
        result:'auditLegalCenterResult',
        remark:'auditLegalCenterRemark'
      },{
        name: '财务管理中心负责人',
        result:'financialManagementResult',
        remark:'financialManagementRemark'
      },{
        name: '投标管理部投标专员,投标管理部投标经理',
        result:'bidManageDepartResult',
        remark:'bidManageDepartRemark'
      },{
        name: '投标管理部负责人',
        result:'bidManageLeaderResult',
        remark:'bidManageLeaderRemark'
      },{
        name: '区域中心分管领导',
        result:'regionalCenterLeaderResult',
        remark:'regionalCenterLeaderRemark'
      },{
        name: '市场管理中心负责人',
        result:'marketManagementCenterResult',
        remark:'marketManagementCenterRemark'
      }],
      auditResultOptions: [],
      contractTypeOptions: [],
      depositPaymentOptions: [],
      performanceBondPayOptions: [],
      bidEvaluationWayOptions: [],
      specialDocOptions: [],
      bidFormOptions: [],
      bidSituationOptions: [],
      projectTypeOptions: [],
      marketMainDialog: { code: 'market_main', customDialog: 'market_main', isSetHead: 1, isMulti: false, initailData: [] },
      //必填项字段
      dataRule: RuleRequired.dataRule(requiredArray),
      form: {
        modifyReason: ''
      },
      WFContext: {}
    };
  },
  computed: {
    // isRequired() {
    //   if (this.dataForm.companyType === '1') {
    //     return [{ required: false }]
    //   }
    //   return [{ required: true, message: '必填项不能为空', trigger: ['blur', 'change'] }];
    // },
    /**
     * 当前节点
     */
    currentActivityName() {
      return WFContext.CurrentActivityName.trim();
    },
    /**
     * 客户状态
     */
    customerStatusDisabled() {
      const { isRevise } = this.$route.query;
      if (isRevise) { return false }
      return true;
    }
  },
  mounted() {
    this.WFContext = window.WFContext;
  },
  methods: {
    /**
     * 开具保函 切换
     */
    changeDepositPayment(val) {
      // 投标保证金支付方式=无，不可填 其他方式必填
      if(val == -1) {
        this.dataForm.payForBid = ''
        this.dataForm.bidSecurity = ''
      }
      this.dataRule['payForBid'] = RuleRequired.curFiledRule(val==1);
      this.dataRule['bidSecurity'] = RuleRequired.curFiledRule(val==2);
    },
    /**
     * 履约保证金支付方式
     */
    changePerformanceBondPay(val) {
      // 【履约保证金/保函】“履约保证金支付方式”有值时必填，否则非必填
      this.dataRule['performanceBond'] = RuleRequired.curFiledRule(val?true:false);
    },
    isRequired(fieldName, requiredField) {
      if(this.dataForm[fieldName] == '1') {
        this.dataRule[requiredField] = RuleRequired.curFiledRule(this.dataForm[fieldName]=='1');
        return true;
      }
      return false;
    },
    isShowAduit (val,isShow) {
      if(isShow) return true;
      const approveUsers = val.split(',');
      for (let index = 0; index < approveUsers.length; index++) {
        const ele = approveUsers[index];
        let isApprove = this.pageBaseInfo.buttons.find((res)=>{return res.buttonName == '审批'})
        if((WFContext.CurrentActivityName.trim().indexOf(ele) == 0 && (WFContext.JumpToTaskId || isApprove))) {
          return true;
        }
      }
      return false;
    },
    /**
     * 汉字
     */
    countChinese(str) {
      const reg = /[\u4e00-\u9fa5]/gu;
      const matches = str.match(reg);
      return matches === null ? 0 : matches.length;
    },
    /**
     * 检查项目是否预警
     */
    async checkProjectDetail() {
      const res = await checkProjectDetail({ marketCenterId: this.dataForm.marketMainId })
      if (res.code === 200) {
        const { isCooperationCustomer, isCooperationProjectLeader, isForewarningCustomer, isForewarningProjectLeader,
          customerForewarningReason, projectLeaderForewarningReason } = res.data;
        this.dataForm.isCooperationCustomer = isCooperationCustomer ? '1' : '0';
        this.dataForm.isCooperationProjectLeader = isCooperationProjectLeader ? '1' : '0';
        this.dataForm.isForewarningCustomer = isForewarningCustomer;
        this.dataForm.isForewarningProjectLeader = isForewarningProjectLeader;
        this.dataForm.customerForewarningReason = customerForewarningReason;
        this.dataForm.projectLeaderForewarningReason = projectLeaderForewarningReason;
        this.$forceUpdate();
      }
    },
    /**
     * 招投标形式更新
    */
    updateMarketMainValue(data) {
      if (data && data.length <= 0) return;
      const { id, marketUnitName, marketCenterName, customerName, NAME, followerName, bidForm, CODE, qualificationScope,
        projectLeaderName, projectType, productLineName, address, detailAddress, isContractor } = data[0];
      this.dataForm.marketMainId = id;
      this.dataForm.projectCode = CODE;
      this.dataForm.marketUnitName = marketUnitName;
      this.dataForm.customerName = customerName;
      this.dataForm.projectName = NAME;
      this.dataForm.marketCenterName = marketCenterName;
      this.dataForm.followerName = followerName;
      this.dataForm.projectLeaderName = projectLeaderName;
      this.dataForm.bidForm = bidForm;
      this.dataForm.projectType = projectType;
      this.dataForm.productLineName = productLineName;
      this.dataForm.address = address;
      this.dataForm.detailAddress = detailAddress;
      this.dataForm.isContractor = isContractor;
      this.dataForm.qualificationScope = qualificationScope;
      this.checkProjectDetail();
    },
    handleClick(val) {
      console.log('xxx', val)
    },
    changeCompanyType() {
      this.$refs['dataForm'].clearValidate(['taxRegistrationNum', 'regFound', 'legalbody', 'customerStatus'])
    },
    openDialogVisible() {
      this.dialogVisible = true;
      this.form.modifyReason = ''
    },
    handleClose() {

    },
    submitForm() {
      this.dataForm.modifyReason = this.form.modifyReason;
      this.dialogVisible = false;
    },
    /**
     * 切换地址
     */
    changeAreaId(data) {
      this.dataForm.areaId = data.value
      this.$refs['dataForm'].clearValidate('areaId')
    },
    /**
     * 添加进度款(%)-按节点收款
     */
    addReviewProgressDetail() {
      if (!this.dataForm.bidPreReviewProgressDetail) this.dataForm.bidPreReviewProgressDetail = []
      this.dataForm.bidPreReviewProgressDetail.push({
        bidPreReviewMainId: '',
        id: '',
        nodeContent: '',
        proportProgPayment: ''
      })
    },
    /**
     * 删除进度款(%)-按节点收款
     */
    delReviewProgressDetail(index) {
      this.dataForm.bidPreReviewProgressDetail.splice(index, 1)
    },
    /**
     * 行业类别
     */
    updateValue(data) {
      if (data.length > 0) {
        this.dataForm.industryCategoryId = data[0].id;
        this.dataForm.industryCategory = data[0].name;
      }
    },
    beforeInit() {
      this.getDataDictByConfigType()
      this.initRuleRequired()
      const { rowId } = this.$route.query;
      if(!rowId && this.dataForm.bidPreReviewProgressDetail.length <= 0) this.addReviewProgressDetail();
    },
    /**
     * 字段校验
     */
    initRuleRequired() {
      this.dataRule['successCaliBratFlow'] = RuleRequired.curCustomRule(true, function (rule, value, callbacak) {
        let len = value.match(/[\u4E00-\u9FA5]/g)?value.match(/[\u4E00-\u9FA5]/g).length:0;
        if (len >= 4 && len <= 500) {
          callbacak();
        } else {
          callbacak(new Error('至少4个汉字，至多500汉字'));
        }
       });
      this.dataRule['otherInstructions'] = RuleRequired.curCustomRule(false, function (rule, value, callbacak) {
        if(!value) callbacak();
        let len = value.match(/[\u4E00-\u9FA5]/g)?value.match(/[\u4E00-\u9FA5]/g).length:0;
        if (len >= 15 && len <= 500) {
          callbacak();
        } else {
          callbacak(new Error('15汉字<=内容<500汉字'));
        }
       });
      ['marketBottomLine', 'breachDuty', 'settleStyleExplain'].forEach(e=>{
        this.dataRule[e] = RuleRequired.curCustomRule(true, function (rule, value, callbacak) {
          if(!value) callbacak();
          let len = value.match(/[\u4E00-\u9FA5]/g)?value.match(/[\u4E00-\u9FA5]/g).length:0;
          if (len >= 15 && len <= 500) {
            callbacak();
          } else {
            callbacak(new Error('至少15个汉字，至多500汉字'));
          }
         });
      })
      this.reviewResultList.forEach(res=>{
        if(WFContext.CurrentActivityName.trim() == '结束') {
          this.dataRule[res.result] = RuleRequired.curFiledRule(false);
        } else {
          const ruleRequired = this.isShowAduit(res.name)
          this.dataRule[res.result] = RuleRequired.curFiledRule(ruleRequired);
        }
      })
      this.dataRule['performanceBond'] = RuleRequired.curFiledRule(this.dataForm.performanceBondPay?true:false);
      // 开具保函
      this.changeDepositPayment(this.dataForm.depositPayment)
    },
    afterInit() {
      // 特殊证件需求
      if (this.dataForm.specialDoc && this.dataForm.specialDoc.length > 0) {
        this.dataForm.specialDoc = this.dataForm.specialDoc.split(',')
      } else {
        this.dataForm.specialDoc = []
      }
      // 招标文件及图纸资料
      if (this.dataForm.bidSituation && this.dataForm.bidSituation.length > 0) {
        this.dataForm.bidSituation = this.dataForm.bidSituation.split(',')
      } else {
        this.dataForm.bidSituation = []
      }
      this.checkProjectDetail()
      this.initRuleRequired()
      this.removeReviewResult()
    },
    /**
     * 驳回的评审已经需要清空
     */
    removeReviewResult(){
      let isApprove = this.pageBaseInfo.buttons.find((res)=>{return res.buttonName == '审批'})
      if(isApprove){
        const index = this.reviewResultList.findIndex(res=>{return res.name.indexOf(WFContext.CurrentActivityName.trim()) != -1})
        if(index != -1){
          this.dataForm[this.reviewResultList[index].result] = ""
          this.dataForm[this.reviewResultList[index].remark] = ""
        }
      }
    },
    /**
     * 获取表单数据
     */
    getDataForm() {
      const _this = this;
      const dataForm = JSON.parse(JSON.stringify(_this.dataForm));
      dataForm.specialDoc = dataForm.specialDoc.toString();
      dataForm.bidSituation = dataForm.bidSituation.toString();
      return dataForm;
    },
    /**
     * 表单业务校验
     */
    validateParams() {
      if(this.dataForm.bidEvaluationWay.indexOf('-1')!=-1 && !this.dataForm.bidEvaluationOther) {
        FUI.Window.showMsg('其他评标办法描述不能为空');
        return false;
      }
      if(this.dataForm.specialDoc.indexOf('-1')!=-1 && !this.dataForm.specialDocOther) {
        FUI.Window.showMsg('其他特殊证据描述不能为空');
        return false;
      }
      if(this.dataForm.bidSituation.indexOf('-1')!=-1 && !this.dataForm.bidSituationOther) {
        FUI.Window.showMsg('招标文件及图纸资料其他文件描述不能为空');
        return false;
      }
      
      // 进度款(%)≥预收款(%)
      if(this.dataForm.proPayment && Number(this.dataForm.proPayment) < Number(this.dataForm.prePayment)) {
        FUI.Window.showMsg('进度款(%)必须≥预收款(%)');
        return false;
      }
      // 完工款(%)≥进度款(%)(包含最后一笔 节点进度款(%))
      if(this.dataForm.proPayment && 
        Number(this.dataForm.completedPayment) < Number(this.dataForm.proPayment)) {
        FUI.Window.showMsg('完工款(%)必须≥进度款(%)');
        return false;
      }
      // 结算款(%)≥完工款(%)
      if(Number(this.dataForm.settlement) < Number(this.dataForm.completedPayment)) {
        FUI.Window.showMsg('结算款(%)必须≥完工款(%)');
        return false;
      }
      // 结算款(%)+质保金(%)=100(%)
      if(tools.getNumAdd(this.dataForm.settlement,this.dataForm.retmoney) != 1) {
        FUI.Window.showMsg('结算款(%)+质保金(%)必须=100')
        return false;
      }
      for (var i = 0; i < this.dataForm.bidPreReviewProgressDetail.length; i++) {
        // 进度款(%) 与  进度款(%)-按节点收款  必填1个，只能填1个
        if(this.dataForm.proPayment && this.dataForm.bidPreReviewProgressDetail[i].proportProgPayment) {
          FUI.Window.showMsg('进度款(%) 与 进度款(%)-按节点收款  必填1个，只能填1个');
          return false;
        }
        if (this.dataForm.bidPreReviewProgressDetail.length > i + 1 && 
          Number(this.dataForm.bidPreReviewProgressDetail[i].proportProgPayment) > 
          Number(this.dataForm.bidPreReviewProgressDetail[i + 1].proportProgPayment)) {
          FUI.Window.showMsg('进度款(%)列表中，表格行 ' + (i + 2) + ' 的进度款比例，需要大于表格行 ' + (i + 1) + ' 的进度款比例')
          return false
        }
        if(i == this.dataForm.bidPreReviewProgressDetail.length - 1 &&
          Number(this.dataForm.completedPayment) < 
          Number(this.dataForm.bidPreReviewProgressDetail[i].proportProgPayment)) {
          FUI.Window.showMsg('完工款(%)必须≥进度款(%)列表中最后一笔节点进度款(%)');
          return false;
        }
        if(!this.dataForm.proPayment && (!this.dataForm.bidPreReviewProgressDetail[i].nodeContent || !this.dataForm.bidPreReviewProgressDetail[i].proportProgPayment)) {
          FUI.Window.showMsg('进度款(%)列表中，所有表格行都需补充完整！');
          return false
        }
      }
      return true;
    },
    async validateForm() {
      const _this = this;
      const valid = await _this.validateParams();
      if(!valid) return false;
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid) {
            if(_this.$refs['reviewForm']) {
              _this.$refs['reviewForm'].validate(val => {
                if(val) {
                  const index = _this.reviewResultList.findIndex(res=>{return res.name.indexOf(WFContext.CurrentActivityName.trim()) != -1})
                  if(index != -1 && _this.dataForm[_this.reviewResultList[index].result] == 0 && !_this.dataForm[_this.reviewResultList[index].remark]) {
                    FUI.Window.showMsg('请填写不同意原因');
                    return resolve(false);
                  }
                  return resolve(_this.getDataForm());
                } else {
                  FUI.Window.showMsg('请选择审批意见');
                  return resolve(false)
                }
              })
            } else {
              return resolve(_this.getDataForm());
            }
          } else {
            return resolve(false)
          }
        })
      });
    },
    /**
     * 初始化字典
     */
    async getDataDictByConfigType() {
      const res = await getDataDictByConfigType({ params: { configTypes: '评审结果,合同类型,投标保证金支付方式,履约保证金支付方式,评标办法,特殊证件需求,招标文件及图纸资料,招投标形式,立项类型' }})
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '评审结果':
              this.auditResultOptions = ele.dataDict;
              break;
            case '合同类型':
              this.contractTypeOptions = ele.dataDict;
              break;
            case '投标保证金支付方式':
              this.depositPaymentOptions = ele.dataDict;
              break;
            case '履约保证金支付方式':
              this.performanceBondPayOptions = ele.dataDict;
              break;
            case '评标办法':
              this.bidEvaluationWayOptions = ele.dataDict;
              break;
            case '特殊证件需求':
              this.specialDocOptions = ele.dataDict;
              break;
            case '招标文件及图纸资料':
              this.bidSituationOptions = ele.dataDict;
              break;
            case '招投标形式':
              this.bidFormOptions = ele.dataDict;
              break;
            case '立项类型':
              this.projectTypeOptions = ele.dataDict;
              break;
            default:
              break;
          }
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
::v-deep .designPrice {
  .el-input-group__append {
    padding: 0 12px;
  }
}
.input-row {
  display: flex;
  align-items: center;
  height: 40px;
  .el-input {
    flex:1;
    margin-left: 20px;
  }
}
</style>
