<template>
  <!-- 开票申请表单 -->
  <div v-loading="loading" class="flow-form">
     <el-form class="class" :model="dataForm" ref="dataForm" label-suffix="：" :rules="dataRule" label-width="180px">
      <row-layout title="项目信息" :cols="3">
          <el-form-item label="单据编号" slot="col_1" prop="code">
            <el-input v-model="dataForm.code" :disabled="getDisabledField('code')" placeholder="单据编号"></el-input>
          </el-form-item>
          <el-form-item label="项目编号" slot="col_2" prop="constructArchiveMainCode">
              <select-dialog :disabled="autoDisabled" :isLinkBtn="true" :btnDisabled="setting.readonly" :width="800" :modelData="projectCodeMode" :height="360" :value="dataForm.constructArchiveMainCode" @updateValue="constructArchiveMainCodeChange" dynamicModel="customDialog"></select-dialog>
          </el-form-item>
          <el-form-item label="项目名称" slot="col_3" prop="constructArchiveMainName">
            <el-input v-model="dataForm.constructArchiveMainName" :disabled="getDisabledField('constructArchiveMainName')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
          </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item label="管理部门" slot="col_1" prop="constructionUnitName">
          <el-input v-model="dataForm.constructionUnitName" :disabled="getDisabledField('constructionUnitName')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item label="项目负责人" slot="col_2" prop="projectManagerName">
          <select-dialog :disabled="getDisabledField('projectManagerName')" :btnDisabled="setting.readonly" :placeholder="msgTip.AUTO_PLACEHOLDER" :width="800" :modelData="projectManagerNameModel" :height="360" :value="dataForm.projectManagerName" @updateValue="projectManagerNameChange" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item label="累计上报产值(含税)(元)" slot="col_3" prop="escalationOutputValue">
          <link-input v-model="dataForm.escalationOutputValue" tip="链接到产值列表页面" :disabled="getDisabledField('escalationOutputValue')" :placeholder="msgTip.SYSTEM_PLACEHOLDER"></link-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item label="项目地址" slot="col_1" prop="projectAddress">
          <text-input :disabled="getDisabledField('projectAddress')" v-model="dataForm.projectAddress" :placeholder="msgTip.AUTO_PLACEHOLDER"></text-input>
        </el-form-item>
        <el-form-item slot="col_2">
        </el-form-item>
        <el-form-item slot="col_3">
        </el-form-item>
      </row-layout>
      <row-layout title="申请信息" :cols="3">
        <el-form-item label="收入合同编号" slot="col_1" prop="contractInMainCode">
          <select-dialog :disabled="getDisabledField('contractInMainCode')" :btnDisabled="setting.readonly" :width="800" :modelData="contractInMainCodeMode" :height="360" :value="dataForm.contractInMainCode" @updateValue="contractInMainCodeChange" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item label="收入合同名称" slot="col_2" prop="contractInMainName">
          <el-input v-model="dataForm.contractInMainName" :disabled="getDisabledField('contractInMainName')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item label="开票分类" slot="col_3" prop="makeOutInvoiceType">
           <el-radio-group :disabled="getDisabledField('makeOutInvoiceType')" v-model="dataForm.makeOutInvoiceType" @change="invoiceTypeChange">
              <el-radio :label="rItem.configValue" :key="rItem.configValue" :name="rItem.configValue" v-for="rItem in makeOutInvoiceTypeData">{{rItem.configName}}</el-radio>
            </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item label="税跨报号" slot="col_1" prop="taxAcross">
          <select-dialog :disabled="getDisabledField('taxAcross')" :btnDisabled="getDisabledField('taxAcross')" :width="800" :modelData="taxAcrossModel" :height="360" :value="dataForm.taxAcross" @updateValue="taxAcrossChange" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item label="预缴情况" slot="col_2" prop="prepaymentSituationType">
          <el-select v-model="dataForm.prepaymentSituationType" :disabled="getDisabledField('prepaymentSituationType')">
            <el-option v-for="pItem in pstData" :key="pItem.configValue" :label="pItem.configName" :value="pItem.configValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可申请开票金额(含税)(元)" slot="col_3" prop="mayApplyInvoiceAmountTax">
          <el-input v-model="dataForm.mayApplyInvoiceAmountTax" :disabled="getDisabledField('mayApplyInvoiceAmountTax')" placeholder="预缴金额"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item label="是否预付款" slot="col_1" prop="isAdvance" v-if="isAdvanceStatus">
          <el-radio-group v-model="dataForm.isAdvance" :disabled="getDisabledField('isAdvance')" @change="isAdvanceChange">
            <el-radio :label="key" :key="key" v-for="(rValue,key) in radioCheck">{{rValue}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="预缴完税凭证号" slot="col_2" prop="taxPaymentVoucherNo">
          <select-dialog :disabled="getDisabledField('taxPaymentVoucherNo')" :btnDisabled="setting.readonly" :width="800" :modelData="voucherMode" :height="360" :value="dataForm.constructArchiveMainCode" @updateValue="voucherModeChange" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item label="累计已开票金额(含税)(元)" slot="col_3" prop="totalInvoicedAmountTax">
          <amount-input v-model="dataForm.totalInvoicedAmountTax" :disabled="getDisabledField('totalInvoicedAmountTax')" @change="invoiceAmountTaxAmountChagne" defaultValue clearable :placeholder="msgTip.SYSTEM_PLACEHOLDER"></amount-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item label="税率" slot="col_1" prop="taxRate">
          <select-dialog disabled :btnDisabled="getDisabledField('taxRate')" :width="800" :modelData="taxRateModel" :height="360" :value="dataForm.taxRate" @updateValue="taxRateChange" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item label="累计已预缴计税基数(元)" slot="col_2" prop="totalPrepaidTaxBaseAmount">
          <amount-input v-model="dataForm.totalPrepaidTaxBaseAmount" :disabled="getDisabledField('totalPrepaidTaxBaseAmount')" @change="invoiceAmountTaxAmountChagne" defaultValue clearable :placeholder="msgTip.SYSTEM_PLACEHOLDER"></amount-input>
        </el-form-item>
        <el-form-item label="百望开票" slot="col_3" prop="baiWangTicketType">
          <el-radio-group v-model="dataForm.baiWangTicketType" :disabled="getDisabledField('baiWangTicketType')">
              <el-radio :label="rItem.configValue" :key="rItem.configValue" v-for="rItem in baiWangTicketTypeRadio">{{rItem.configName}}</el-radio>
            </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="3">
        <el-form-item label="开票申请说明" slot="col_1" prop="invoicingApplicationRemark">
          <el-input type="textarea" v-model="dataForm.invoicingApplicationRemark" :disabled="getDisabledField('invoicingApplicationRemark')" :rows="5" placeholder="开票申请说明"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="3" v-if="getShowHideField('overOutputRemark')">
        <el-form-item label="超产值开票原因" slot="col_1" prop="overOutputRemark">
          <el-input type="textarea" v-model="dataForm.overOutputRemark" :rows="5" :disabled="getDisabledField('overOutputRemark')" placeholder="超产值开票原因"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="3" v-if="getShowHideField('unpaidAdvanceRemark')">
        <el-form-item label="未预缴开票原因" slot="col_1" prop="unpaidAdvanceRemark">
          <el-input type="textarea" v-model="dataForm.unpaidAdvanceRemark" :disabled="getDisabledField('unpaidAdvanceRemark')" :rows="5" placeholder="未预缴提前开票原因"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item label="是否关闭" slot="col_1" prop="isEnable">
           <el-radio-group v-model="dataForm.isEnable" :disabled="getDisabledField('isEnable')">
            <el-radio :label="key" :key="key" v-for="(rValue,key) in radioCheck">{{rValue}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="对接状态" slot="col_2" prop="dockingStatus">
          <el-select v-model="dataForm.dockingStatus" :disabled="getDisabledField('dockingStatus')">
            <el-option v-for="dItem in dockingStatusData" :key="dItem.configValue" :label="dItem.configName" :value="dItem.configValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="对接备注" slot="col_3" prop="dockingRemark">
          <el-input v-model="dataForm.dockingRemark" :disabled="getDisabledField('dockingRemark')" placeholder="对接备注"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout title="开票信息" :cols="3">
        <el-form-item label="是否红票" slot="col_1" prop="isRedTicket">
          <el-radio-group v-model="dataForm.isRedTicket" @change="isRedTicketChange" :disabled="getDisabledField('isRedTicket')">
            <el-radio :label="key" :key="key" v-for="(rValue,key) in radioCheck">{{rValue}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="对应蓝字发票号码" slot="col_2" prop="blueFontInvoiceNo">
          <select-dialog :disabled="getDisabledField('blueFontInvoiceNo')" :btnDisabled="setting.readonly" :width="800" :modelData="blueFontInvoiceNoModel" :height="360" :value="dataForm.blueFontInvoiceNo" @updateValue="blueFontInvoiceNoChange" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item label="发票类型" slot="col_3" prop="invoiceType">
          <el-select v-model="dataForm.invoiceType" :disabled="getDisabledField('invoiceType')">
            <el-option v-for="item in invoiceTypeData" :key="item.configValue" :label="item.configName" :value="item.configValue"></el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item label="是否异地经营" slot="col_1" prop="isOperatePlace">
          <el-radio-group v-model="dataForm.isOperatePlace" :disabled="getDisabledField('isOperatePlace')" @change="isOperatePlaceChange">
            <el-radio :label="key" :key="key" v-for="(rValue,key) in radioCheck">{{rValue}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="红字信息表编号" slot="col_2" prop="redLetterInfoNumber">
          <el-input v-model="dataForm.redLetterInfoNumber" :disabled="getDisabledField('redLetterInfoNumber')" placeholder="红字信息表编号"></el-input>
        </el-form-item>
        <el-form-item label="红字信息表UUID" slot="col_3" prop="redLetterInfoUuid">
          <el-input v-model="dataForm.redLetterInfoUuid" :disabled="getDisabledField('redLetterInfoUuid')" placeholder="红字信息表UUID"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item label="销售方" slot="col_1" prop="sellerName">
          <select-dialog :disabled="getDisabledField('sellerName')" :btnDisabled="setting.readonly" :width="600" :height="360" :value="dataForm.sellerName" @updateValue="sellerNameChange" dynamicModel="selectOrg"></select-dialog>
        </el-form-item>
        <el-form-item label="销售方纳税识别号" slot="col_2" prop="sellerTaxIdentificationNumber">
          <el-input v-model="dataForm.sellerTaxIdentificationNumber" :disabled="getDisabledField('sellerTaxIdentificationNumber')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item label="销售方地址" slot="col_3" prop="sellerAddress">
          <el-input v-model="dataForm.sellerAddress" :disabled="getDisabledField('sellerAddress')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item label="销售方电话" slot="col_1" prop="sellerPhone">
          <text-input v-model="dataForm.sellerPhone" :disabled="getDisabledField('sellerPhone')" :placeholder="msgTip.AUTO_PLACEHOLDER"></text-input>
        </el-form-item>
        <el-form-item label="销售方开户行" slot="col_2" prop="sellerOpenAccountBank">
          <text-input v-model="dataForm.sellerOpenAccountBank" :disabled="getDisabledField('sellerOpenAccountBank')" :placeholder="msgTip.AUTO_PLACEHOLDER"></text-input>
        </el-form-item>
        <el-form-item label="销售方账号" slot="col_3" prop="sellerAccountNumber">
          <el-input v-model="dataForm.sellerAccountNumber" :disabled="getDisabledField('sellerAccountNumber')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item label="购方" slot="col_1" prop="buyerName">
          <el-input v-model="dataForm.buyerName" :disabled="getDisabledField('buyerName')" placeholder="购方(名称)"></el-input>
        </el-form-item>
        <el-form-item label="购方纳税识别号" slot="col_2" prop="buyerTaxIdentificationNumber">
          <text-input v-model="dataForm.buyerTaxIdentificationNumber" :disabled="getDisabledField('buyerTaxIdentificationNumber')" :placeholder="msgTip.AUTO_PLACEHOLDER"></text-input>
        </el-form-item>
        <el-form-item label="购方地址" slot="col_3" prop="buyerAddress">
          <text-input v-model="dataForm.buyerAddress" :disabled="getDisabledField('buyerAddress')" :placeholder="msgTip.AUTO_PLACEHOLDER"></text-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item label="购方电话" slot="col_1" prop="buyerPhone">
          <text-input v-model="dataForm.buyerPhone" :disabled="getDisabledField('buyerPhone')" placeholder="购方电话"></text-input>
        </el-form-item>
        <el-form-item label="购方开户行" slot="col_2" prop="buyerOpenAccountBank">
          <el-input v-model="dataForm.buyerOpenAccountBank" :disabled="getDisabledField('buyerOpenAccountBank')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item label="购方账号" slot="col_3" prop="buyerAccountNumber">
          <el-input v-model="dataForm.buyerAccountNumber" :disabled="getDisabledField('buyerAccountNumber')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item label="开票申请金额(含税)(元)" slot="col_1" prop="invoiceApplicationAmountTax">
          <amount-input v-model="dataForm.invoiceApplicationAmountTax" disabled :placeholder="msgTip.SYSTEM_PLACEHOLDER"></amount-input>
        </el-form-item>
        <el-form-item label="开票申请金额(无税)(元)" slot="col_2" prop="invoiceApplicationAmountUntax">
          <amount-input v-model="dataForm.invoiceApplicationAmountUntax" disabled :placeholder="msgTip.SYSTEM_PLACEHOLDER"></amount-input>
        </el-form-item>
        <el-form-item slot="col_3" label="税额" prop="tax">
          <amount-input v-model="dataForm.tax" disabled :placeholder="msgTip.SYSTEM_PLACEHOLDER"></amount-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3"> 
        <el-form-item slot="col_1" label="快递方式" prop="fastMailWay">
          <el-select v-model="dataForm.fastMailWay" :disabled="getDisabledField('fastMailWay')" @change="fastMailWayChange">
            <el-option v-for="fItem in fastMailWaySelecte" :key="fItem.configValue" :label="fItem.configName" :value="fItem.configValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" label="收件人" prop="recipient">
          <text-input v-model="dataForm.recipient" :disabled="getDisabledField('recipient')" :placeholder="msgTip.ENTER_PLACEHOLDER"></text-input>
        </el-form-item>
        <el-form-item slot="col_3" label="收件人手机号" prop="recipientPhone">
          <text-input v-model="dataForm.recipientPhone" :disabled="getDisabledField('recipientPhone')" :placeholder="msgTip.ENTER_PLACEHOLDER"></text-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="收件人邮箱" prop="recipientEmail">
          <text-input v-model="dataForm.recipientEmail" :disabled="getDisabledField('recipientEmail')" placeholder="请输入"></text-input>
        </el-form-item>
        <el-form-item slot="col_2" label="开票状态" prop="invoiceStatus">
          <el-select v-model="dataForm.invoiceStatus" :disabled="getDisabledField('invoiceStatus')">
            <el-option v-for="iItem in invoiceStatusSelect" :key="iItem.configValue" :label="iItem.configName" :value="iItem.configValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_3" label="剩余可开票金额(含税)(元)" prop="residueInvoicableAmountTax">
          <amount-input v-model="dataForm.residueInvoicableAmountTax" :disabled="getDisabledField('residueInvoicableAmountTax')" :placeholder="msgTip.SYSTEM_PLACEHOLDER"></amount-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="跨地（市）标志" prop="crossGroundMark">
          <el-radio-group v-model="dataForm.crossGroundMark" :disabled="getDisabledField('crossGroundMark')">
            <el-radio :label="key" :key="key" v-for="(rValue,key) in radioCheck">{{rValue}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" label="建筑服务发生地" prop="buildingServiceTakesPlace">
          <!-- <el-input v-model="dataForm.buildingServiceTakesPlace" placeholder="建筑服务发生地"></el-input> -->
          <casc-select code="AddressCascade" :disabled="getDisabledField('buildingServiceTakesPlace')" :defaultValue="dataForm.buildingServiceTakesPlace" @change-select="buildSerTakesPlaceChange"></casc-select>
        </el-form-item>
        <el-form-item slot="col_3" label="建筑服务详细地址" prop="buildingServiceAddress">
          <text-input v-model="dataForm.buildingServiceAddress" :disabled="getDisabledField('buildingServiceAddress')" :placeholder="msgTip.ENTER_PLACEHOLDER"></text-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
         <el-form-item slot="col_1" label="折扣类型" prop="discountType">
          <el-radio-group v-model="dataForm.discountType" :disabled="getDisabledField('discountType')">
            <el-radio :label="rValue.configValue" :key="rValue.configValue" v-for="rValue in discountTypeRadio">{{rValue.configName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" label="整单折扣率" prop="wholeOrderDiscountRate">
          <percentage-input v-model="dataForm.wholeOrderDiscountRate" :disabled="getDisabledField('wholeOrderDiscountRate')" @change="wholeOrderDiscountRateBlur"></percentage-input>
        </el-form-item>
        <el-form-item slot="col_3" label="建筑项目名称" prop="buildingProjectName">
          <el-input v-model="dataForm.buildingProjectName" placeholder="建筑项目名称" :disabled="getDisabledField('buildingProjectName')"></el-input>
        </el-form-item>
      </row-layout> 
      <row-layout :cols="3">
         <el-form-item slot="col_1" label="整单折扣金额(含税)(元)" prop="wholeOrderDiscountAmount">
          <amount-input v-model="dataForm.wholeOrderDiscountAmount" :disabled="getDisabledField('wholeOrderDiscountAmount')" :placeholder="msgTip.ENTER_PLACEHOLDER" @change="wholeOrderDiscountAmountBlur"></amount-input>
        </el-form-item>
        <el-form-item slot="col_2"></el-form-item>
        <el-form-item slot="col_3"></el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="3">
         <el-form-item slot="col_1" label="发票备注" prop="invoiceRemark">
          <el-input type="textarea" v-model="dataForm.invoiceRemark" :disabled="getDisabledField('invoiceRemark')" :rows="5" placeholder="发票备注"></el-input>
         </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="3">
         <el-form-item slot="col_1" label="红字开票申请原因" prop="redInvoiceRemark">
          <el-input type="textarea" v-model="dataForm.redInvoiceRemark" :disabled="getDisabledField('redInvoiceRemark')" :rows="5" placeholder="红字开票申请原因"></el-input>
         </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="3">
         <el-form-item slot="col_1" label="收件人地址" prop="recipientAddress">
          <el-input type="textarea" v-model="dataForm.recipientAddress" :disabled="getDisabledField('recipientAddress')" :rows="5" placeholder="收件人地址"></el-input>
         </el-form-item>
      </row-layout>
      <row-layout title="申请明细信息" :cols="3" cell="3">
        <el-form-item slot="col_1" label-width="0" prop="detailList">
          <detail-list v-model="dataForm.detailList" :id="dataForm.id" :isRedTicket="dataForm.isRedTicket" :readOnly="setting.readonly" :ppData="ppData" :mayApplyInvoiceAmountTaxMethod="getMayApplyInvoiceAmountTaxApi" ref="subFromData"></detail-list>
        </el-form-item>
      </row-layout>
      <row-layout title="附件" :cols="3" cell="3">
         <el-form-item slot="col_1" prop="fileInfoList" label="附件：">
          <uploader-file v-model="dataForm.fileInfoList" :isReadOnly="getDisabledField('fileInfoList')"></uploader-file>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="createUserName" label="编制人：">
          <label class="label-style">{{dataForm.createUserName}}</label>
        </el-form-item>
        <el-form-item slot="col_2" prop="createUserDeptName" label="编制人部门：">
            <label class="label-style">{{dataForm.deptName}}</label>
        </el-form-item>
        <el-form-item slot="col_3" prop="createTime" label="编制时间：">
          <label class="label-style">{{ dataForm.createTime}}</label>
        </el-form-item>
      </row-layout>
     </el-form>
  </div>
</template>
<script>
import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import AmountInput from '@/components/basic/numberInput/amountInput.vue';
import CascSelect from '@/components/basic/cascSelect/index.vue';
import UploaderFile from '@/components/basic/uploaderFile/index.vue';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import LinkInput from '@/components/basic/elInput/linkInput.vue';
import TextInput from '@/components/basic/elInput/textInput.vue'; //清除空格组件
import PercentageInput from '@/components/basic/numberInput/percentageInput.vue';  //百分比
import FormTitle from '@/components/basic/formTitle/index.vue';  //标题
import DetailList from './components/detailList.vue';  //申请明细信息

import {
  TAXACROSS_MODE,
  PROJECTCODEINVOICE_MODE,
  VOUCHER_MODE,
  PROJECT_LEADER_MODEL,
  CONTRACTCODE_MODEL,
  MAKEDRAFT_STATUS, 
  VOUCHER_OPEN_MODE,
  REJECT_STATUS,
  TAX_RATE_ARCHIVE_MODEL
} from '@/views/businessModule/enum/param';
import constParams from './constParams';

import comMixin from '../minix';
import {
  getEscalationOutputValue, //累计上报产值(含税)(元)
  getTotalPrepaidTaxBaseAmount,  //累计已预缴计税基数(元)
  getTotalInvoicedAmountTax,  //累计已开票金额(含税)元
  getMayApplyInvoiceAmountTax, //可申请开票金额(含税)(元)
  getIsAdvanceApi,  //是否预付款接口
  getTaxApi,
  getSellerAndBuyerInfoByContractInMainIdApi,
  getSellerAndBuyerInfoByInvoiceCollectionMainIdApi,
  getMarketBusinessUnitInfoApi
  // getSellerAndBuyerInfoByContractInMainIdApi
} from '@/Api/invoice/invoiceApplyApi';
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import myFun from '@/utils/fun'


const nodeArray = ['财务管理中心税务主管', '税务会计', '建工税务会计', '园林税务会计开票', '幕墙税务会计2'];  //共同的节点(可编辑节点)
let nodeStatus = 0;
let nodeName = '';
let approveStatus = false; //是否是当前的审批人 wholeOrderDiscountAmount

//必填字段 
const mustFiles = ['constructArchiveMainCode', 'contractInMainCode', 'makeOutInvoiceType', 'taxRate', 'isRedTicket', 'fastMailWay', 'invoiceType',
  'sellerAddress', 'sellerPhone', 'sellerOpenAccountBank', 'sellerAccountNumber', 'isEnable'];
//分情况必填字段
const possibleFiles = ['blueFontInvoiceNo', 'sellerName', 'buyerName', 'taxAcross', 'sellerTaxIdentificationNumber',
        'buyerTaxIdentificationNumber', 'prepaymentSituationType', 'totalInvoicedAmountTax', 'unpaidAdvanceRemark', 'overOutputRemark',
        'buyerAddress', 'buyerPhone', 'redInvoiceRemark', 'buyerAccountNumber', 'buyerOpenAccountBank', 'recipientAddress',
      'invoiceRemark','redLetterInfoNumber','redLetterInfoUuid','recipient','recipientPhone','recipientEmail','crossGroundMark','buildingServiceTakesPlace','buildingServiceAddress','buildingProjectName','wholeOrderDiscountRate','wholeOrderDiscountAmount'];
//初始化必填字段(包括必填和分情况必填)
// const requiredFileds = ['constructArchiveMainCode', 'contractInMainCode', 'makeOutInvoiceType','invoiceRemark',
//   'isRedTicket', 'invoiceType', 'sellerName', 'sellerTaxIdentificationNumber', 'sellerAddress','redInvoiceRemark',
//   'sellerPhone', 'buyerPhone','buyerName', 'buyerTaxIdentificationNumber','wholeOrderDiscountRate', 'fastMailWay', 'fileInfoList','blueFontInvoiceNo','recipient','recipientPhone','recipientAddress','taxAcross','sellerOpenAccountBank'];
const requiredFileds = [...mustFiles, ...possibleFiles];

export default {
  components: {
    SelectDialog,
    RowLayout,
    AmountInput,
    CascSelect,
    UploaderFile,
    LinkInput,
    TextInput,
    PercentageInput,
    FormTitle,
    DetailList
  },
  mixins: [comMixin],
  data() { 
    return {
      loading: false,
      msgTip: RuleRequired.tipMsg,
      projectCodeMode: PROJECTCODEINVOICE_MODE,  //项目编号  项目档案
      // taxAcrossModel: TAXACROSS_MODE,  //跨税报号
      //{ code: 'KuaShuiBaoHaoTongYong', customDialog: 'KuaShuiBaoHaoTongYong', isSetHead: 1, isMulti: false, initailData: [] }
      // taxAcrossModel: { code: 'KuaShuiBaoHaoTongYong', customDialog: 'KuaShuiBaoHaoTongYong', isSetHead: 1, isMulti: false, initailData: [] },  //跨税报号
      taxAcrossModel: {
        code: 'KuaShuiBaoHaoTongYong_CP267',
        customDialog: 'KuaShuiBaoHaoTongYong_CP267',
        isSetHead: 1,
        isMulti: false,
        initailData: [],
        parm: {
          varParams: [{ key: 'constructArchiveMainId', value: '' }, {key:'contractInMainId',value:''}]
        }
      }, 
      projectManagerNameModel: PROJECT_LEADER_MODEL,  //项目负责人
      // contractInMainCodeMode: CONTRACTCODE_MODEL,  //收入合同编号  taxAcrossModel
      // contractInMainCodeMode: { code: 'ShouRuHeTongBianHao', customDialog: 'ShouRuHeTongBianHao', isSetHead: 1, isMulti: false, initailData: [] },
      contractInMainCodeMode: {
        code: 'ShouRuHeTongBianHao',
        customDialog: 'ShouRuHeTongBianHao',
        isSetHead: 1,
        isMulti: false,
        initailData: [],
        parm: {
          varParams: [{ key: 'constructArchiveMainId', value: '' }]
        }
      },
      taxRateModel: TAX_RATE_ARCHIVE_MODEL,  //税率
      voucherMode: VOUCHER_MODE,  //预缴完税凭证号
      blueFontInvoiceNoModel: VOUCHER_OPEN_MODE,  //对应蓝字发票号码
      //项目负责人
      autoDisabled: true,  //自动带出，不可编辑
      makeOutInvoiceTypeData: constParams.INVOICE_CLASSIFY,  //开票分类
      pstData: constParams.PREPAYMENT_SITUATION,  //预缴情况  PREPAYMENT_SITUATION_YES
      pstDataArray: [], //预缴情况
      invoiceTypeData: constParams.INVOICETYPE_SELECT,  //发票类型
      radioCheck: constParams.IS_CHECKED,  //radio 是和否选择
      baiWangTicketTypeRadio: constParams.BAIWAN_INVOICE,  //百望开票
      dockingStatusData: constParams.CONNECT_STATUS,  //对接状态
      // discountTypeRadio: constParams.DISCOUNT_TYPE_RADIO, //折扣类型
      discountTypeRadio: [], //折扣类型
      fastMailWaySelecte: constParams.FATMAILWAY_SELECT,  //快递方式
      invoiceStatusSelect: constParams.INVOICE_STATUS,  //开票状态
      dataForm: {
        id:'',
        code:'',  //单据编号
        constructArchiveMainCode:'', //项目编号
        constructArchiveMainName:'',//项目名称
        constructionUnitName:'',//管理部门
        projectManagerName: '', //项目负责人
        projectAddress:'',  //项目地址
        escalationOutputValue:'',//累计上报产值(含税)(元)
        contractInMainCode: '',//收入合同编号
        constructArchiveMainId: '', //项目id
        contractInMainId:'',  //收入合同id
        contractInMainName:'',//收入合同名称
        makeOutInvoiceType:'',//开票分类 (1-施工；2-设计；3-销售；4-其他；)
        taxAcross: '',//税跨报号
        orgId:'',
        voucherCrossTaxReportId:'',//税跨报号id
        prepaymentSituationType:'',//预缴情况 (1-已预缴；2-未预缴；3-无需预缴；)
        mayApplyInvoiceAmountTax:'',//可申请开票金额(含税)(元)
        isAdvance:'',//是否预付款
        taxPaymentVoucherNo:'',//预缴完税凭证号
        totalInvoicedAmountTax: '',//累计已开票金额(含税)(元)
        baseTaxRateArchiveId:'',  //税率Id
        taxRate: '',//税率 税率档案
        totalPrepaidTaxBaseAmount:'0',//累计已预缴计税基数(元) 默认值为0
        baiWangTicketType:'',//百望开票 (1-线下开票；2-直联开票；3-流水单开票；)
        invoicingApplicationRemark:'',//开票申请说明
        overOutputRemark:'',//超产值开票原因
        unpaidAdvanceRemark:'',//未预缴提前开票原因
        isEnable:'0',//是否关闭 (0:否 1： 是)  默认否
        dockingStatus:'',//对接状态 (1-直联对接成功；2-直联对接失败；3-流水单对接成功；4-流水单对接失败；5-流水单删除；)
        dockingRemark:'',//对接备注
        isRedTicket:'0',//是否红票 (0-否；1-是；)  默认否
        blueFontInvoiceNo: '',//对应蓝字发票号码
        invoiceOpenMainId:'',  //对应蓝字发票号码Id
        invoiceType:'',//发票类型
        isOperatePlace:'',//是否异地经营 (0-否；1-是；)
        redLetterInfoNumber:'',//红字信息表编号
        redLetterInfoUuid:'',//红字信息表UUID
        sellerName:'',//销售方(名称) 必填
        sellerTaxIdentificationNumber:'',//销售方纳税识别号 必填
        sellerAddress:'',//销售方地址 必填
        sellerPhone:'',//销售方电话 必填
        sellerOpenAccountBank:'',//销售方开户行
        sellerAccountNumber:'',//销售方账号
        buyerName:'', //购方(名称) 必填
        buyerTaxIdentificationNumber:'',//购方纳税识别号 必填
        buyerAddress:'',//购方地址
        buyerPhone:'',//购方电话
        buyerOpenAccountBank:'',//购方开户行
        buyerAccountNumber:'',//购方账号
        invoiceApplicationAmountTax:'',//开票申请金额(含税)(元)
        invoiceApplicationAmountUntax:'',//开票申请金额(无税)(元)
        tax:'',//税额
        fastMailWay:'',//快递方式  必填
        recipient:'',//收件人
        recipientPhone:'',//收件人手机号
        recipientEmail:'',//收件人邮箱
        invoiceStatus:'3',//开票状态 (1-已开票；2-部分开票；3-未开票；)
        residueInvoicableAmountTax:'',//剩余可开票金额(含税)(元)
        crossGroundMark:'',//跨地（市）标志
        buildingServiceTakesPlace:'',//建筑服务发生地
        buildingServiceAddress:'',//建筑服务详细地址
        discountType:'',//折扣类型 (1-价外；2-价内；)
        wholeOrderDiscountRate:'',//整单折扣率
        buildingProjectName:'',//建筑项目名称
        wholeOrderDiscountAmount:'',//整单折扣金额(含税)(元)
        invoiceRemark:'',//发票备注
        redInvoiceRemark:'',//红字开票申请原因
        recipientAddress:'',//收件人地址
        detailList: [
          // {
          //   key: 0,
          //   id:'',
          //   preferentialPolicy: '',//优惠政策 (1-出口免税和其他免税优惠政策；2-普通零税率；3-不征增值税；4-按5%简易征收；5-按3%简易征收；)
          //   baseServiceClassificationArchiveId:'',  //商品服务分类id
          //   baseServiceClassificationArchiveName: '',//商品服务分类(名称) 必填
          //   contentMakeOutInvoice:'',//开票内容 必填
          //   specification:'',//规格/型号 必填
          //   taxRate:'',//税率
          //   unit: '',//单位 数字
          //   objectNumber: '', //数量
          //   unitPriceTax: '',  //单价含税
          //   unitPriceUntax: '', //单价(无税)	
          //   includingTaxAmount: '',//金额(含税) 必填
          //   tax: '', //税额* 必填
          //   noTaxAmount:'', //金额(无税)* 必填
          // }
        ],//detailList  开票申请明细列表
        //百望重开记录
        baiWangTicketType:'',//百望开票
        invoiceApplicationAmountTax:'',//开票申请金额(含税)(元)
        dockingStatus:'',//对接状态 (1-直联对接成功；2-直联对接失败；3-流水单对接成功；4-流水单对接失败；5-流水单删除；)
        dockingRemark:'',//对接备注
        //操作时间
        fileInfoList: [],//附件 必填
        createUserId: '', //编制人Id
        createUserName:'',  //编制人姓名
        deptId:'',  //编制人部门Id
        lastModifyDeptName:'',//编制人部门
        createTime: '',//编制时间
        constructionUnitId: '',  //管理部门id
        projectManagerId: '',  //项目负责人id
        // contractType: '',  //合同类型  模块类型
        moduleType: '',  //模块类型
      },
      dataRule: RuleRequired.dataRule(requiredFileds),  //必填字段
      disabledFiled: { //不可编辑的一些字段 
        'code': true, //单据编号
        'constructArchiveMainCode': true, //项目编号
        'constructArchiveMainName': true, //项目名称
        'constructionUnitName': true, //管理部门
        'projectManagerName': true, //项目负责人
        'projectAddress': true, //项目地址
        'escalationOutputValue': true, //累计上报产值(含税)(元) 
        'contractInMainCode': true, //收入合同编号
        'contractInMainName': true, //收入合同名称
        'makeOutInvoiceType': false,  //开票分类
        'taxAcross': false,  //税跨报号
        'prepaymentSituationType': false ,//预缴情况
        'isAdvance': true,//是否预付款
        'totalInvoicedAmountTax': false ,//预缴完税凭证号
        'taxRate': false ,//税率
        'totalPrepaidTaxBaseAmount': false,//累计已预缴计税基数(元)
        'invoicingApplicationRemark': false ,//开票申请说明
        'overOutputRemark': false ,//超产值开票原因
        'unpaidAdvanceRemark': false ,//未预缴开票原因
        'isEnable': false,//是否关闭
        'dockingStatus': false ,//对接状态
        'dockingRemark': false ,//对接备注
        'isRedTicket': false,//是否红票
        'invoiceType': false ,//发票类型
        'isOperatePlace': false ,//是否异地经营
        'redLetterInfoNumber': false ,//红字信息表编号
        'redLetterInfoUuid': false ,//红字信息表UUID
        'sellerName': false ,//销售方
        'sellerTaxIdentificationNumber': false ,//销售方纳税识别号
        'sellerAddress': false ,//销售方地址
        'sellerPhone': false,//销售方电话
        'sellerOpenAccountBank': false ,//销售方开户行
        'sellerAccountNumber': false ,//销售方账号
        'buyerName': false ,//购方
        'buyerTaxIdentificationNumber': false ,//购方纳税识别号
        'buyerAccountNumber': false,//购方账号
        "buyerAddress": false,  //购方地址
        'buyerPhone': false,  //购方电话
        'buyerOpenAccountBank': false,//购方开户行
        'tax': true,  //税额
        'fastMailWay': false ,  //快递方式
        'recipient': false ,  //收件人
        'recipientPhone' :false ,  //收件人手机号
        'recipientEmail': true ,  //收件人邮箱
        'residueInvoicableAmountTax': false ,  //剩余可开票金额(含税)(元)
        'crossGroundMark': false ,  //跨地（市）标志
        'buildingServiceTakesPlace': false ,  //建筑服务发生地
        'buildingServiceAddress': false ,  //建筑服务详细地址
        'wholeOrderDiscountRate': false ,  //整单折扣率
        'buildingProjectName': false,  //建筑项目名称
        'wholeOrderDiscountAmount': false,//整单折扣金额(含税)(元)
        'invoiceRemark': false ,//发票备注
        'redInvoiceRemark': false ,//红字开票申请原因
        'recipientAddress': false ,//收件人地址
        'fileInfoList': false, //附件
        'totalPrepaidTaxBaseAmount': true,  //累计已开票金额(含税)(元)
        'mayApplyInvoiceAmountTax': true, //可申请开票金额(含税)(元)
        'totalInvoicedAmountTax': true, //累计已开票金额（含税）元
        'taxRate': false,  //税率
        "taxPaymentVoucherNo": true,  //预缴完税凭证号
        "blueFontInvoiceNo": false,  //对应蓝字发票号码
        'sellerAddress': false,  //销售方地址 默认可编辑
        'invoiceStatus': true, //开票状态
        'dockingStatus': true,  //对接状态
        'dockingRemark': true,  //对接备注
        'discountType': true,  //折扣类型  默认不可编辑
        'baiWangTicketType': true,  //百望开票
        'invoiceApplicationAmountTax': true, //开票申请金额
        'createUserName': true,  //操作人 编制人
        'createTime': true, //编制时间
      },
      ppData:[], //商品服务分类
      //判断显示隐藏的字段
      showHideField: {
        'isAdvance':true,//是否预付款
        'unpaidAdvanceRemark': true,//未预缴开票原因 默认显示
        'overOutputRemark': true, //超产值开票原因 默认隐藏  
        'redInvoiceRemark': true //红字开票申请原因
      }
    }
  },
  computed: {
    getDisabledField() {
      return (field) => {
        return this.disabledFiled[field] ? this.disabledFiled[field] : false;
      }
    },
    getShowHideField() {
      return (field) => {
        return this.showHideField[field] ? this.showHideField[field] : false;
      }
    },
    //是否预付款显示隐藏状态 开票分类=施工 或 设计 展示字段，否则隐藏字段
    isAdvanceStatus() {
      console.log("是否预付款===：",this.dataForm.makeOutInvoiceType);
      return (this.dataForm.makeOutInvoiceType === '1' || this.dataForm.makeOutInvoiceType === '2');
    }
  },
  mounted() { },
  methods: {
    //详情前置事件
    beforeInit() {
      nodeStatus = WFContext.WorkflowInstinceState; //节点状态 //0:拟稿 1:新增  2：审批中  3：审批完成  5:驳回
      nodeName = WFContext.CurrentActivityName;  //节点名称  
      this.dataRule['invoiceRemark'] = RuleRequired.curFiledRule(false);  //发票备注 默认非必填

      //这里初始化 分情况必填的字段 一进来不必填
      possibleFiles.forEach(filed => {
        this.dataRule[filed] = RuleRequired.curFiledRule(false);
      });

      const { wholeOrderDiscountRate, wholeOrderDiscountAmount, invoiceApplicationAmountTax } = this.dataForm;
      //整单折扣率校验
      this.dataRule['wholeOrderDiscountRate'] = [
        {
          required: true, validator: function (rule, value, callback) {
            console.log("查看整单折扣率的值：", Number(value));
            if (Number(value) < 0 || Number(value) > 1) {
              callback(new Error("请输入0%-100%闭区间之间"));
            }
            if (value && wholeOrderDiscountAmount) {
              callback(new Error("整单折扣率与整单折扣金额(含税)只能一个字段有值"));
            }
            callback();
          }, trigger: 'blur'
        }
      ]
      //获取数据字典的数据
      this.getDataDictByConfigType('开票分类,百望开票,发票类型,对接状态,预缴情况,开票状态,折扣类型,优惠政策,商品服务分类,快递方式');

      //整单折扣金额(含税)(元) 校验
      this.dataRule['wholeOrderDiscountAmount'] = [
        {
          required: true, validator: function (rule, value, callback) {
            if (Number(value) && wholeOrderDiscountRate) {
              callback(new Error("整单折扣率与整单折扣金额(含税)只能一个字段有值"));
            }
            else if (invoiceApplicationAmountTax && Number(value) > invoiceApplicationAmountTax) {
              callback(new Error("整单折扣金额(含税)(元)要小于或等于开票申请金额(含税)(元)"));
            } else if (Number(value) < 0) {
              callback(new Error("金额不能小于0"));
            }
            callback();
          }, trigger: 'blur'
        }
      ]
    },
    //详情后置事件
    afterInit() {
      nodeStatus = WFContext.WorkflowInstinceState; //节点状态 //0:拟稿 1:新增  2：审批中  3：审批完成  5:驳回
      nodeName = WFContext.CurrentActivityName;  //节点名称
      //是否是当前审批人 
      approveStatus = (this.pageBaseInfo && this.pageBaseInfo.buttons.some(btn => btn.buttonName === '审批'));

      //设置是否是不可编辑
      // if (this.setting.readonly || !nodeArray.includes(nodeName)) { 
      if (nodeStatus === 3) {
        Object.keys(this.disabledFiled).forEach(item => {
          this.disabledFiled[item] = true;
        })
      }

      //草稿状态及驳回发起人状态，编制人及有数据权限的用户 
      //节点为['财务管理中心税务主管', '税务会计', '建工税务会计', '园林税务会计开票', '幕墙税务会计2']时可编辑
      //可编辑的字段有是否红票、对应蓝字发票号、快递方式、发票类型、销售方、购方、税跨报号、销售方纳税识别号、购方纳税识别号、预缴情况
      const fieldValidteArray = ['isRedTicket', 'blueFontInvoiceNo', 'fastMailWay', 'sellerName', 'buyerName', 'taxAcross',
        'sellerTaxIdentificationNumber', 'buyerTaxIdentificationNumber', 'prepaymentSituationType'];   //可编辑的字段

      this.fieldDisabledStauts(fieldValidteArray);
      //发票类型
      this.invoiceTypeVerify();
      //对应蓝字发票号码
      this.blueFontInvoiceNoVerify();
      //销售方
      this.sellerNameVerify();
      //购方
      this.buyerNameVerify()
      //税跨报号
      this.taxAcrossVerify();
      //销售方纳税识别号
      this.sellerTaxIdentificationNumberVerify();
      //购方纳税识别号
      this.buyerTaxIdentificationNumberVerify();
      //预缴情况
      this.prepaymentSituationTypeVerify();
      //预缴完税凭证号
      this.taxPaymentVoucherNosVerify();
      //未预缴开票原因
      this.unpaidAdvanceRemarkVerify();
      //超产值开票原因
      this.overOutputRemarkVerify();
      //销售方地址
      this.sellerAddressVerify();
      //购方电话校验
      this.buyerPhoneVerify();
      //红字开票申请原因
      this.redInvoiceRemarkVerify();
      //销售方开户行
      this.sellerOpenAccountBankVerify();
      //销售方账号
      this.sellerAccountNumberVerify();
      //购方账号
      this.buyerAccountNumberVerify();
      //购方开户行
      this.buyerOpenAccountBankVerify();
      //开票申请金额(含税)(元)
      this.invoiceApplicationAmountTaxVerify();
      //开票申请说明
      this.invoicingApplicationRemarkVerify();
      //收件人地址
      this.recipientAddressVerify();
      //发票备注
      this.invoiceRemarkVerify();
      //是否关闭
      this.isEnableVerify();
      //是否异地经营
      this.isOperatePlaceVerify();
      //百望开票
      this.baiWangTicketTypeVerify();
      //红字信息表编号
      this.redLetterInfoNumberVerify();
      //红字信息标UUID
      this.redLetterInfoUuidVerify();
      //收件人
      this.recipientVerify();
      //收件人手机号
      this.recipientPhoneVerify();
      //收件人邮箱
      this.recipientEmailVerify();
      //跨地（市）标志
      this.crossGroundMarkVerify();
      //建筑服务发生地
      this.buildingServiceTakesPlaceVerify();
      //建筑服务详细地址
      this.buildingServiceAddressVerify();
      //建筑项目名称
      this.buildingProjectNameVerify();
      //折扣类型
      this.discountTypeVerify();
      //整单折扣率
      this.wholeOrderDiscountRateVerify();
    },
    //开票分类,百望开票,发票类型,对接状态,预缴情况,开票状态,优惠政策,快递方式,商品服务分类
    async getDataDictByConfigType(configTypes) {
      const { data, success } = await getDataDictByConfigType({ params: { configTypes: configTypes } });
      if (success) {
        // 开票分类
        this.makeOutInvoiceTypeData = data.find(item => item.dataDictType === '开票分类')?.dataDict || [];
        //百望开票
        this.baiWangTicketTypeRadio = data.find(item => item.dataDictType === '百望开票')?.dataDict || [];
        //发票类型
        this.invoiceTypeData = data.find(item => item.dataDictType === '发票类型')?.dataDict || [];
        //对接状态
        this.dockingStatusData = data.find(item => item.dataDictType === '对接状态')?.dataDict || [];
        //折扣类型
        this.discountTypeRadio = data.find(item => item.dataDictType === '折扣类型')?.dataDict || [];
        //预缴情况
        // this.pstData = data.find(item => item.dataDictType === '预缴情况')?.dataDict || [];
        this.pstDataArray = data.find(item => item.dataDictType === '预缴情况')?.dataDict || [];
        //开票状态
        this.invoiceStatusSelect = data.find(item => item.dataDictType === '开票状态')?.dataDict || [];
        //优惠政策
        this.preferentialPolicyData = data.find(item => item.dataDictType === '优惠政策')?.dataDict || [];
        //快递方式
        this.fastMailWaySelecte = data.find(item => item.dataDictType === '快递方式')?.dataDict || [];
        //商品服务分类
        this.ppData = data.find(item => item.dataDictType === '商品服务分类')?.dataDict || [];
        console.log("商品服务分类===：", this.ppData);
      }
    },
    //项目编号
    constructArchiveMainCodeChange(data) {
      console.log("项目编号===：", data, this.contractInMainCodeMode.parm.varParams);
      if (data && data.length > 0) {
        this.dataForm.constructArchiveMainId = data[0].id || ''; //项目id
        this.dataForm.projectManagerId = data[0].projectManagerId || '';  //项目介绍人
        this.dataForm.constructionUnitId = data[0].constructionUnitId || '';  //管理部门Id
        // this.contractInMainCodeMode.parm.constructArchiveMainId = data[0].id || '';
        this.dataForm.constructArchiveMainCode = data[0].code;  //项目编号
        this.dataForm.constructArchiveMainName = data[0].name;  //项目名称
        // this.dataForm.taxRate = data[0].prevalenceRate ? (data[0].prevalenceRate * 100) + '%' : '';  //税率
        this.dataForm.constructionUnitName = data[0].constructionUnitName;  //管理部门
        this.dataForm.projectManagerName = data[0].projectManagerName || '';  //项目负责人
        this.dataForm.projectAddress = data[0].projectAddress;  //项目地址

        this.contractInMainCodeMode.parm.varParams.find(item => item.key === 'constructArchiveMainId').value = data[0].id || '';
        //跨税报号弹框参数
        this.taxAcrossModel.parm.varParams.find(item => item.key === 'constructArchiveMainId').value = data[0].id || '';
      }

      this.getEscalationOutputValueApi();  //取累计上报产值(含税)(元)
    },
    //税率
    taxRateChange(data) {
      console.log("税率===：", data);
      this.dataForm.taxRate = (data[0] && data[0].taxRate) ? (data[0].taxRate * 100 + '%') : '';  //税率
    },
    //项目负责人
    projectManagerNameChange(data) {
      console.log("项目负责人：", data);
      this.dataForm.projectManagerName = data[0].personName;  //项目负责人
    },
    //收入合同编号
    contractInMainCodeChange(data) {
      console.log("收入合同编号：", data);

      if (data.length > 0) {
        this.dataForm.contractInMainCode = data[0].code || '';  //收入合同编号
        this.dataForm.contractInMainId = data[0].id || '';  //收入合同id
        this.dataForm.contractInMainName = data[0].contract || '';  //收入合同名称
        this.dataForm.moduleType = data[0].moduleType || ''; //模块类型

        //跨税报号弹框参数
        this.taxAcrossModel.parm.varParams.find(item => item.key === 'contractInMainId').value = data[0].id || '';

        if (data[0] && data[0].moduleType) {
          this.makeOutInvoiceTypeJudge(data[0].moduleType);
        }

        this.getEscalationOutputValueApi(); //取累计上报产值(含税)(元)
        this.getTotalPrepaidTaxBaseAmountApi(); //累计已预缴计税基数(元)
        this.getTotalInvoicedAmountTaxApi();  //累计已开票金额(含税)元
        this.getMayApplyInvoiceAmountTaxApi();  //可申请开票金额(含税
        this.getIsAdvanceData();  //获取是否预付款结果
        this.getTaxData();  //获取税率
        this.getSellerAndBuyerInfoByContractInMainIdData(data[0].id);  //根据收入合同id获取销售方和购方信息

      }

    },
    //开票分类
    invoiceTypeChange(e) {
      console.log("开票分类：", e);
      this.getEscalationOutputValueApi(); //取累计上报产值(含税)(元)
    },
    //预缴完税凭证
    voucherModeChange(data) {
      console.log("预缴完税凭证===:", data);
    },
    //税跨报号
    taxAcrossChange(data) {
      console.log("税跨报号===:", data);
      if (data && data.length > 0) {
        this.dataForm.taxAcross = data[0].taxAcross;
      }
    },
    //对应蓝字发票号码
    blueFontInvoiceNoChange(data) {
      console.log("对应蓝字发票号码===:", data);
      //对应蓝字发票号码回显的字段
      if (data.length > 0) { 
        this.dataForm.blueFontInvoiceNo = data[0].invoiceNo;  //发票号码
        this.dataForm.invoiceOpenMainId = data[0].id;  //对应蓝字发票号码Id
        this.invoiceNumberChangeFiled(data[0]);
        //根据发票id获取销售方和购方信息
        this.getSellerAndBuyerInfoByInvoiceCollectionMainIdData(data[0].id);
      }
    },
    //销售方选择
    sellerNameChange(data) {
      console.log("销售方===:", data);
      if (data.length > 0) { 
        this.dataForm.sellerName = data[0].text;
        this.dataForm.orgId = data[0].value;  //组织id
        //根据组织id获取业务单元信息
        this.getMarketBusinessUnitInfoData(data[0].value);
      }
    },
    //累计已开票金额
    invoiceAmountTaxAmountChagne(e) {
      console.log('累计已开票金额:', e);
    },
    //建筑服务发生地
    buildSerTakesPlaceChange(data) {
      console.log('建筑服务发生地:', data);
      this.dataForm.buildingServiceTakesPlace = data.value || '';
    },
    //累计上报产值(含税)(元)
    async getEscalationOutputValueApi() {
      let dataParams = this.dataParams();
      let { data, code } = await getEscalationOutputValue(dataParams);
      if (code === 200) {
        this.dataForm.escalationOutputValue = (data === 0 || data) ? myFun.getTofixed(data, 2) : '';  //累计上报产值(含税)(元
      }
    },
    //累计已预缴计税基数(元) 
    async getTotalPrepaidTaxBaseAmountApi() {
      let dataParams = this.dataParams();
      let { data, code } = await getTotalPrepaidTaxBaseAmount(dataParams);
      if (code === 200) {
        this.dataForm.totalPrepaidTaxBaseAmount = data;  //累计已预缴计税基数(元)
      }
    },
    //获取是否预付款结果 
    async getIsAdvanceData() {
      const { invoiceApplicationAmountTax } = this.dataForm;
      let dataParams = this.dataParams();  //开票分类 收入合同id  项目id 参数
      dataParams['applyAmount'] = invoiceApplicationAmountTax || '';  //本次申请金额(元) 开票申请金额
      dataParams.id = '';  //开票申请表id
      let { data, code } = await getIsAdvanceApi(dataParams);
      if (code === 200) {
        let isAdvanceVal = (data === 0 || data === 1) ? data.toString() : '';
        this.dataForm.isAdvance = isAdvanceVal;
      }
    },
    //获取税率
    async getTaxData() {
      const { invoiceApplicationAmountTax } = this.dataForm;
      let dataParams = this.dataParams();
      dataParams['applyAmount'] = invoiceApplicationAmountTax || '';
      let { data, code } = await getTaxApi(dataParams);
      if (code === 200) {
        this.dataForm.baseTaxRateArchiveId = data.id;
        this.dataForm.taxRate = (data.taxRate === 0 || data.taxRate) ? myFun.getTofixed(data.taxRate * 100, 2) + '%' : '';
      }
    },

    //根据收入合同id获取销售方和购方信息
    async getSellerAndBuyerInfoByContractInMainIdData(contractInMainId) {
      let { code, data } = await getSellerAndBuyerInfoByContractInMainIdApi(contractInMainId);
      if (code === 200) { 
        this.getSellerAndBuyerInfoByContractInfo(data);
      }
    },
    //根据发票id获取销售方和购方信息
    async getSellerAndBuyerInfoByInvoiceCollectionMainIdData(invoiceCollectionMainId) { 
      let { code, data } = await getSellerAndBuyerInfoByInvoiceCollectionMainIdApi(invoiceCollectionMainId);
      if (code === 200) { 
        this.getSellerAndBuyerInfoByContractInfo(data);
      }
    },
    //根据组织id获取业务单元信息
    async getMarketBusinessUnitInfoData(orgId) { 
      let { code, data } = await getMarketBusinessUnitInfoApi(orgId);
      if (code === 200) { 
        if (data) { 
          //获取销售方纳税识别号
          this.dataForm.sellerTaxIdentificationNumber = data.taxIdentificationNumber || '';
        }
      }
    },
    //根据收入合同id获取销售方和购方信息
    // async getSellerAndBuyerInfoByContractInMainIdData(contractInMainId) { 
    //   let { code, data } = await getSellerAndBuyerInfoByContractInMainIdApi(contractInMainId);
    //   if (code === 200) { 

    //   }
    // },
    // 获取销售方和购方信息
    getSellerAndBuyerInfoByContractInfo(data) {
      this.dataForm.sellerName = data.sellerName || ''; //销售方
        this.dataForm.buyerName = data.buyerName || '';  //购方名称
        this.dataForm.buyerAccountNumber = data.buyerAccountNumber || '';  //购方账号
        this.dataForm.buyerAddress = data.buyerAddress || '';  //购方地址
        this.dataForm.buyerOpenAccountBank = data.buyerOpenAccountBank || '';  //购方开户行
        this.dataForm.buyerPhone = data.buyerPhone || '';  //购方电话
        this.dataForm.buyerTaxIdentificationNumber = data.buyerTaxIdentificationNumber || ''; //购方纳税识别号
        this.dataForm.sellerAccountNumber = data.sellerAccountNumber || '';  //销售方账号
        this.dataForm.sellerAddress = data.sellerAddress || '';  //销售方地址
        this.dataForm.sellerName = data.sellerName || ''; //销售方(名称) 必填
        this.dataForm.sellerOpenAccountBank = data.sellerOpenAccountBank || '';  //销售方开户行
        this.dataForm.sellerPhone = data.sellerPhone || ''; //销售方电话 必填
        this.dataForm.sellerTaxIdentificationNumber = data.sellerTaxIdentificationNumber || '';  //销售方纳税识别号
    },

    //累计已开票金额(含税)元
    async getTotalInvoicedAmountTaxApi() {
      const dataParams = this.dataParams(); //开票分类 收入合同id  项目id 参数
      let { data, code } = await getTotalInvoicedAmountTax(dataParams);
      if (code === 200) {
        this.dataForm.totalInvoicedAmountTax = data || myFun.getTofixed('0', 0);  //累计已开票金额(元)
      }
    },
    //可申请开票金额(含税)(元)
    async getMayApplyInvoiceAmountTaxApi() {
      const dataParams = this.dataParams(); //开票分类 收入合同id  项目id 参数
      let { data, code } = await getMayApplyInvoiceAmountTax(dataParams);
      if (code === 200) {
        this.dataForm.mayApplyInvoiceAmountTax = (data === 0 || data) ? myFun.getTofixed(data, 2) : '';
      }
    },
    //获取公共参数： 开票分类 收入合同id  项目id 参数
    dataParams() {
      const { constructArchiveMainId, makeOutInvoiceType, contractInMainId } = this.dataForm;
      return {
        constructArchiveMainId,  //项目id
        contractInMainId,  //收入合同id
        makeOutInvoiceType  //开票分类
      }
    },
    //暂存
   getDataForm() {
      const subFromData = this.$refs['subFromData'].validateForm();
      this.dataForm.taxRate = this.taxRateResult(this.dataForm.taxRate).toString();
      this.dataForm.detailList = this.getDetailList(subFromData);
      return this.dataForm;
    },
    //提交
    async validateForm() {
      const _this = this;
      const subFromData = await _this.$refs['subFromData'].validateForm();
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid) {
            console.log("subFromData===:", subFromData);
            _this.dataForm.taxRate = _this.taxRateResult(_this.dataForm.taxRate).toString();
            _this.dataForm.detailList = _this.getDetailList(subFromData);
            return resolve(_this.dataForm);
          } else {
            return resolve(false)
          }
        })
      });
    },
    getDetailList(arr) {
      return arr && arr.length > 0 ? arr.map(item => ({
        id: item.id,
        preferentialPolicy: item.preferentialPolicy,  //优惠政策
        baseServiceClassificationArchiveId: item.baseServiceClassificationArchiveId,  //商品服务分类id
        baseServiceClassificationArchiveName: item.baseServiceClassificationArchiveName,   //商品服务分类名称
        contentMakeOutInvoice: item.contentMakeOutInvoice,  //开票内容	
        specification: item.specification,  //规格/型号
        taxRate: this.taxRateResult(item.taxRate).toString(),  //税率 
        unit: item.unit,  //单位
        objectNumber: item.objectNumber || '',  //数量
        unitPriceTax: item.unitPriceTax || '',  //单价含税
        unitPriceUntax: item.unitPriceUntax || '', //单价(无税)	
        amountTax: item.amountTax || '',  //金额含税
        tax: item.tax || '',  //税额	
        amountUntax: item.amountUntax || '',  //金额无税
      })) : []
    },
    taxRateResult(taxRate) {
      let result = '';
      if (taxRate && taxRate.includes('%')) {
        result = taxRate.replace('%', '');
      }
      if (Number(taxRate) === 0) { 
        return 0;
      }
      return result ? Number(result / 100) : 0;
    },
    //逻辑分类处理
    //草稿状态及驳回发起人状态，编制人及有数据权限的用户 节点为财务管理中心税务主管、税务会计、建工税务会计、园林税务会计开票、幕墙税务会计2 可编辑
    fieldDisabledStauts(arr) {
      console.log('设置不必填===：', arr, nodeStatus);
      arr.forEach(filed => {
        if (nodeArray.includes(nodeName) || nodeStatus === 0 || nodeStatus === 5) {
          this.disabledFiled[filed] = false;  //快递方式可编辑
          this.dataRule[filed] = RuleRequired.curFiledRule(false);
        }
      })
    },
    //对应蓝字发票号码 回显字段
    invoiceNumberChangeFiled(data) {
      const { isRedTicket } = this.dataForm;
      //当 是否红票=是
      if (isRedTicket === '1') {
        // this.dataForm.invoiceType = data[0].invoiceType; //发票类型 自动带出  
        this.dataForm.sellerName = data.sellerName;  //销售方 自动带出
        this.dataForm.sellerAddress = data.sellerAddress;  //销售方地址 自动带出
        this.dataForm.sellerPhone = data.sellerPhone;  //销售方电话 //自动带出
        this.dataForm.buyerAddress = data.buyerAddress;  //购方地址  //自动带出
        this.dataForm.buyerPhone = data.buyerPhone;  //购方电话  //自动带出
        this.dataForm.sellerOpenAccountBank = data.sellerOpenAccountBank;   //销售方开户行
        this.dataForm.sellerAccountNumber = data.sellerAccountNumber;  //销售方账号	
        this.dataForm.buyerAccountNumber = data.buyerAccountNumber;  //购方账号
        this.dataForm.buyerOpenAccountBank = data.buyerOpenAccountBank;  //购方开户行
      }
    },
    isRedTicketVerify(filed) {
      //isRedTicket: 是否红票 
      let { isRedTicket } = this.dataForm;
      if (isRedTicket === '0') {
        //草稿状态及驳回发起人状态，编制人及有数据权限的用户 可编辑、必填
        if (nodeArray.includes(nodeName) || (nodeStatus === 0 || nodeStatus === 5)) {
          this.disabledFiled[filed] = false;  //购方纳税识别号可编辑
          // this.dataRule[filed] = RuleRequired.curFiledRule(true); //预缴情况可必填
        }
      }
      if (isRedTicket === '1') {
        this.disabledFiled[filed] = true;  //购方纳税识别号不可编辑
      }
    },
    //发票类型
    invoiceTypeVerify() {
      this.isRedTicketVerify('invoiceType')
    },
    //对应蓝字发票号码
    blueFontInvoiceNoVerify() {
      const { isRedTicket } = this.dataForm;
      if (isRedTicket === '1') { //是否红票 为是
        if (nodeArray.includes(nodeName)) {
          this.disabledFiled['blueFontInvoiceNo'] = false;  //可编辑
        }
        if (nodeStatus === 0 || nodeStatus === 5) {  //草稿、驳回发起人
          this.disabledFiled['blueFontInvoiceNo'] = false;  //可编辑
          this.dataRule['blueFontInvoiceNo'] = RuleRequired.curFiledRule(true); //必填
        }
      }
      else if (isRedTicket === '0') {
        this.dataRule['blueFontInvoiceNo'] = RuleRequired.curFiledRule(false);
      }
    },
    //销售方
    sellerNameVerify() {
      this.isRedTicketVerify('sellerName');
    },
    //购方
    buyerNameVerify() {
      this.isRedTicketVerify('buyerName');
    },
    //税跨报号
    taxAcrossVerify() {
      //isRedTicket: 是否红票  isOperatePlace：是否异地经营  makeOutInvoiceType: 开票分类(1:施工 2:设计 3:销售 4:其他)
      const taxAcross = 'taxAcross';
      const { isRedTicket, isOperatePlace, makeOutInvoiceType } = this.dataForm;
      const makeOutInvoiceTypeArray = ['2', '3', '4'];
      if (isRedTicket === '0' && isOperatePlace === '1' && makeOutInvoiceType === '1') {
        this.dataRule[taxAcross] = RuleRequired.curFiledRule(true); //必填跨税报号
        this.disabledFiled[taxAcross] = false;  //可编辑
      } else if (isRedTicket === '0' && isOperatePlace === '0' && makeOutInvoiceType === '1') {
        this.dataRule[taxAcross] = RuleRequired.curFiledRule(false); //非必填跨税报号
        this.disabledFiled[taxAcross] = false;  //可编辑
      } else if (isRedTicket === '0' && makeOutInvoiceTypeArray.includes(makeOutInvoiceType)) {
        this.dataRule[taxAcross] = RuleRequired.curFiledRule(false); //非必填跨税报号
        this.disabledFiled[taxAcross] = true;  //不可编辑
      } else if (isRedTicket === '1') { 
         this.disabledFiled[taxAcross] = true;  //购方纳税识别号不可编辑
      }
    },
    //销售方纳税识别号
    sellerTaxIdentificationNumberVerify() {
      //isRedTicket: 是否红票 
      this.isRedTicketVerify('sellerTaxIdentificationNumber');
    },
    //购方纳税识别号 判断
    buyerTaxIdentificationNumberVerify() {
      //isRedTicket: 是否红票 
      let { isRedTicket } = this.dataForm;
      if (isRedTicket === '0') {
        //草稿状态及驳回发起人状态，编制人及有数据权限的用户 可编辑、必填
        if (nodeArray.includes(nodeName) || (nodeStatus === 0 || nodeStatus === 5)) {
          this.disabledFiled['buyerTaxIdentificationNumber'] = false;  //购方纳税识别号可编辑
          this.dataRule['buyerTaxIdentificationNumber'] = RuleRequired.curFiledRule(true); //预缴情况可必填
        }
      }
      if (isRedTicket === '1') {
        this.disabledFiled['buyerTaxIdentificationNumber'] = true;  //购方纳税识别号不可编辑
      }
    },
    //点击是否红票
    isRedTicketChange() {
      // this.prepaymentSituationTypeVerify();
      // this.isRedTicketVerify('prepaymentSituationType'); //根据是否红票判断 预缴情况
      this.blueFontInvoiceNoVerify(); //判断对应蓝字发票号码
      this.prepaymentSituationTypeVerify();
    },
    //是否异地经营
    isOperatePlaceChange() { 
      this.prepaymentSituationTypeVerify();
    },
    //预缴情况字段判断
    prepaymentSituationTypeVerify() {
      //isRedTicket: 是否红票  makeOutInvoiceType：开票分类  isOperatePlace：是否异地经营
      let { isRedTicket, makeOutInvoiceType, isOperatePlace } = this.dataForm;
      if (isRedTicket === '0') { //是否红票为否
        // this.dataForm.prepaymentSituationType = '';  //无默认项
        if (makeOutInvoiceType === '0') {  //开票分类=施工
          //草稿状态及驳回发起人状态，编制人及有数据权限的用户 可编辑、必填
          if (nodeArray.includes(nodeName) || (nodeStatus === 0 || nodeStatus === 5)) {
            this.disabledFiled['prepaymentSituationType'] = false;  //预缴情况可编辑
            this.dataRule['prepaymentSituationType'] = RuleRequired.curFiledRule(true); //预缴情况可必填
          }
          if (isOperatePlace === '1') { //是否异地经营=是。 只能选择“已预交或者未预缴”
            // this.pstData = constParams.PREPAYMENT_SITUATION_YES;
            this.pstData = this.pstDataArray.filter(item => item.configValue === '1' || item.configValue === '2');
          }
          if (isOperatePlace === '0') { //是否异地经营=否
            this.disabledFiled['prepaymentSituationType'] = false;  //预缴情况可编辑
            // this.pstData = constParams.PREPAYMENT_SITUATION;
            this.pstData = this.pstDataArray;
            this.prepaymentSituationType = '3';  //默认为无需预交
          }
        }
      }
      else if (isRedTicket === '1') { //是否红票为是
        this.disabledFiled['prepaymentSituationType'] = true;  //预缴情况不可编辑
      } else {
        this.pstData = this.pstDataArray;
      }
    },
    //预缴完税凭证号
    taxPaymentVoucherNosVerify() {
      //isRedTicket: 是否红票  prepaymentSituationType: 预缴情况
      let { isRedTicket, prepaymentSituationType } = this.dataForm;
      if (isRedTicket === '0') { //是否红票为否
        //草稿状态及驳回发起人状态，编制人及有数据权限的用户 可编辑
        if ((nodeStatus === 0 || nodeStatus === 5)) {
          this.disabledFiled['taxPaymentVoucherNos'] = false;  //预缴完税凭证号可编辑
          // this.dataRule['prepaymentSituationType'] = RuleRequired.curFiledRule(true); //预缴完税凭证号可必填
        } else if (prepaymentSituationType === '2' || prepaymentSituationType === '3') { //预交情况=“未预交”或者“无需预缴”，不可编辑，非必填
          this.disabledFiled['taxPaymentVoucherNos'] = true;
          this.dataRule['taxPaymentVoucherNos'] = RuleRequired.curFiledRule(false);
        } else if (prepaymentSituationType === '1') { //预交情况=已预缴
          if (nodeArray.includes(nodeName)) {
            this.disabledFiled['taxPaymentVoucherNos'] = false;  //预缴完税凭证号可编辑
          } else if (nodeStatus === 0 || nodeStatus === 5) { //草稿状态及驳回发起人状态，编制人及有数据权限的用户 可编辑
            this.disabledFiled['taxPaymentVoucherNos'] = false;  //预缴完税凭证号可编辑
            this.dataRule['taxPaymentVoucherNos'] = RuleRequired.curFiledRule(true);  //必填
          }
        }
      }
      if (isRedTicket === '1') {
        this.disabledFiled['taxPaymentVoucherNos'] = true;  //预缴完税凭证号不可编辑
      }
    },
    //未预缴开票原因 字段判断
    unpaidAdvanceRemarkVerify() {
      //  prepaymentSituationType: 预缴情况
      let { prepaymentSituationType } = this.dataForm;
      if (prepaymentSituationType === '1' || prepaymentSituationType === '3') {  //当预缴情况为 已预缴 无需预缴
        this.showHideField['unpaidAdvanceRemark'] = false;  //未预缴提前开票原因	不显示
      }
      if (prepaymentSituationType === '2') { //当预缴情况=未预缴
        //草稿状态及驳回发起人状态，编制人及有数据权限的用户 可编辑、必填
        if (nodeStatus === MAKEDRAFT_STATUS || nodeStatus === REJECT_STATUS) {
          this.disabledFiled['unpaidAdvanceRemark'] = false;  //可编辑
          this.dataRule['unpaidAdvanceRemark'] = RuleRequired.curFiledRule(true);  //必填
        }
        if (nodeArray.includes(nodeName)) {
          this.disabledFiled['unpaidAdvanceRemark'] = false;  //可编辑
        }
      }
    },
    //选择是否预付款时
    isAdvanceChange() {
      this.overOutputRemarkVerify();
    },
    //超产值开票原因  问题
    overOutputRemarkVerify() {
      //isAdvance: 是否预付款   makeOutInvoiceType: 开票分类  isEnable: 是否关闭
      let { isAdvance, makeOutInvoiceType, isEnable } = this.dataForm;
      if (isAdvance === '1') {  //是否预付款为是 不显示此字段
        this.showHideField['overOutputRemark'] = false;  //超产值开票原因  不显示
      }
      if (isAdvance === '0') {
        // let makeOutInvoiceTypeArray = ['1', '2', '3'];  //开票分类 施工+设计+其他
        // if (makeOutInvoiceTypeArray.includes(isEnable) || (nodeStatus === 3 && isEnable === '0')) {
        //   this.showHideField['overOutputRemark'] = false;  //超产值开票原因  不显示
        // }
        if (nodeArray.includes(nodeName)) {
          this.showHideField['overOutputRemark'] = true;  //超产值开票原因  显示 可编辑
          thsi.disabledFiled['overOutputRemark'] = false;
        }
      }
    },
    //销售方地址 校验
    sellerAddressVerify() {
      //isRedTicket: 是否红票 
      let { isRedTicket } = this.dataForm;
      if (isRedTicket === '0') { //当 是否红票=否，草稿状态及驳回发起人状态，编制人及有数据权限的用户 可编辑
        if ((nodeStatus === MAKEDRAFT_STATUS || nodeStatus === REJECT_STATUS) || nodeArray.includes(nodeName)) {
          this.disabledFiled['sellerAddress'] = false;  //销售方地址可编辑
        }
      }
      if (isRedTicket === '1') {
        this.disabledFiled['sellerAddress'] = true;  //销售方地址可编辑
      }
    },
    //购方电话校验 buyerPhone
    buyerPhoneVerify() {
      //isRedTicket: 是否红票  invoiceType: 发票类型
      let { isRedTicket, invoiceType } = this.dataForm;
      if (isRedTicket === '0') {  //当 是否红票=否
        //当发票类型=增值税专用发票、全电发票(增值税专用发票)、增值税电子专用发票，草稿状态及驳回发起人状态，编制人及有数据权限的用户 必填
        let invoiceArray = [11, 16, 17];
        if (invoiceArray.includes(invoiceType)) {
          // this.disabledFiled['buyerPhone'] = false;  //购方电话可编辑
          this.dataRule['buyerPhone'] = RuleRequired.curFiledRule(true);  //购方电话必填
        } else {
          this.dataRule['buyerPhone'] = RuleRequired.curFiledRule(false);  //购方电话必填
        }
        this.setDisabledVerify('buyerPhone', false);  //设置可编辑字段
      }
      if (isRedTicket === '1') {
        this.disabledFiled['buyerPhone'] = true;  //购方电话不可编辑
      }
    },
    //红字开票申请原因
    redInvoiceRemarkVerify() {
      //isRedTicket: 是否红票
      const { isRedTicket } = this.dataForm;
      if (isRedTicket === '1') {
        this.dataRule['redInvoiceRemark'] = RuleRequired.curFiledRule(true);  //必填
      } else {
        this.dataRule['redInvoiceRemark'] = RuleRequired.curFiledRule(false);  //非必填
        this.showHideField['redInvoiceRemark'] = false;  //隐藏字段
      }
      this.setDisabledVerify('redInvoiceRemark', false);
    },
    //销售方开户行
    sellerOpenAccountBankVerify() {
      //isRedTicket: 是否红票
      const { isRedTicket } = this.dataForm;
      if (isRedTicket === '0') {
        if (nodeStatus === MAKEDRAFT_STATUS || nodeStatus === REJECT_STATUS) {
          this.setDisabledVerify('sellerOpenAccountBank', false);  ////销售方开户行可编辑
          this.dataRule['sellerOpenAccountBank'] = RuleRequired.curFiledRule(true);  //必填
        }
      }
      if (isRedTicket === '1') {
        this.setDisabledVerify('sellerOpenAccountBank', true);
      }
    },
    //销售方账号
    sellerAccountNumberVerify() {
      //isRedTicket: 是否红票
      const { isRedTicket } = this.dataForm;
      if (isRedTicket === '0') {
        //草稿状态及驳回发起人状态，编制人及有数据权限的用户
        if (nodeStatus === MAKEDRAFT_STATUS || nodeStatus === REJECT_STATUS) {
          this.setDisabledVerify('sellerAccountNumber', false);  //销售方账号可编辑
          this.dataRule['sellerAccountNumber'] = RuleRequired.curFiledRule(true);  //必填
        }
      }
      if (isRedTicket === '1') {
        this.setDisabledVerify('sellerAccountNumber', true);
      }
    },
    //购方账号  购方开户行 想通校验
    buyerAccountNumberVerify() {
      this.filedTwoVerifyMethods('buyerAccountNumber');
    },
    //购方开户行
    buyerOpenAccountBankVerify() {
      this.filedTwoVerifyMethods('buyerOpenAccountBank');
    },
    //购方账号  购方开户行 相同校验
    filedTwoVerifyMethods(filed) {
      const { isRedTicket, invoiceType } = this.dataForm;
      if (isRedTicket === '0') {
        //当发票类型=增值税专用发票、全电发票(增值税专用发票)、增值税电子专用发票，草稿状态及驳回发起人状态，编制人及有数据权限的用户 必填
        let invoiceArray = [11, 16, 17];
        if (invoiceArray.includes(invoiceType)) {
          //草稿状态及驳回发起人状态，编制人及有数据权限的用户
          if (nodeStatus === MAKEDRAFT_STATUS || nodeStatus === REJECT_STATUS) {
            this.dataRule[filed] = RuleRequired.curFiledRule(true);  //必填
          }
        } else {
          //草稿状态及驳回发起人状态，编制人及有数据权限的用户
          if (nodeStatus === MAKEDRAFT_STATUS || nodeStatus === REJECT_STATUS) {
            this.dataRule[filed] = RuleRequired.curFiledRule(false);  //非必填
          }
        }
        this.setDisabledVerify(filed, false);  //可编辑
      }
      if (isRedTicket === '1') {
        this.setDisabledVerify(filed, true); //不可编辑
      }
    },
    //开票申请金额(含税)(元) 校验
    invoiceApplicationAmountTaxVerify() {
      const { mayApplyInvoiceAmountTax } = this.dataForm;
      this.dataRule['invoiceApplicationAmountTax'] = [
        {
          required: true, validator: function (rule, value, callback) {
            if (Number(value) > Number(mayApplyInvoiceAmountTax)) {
              callback(new Error("开票申请金额(含税)不能大于可申请开票金额(含税)"));
            }
            callback();
          }, trigger: 'blur'
        }
      ]
    },
    //开票申请说明 
    invoicingApplicationRemarkVerify() {
      //草稿状态及驳回发起人状态，编制人及有数据权限的用户 可编辑，非必填
      if (nodeStatus === MAKEDRAFT_STATUS || nodeStatus === REJECT_STATUS) {
        this.disabledFiled['invoicingApplicationRemark'] = false;  //开票申请说明可编辑
        this.dataRule['invoicingApplicationRemark'] = RuleRequired.curFiledRule(false);  //非必填
      }
      this.setDisabledVerify("invoicingApplicationRemark", false);
    },
    //收件人地址
    recipientAddressVerify() {
      //fastMailWay:快递方式 
      const { fastMailWay } = this.dataForm;
      //当 快递方式= 到付 或 寄付，则必填

      if (fastMailWay === '1' || fastMailWay === '2' || nodeArray.includes(nodeName)) {
        this.dataRule['recipientAddress'] = RuleRequired.curFiledRule(true);  //必填
        this.disabledFiled['recipientAddress'] = false;
      } else {
        this.dataRule['recipientAddress'] = RuleRequired.curFiledRule(false);  //不必填
        this.disabledFiled['recipientAddress'] = true;
      }
      // this.setDisabledVerify("recipientAddress", false, true);
    },
    //发票备注
    invoiceRemarkVerify() {
      //makeOutInvoiceType:开票分类
      const { makeOutInvoiceType } = this.dataForm;
      if (nodeArray.includes(nodeName)) {
        this.disabledFiled['invoiceRemark'] = false;  //发票备注可编辑
        this.dataRule['invoiceRemark'] = RuleRequired.curFiledRule(false);  //非必填
      }
      //开票分类=施工，发票备注必填
      if (makeOutInvoiceType === '1') {
        this.dataRule['invoiceRemark'] = RuleRequired.curFiledRule(true);  //必填
      }
    },
    //是否关闭
    isEnableVerify() {
      //草稿状态及驳回发起人状态，编制人及有数据权限的用户 不可编辑，必填
      if (nodeStatus === MAKEDRAFT_STATUS || nodeStatus === REJECT_STATUS) {
        this.disabledFiled['isEnable'] = true;  //不可编辑
        this.dataRule['isEnable'] = RuleRequired.curFiledRule(true);  //必填
      }
    },
    //是否异地经营
    isOperatePlaceVerify() {
      //草稿状态及驳回发起人状态，编制人及有数据权限的用户 不可编辑，必填
      if (nodeStatus === MAKEDRAFT_STATUS || nodeStatus === REJECT_STATUS) {
        this.disabledFiled['isOperatePlace'] = true;  //不可编辑
      }
    },
    //百望开票 
    baiWangTicketTypeVerify() {
      //isRedTicket: 是否红票
      const { isRedTicket } = this.dataForm;
      //稿状态及驳回发起人状态，编制人及有数据权限的用户 不可编辑，不必填
      if (nodeStatus === MAKEDRAFT_STATUS || nodeStatus === REJECT_STATUS) {
        this.disabledFiled['baiWangTicketType'] = true;  //不可编辑
        this.dataRule['baiWangTicketType'] = RuleRequired.curFiledRule(false);  //不必填
      }
      let arry = ['财务管理中心税务主管', '建工税务会计', '园林税务会计开票'];
      if (arry.includes(nodeName)) {
        this.dataRule['baiWangTicketType'] = RuleRequired.curFiledRule(true);  //必填
      }
      // this.baiWangTicketTypeRadio = constParams.BAIWAN_INVOICE;  //百望开票
      // if (isRedTicket === '1') {
      //   this.baiWangTicketTypeRadio = constParams.BAIWAN_INVOICE_NO;  //百望开票
      // }
    },
    //红字信息表编号
    redLetterInfoNumberVerify() {
      this.redLetterInfoFiled("redLetterInfoNumber");
    },
    //红字信息标UUID 校验
    redLetterInfoUuidVerify() {
      this.redLetterInfoFiled("redLetterInfoUuid");
    },
    //红字信息表编号 红字信息标UUID 相同校验
    redLetterInfoFiled(filed) {
      const { isRedTicket, makeOutInvoiceType } = this.dataForm;
      let typeArray = [6, 16, 17];
      if (typeArray.includes(makeOutInvoiceType) && isRedTicket === '1') {
        let arry = ['财务管理中心税务主管', '建工税务会计', '园林税务会计开票'];
        if (arry.includes(nodeName)) {
          this.dataRule[filed] = RuleRequired.curFiledRule(true);  //必填
        }
      } else {
        this.disabledFiled[filed] = true;  //不可编辑
      }
    },
    //收件人
    recipientVerify() {
      this.recevieInfoVerify("recipient");
    },
    //收件人手机号
    recipientPhoneVerify() {
      this.recevieInfoVerify("recipientPhone");
    },
    //收件人邮箱
    recipientEmailVerify() {
      // fastMailWay： 快递方式 
      const { fastMailWay } = this.dataForm;
      // if (fastMailWay === '4') {  //快递方式= 邮箱交付
      //   this.dataRule['recipientEmail'] = RuleRequired.curFiledRule(true);  //必填
      //   this.disabledFiled['recipientEmail'] = false;
      // }
      // this.setDisabledVerify('recipientEmail', false, false);

      if (nodeArray.includes(nodeName)) {
        this.emailVerify(fastMailWay);
      } else { 
        this.emailVerify(fastMailWay);
      }
    },
    emailVerify(fastMailWay) { 
      if (fastMailWay === '4') {
          this.dataRule['recipientEmail'] = RuleRequired.curFiledRule(true);  //必填
          this.disabledFiled['recipientEmail'] = false;
        } else { 
          this.dataRule['recipientEmail'] = RuleRequired.curFiledRule(false);  //非必填
          this.disabledFiled['recipientEmail'] = true;
        }
    },
    //收件人手机号
    recevieInfoVerify(filed) {
      // fastMailWay： 快递方式 
      const { fastMailWay } = this.dataForm;
      if (nodeArray.includes(nodeName)) {
        this.recevieInfoDisableVerify(fastMailWay,filed);
      } else { 
        this.recevieInfoDisableVerify(fastMailWay,filed);
      }
    },
    recevieInfoDisableVerify(fastMailWay,filed) { 
      if (fastMailWay === '1' || fastMailWay === '2') {
          this.dataRule[filed] = RuleRequired.curFiledRule(true);  //必填
          this.disabledFiled[filed] = false;
        } else { 
          this.dataRule[filed] = RuleRequired.curFiledRule(false);
          this.disabledFiled[filed] = true;
        }
    },
    //选择快递方式时  1: 到付  2：寄付 时 收件人、收件人手机号必填
    fastMailWayChange(e) {
      
      this.recevieInfoVerify('recipient');  //收件人必填情况
      this.recevieInfoVerify('recipientPhone'); //收件人手机号必填情况
      this.recipientEmailVerify(); //如果是'邮箱交付' 收件人邮箱必填
    },
    //跨地（市）标志
    crossGroundMarkVerify() {
      this.crossBuidVerify("baiWangTicketType");
    },
    //建筑服务发生地
    buildingServiceTakesPlaceVerify() {
      this.crossBuidVerify("buildingServiceTakesPlace");
    },
    //建筑服务详细地址
    buildingServiceAddressVerify() {
      this.crossBuidVerify("buildingServiceAddress");
    },
    //建筑项目名称
    buildingProjectNameVerify() {
      this.crossBuidVerify("buildingProjectName");
    },
    crossBuidVerify(filed) {
      if (nodeStatus === MAKEDRAFT_STATUS || nodeStatus === REJECT_STATUS) {
        this.disabledFiled[filed] = false;  //可编辑
        // this.dataRule['baiWangTicketType'] = RuleRequired.curFiledRule(false);  //不必填
      }
      this.setDisabledVerify(filed, false);
    },
    //折扣类型 当 整单折扣率 或 整单折扣金额(含税)(元)有值时，默认 价外，否则 为空
    discountTypeVerify() {
      const { wholeOrderDiscountRate, wholeOrderDiscountAmount } = this.dataForm;
      this.dataForm.discountType = (wholeOrderDiscountRate || wholeOrderDiscountAmount) ? '1' : '';
    },
    //整单折扣率
    wholeOrderDiscountRateVerify() {
      if (nodeStatus === MAKEDRAFT_STATUS || nodeStatus === REJECT_STATUS) {
        this.disabledFiled['wholeOrderDiscountRate'] = false;  //可编辑
        this.dataRule['wholeOrderDiscountRate'] = RuleRequired.curFiledRule(false);  //不必填
      }
      // this.setDisabledVerify('wholeOrderDiscountRate', false);
    },
    //整袋折扣率 失去焦点 整单折扣金额清空
    wholeOrderDiscountRateBlur(e) {
      console.log("整袋折扣率===:", e);
      if (e) {
        this.tempFiled('wholeOrderDiscountAmount');
      }
      this.discountTypeStatus();
    },
    //整单折扣金额  失去焦点 整单折扣率 清空
    wholeOrderDiscountAmountBlur(e) {
      console.log("整单折扣金额===:", e);
      if (e) {
        this.tempFiled('wholeOrderDiscountRate');
      }
      this.discountTypeStatus();
    },
    tempFiled(filed) {
      this.dataForm[filed] = '';
      this.disabledFiled[filed] = false;
      this.dataRule[filed] = RuleRequired.curFiledRule(false)
    },
    discountTypeStatus() { 
      const { wholeOrderDiscountRate, wholeOrderDiscountAmount } = this.dataForm;
      let status = [wholeOrderDiscountRate, wholeOrderDiscountAmount].some(item => (item !== null && item !== ''));
      this.dataForm.discountType = status ? '1' : '';
    },
    //可编辑字段
    setDisabledVerify(filed, stauts, isElse = false) { 
      if (isElse) {
        if (nodeArray.includes(nodeName)) {
          this.disabledFiled[filed] = stauts;  //销售方地址可编辑
        } else {
          this.disabledFiled[filed] = !stauts;  //销售方地址可编辑
        }
      } else { 
        if (nodeArray.includes(nodeName) || nodeStatus === 0 || nodeStatus === 5) {
          this.disabledFiled[filed] = stauts;  //销售方地址可编辑
        }
      }
    },
    //判断开票分类
    makeOutInvoiceTypeJudge(moduleType) {
      this.dataForm.makeOutInvoiceType = moduleType;
      this.disabledFiled['makeOutInvoiceType'] = moduleType === '2';
    }
  },
}
</script>
<style scoped lang="scss">
@import url('../../style/form.scss');
</style>