<template>
  <div class="flow-form">
       <el-form class="class" ref="dataForm" :rules="dataRule" :model="dataForm" label-suffix="：" label-width="142px">
          <row-layout :cols="3">
            <el-form-item slot="col_1" label="单据编号" prop="code">
              <el-input v-model="dataForm.code" clearable :placeholder="msgTip.AUTO_PLACEHOLDER" :disabled="getDisabledField('code')"></el-input>
            </el-form-item>
            <el-form-item slot="col_2" label="发票号码" prop="invoiceNo">
              <el-input v-model="dataForm.invoiceNo" clearable :disabled="getDisabledField('invoiceNo')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
            <el-form-item slot="col_3" label="发票代码" prop="invoiceCode">
              <el-input v-model="dataForm.invoiceCode" clearable :disabled="getInvoiceCodeByInvoice" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
        </row-layout>
        <row-layout :cols="3">
           <el-form-item slot="col_1" label="开票日期" prop="invoiceCreateTime">
              <el-date-picker v-model="dataForm.invoiceCreateTime" type="date" :disabled="getinvoiceCreateTimeByInvoice" placeholde="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item slot="col_2" label="销售方" prop="sellerName">
              <el-input v-model="dataForm.sellerName" clearable :disabled="getDisabledField('sellerName')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
            <el-form-item slot="col_3" label="购方" prop="buyerName">
              <el-input v-model="dataForm.buyerName" clearable :disabled="getDisabledField('buyerName')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
        </row-layout>
        <row-layout :cols="3">
           <el-form-item slot="col_1" label="发票类型" prop="invoiceType">
              <el-select v-model="dataForm.invoiceType"  @change="changeInvoiceType" :disabled="getStatusByInvoice" clearable :placeholder="msgTip.SELECT_PLACEHOLDER">
                <el-option :label="item.configName" :value="item.configValue" :key="item.configValue" v-for="item in invoiceTypeArray"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item slot="col_2" label="销售方纳税识别号" prop="sellerTaxIdentificationNumber">
              <el-input v-model="dataForm.sellerTaxIdentificationNumber" clearable :disabled="getDisabledField('sellerTaxIdentificationNumber')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
            <el-form-item slot="col_3" label="购方纳税识别号" prop="buyerTaxIdentificationNumber">
              <el-input v-model="dataForm.buyerTaxIdentificationNumber" clearable :disabled="getDisabledField('buyerTaxIdentificationNumber')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
        </row-layout>
        <row-layout :cols="3">
           <el-form-item slot="col_1" label="发票状态" prop="invoiceStatus">
              <!-- <el-input v-model="dataForm.invoiceStatus" clearable :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input> -->
              <el-select v-model="dataForm.invoiceStatus" :disabled="getDisabledField('invoiceStatus')" clearable :placeholder="msgTip.SELECT_PLACEHOLDER">
                <el-option :label="item.configName" :value="item.configValue" :key="item.configValue" v-for="item in invoiceStatusArray"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item slot="col_2" label="销售方地址及电话" prop="sellerAddressAndPhone">
              <el-input v-model="dataForm.sellerAddressAndPhone" clearable :disabled="getDisabledField('sellerAddressAndPhone')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
            <el-form-item slot="col_3" label="购方地址及电话" prop="buyerAddressAndPhone	">
              <el-input v-model="dataForm.buyerAddressAndPhone" clearable :disabled="getDisabledField('buyerAddressAndPhone')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
        </row-layout>
        <row-layout :cols="3">
           <el-form-item slot="col_1" label="是否红票" prop="isRedTicket">
              <el-radio-group v-model="dataForm.isRedTicket" :disabled="getDisabledField('isRedTicket')">
                <el-radio :label="item.configValue" :key="item.configValue" v-for="item in isRedTicketArray">{{ item.configName }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item slot="col_2" label="销售方开户行及账号" prop="sellerOpenBankAndAccount">
              <el-input v-model="dataForm.sellerOpenBankAndAccount" clearable :disabled="getDisabledField('sellerOpenBankAndAccount')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
            <el-form-item slot="col_3" label="购方开户行及账号" prop="buyerOpenBankAndAccount	">
              <el-input v-model="dataForm.buyerOpenBankAndAccount	" clearable :disabled="getDisabledField('buyerOpenBankAndAccount')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
        </row-layout>
        <row-layout :cols="3">
           <el-form-item slot="col_1" label="对应蓝字发票号码" :prop="dataForm.isRedTicket == 1?'blueInvoiceCollectionMainId':''">
              <el-input v-model="dataForm.blueInvoiceCollectionMainId" clearable :disabled="getDisabledField('blueInvoiceCollectionMainId')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
            <el-form-item slot="col_2" label="对应蓝字发票代码" prop="blueFontInvoiceCode">
              <el-input v-model="dataForm.blueFontInvoiceCode" clearable :disabled="getDisabledField('blueFontInvoiceCode')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
            <el-form-item slot="col_3" label="发票校验码" prop="invoiceVerificationCode	">
              <el-input v-model="dataForm.invoiceVerificationCode" :disabled="getDisabledField('invoiceVerificationCode')" clearable :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
        </row-layout>
        <row-layout :cols="3">
           <el-form-item slot="col_1" label="发票金额(含税)(元)" prop="invoiceAmountTax">
              <amount-input v-model="dataForm.invoiceAmountTax" clearable :disabled="getDisabledField('invoiceAmountTax')" :placeholder="msgTip.AUTO_PLACEHOLDER"></amount-input>
            </el-form-item>
            <el-form-item slot="col_2" label="发票金额(无税)(元)" prop="invoiceAmountUntax">
              <amount-input v-model="dataForm.invoiceAmountUntax" clearable :disabled="getDisabledField('invoiceAmountUntax')" :placeholder="msgTip.ENTER_PLACEHOLDER"></amount-input>
            </el-form-item>
            <el-form-item slot="col_3" label="税额" prop="tax">
              <amount-input v-model="dataForm.tax" clearable :disabled="getDisabledField('tax')" :placeholder="msgTip.AUTO_PLACEHOLDER"></amount-input>
            </el-form-item>
        </row-layout>
        <row-layout :cols="3">
           <el-form-item slot="col_1" label="已申请红字信息表" prop="applicationRedInformation">
              <el-radio-group v-model="dataForm.applicationRedInformation" @change="changeRedInformation" :disabled="getDisabledField('applicationRedInformation')">
                <el-radio :label="item.configValue" :key="item.configValue" v-for="item in defaultRadioGroup">{{ item.configName}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item slot="col_2" label="红冲税额" prop="redCharge" :rules="[{required:isRequired,message: '必填项不能为空',trigger:'blur'}]">
              <amount-input v-model="dataForm.redCharge" clearable :disabled="getDisabledField('redCharge')" :placeholder="msgTip.ENTER_PLACEHOLDER"></amount-input>
            </el-form-item>
            <el-form-item slot="col_3"></el-form-item>
        </row-layout>
        <row-layout :cols="3" cell="3">
           <el-form-item slot="col_1" label="发票备注" prop="invoiceRemark">
              <text-input type="textarea" v-model="dataForm.invoiceRemark" :row="5" clearable :disabled="getDisabledField('invoiceRemark')" :placeholder="msgTip.AUTO_PLACEHOLDER"></text-input>
            </el-form-item>
        </row-layout>
        <row-layout title="业务信息" :cols="3">
           <el-form-item slot="col_1" label="发票来源" prop="sourceInvoice">
            <el-select v-model="dataForm.sourceInvoice" :disabled="getDisabledField('sourceInvoice')" :placeholder="msgTip.ENTER_PLACEHOLDER" @change="sourceInvoiceChange">
              <el-option :label="item.configName" :value="item.configValue" :key="item.configValue" v-for="item in sourceInvoiceArray"></el-option>
            </el-select>
           </el-form-item>
           <el-form-item slot="col_2" label="进项转出期间" prop="periodOutputTime">
            <el-date-picker v-model="dataForm.periodOutputTime" :disabled="getDisabledField('periodOutputTime')" type="date" placeholde="选择日期"></el-date-picker>
           </el-form-item>
           <el-form-item slot="col_3" label="发票业务类型" prop="invoiceBizType">
             <el-select v-model="dataForm.invoiceBizType" :disabled="getDisabledField('invoiceBizType')" :placeholder="msgTip.ENTER_PLACEHOLDER">
               <el-option :label="item.configName" :value="item.configValue" :key="item.configValue" v-for="item in invoiceBizTypeArray">{{ item.configName }}</el-option>
             </el-select>
           </el-form-item>
        </row-layout>
        <row-layout :cols="3">
          <el-form-item slot="col_1" label="认领状态" prop="claimStatus">
            <el-select v-model="dataForm.claimStatus" :disabled="getDisabledField('claimStatus')" :placeholder="msgTip.ENTER_PLACEHOLDER">
               <el-option :label="item.configName" :value="item.configValue" :key="item.configValue" v-for="item in claimStatusArray">{{ item.configName }}</el-option>
             </el-select>
          </el-form-item>
          <el-form-item slot="col_2" label="认领人" prop="invoiceClaimantUserName">
            <text-input v-model="dataForm.invoiceClaimantUserName" :disabled="getDisabledField('invoiceClaimantUserName')" :placeholder="msgTip.ENTER_PLACEHOLDER"></text-input>
          </el-form-item>
          <el-form-item slot="col_3" label="认领时间" prop="claimTime">
            <el-date-picker v-model="dataForm.claimTime" type="date" :disabled="getDisabledField('claimTime')" placeholde="选择日期"></el-date-picker>
           </el-form-item>
        </row-layout>
        <row-layout :cols="3" cell="2-1">
          <el-form-item slot="col_1" label="发票错误类型" prop="invoiceErrorType">
             <el-checkbox-group v-model="invoiceErrorSelectType" @change="changeErrorType" :disabled="getDisabledField('invoiceErrorType')">
               <el-checkbox :key="item.configValue" :label="item.configValue" v-for="item in invoiceErrorTypeArray">{{ item.configName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item slot="col_2" label="是否勾选" prop="checkWhether">
             <el-radio-group v-model="dataForm.accrualExpenseStatus" :disabled="getDisabledField('checkWhether')">
               <el-radio :label="item.configValue" :key="item.configValue" v-for="item in checkWhetherArray">{{ item.configName }}</el-radio>
             </el-radio-group>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3" cell="3">
           <el-form-item label="发票错误类型备注" slot="col_1" prop="invoiceErrorTypeRemark" :rules="[{required:remarkRequired,message: '必填项不能为空',trigger:'blur'}]">
             <text-input type="textarea" :row="5" v-model="dataForm.invoiceErrorTypeRemark" :disabled="getDisabledField('invoiceErrorTypeRemark')"></text-input>
           </el-form-item>
        </row-layout>
        <row-layout :cols="3">
           <el-form-item slot="col_1" label="民航发展基金" prop="civilAviationDevelopmentFund" :rules="[{required:fundRequired,message:'必填项不能为空',trigger:'blur'}]">
              <amount-input type="text" v-model="dataForm.civilAviationDevelopmentFund" :disabled="getDisabledField('civilAviationDevelopmentFund')"></amount-input>
           </el-form-item>
           <el-form-item slot="col_2" label="票价" prop="fare" :rules="[{required:fundRequired,message:'必填项不能为空',trigger:'blur'}]">
              <amount-input type="text" v-model="dataForm.fare" :disabled="getDisabledField('fare')"></amount-input>
           </el-form-item>
           <el-form-item slot="col_3" label="旅客姓名" prop="passengerName" :rules="[{required:passengerRequired,message: '必填项不能为空',trigger:'blur'}]">
            <text-input type="text" v-model="dataForm.passengerName" :disabled="getDisabledField('passengerName')"></text-input>
           </el-form-item>
        </row-layout>
        <row-layout :cols="3">
          <el-form-item slot="col_1" label="是否收到发票原件" prop="haveReceivedOriginalInvoice">
             <el-radio-group v-model="dataForm.haveReceivedOriginalInvoice" :disabled="getDisabledField('haveReceivedOriginalInvoice')">
               <el-radio :label="item.configValue" :key="item.configValue" v-for="item in haveReceivedOriginalInvoiceArray">{{ item.configName}}</el-radio>
             </el-radio-group>
          </el-form-item>
          <el-form-item slot="col_2" label="收票人" prop="receiveTicketUserName">
            <text-input v-model="dataForm.receiveTicketUserName" :disabled="getDisabledField('receiveTicketUserName')" :placeholder="msgTip.AUTO_PLACEHOLDER"></text-input>
          </el-form-item>
          <el-form-item slot="col_3" label="收票时间" prop="ticketTime">
            <el-date-picker v-model="dataForm.ticketTime" type="date" :disabled="getDisabledField('ticketTime')" placeholde="选择日期"></el-date-picker>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3">
          <el-form-item slot="col_1" label="复核状态" prop="reviewStatus">
            <el-radio-group v-model="dataForm.reviewStatus" :disabled="getDisabledField('reviewStatus')">
               <el-radio :label="item.configValue" :key="item.configValue" v-for="item in reviewStatusArray">{{ item.configName }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item slot="col_2" label="复核人" prop="reviewOneUserName">
            <text-input v-model="dataForm.reviewOneUserName" :disabled="getDisabledField('reviewOneUserName')" :placeholder="msgTip.AUTO_PLACEHOLDER"></text-input>
          </el-form-item>
          <el-form-item slot="col_3" label="复核时间" prop="checkTime">
            <el-date-picker v-model="dataForm.checkTime" type="date" :disabled="getDisabledField('checkTime')" placeholde="选择日期"></el-date-picker>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3">
           <el-form-item slot="col_1" label="异常已交罚款" prop="abnormalFinePaid">
             <el-radio-group v-model="dataForm.abnormalFinePaid" :disabled="getDisabledField('abnormalFinePaid')">
               <el-radio :label="item.configValue" :key="item.configValue" v-for="item in abnormalFinePaidArray">{{ item.configName }}</el-radio>
             </el-radio-group>
           </el-form-item>
           <el-form-item slot="col_2" label="预缴已抵扣金额(元)" prop="prePaymentDeductionAmount">
            <amount-input type="text" v-model="dataForm.prePaymentDeductionAmount" :disabled="getDisabledField('prePaymentDeductionAmount')" :placeholder="msgTip.AUTO_PLACEHOLDER"></amount-input>
           </el-form-item>
           <el-form-item slot="col_3" label="剩余可付款金额(元)" prop="residueApprovePaymentAmountTax">
            <amount-input type="text" v-model="dataForm.residueApprovePaymentAmountTax" :disabled="getDisabledField('residueApprovePaymentAmountTax')" :placeholder="msgTip.AUTO_PLACEHOLDER"></amount-input>
           </el-form-item>
        </row-layout>
        <row-layout :cols="3">
           <el-form-item slot="col_1" label="启用状态" prop="enableStatus">
             <el-radio-group v-model="dataForm.enableStatus" :disabled="getDisabledField('enableStatus')">
               <el-radio :label="item.configValue" :key="item.configValue" v-for="item in enableStatusArray">{{ item.configName }}</el-radio>
             </el-radio-group>
           </el-form-item>
           <el-form-item slot="col_2" label="销售类项目" prop="isSaleItem">
            <el-radio-group v-model="dataForm.isSaleItem" :disabled="getDisabledField('isSaleItem')">
               <el-radio :label="item.configValue" :key="item.configValue" v-for="item in defaultRadioGroup">{{ item.configName }}</el-radio>
             </el-radio-group>
           </el-form-item>
           <el-form-item slot="col_3" label="使用情况" prop="memoryUsageMemo">
            <el-checkbox v-model="dataForm.memoryUsageMemo" :disabled="getDisabledField('memoryUsageMemo')">DRP1.0使用</el-checkbox>
           </el-form-item>
        </row-layout>
        <row-layout :cols="3">
           <el-form-item slot="col_1" label="是否推费用预提单" prop="accrualExpenseStatus">
             <el-radio-group v-model="dataForm.accrualExpenseStatus" :disabled="getDisabledField('accrualExpenseStatus')">
               <el-radio :label="item.configValue" :key="item.configValue" v-for="item in defaultRadioGroup">{{ item.configName }}</el-radio>
             </el-radio-group>
           </el-form-item>
           <el-form-item slot="col_2"></el-form-item>
           <el-form-item slot="col_3"></el-form-item>
        </row-layout>
        <row-layout :cols="3" cell="3">
           <el-form-item slot="col_1" label="备注" prop="remark">
             <text-input type="textarea" :row="5" v-model="dataForm.remark" :disabled="getDisabledField('remark')"></text-input>
           </el-form-item>
        </row-layout>
        <row-layout title="发票明细信息" :cols="3" cell="3">
         <el-form-item slot="col_1" label-width="0" prop="detailList">
          <invoice-detail-list :sourceInvoice="dataForm.sourceInvoice" :invoiceType="dataForm.invoiceType" ref="subFromData" v-model="dataForm.detailList" :id="dataForm.id" :rowData="rowData" :readOnly="setting.readnoly"></invoice-detail-list>
         </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="3">
        <el-form-item slot="col_1" label-width="0">
          <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="项目信息" name="project">
            <project-detail-list ref="projectSubForm" v-model="dataForm.projectDetailList" :id="dataForm.id" :readOnly="setting.readOnly"></project-detail-list>
          </el-tab-pane>
          <el-tab-pane label="付款信息" name="payment">
            <payment-detail-list ref="paymentSubForm" v-model="dataForm.paymentDetailList" :id="dataForm.id" :readOnly="setting.readOnly"></payment-detail-list>
          </el-tab-pane>
        </el-tabs>
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
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import ListSearchForm from '@/components/basic/fromLayout/listSearchForm.vue';
import AmountInput from '@/components/basic/numberInput/amountInput.vue';
import TextInput from '@/components/basic/elInput/textInput.vue';
import UploaderFile from '@/components/basic/uploaderFile/index.vue';
import InvoiceDetailList from './components/invoiceDetailList.vue';
import ProjectDetailList from './components/projectDetailList.vue';  //项目信息
import PaymentDetailList from './components/paymentDetailList.vue';  //付款信息列表
import { getDataDictByConfigType } from '@/Api/dataDict.js';
import comMixin from '../minix';
import moment from 'moment';

const requiredFiled = ['invoiceNo', 'invoiceCode', 'invoiceCreateTime', 'sellerName', 'buyerName', 'invoiceType',
  'sellerTaxIdentificationNumber', 'buyerTaxIdentificationNumber', 'invoiceStatus', 'isRedTicket', 'blueInvoiceCollectionMainId',
  'invoiceVerificationCode', 'civilAviationDevelopmentFund']

export default {
  name: 'searchFrom',
  components: {
    RowLayout,
    ListSearchForm,
    AmountInput,
    TextInput,
    UploaderFile,
    InvoiceDetailList,
    ProjectDetailList,
    PaymentDetailList
  },
  mixins: [comMixin],
  props: {
    rowData: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      dataForm: {
        id:'',
        code: '',
        invoiceNo: '',
        invoiceCode: '',  //发票代码
        sellerName: '',  //销售方
        buyerName: '',  //购方
        invoiceType:'',  //发票类型
        invoiceCreateTime: '',  //开票日期
        sellerTaxIdentificationNumber: '',  //销售方纳税识别号
        buyerTaxIdentificationNumber: '',  //购方纳税识别号
        invoiceStatus: '',  //发票状态
        sellerAddressAndPhone: '',  //销售方地址及电话
        isRedTicket: '',  //是否红票
        sellerOpenBankAndAccount: '', //销售方开户行及账号
        buyerOpenBankAndAccount: '', //购方开户行及账号
        blueInvoiceCollectionMainId: '',  //对应蓝字发票号码
        blueFontInvoiceCode:'',  //对应蓝字发票代码
        invoiceVerificationCode: '', //发票校验码
        invoiceAmountTax: '',  //发票金额(含税)(元)
        invoiceAmountUntax: '',  //发票金额(无税)(元)
        tax: '',  //税额
        applicationRedInformation:'', //已申请红字信息表
        redCharge: '', //红冲税额
        invoiceRemark: '', //发票备注
        sourceInvoice:'',//发票来源
        periodOutputTime:'',//进项转出期间
        invoiceBizType:'',//发票业务类型
        claimStatus:'',//认领状态
        invoiceClaimantUserName:'',//认领人
        claimTime:'',//认领时间
        invoiceErrorType:[],//发票错误类型
        checkWhether:'',//是否勾选
        invoiceErrorTypeRemark:'',//发票错误类型备注
        civilAviationDevelopmentFund:'',//民航发展基金
        fare:'',//票价
        passengerName:'',//旅客姓名
        haveReceivedOriginalInvoice:'',//是否收到发票原件
        receiveTicketUserName:'',//收票人
        ticketTime:'',//收票时间
        reviewStatus:'',//复核状态
        reviewOneUserName:'',//复核人
        checkTime:'',//复核时间
        abnormalFinePaid:'',//异常已交罚款
        prePaymentDeductionAmount:'',//预缴已抵扣金额(元)
        residueApprovePaymentAmountTax:'',//剩余可付款金额(元)
        enableStatus:'',//启用状态
        isSaleItem:'',//销售类项目
        memoryUsageMemo:'',//使用情况
        accrualExpenseStatus:'',//是否推费用预提单
        remark: '',//备注,
        detailList: [],  //发票明细信息
        projectDetailList: [
          // {
          //   constructArchiveMainCode: '',  //项目编号
          //   constructArchiveMainName: '',  //项目名称
          //   contractOutMainCode: '',  //支出合同编号
          //   contractOutMainName: '', //支出合同名称
          //   claimAmountTax: '', //认领金额(含税)(元)
          //   claimTaxAmount: '',
          //   constructionUnitName: '', //管理部门
          //   projectDepartmentName:'' //项目部
          // }
        ],  //项目信息列表
        paymentDetailList: [],  //付款信息列表
        createUserId:'',  //编制人id
        createUserName: '',  //编制人
        deptId: '',  //编制人部门id
        deptName: '',  //编制人部门
        fileInfoList:[],  //附件
      },
      msgTip: RuleRequired.tipMsg,
      isOpen: false,
      defaultRadioGroup: [
        { configValue: '1', configName: '是' },
        { configValue: '0', configName: '否' }
      ],
      invoiceTypeArray: [],  //发票类型
      invoiceStatusArray: [],  //发票状态
      invoiceBizTypeArray:[],  //发票业务类型
      isRedTicketArray:[],  //是否红票
      sourceInvoiceArray: [],  //发票来源
      claimStatusArray: [],//认领状态
      invoiceErrorTypeArray: [],  //发票错误类型
      invoiceErrorSelectType:[],  //发票错误类型选中的值
      checkWhetherArray: [],  //是否勾选
      reviewStatusArray: [],  //复核状态
      enableStatusArray:[],//启用状态
      abnormalFinePaidArray: [],  //异常已交罚款
      haveReceivedOriginalInvoiceArray: [],  //是否收到发票原件
      ppData: [],
      disabledFiled: {
        'code': true,
        'invoiceAmountTax': true,  //发票金额不可编辑
        'invoiceAmountUntax': true,  //发票金额(无税)不可编辑
        'tax': true,  //税额 不可编辑
        'redCharge': false,  //红冲税额 默认可编辑
        'sourceInvoice': false,  //发票来源
        'claimStatus': true,  //认领状态
        'invoiceClaimantUserName': true,  //认领人
        'claimTime': true,  //认领日期
        'checkWhether': true,  //是否勾选
        'receiveTicketUserName': true, //收票人
        'ticketTime': true,  //收票时间
        'reviewOneUserName': true,  //复核人
        'checkTime': true,  //复核时间
        'memoryUsageMemo': true,  //使用情况
        'prePaymentDeductionAmount': true, //预缴已抵扣金额(元)
        'accrualExpenseStatus': true,  //是否推费用预提单
        'residueApprovePaymentAmountTax': true, //剩余可付款金额(元)
        'fileInfoList': false
      },
      dataRule: RuleRequired.dataRule(requiredFiled),
      activeName:'project',
      isRequired: false, // 红冲税额默认非必填
      remarkRequired: false, // 发票错误类型备注默认非必填
      fundRequired: false, // 民航发展基金、票价默认非必填
      passengerRequired: false, // 旅客姓名默认非必填
    }
  },
  computed: {
    getDisabledField() {
      return (field) => {
        return this.disabledFiled[field] ? this.disabledFiled[field] : false;
      }
    },
    //根据发票来源判断发票代码
    getInvoiceCodeByInvoice() {
      return (this.dataForm.sourceInvoice === '2' || this.setting.readonly);
    },
    //根据发票来源来判断开票日期状态
    getinvoiceCreateTimeByInvoice() {
      return (this.dataForm.sourceInvoice === '2' || this.setting.readonly);
    },
    //根据发票来源来判断发票类型状态  当发票来源=下载，发票类型 不可修改
    getStatusByInvoice() {
      return (this.dataForm.sourceInvoice === '2' || this.setting.readnoly);
    }
  },
  created() {
    this.getDataDictByConfigType();
  },
  methods: {
    beforeInit() {
      this.setting.readnoly = this.rowData.readonly;
    },
    afterInit() {
      console.log("rowData===:",this.rowData);
      //如果是详情 把控件设置的不可编辑
      if (this.setting.readonly) {
        Object.keys(this.dataForm).forEach(key => {
          this.disabledFiled[key] = true;
        })
      }
      //发票代码校验判断
      this.invoiceCodeJudage();
      //发票状态判断
      this.invoiceStatusJudage();
    },
    handleClick(tab, event) {
      console.log("tab===:", tab);
    },
    async getDataDictByConfigType() {
      const configTypes = '发票类型,发票状态,发票业务类型,发票来源,认领状态,发票错误类型,是否红票,已申请红字信息表,是否勾选,是否收到发票原件,认领人,复核状态,启用状态,异常已交罚款,销售类项目,是否推费用预提单';
      let { data, success } = await getDataDictByConfigType({ params: { configTypes: configTypes } });
      if (success) {
        if (data && data.length > 0) {
          //发票类型
          this.invoiceTypeArray = data.find(item => item.dataDictType === '发票类型')?.dataDict || [];
          //发票状态
          this.invoiceStatusArray = data.find(item => item.dataDictType === '发票状态')?.dataDict || [];
          //发票业务类型
          this.invoiceBizTypeArray = data.find(item => item.dataDictType === '发票业务类型')?.dataDict || [];
          //发票来源
          this.sourceInvoiceArray = data.find(item => item.dataDictType === '发票来源')?.dataDict || [];
          //认领状态
          this.claimStatusArray = data.find(item => item.dataDictType === '认领状态')?.dataDict || [];
          //发票错误类型
          this.invoiceErrorTypeArray = data.find(item => item.dataDictType === '发票错误类型')?.dataDict || [];
          //是否勾选
          this.checkWhetherArray = data.find(item => item.dataDictType === '是否勾选')?.dataDict || [];
          //复核状态
          this.reviewStatusArray = data.find(item => item.dataDictType === '复核状态')?.dataDict || [];
          // 启用状态
          this.enableStatusArray = data.find(item => item.dataDictType === '启用状态')?.dataDict || [];
          //异常已交罚款
          this.abnormalFinePaidArray = data.find(item => item.dataDictType === '异常已交罚款')?.dataDict || [];
          //是否红票
          this.isRedTicketArray = data.find(item => item.dataDictType === '是否红票')?.dataDict || [];
          //是否收到发票原件
          this.haveReceivedOriginalInvoiceArray = data.find(item => item.dataDictType === '是否收到发票原件')?.dataDict || [];
        }
      }
    },
    //发票代码校验判断
    invoiceCodeJudage() {
      let { invoiceTypeArray } = this;
      //sourceInvoice:发票来源 invoiceType：发票类型
      let { sourceInvoice, invoiceType } = this.dataForm;
      let invoiceTypeName = invoiceTypeArray.find(item => item.configValue === invoiceType)?.configName || '';
      //发票代码必填判断
      const invoiceTypeList = ['增值税普通发票', '增值税专用发票', '增值税电子专用发票', '增值税电子普通发票'];
      if (sourceInvoice === '1' && invoiceTypeList.includes(invoiceTypeName)) {
        this.dataRule['invoiceCode'] = RuleRequired.curFiledRule(true);
      }
    },
    async validateForm() {
      const _this = this;
      //发票明细信息
      const subFromData = await _this.$refs['subFromData'].validateForm();
      //项目信息列表
      const projectSubForm = await _this.$refs['projectSubForm'].validateForm();
      //付款信息列表
      const paymentDetailList = await _this.$refs['paymentSubForm'].validateForm();
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid && subFromData) {
            // _this.dataForm.detailList = _this.getDetailList(subFromData);
            //格式化时间
            _this.formatDate();
            _this.dataForm.detailList = _this.getDetailList(subFromData);
            _this.dataForm.projectDetailList = projectSubForm;
            _this.dataForm.paymentDetailList = paymentDetailList;
            return resolve(_this.dataForm);
          } else {
            return resolve(false)
          }
        })
      });
    },
    getDetailList(arr) {
      return arr.length > 0 ? arr.map(item => ({
        amountTax: item.amountTax ? Number(item.amountTax) : '',
        amountUntax: item.amountUntax ? Number(item.amountUntax) : '',
        baseServiceClassificationArchiveId: item.baseServiceClassificationArchiveId,
        baseServiceClassificationArchiveName: item.baseServiceClassificationArchiveName,
        id: this.dataForm.id ? item.id : '',
        nameGoodsTaxableService: item.nameGoodsTaxableService,
        objectNumber: item.objectNumber ? Number(item.objectNumber) : '',
        specification: item.specification,
        tax: item.tax || '',
        taxRate: this.taxRateResult(item.taxRate),
        unit: item.unit,
        unitPriceUntax: item.unitPriceUntax
      })) : [];
    },
    taxRateResult(taxRate) {
      let result = '';
      if (taxRate && taxRate.indexOf('%') > -1) {
        result = taxRate.replace('%', '');
      }
      return result ? Number(result / 100) : 0;
    },
    formatDate() {
      const { invoiceCreateTime, periodOutputTime } = this.dataForm;
      this.dataForm.invoiceErrorType = this.invoiceErrorSelectType.length > 0 ? this.invoiceErrorSelectType.join(',') : '';
      this.dataForm.invoiceCreateTime = invoiceCreateTime ? moment(invoiceCreateTime).format('YYYY-MM-DD HH:mm:ss') : '';
      this.dataForm.periodOutputTime = periodOutputTime ? moment(periodOutputTime).format('YYYY-MM-DD HH:mm:ss') : '';
    },
    //发票来源选择的时候
    sourceInvoiceChange() {
      this.invoiceStatusJudage();
     },
    invoiceStatusJudage() {
      const { sourceInvoice } = this.dataForm;
      if (sourceInvoice === '1') { //如果发票来源等于录入
        this.dataForm.invoiceStatus = sourceInvoice;
      }
    },
    changeRedInformation(val){
      if(val=='1'){   // 已申请红字信息表=否，红冲税额无需校验必填；
        this.isRequired = true;
      }else{
        this.isRequired = false;
      }
    },
    changeErrorType(val){
      // 仅当发票错误类型勾选“其他”时，发票错误类型备注才需要校验必填；configName "其他" configValue "6"
      if(val.includes("6")){   
        this.remarkRequired = true;
      }else{
        this.remarkRequired = false;
      }
    },
    changeInvoiceType(val){
      // 当发票类型为电子行程单'5'时，民航发展基金/票价必填;当发票类型为电子行程单，火车票，汽车票，旅客姓名必填
      this.fundRequired = (val=='5') ? true : false;
      this.passengerRequired = (['5', '7', '8'].includes(val)) ? true : false;
    },
  }
}
</script>
<style lang="scss" scoped>
@import '../../style/form.scss';
// @import "../../style/searchForm.scss";


</style>
