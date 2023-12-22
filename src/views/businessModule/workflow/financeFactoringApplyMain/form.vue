<template>
  <!-- 保理融资申请-表单 -->
  <div class="flow-form">
    <el-form class="class" ref="dataForm" :model="dataForm" label-suffix="：" label-width="195px" :rules="dataRule">
      <row-layout :cols="3" title="项目信息">
        <el-form-item slot="col_1" label="单据编号" prop="code">
          <el-input v-model="dataForm.code" clearable :placeholder="msgTip.AUTO_PLACEHOLDER" disabled></el-input>
        </el-form-item>
        <el-form-item slot="col_2" label="合同编号" prop="contractInCode">
           <select-dialog :disabled="true" :btnDisabled="setting.readonly" :width="800" :modelData="contractInCodeModel" :height="360" :value="dataForm.contractInCode" @updateValue="contractInCodeChange" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="合同金额(元)" prop="norigsignmnyTax">
          <amount-input v-model="dataForm.norigsignmnyTax" :disabled="getDisabledField('norigsignmnyTax')" clearable :placeholder="msgTip.AUTO_PLACEHOLDER"></amount-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="客户" prop="customerName">
          <el-input v-model="dataForm.customerName" clearable :disabled="getDisabledField('customerName')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item slot="col_2" label="合同名称" prop="contractInName">
          <el-input v-model="dataForm.contractInName" :disabled="getDisabledField('contractInName')" clearable :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item slot="col_3" label="业务中心" prop="marketCenterName">
          <el-input v-model="dataForm.marketCenterName" clearable :disabled="getDisabledField('marketCenterName')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="合同是否约定保理融资" prop="isStipulation">
          <el-radio-group v-model="dataForm.isStipulation" :disabled="getDisabledField('isStipulation')">
            <el-radio :label="item.label" :key="item.label" v-for="item in radioGroup">{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" label="项目介绍人" prop="projectManagerName">
          <el-input v-model="dataForm.projectManagerName" clearable :disabled="getDisabledField('projectManagerName')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item slot="col_3"></el-form-item>
      </row-layout>
      <row-layout :cols="3" title="保理信息" text="提示：保理收款的项目，付款须以同等条件（包括金额、期限等约定）使用智付单进行结算，使用智付单支付的，项目无需缴存保理结算保证金。">
        <el-form-item slot="col_1" label="合同是否首次签收保理" prop="isFirstReceipt">
          <el-radio-group v-model="dataForm.isFirstReceipt" :disabled="getDisabledField('isFirstReceipt')" @change="receiptChange">
            <el-radio :label="item.label" :key="item.label" v-for="item in radioGroup">{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" label="本次保理金额(元)" prop="factoringAmount">
          <amount-input v-model="dataForm.factoringAmount" clearable :disabled="getDisabledField('factoringAmount')" :placeholder="msgTip.AUTO_PLACEHOLDER"></amount-input>
        </el-form-item>
        <el-form-item slot="col_3" label="保理商(受让方)" prop="factoringAssigner">
          <el-input v-model="dataForm.factoringAssigner" clearable :disabled="getDisabledField('factoringAssigner')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="保理融资类型" prop="factoringType">
          <el-radio-group v-model="dataForm.factoringType" :disabled="getDisabledField('factoringType')" @change="factoringTypeChange">
            <el-radio :label="item.configValue" :key="item.configValue" v-for="item in factoringTypeArray">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" label="本次保理融资金额(元)" prop="factoringFinanceAmount">
          <amount-input v-model="dataForm.factoringFinanceAmount" clearable :disabled="getDisabledField('factoringFinanceAmount')" :placeholder="msgTip.AUTO_PLACEHOLDER" @change="factorBlur"></amount-input>
        </el-form-item>
        <!-- 组织控件 -->
        <el-form-item slot="col_3" label="融资申请方(出让方)" prop="factoringApplicantName">
          <select-dialog :disabled="true" :btnDisabled="getDisabledField('factoringApplicantName')" :width="600" :height="360" @updateValue="factoringApplicantNameUpdate" :value="dataForm.factoringApplicantName || msgTip.SELECT_PLACEHOLDER" dynamicModel="selectOrg"></select-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="本次保理开具协议编号" prop="financingApplyCode">
          <el-input v-if="dataForm.factoringType === '1'" v-model="dataForm.financingApplyCode" :disabled="getDisabledField('financingApplyCode')" clearable :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
          <select-dialog v-if="dataForm.factoringType === '2'" :disabled="true" :btnDisabled="setting.readonly" :width="800" :modelData="financingApplyCodeModel" :height="360" :value="dataForm.financingApplyCode" @updateValue="financingApplyCodeChange" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="保理费率(%)" prop="factoringRate">
          <percentage-input v-model="dataForm.factoringRate" clearable :disabled="getDisabledField('factoringRate')" :placeholder="msgTip.ENTER_PLACEHOLDER" @change="factoringRateChange"></percentage-input>
        </el-form-item>
        <el-form-item slot="col_3" label="收款账户名称" prop="payInAccountName">
          <el-input v-model="dataForm.payInAccountName" clearable :disabled="getDisabledField('payInAccountName')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="本次保理协议名称" prop="factoringApplyName">
          <el-input v-model="dataForm.factoringApplyName" clearable :disabled="getDisabledField('factoringApplyName')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item slot="col_2" label="预计保理融资利息(元)" prop="factoringInterestAmount">
          <amount-input v-model="dataForm.factoringInterestAmount" clearable :disabled="getDisabledField('factoringInterestAmount')" :placeholder="msgTip.ENTER_PLACEHOLDER"></amount-input>
        </el-form-item>
        <el-form-item slot="col_3" label="收款账号" prop="payInAccountNo">
          <select-dialog :disabled="true" :btnDisabled="setting.readonly" :width="800" :modelData="payInAccountNoModel" :height="360" :value="dataForm.payInAccountNo" @updateValue="payInAccountNoChange" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="本次保理融资协议编号" prop="financingFinanceCode">
          <el-input v-model="dataForm.financingFinanceCode" clearable :disabled="getDisabledField('financingFinanceCode')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item slot="col_2" label="保理业务手续费(元)" prop="factoringFee">
          <amount-input v-model="dataForm.factoringFee" clearable :disabled="getDisabledField('factoringFee')" :placeholder="msgTip.ENTER_PLACEHOLDER"></amount-input>
        </el-form-item>
        <el-form-item slot="col_3" label="收款账户开户银行" prop="payInBankName">
          <el-input v-model="dataForm.payInBankName" clearable :disabled="getDisabledField('payInBankName')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="本次保理开具日期" prop="factoringStartDate">
          <el-date-picker
            v-model="dataForm.factoringStartDate"
            type="date"
            placeholder="选择日期时间"
            :disabled="getDisabledField('factoringStartDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item slot="col_2" label="其他" prop="other">
          <el-input v-model="dataForm.other" clearable :disabled="getDisabledField('other')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
        </el-form-item>
        <!-- signatureMode -->
        <el-form-item slot="col_3" label="签章模式" prop="signatureMode">
          <el-checkbox-group v-model="signatureModeGroup" :disabled="getDisabledField('signatureMode')">
             <el-checkbox :label="item.configValue" :key="item.configValue" v-for="item in signatureModeArray">{{ item.configName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="本次保理到期日" prop="factoringEndDate">
          <el-date-picker
            v-model="dataForm.factoringEndDate"
            type="date"
            placeholder="选择日期时间"
            :disabled="getDisabledField('factoringEndDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item slot="col_2" label="发票金额(元)" prop="invoiceAmount">
          <amount-input v-model="dataForm.invoiceAmount" clearable :disabled="getDisabledField('invoiceAmount')" :placeholder="msgTip.AUTO_PLACEHOLDER"></amount-input>
        </el-form-item>
        <el-form-item slot="col_3" label="签章顺序" prop="signatureOrder">
          <el-radio-group v-model="dataForm.signatureOrder" :disabled="getDisabledField('signatureOrder')">
            <el-radio :label="item.configValue" :key="item.configValue" v-for="item in signatureOrderArray">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="保理业务类型" prop="financingBusinessType">
          <el-radio-group v-model="dataForm.financingBusinessType" :disabled="getDisabledField('financingBusinessType')">
            <el-radio :label="item.configValue" :key="item.configValue" v-for="item in financingBusinessTypeArray">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" label="发票是否登记中登网" prop="isRegistration">
          <el-radio-group v-model="dataForm.isRegistration" :disabled="getDisabledField('isRegistration')">
            <el-radio :label="item.label" :key="item.label" v-for="item in radioGroup">{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" label="本方签章" prop="signatureSeal">
          <el-checkbox-group v-model="signatureSealGroup" :disabled="getDisabledField('signatureSeal')">
             <el-checkbox :label="item.configValue" :key="item.configValue" v-for="item in signatureSealArray">{{ item.configName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="本次保理业务费用是否补贴" prop="isSubsidy">
          <el-radio-group v-model="dataForm.isSubsidy" :disabled="getDisabledField('isSubsidy')" @change="isSubsidyChange">
            <el-radio :label="item.label" :key="item.label" v-for="item in radioGroup">{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" label="补贴比例(%)" prop="subsidyRate">
          <percentage-input v-model="dataForm.subsidyRate" clearable :disabled="getDisabledField('subsidyRate')" :placeholder="msgTip.ENTER_PLACEHOLDER"></percentage-input>
        </el-form-item>
        <el-form-item slot="col_3" label="合同累计已收保理金额(元)" prop="totalFactoringAmount">
          <amount-input v-model="dataForm.totalFactoringAmount" clearable :disabled="getDisabledField('totalFactoringAmount')" :placeholder="msgTip.AUTO_PLACEHOLDER"></amount-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="补贴方式" prop="subsidyMethod">
          <el-input v-model="dataForm.subsidyMethod" clearable :disabled="getDisabledField('subsidyMethod')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item slot="col_2"></el-form-item>
        <el-form-item slot="col_3"></el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="3">
        <el-form-item slot="col_1" label="摘要备注" prop="remark">
          <el-input type="textarea" v-model="dataForm.remark" :disabled="getDisabledField('remark')" :rows="5" placeholder="发票备注"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="2">
        <el-form-item slot="col_1" label="保理经办人" prop="financingUserName">
          <el-input v-model="dataForm.financingUserName" clearable :disabled="getDisabledField('financingUserName')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item slot="col_2" label="保理经办人部门" prop="financingUserDeptName">
          <el-input v-model="dataForm.financingUserDeptName" clearable :disabled="getDisabledField('financingUserDeptName')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" v-if="isReceiptStatus">
        <el-form-item slot="col_1" label="是否到账" prop="isReceipt">
          <el-radio-group v-model="dataForm.isReceipt" :disabled="getDisabledField('isReceipt')" @change="isReceiptChange">
            <el-radio :label="item.label" :key="item.label" v-for="item in radioGroup">{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" label="保理融资到账金额(元)" prop="receiptAmount" v-if="isReceiptStatus && dataForm.isReceipt !== '0'">
          <amount-input v-model="dataForm.receiptAmount" :disabled="getDisabledField('receiptAmount')" clearable :placeholder="msgTip.AUTO_PLACEHOLDER"></amount-input>
        </el-form-item>
        <el-form-item slot="col_3" label="到账日期" prop="receiptDate" v-if="isReceiptStatus && dataForm.isReceipt !== '0'">
          <el-date-picker
            v-model="dataForm.receiptDate"
            type="datetime"
            placeholder="选择日期时间"
            :disabled="getDisabledField('receiptDate')">
          </el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="3" v-if="isReceiptStatus && dataForm.isReceipt !== '1'">
        <el-form-item slot="col_1" label="未到账原因" prop="reason">
          <el-input type="textarea" v-model="dataForm.reason" :disabled="getDisabledField('reason')" :rows="5" placeholder="发票备注"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout title="编制人提供文件" :cols="3" cell="3">
         <el-form-item slot="col_1" prop="createFileInfoList" label="编制人提供文件">
          <uploader-file v-model="dataForm.createFileInfoList" :isReadOnly="getDisabledField('createFileInfoList')" :disabled="getDisabledField('createFileInfoList')"></uploader-file>
        </el-form-item>
      </row-layout>
      <row-layout title="融资专员提供文件" :cols="3" cell="3">
         <el-form-item slot="col_1" prop="factoringFileInfoList" label="融资专员提供文件">
          <uploader-file v-model="dataForm.factoringFileInfoList" :isReadOnly="getDisabledField('factoringFileInfoList')" :disabled="getDisabledField('factoringFileInfoList')"></uploader-file>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="createUserName" label="编制人">
          <label class="label-style">{{dataForm.createUserName}}</label>
        </el-form-item>
        <el-form-item slot="col_2" prop="createUserDeptName" label="编制人部门">
            <label class="label-style">{{dataForm.createUserDeptName}}</label>
        </el-form-item>
        <el-form-item slot="col_3" prop="createTime" label="编制时间">
          <label class="label-style">{{ dataForm.createTime}}</label>
        </el-form-item>
      </row-layout>
    </el-form>
  </div>
</template>

<script>
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import AmountInput from '@/components/basic/numberInput/amountInput.vue';
import TextInput from '@/components/basic/elInput/textInput.vue';
import PercentageInput from '@/components/basic/numberInput/percentageInput.vue';
import UploaderFile from '@/components/basic/uploaderFile/index.vue';
import {
  FINAN_CONTRACT_CODE_MODEL,
  PAYINACCOUNT_NO_MODEL,
  FOLLOWER_MODEL,
  FINANCING_APPLY_CODE_MODEL
} from '@/views/businessModule/enum/param';
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import { getAutomaticApi, getBankArchiveDataApi } from '@/Api/invoice/financeFactoring';
import moment from 'moment'

import comMixin from '../minix';
import myFun from '@/utils/fun';

const requiredFileds = ['contractInCode', 'isFirstReceipt', 'financingBusinessType', 'factoringType',
  'financingApplyCode', 'factoringEndDate','factoringStartDate', 'subsidyMethod', 'subsidyRate',
  'factoringAmount', 'factoringFinanceAmount','factoringApplyName', 'factoringRate', 'invoiceAmount','factoringAssigner',
  'isRegistration', 'payInAccountNo', 'signatureMode', 'signatureOrder', 'signatureSeal', 'factoringApplicantName',
'isSubsidy','receiptAmount','receiptDate','factoringFileInfoList'];

export default {
  components: {
    RowLayout,
    SelectDialog,
    AmountInput,
    TextInput,
    PercentageInput,
    UploaderFile
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
      dialogModel: FOLLOWER_MODEL,  //跟进人
      msgTip: RuleRequired.tipMsg,
      radioGroup: [
        { label: '1', value: '是' },
        { label: '0', value:'否'}
      ],
      contractInCodeModel: FINAN_CONTRACT_CODE_MODEL,  //合同编号
      payInAccountNoModel: PAYINACCOUNT_NO_MODEL,  //收款账号
      financingApplyCodeModel: FINANCING_APPLY_CODE_MODEL, //本次保理融资协议编号
      dataForm: {
        code: '',  //单据编号
        baseBankArchiveMainId: '',
        financingApplyMainId: '',
        contractInMainId: '',  //合同主键Id
        contractInCode:'',  //合同编号
        norigsignmnyTax: '',  //合同金额
        customerName: '',  //客户
        contractInName: '',  //合同名称
        marketCenterName: '',  //业务中心
        isStipulation: '', //合同是否约定保理融资
        projectManagerName: '',  //项目介绍人
        isFirstReceipt: '1',  //合同是否首次签收保理  默认是
        factoringAmount: '',  //本次保理金额
        factoringApplicantId:'', //融资申请方(出让方)id
        factoringAssigner: '', //保理商(受让方)
        factoringType: '',  //保理融资类型(1新签协议融资2已签协议再次融资)	
        factoringFinanceAmount: '',  //本次保理融资金额
        factoringApplicantName: '',  //融资申请方(出让方)
        financingApplyCode: '',  //本次保理开具协议编号
        factoringRate: '',  //保理费率
        payInAccountName: '', //收款账户名称
        factoringApplyName: '', //本次保理协议名称
        factoringInterestAmount: '', //预计保理融资利息
        payInAccountNo: '', //收款账号
        financingFinanceCode:'', //本次保理融资协议编号
        factoringFee: '', //保理业务手续费
        payInBankName: '', //收款账户开户银行
        factoringStartDate: '', //本次保理开具日期
        other: '',  //其他
        signatureMode:'',  //签章模式(1线上签章2线下签章)
        factoringEndDate: '', //本次保理到期日
        invoiceAmount: '', //发票金额(元)
        signatureOrder: '',  //签章顺序
        financingBusinessType: '', //保理业务类型(1有追索权2无追索权)
        isRegistration: '', //发票是否登记中登网
        signatureSeal:'', //本方签章
        isSubsidy:'', //本次保理业务费用是否补贴
        subsidyRate:'', //	补贴比例
        totalFactoringAmount:'', //合同累计已收保理金额
        subsidyMethod:'', //补贴方式
        remark:'', //摘要备注
        financingUserName:'', //保理经办人
        financingUserDeptName:'',//保理经办人部门
        isReceipt: '', //是否到账
        receiptAmount: '', //保理融资到账金额(元)
        receiptDate:'', //到账日期
        reason:'', //未到账原因
        createFileInfoList:[],//编制人提供文件
        factoringFileInfoList:[],//融资专员提供文件
        createUserName:'', //编制人
        createUserDeptName:'',//编制人部门
        createTime:'',//编制时间
      },
      disabledFiled: {
        'code': true,
        'factoringAmount': false,
        'factoringAssigner': false, //保理受让方
        'factoringApplicantName': false, //融资申请方(出让方)
        'contractInCode': true,
        'factoringType': true,
        'financingApplyCode': true,
        'norigsignmnyTax': true,  //合同金额
        'customerName': true,  //客户
        'contractInName': true, //合同名称
        'marketCenterName': true,  //业务中心
        'factoringApplyName': true,  //本次保理协议名称
        'isStipulation': false,  //合同是否约定保理融资
        'projectManagerName': true,//项目介绍人
        'subsidyRate': false,  //补贴比例
        'subsidyMethod': false,  //补贴方式
        'factoringRate': true,  //保理费率 编制人不可填
        'factoringInterestAmount': true,  //预计保理融资利息
        'factoringFee': false, //保理业务手续费（元）
        'other': false,  //
        'financingUserName': true,  //保理经纪人
        'financingUserDeptName': true, //保理经办人部门
        'financingFinanceCode': true,  //本次保理融资协议编号 编制人不可编辑
        'signatureMode': true,  //签章模式
        'signatureOrder': true,  //签章顺序
        'signatureSeal': true,  //本方签章 收款账号
        'payInAccountNo': true, ///收款账号
      },
      isReceiptStatus: false,  //是否到账 是否展示
      dataRule: RuleRequired.dataRule(requiredFileds),  //必填字段
      factoringTypeArray: [],  //保理融资类型
      financingBusinessTypeArray: [], //保理业务类型
      signatureModeArray: [], //签章模式
      signatureModeGroup:[], //签章模式
      signatureOrderArray: [], //签章顺序
      signatureSealGroup:[],  //本方签章
      signatureSealArray: [], //本方签章
      nodeName: '',  //当前节点名称
      nodeStatus: 0,  //当前流程状态
      isCurApprove: false  //是否是当前编制人 是否是当前审批人
    }
  },
  computed: {
    getDisabledField() { 
      return (field) => {
        return this.disabledFiled[field] ? this.disabledFiled[field] : false;
      }
    },
    //保理融资类型值选中状态
    factoringTypeValue() { 
      let { isFirstReceipt } = this.dataForm; //合同是否首次签收保理
      return isFirstReceipt === '1' ? '1' : (isFirstReceipt === '0' ? '2' : '');
    }
  },
  methods: {
    beforeInit() {
      const configTypes = '保理融资类型,保理业务类型,签章模式,签章顺序,本方签章';
      this.getDataDictByConfigTypeData(configTypes);
      //保理融资类型 默认是新签协议融资 
      this.receiptChange(this.dataForm.isFirstReceipt);
      //不是必填项字段
      const notRequredFiels = ['factoringRate','factoringApplyName', 'factoringEndDate', 'isRegistration', 'subsidyRate', 'subsidyMethod',
      'signatureMode','signatureOrder','signatureSeal', 'receiptAmount','receiptDate','factoringFileInfoList'];
      notRequredFiels.forEach(filed => { 
        this.dataRule[filed] = RuleRequired.curFiledRule(false);
      })
      
    },
    afterInit() {
      //factoringType:保理融资类型
      const { factoringType, isSubsidy, isReceipt } = this.dataForm;
      this.isCurApprove = this.isAuthor();
      this.nodeStatus = WFContext.WorkflowInstinceState;  //状态判断 0：拟稿  1：草稿 2：审批中 3：审批完成
      //获取当前审批节点
      this.nodeName = WFContext.CurrentActivityName;  //当前节点
      if (this.setting.readonly) {
        Object.keys(this.dataForm).forEach(key => {
          this.disabledFiled[`${key}`] = true;
        })
      }
      this.initFormData();
      this.fnCalculateFinanceInterest();  //预计保理融资利息 计算 
      if (this.nodeName === '融资专员') {  //
        //融资专员第一次填写的字段
        if (factoringType === '1') { //新签协议融资
          //本次保理开具协议编号:  financingApplyCode
          //本次保理协议名称: factoringApplyName
          //本次保理融资协议编号 非必填 : financingFinanceCode 
          //本次保理到期日: factoringEndDate
          //保理融资到账金额: receiptAmount 分情况必填
          //保理业务类型: financingBusinessType
          //本次保理业务费用是否补贴: isSubsidy
          //补贴方式: subsidyMethod
          //补贴比例: subsidyRate
          //保理费率: factoringRate
          //预计保理融资利息: factoringInterestAmount
          //保理业务手续费: factoringFee
          //其他: other
          //发票金额: invoiceAmount
          //发票是否登记中登网: isRegistration
          //保理商（受让方）: factoringAssigner
          //融资申请方（出让方）: factoringApplicantName
          //收款账号: payInAccountNo
          //签章模式: signatureMode
          //签章顺序: signatureOrder
          //本次签章: signatureSeal
          const requiredFiles = ['financingApplyCode', 'factoringApplyName', 'factoringEndDate', 'financingBusinessType', 'isSubsidy', 'subsidyMethod', 'subsidyRate', 'factoringRate', 'factoringInterestAmount', 'factoringFee', 'other', 'invoiceAmount', 'isRegistration', 'factoringAssigner', 'factoringApplicantName', 'payInAccountNo', 'signatureMode', 'signatureOrder', 'signatureSeal','factoringFileInfoList'];
          this.dataRule['financingFinanceCode'] = RuleRequired.curFiledRule(false);
          requiredFiles.forEach(filed => { 
            this.dataRule[filed] = RuleRequired.curFiledRule(true);
            this.disabledFiled[filed] = false;
          })
          this.disabledFiled['isReceipt'] = false;
        }
        // else if (factoringType === '2') { //已签协议再次融资
        //    this.isReceiptStatus = true;  //显示是否到账
        // }

        // this.isReceiptStatus = true;  //显示是否到账
        // const requiredFiels = ['financingApplyCode', 'factoringApplyName', 'isSubsidy', 'factoringEndDate', 'factoringRate', 'invoiceAmount', 'isRegistration', 'payInAccountNo', 'factoringInterestAmount', 'receiptAmount', 'receiptDate']; //融资专员的必填项
        // const noRequiredFiles = ['financingFinanceCode', 'factoringFee', 'other', 'factoringInterestAmount']; //融资专员的不必填项 
        // requiredFiels.forEach(filed => {
        //   this.dataRule[filed] = RuleRequired.curFiledRule(true);
        // })
        // noRequiredFiles.forEach(filed => {
        //   this.dataRule[filed] = RuleRequired.curFiledRule(false);
        // })
        // this.disabledFiled['factoringInterestAmount'] = false;  //预计保理融资利息 融资专员必填可编辑
        // this.disabledFiled['factoringFee'] = false;  //保理业务手续费（元）可编辑
        // this.disabledFiled['other'] = false;
        // if (factoringType === '1') { //新签协议融资 本次保理金额
        //   this.dataRule['factoringAmount'] = RuleRequired.curFiledRule(false);
        // }
        // else if (factoringType === '2') { //已签协议再次融资
        //   this.dataRule['factoringAmount'] = RuleRequired.curFiledRule(true);
        // }
      } else if (this.nodeName === '融资专员2') {
        this.isReceiptStatus = true;  //显示是否到账
        //保理融资到账金额、到账日期、未到账原因
        this.receiptStatus(isReceipt);
        this.disabledFiled['isReceipt'] = false; //是否到账  融资专员可编辑
        this.disabledFiled['factoringFileInfoList'] = false; //融资专员提供文件 可编辑
      }

      if (factoringType === '1') { //新签协议融资 本次保理金额 必填
        this.dataRule['factoringAmount'] = RuleRequired.curFiledRule(true);
      }else if (factoringType === '2') { //已签协议再次融资
        this.dataRule['factoringAmount'] = RuleRequired.curFiledRule(false);
        this.disabledFiled['factoringAmount'] = false;  //本次保理金额 可编辑
      }

      this.subsidyMethodJuadge(isSubsidy);
    },
    //选择是否到账时
    isReceiptChange(e) { 
      this.receiptStatus(e);
    },
    receiptStatus(isReceipt) { 
      const requiredFilesAll = ['receiptAmount', 'receiptDate'];
        requiredFilesAll.forEach(filed => {
          if (isReceipt === '1') { 
            this.dataRule[filed] = RuleRequired.curFiledRule(true);
          }
          this.disabledFiled[filed] = false;
        })
      if (isReceipt === '0' && (this.nodeName === '融资专员' || this.nodeName === '融资专员2')) { 
        this.disabledFiled['reason'] = false;
      }
    },
    //签章顺序、本方签章
    signatureModeDataGroup(){ 
       this.dataForm.signatureMode = this.signatureModeGroup.length > 0 ? this.signatureModeGroup.join(",") : '';
       this.dataForm.signatureSeal = this.signatureSealGroup.length > 0 ? this.signatureSealGroup.join(',') : ''; //本方签章
    },
    //判断是否是当前的审批人
    isAuthor() {
      const author = FUI.Sys.getAuthor();
      return author.userId === this.dataForm.createUserId;
    },
    initFormData() { 
      const { signatureMode,signatureSeal } = this.dataForm;
      this.signatureModeGroup = signatureMode.split(',');
      this.signatureSealGroup = signatureSeal.split(',');
    },
    //预计保理融资利息 计算 公式=本次保理融资金额*保理费率/365*（本次保理到期日-编制日期+1）
    fnCalculateFinanceInterest() {
      const { factoringFinanceAmount, factoringRate, factoringEndDate, createTime } = this.dataForm;
      let money = 0;
      if (factoringFinanceAmount && factoringRate) {
        //getNumMulti 乘法  getDayByDate 日期相减
        // let startTime = factoringEndDate ? factoringEndDate.split('')[0] : '';
        let startTime = factoringEndDate ? factoringEndDate : '';
        let endTime = createTime ? createTime.split('')[0] : '';
        let nDay = (startTime && endTime) ? myFun.getTofixed(myFun.getDayByDate(endTime, startTime), 2) : 0; //本次保理日期-编制日期
        let nCalculate = myFun.getNumMulti(factoringFinanceAmount.toString(), factoringRate.toString());
        let nDayNum = Number(myFun.getNumAdd(nDay, '1'));
        let interset = nCalculate / 365 * nDayNum;
        money = myFun.getTofixed(interset, 2);
      } else { 
        money = myFun.getTofixed(0, 2);
      }
      this.dataForm.factoringInterestAmount = money;
    },
    factorBlur(e) {
      console.log("本次保理融资===：",e);
      this.fnCalculateFinanceInterest();
    },
    //保理费率失去焦点时
    factoringRateChange(e) { 
      console.log("保理费率失去焦点时===：",e);
      this.fnCalculateFinanceInterest();
    },
    //选择合同是否首次签收保理
    receiptChange(e) {
      this.clearPayInBankInfo();
      if (e === '1') { 
        this.disabledFiled['factoringType'] = true;  //不可编辑
        this.dataForm.factoringType = '1';
        this.dataRule['factoringType'] = RuleRequired.curFiledRule(false);
      }
      if (e === '0') { 
        this.dataForm.factoringType = '2';
        this.disabledFiled['factoringType'] = false;  //可编辑
        this.dataRule['factoringType'] = RuleRequired.curFiledRule(true);
      }
      //判断 本次保理开具协议编号
      this.financingApplyCodeRequired();
      this.factoringAmountData(this.dataForm.factoringType);
    },
    //保理融资类型 选择的时候
    factoringTypeChange(e) {
      this.clearPayInBankInfo();
      this.financingApplyCodeRequired();
      this.factoringAmountData(e);
    },
    //清空 收款账户 信息
    clearPayInBankInfo() { 
      this.dataForm.payInAccountName = '';  //收款账户名称
      this.dataForm.payInAccountNo = '';  //收款账号
      this.dataForm.payInBankName = '';  //收款账户开户银行
    },
    //判断 本次保理开具协议编号
    financingApplyCodeRequired() { 
      this.dataRule['financingApplyCode'] = RuleRequired.curFiledRule(this.dataForm.factoringType === '2');
    },
    //本次保理金额、保理(受让方)
    factoringAmountData(factoringType) {
      this.disabledFiled['factoringAmount'] = factoringType === '2';  //本次保理金额(元)控件编辑判断
      this.disabledFiled['factoringAssigner'] = factoringType === '2';  //保理商(受让方)
      this.disabledFiled['factoringApplicantName'] = factoringType === '2'; //融资申请方(出让方)
      this.dataRule['factoringApplicantName'] = RuleRequired.curFiledRule(factoringType !== '2');
      // this.dataRule['factoringAmount'] = RuleRequired.curFiledRule(factoringType === '2');
      // this.dataRule['factoringAssigner'] = RuleRequired.curFiledRule(factoringType === '2');
    },
    //本次保理业务费用是否补贴
    isSubsidyChange(e) {
      console.log("本次保理业务费用是否补贴===:",e);
      this.subsidyMethodJuadge(e);
    },
    //补贴方式、补贴比例
    subsidyMethodJuadge(type) { 
      let status = (type === '1') ? true : false;
      this.disabledFiled['subsidyRate'] = !status;
      this.disabledFiled['subsidyMethod'] = !status;
      this.dataRule['subsidyRate'] = RuleRequired.curFiledRule(status);
      this.dataRule['subsidyMethod'] = RuleRequired.curFiledRule(status)
      // this.dataRule['factoringApplicantName'] = RuleRequired.curFiledRule(type === '1');
      // this.dataRule['factoringApplicantName'] = RuleRequired.curFiledRule(type === '1');
      
    },

    //融资申请方(出让方)
    factoringApplicantNameUpdate(data) {
      console.log("融资申请方(出让方)===:",data);
      if (data && data.length > 0) { 
        this.dataForm.factoringApplicantName = data[0].text;
        this.dataForm.factoringApplicantId = data[0].value;  //融资申请方(出让方)id
      }
     },
    //选择合同编号
    contractInCodeChange(data) {
      if (data && data.length > 0) {
        this.dataForm.contractInCode = data[0].contractCode;  //合同编号
        this.dataForm.contractInName = data[0].contract; //合同名称
        this.dataForm.norigsignmnyTax = data[0].norigsignmnyTax;  //合同金额
        this.dataForm.contractInMainId = data[0].id; //根据合同主id调接口
        this.getAutomaticData(this.dataForm.contractInMainId);
      }
    },
    //本次保理融资协议编号
    financingApplyCodeChange(data) { 
      if (data) { 
        this.dataForm.financingApplyMainId = data[0].id; 
        this.dataForm.financingApplyCode = data[0].code;  //本次保理融资协议编号
        this.getBankArchiveData(1, data[0].id);
      }
    },
    async getAutomaticData(id) { 
      const dataParams = {
        contractInMainId:id
      }
      const { data, code } = await getAutomaticApi(dataParams);
      if (code === 200) { 
        this.dataForm.customerName = data.customerName;  //客户
        this.dataForm.marketCenterName = data.marketCenterName;  //业务中心
        this.dataForm.projectManagerName = data.projectManagerName; //项目介绍人
      }
    },
    //根据银行档案自动带出数据
    async getBankArchiveData(type, id) {
      let dataParams = {};
      if (type === 1) {
        dataParams['financingApplyMainId'] = id;
      } else if (type === 2) { 
        dataParams['baseBankArchiveMainId'] = id;
      }
      let { data } = await getBankArchiveDataApi(dataParams);
      this.dataForm.payInBankName = data.payInBankName;
    },
    //选择收款账号
    payInAccountNoChange(data) {
      console.log("收款账号===：", data);
      if (data && data.length > 0) {
        this.dataForm.baseBankArchiveMainId = data[0].id;  //收款账号id
        this.dataForm.payInAccountName = data[0].bankAccountName;  //账号名称
        this.dataForm.payInAccountNo = data[0].bankAccountNo;  //收款账号
        // this.dataForm.payInBankName = data[0]//收款账户开户银行
        this.getBankArchiveData(2, data[0].id);
       }
    },
     //开票分类,百望开票,发票类型,对接状态,预缴情况,开票状态,优惠政策,快递方式,商品服务分类
    async getDataDictByConfigTypeData(configTypes) { 
      const { data, success } = await getDataDictByConfigType({ params: { configTypes: configTypes } });
      if (success) { 
        if (data) { 
          // 保理融资类型
          this.factoringTypeArray = data.find(item => item.dataDictType === '保理融资类型')?.dataDict || [];
          //保理业务类型
          this.financingBusinessTypeArray = data.find(item => item.dataDictType === '保理业务类型')?.dataDict || [];
          //签章模式
          this.signatureModeArray = data.find(item => item.dataDictType === '签章模式')?.dataDict || [];
          //签章顺序
          this.signatureOrderArray = data.find(item => item.dataDictType === '签章顺序')?.dataDict || [];
          //本方签章
          this.signatureSealArray = data.find(item => item.dataDictType === '本方签章')?.dataDict || [];
        }
        
      }
    },
    //提交表单校验
    validateForm() { 
      const _this = this;
      _this.signatureModeDataGroup();
      return new Promise(resolve => { 
        _this.$refs['dataForm'].validate(valid => { 
          if (valid) {
            _this.dataFormDateValid();
            console.log("提交表单===：",_this.dataForm);
            return resolve(_this.dataForm)
          } else { 
            return resolve(false);
          }
        })
      })
    },
    //暂存表单
    getDataForm() { 
      this.dataFormDateValid();
      this.signatureModeDataGroup();
      const dataForm = JSON.parse(JSON.stringify(this.dataForm));
      return dataForm;
    },
    dataFormDateValid() { 
      const { factoringStartDate, factoringEndDate, receiptDate } = this.dataForm;
      this.dataForm.factoringStartDate = factoringStartDate ? moment(factoringStartDate).format('YYYY-MM-DD HH:mm:ss') : '';
      this.dataForm.factoringEndDate = factoringEndDate ? moment(factoringEndDate).format('YYYY-MM-DD HH:mm:ss') : '';
      this.dataForm.receiptDate = receiptDate ? moment(receiptDate).format('YYYY-MM-DD HH:mm:ss') : '';
    }
  }
}
</script>

<style lang="less" scoped>
 
</style>