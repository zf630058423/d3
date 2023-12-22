<template>
  <div class="flow-form">
       <el-form class="class" ref="dataForm" :rules="dataRule" :model="dataForm" label-suffix="：" label-width="152px">
          <row-layout title="付款信息" :cols="3">
            <el-form-item slot="col_1" label="单据编号" prop="code">
              <el-input v-model="dataForm.code" clearable :placeholder="msgTip.AUTO_PLACEHOLDER" :disabled="getDisabledField('code')"></el-input>
            </el-form-item>
            <el-form-item slot="col_2" label="交易日期" prop="tradeDate">
              <el-date-picker v-model="dataForm.tradeDate" type="date" :disabled="getDisabledField('tradeDate')" placeholde="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item slot="col_3" label="付款方" prop="pay">
              <el-input v-model="dataForm.pay" clearable :disabled="getDisabledField('pay')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
        </row-layout>
        <row-layout :cols="3">
           <el-form-item slot="col_1" label="付款账号" prop="payCccount">
            <el-input v-model="dataForm.payCccount" clearable :disabled="getDisabledField('payCccount')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
            <el-form-item slot="col_2" label="收款金额(元)" prop="collectedAmount">
              <amount-input v-model="dataForm.collectedAmount" clearable :disabled="getDisabledField('collectedAmount')" :placeholder="msgTip.ENTER_PLACEHOLDER"></amount-input>
            </el-form-item>
            <el-form-item slot="col_3" label="本方单位" prop="payee">
              <el-input v-model="dataForm.payee" clearable :disabled="getDisabledField('payee')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
        </row-layout>
        <row-layout :cols="3">
           <el-form-item slot="col_1" label="本方银行账号" prop="payeeAccount">
            <el-input v-model="dataForm.payeeAccount" clearable :disabled="getDisabledField('payeeAccount')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
            <el-form-item slot="col_2" label="本方开户银行" prop="payeeBank">
              <el-input v-model="dataForm.payeeBank" clearable :disabled="getDisabledField('payeeBank')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
            <el-form-item slot="col_3" label="备注" prop="remark">
              <el-input v-model="dataForm.remark" clearable :disabled="getDisabledField('remark')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
            
        </row-layout>
        <row-layout title="认领信息" :cols="3">
          <el-form-item slot="col_1" label="收支项目" prop="subjectItem">
            <el-select v-model="dataForm.subjectItem" :disabled="getDisabledField('subjectItem')" clearable :placeholder="msgTip.SELECT_PLACEHOLDER">
                <el-option :label="item.configName" :value="item.configValue" :key="item.configValue" v-for="item in subjectItemArray"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item slot="col_2" label="项目编号" prop="projectCode">
              <select-dialog :disabled="true" :btnDisabled="false" :width="800" :modelData="projectCodeModal" :height="360" :value="dataForm.projectCode" @updateValue="projectCodeChange" dynamicModel="customDialog"></select-dialog>
            </el-form-item>
           <el-form-item slot="col_3" label="项目名称" prop="projectName">
              <el-input v-model="dataForm.projectName" clearable :disabled="getDisabledField('projectName')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
        </row-layout>
        <row-layout :cols="3">
          <el-form-item slot="col_1" label="项目负责人" prop="projectManager">
              <el-input v-model="dataForm.projectManager" clearable :disabled="getDisabledField('projectManager')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
            <el-form-item slot="col_2" label="合同总金额" prop="buyerAddressAndPhone	">
              <amount-input v-model="dataForm.buyerAddressAndPhone" clearable :disabled="getDisabledField('buyerAddressAndPhone')" :placeholder="msgTip.ENTER_PLACEHOLDER"></amount-input>
            </el-form-item>
           <el-form-item slot="col_3" label="计税方式" prop="paymentInitiator">
              <el-input v-model="dataForm.paymentInitiator" clearable :disabled="getDisabledField('paymentInitiator')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
        </row-layout>
        <row-layout :cols="3">
           <el-form-item slot="col_1" label="已申请开票金额" :prop="sqVoinceMoney">
              <el-input v-model="dataForm.sqVoinceMoney" clearable :disabled="getDisabledField('sqVoinceMoney')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
            <el-form-item slot="col_2" label="付款单类型" prop="payBillType">
              <select-dialog :disabled="true" :btnDisabled="false" :width="800" :modelData="payBillTypeModel" :height="360" :value="dataForm.payBillType" @updateValue="payBillTypeChange" dynamicModel="customDialog"></select-dialog>
            </el-form-item>
            <el-form-item slot="col_3" label="付款单号" prop="payBillCode	">
              <select-dialog :disabled="true" :btnDisabled="false" :width="800" :modelData="payBillCodeModel" :height="360" :value="dataForm.payBillCode" @updateValue="payBillCodeChange" dynamicModel="customDialog"></select-dialog>
            </el-form-item>
        </row-layout>
        <row-layout :cols="3">
           <el-form-item slot="col_1" label="管理部门" prop="managerDept">
              <el-input v-model="dataForm.managerDept" clearable :disabled="getDisabledField('managerDept')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
            <el-form-item slot="col_2" label="是否首次到款" prop="isFirstPayment">
              <el-select v-model="dataForm.isFirstPayment" :disabled="getDisabledField('isFirstPayment')" clearable :placeholder="msgTip.SELECT_PLACEHOLDER">
                <el-option :label="item.configName" :value="item.configValue" :key="item.configValue" v-for="item in isFirstPaymentArray"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item slot="col_3" label="投标名称" prop="marketCode">
              <select-dialog :disabled="true" :btnDisabled="false" :width="800" :modelData="marketCodeModel" :height="360" :value="dataForm.marketCode" @updateValue="marketCodeChange" dynamicModel="customDialog"></select-dialog>
            </el-form-item>
        </row-layout>
        <row-layout :cols="3">
           <el-form-item slot="col_1" label="投标保证金支付申请" prop="bidGuaranteeApplyCode">
              <el-input v-model="dataForm.bidGuaranteeApplyCode" clearable :disabled="getDisabledField('bidGuaranteeApplyCode')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
            <el-form-item slot="col_2" label="项目借款" prop="projectLoanCode">
              <select-dialog :disabled="true" :btnDisabled="false" :width="800" :modelData="projectLoanCodeModel" :height="360" :value="dataForm.projectLoanCode" @updateValue="projectLoanCodeChange" dynamicModel="customDialog"></select-dialog>
            </el-form-item>
            <el-form-item slot="col_3" label="员工借款" prop="personLoanCode">
              <select-dialog :disabled="true" :btnDisabled="false" :width="800" :modelData="personLoanCodeModel" :height="360" :value="dataForm.personLoanCode" @updateValue="personLoanCodeChange" dynamicModel="customDialog"></select-dialog>
            </el-form-item>
        </row-layout>
        <row-layout :cols="3">
          <el-form-item slot="col_1" label="履约保证金支付申请">
            <el-input v-model="dataForm.bidGuaranteeApplyCode" clearable :disabled="getDisabledField('bidGuaranteeApplyCode')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
          </el-form-item>
          <el-form-item slot="col_2" label="设计费收取方式" prop="collectionMethod">
            <el-select v-model="dataForm.collectionMethod" :disabled="getDisabledField('collectionMethod')" clearable :placeholder="msgTip.SELECT_PLACEHOLDER">
                <el-option :label="item.configName" :value="item.configValue" :key="item.configValue" v-for="item in collectionMethodArray"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item slot="col_3" label="备注说明" prop="instructions">
            <el-input v-model="dataForm.instructions" clearable :disabled="getDisabledField('instructions')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3">
          <el-form-item slot="col_1" label="结算方式" prop="settlementMethod">
           <el-input v-model="dataForm.settlementMethod" clearable :disabled="getDisabledField('settlementMethod')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
          </el-form-item>
          <el-form-item slot="col_2" label="认领状态" prop="claimStatus">
            <el-select v-model="dataForm.claimStatus" :disabled="getDisabledField('claimStatus')" clearable :placeholder="msgTip.SELECT_PLACEHOLDER">
                <el-option :label="item.configName" :value="item.configValue" :key="item.configValue" v-for="item in claimStatusArray"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item slot="col_3" label="认领人" prop="claimantUser">
            <el-input v-model="dataForm.claimantUser" clearable :disabled="getDisabledField('claimantUser')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3">
          <el-form-item slot="col_1" label="认领时间" prop="claimTime">
            <el-date-picker v-model="dataForm.claimTime" type="date" :disabled="getDisabledField('claimTime')" placeholde="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item slot="col_2" label="认领人部门" prop="claimDept">
            <el-input v-model="dataForm.claimDept" clearable :disabled="getDisabledField('claimDept')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
          </el-form-item>
          <el-form-item slot="col_3"></el-form-item>
        </row-layout>
        <row-layout title="附件" :cols="3" cell="3">
         <el-form-item slot="col_1" prop="fileInfoList" label="附件：">
          <uploader-file v-model="dataForm.fileInfoList" :isReadOnly="getDisabledField('fileInfoList')"></uploader-file>
        </el-form-item>
      </row-layout>
      <row-layout title="撤销认领记录" :cols="3" cell="3">
          <el-form-item slot="col_1" label-width="0" prop="financeBankDirectCancelRecord">
            <claim-record-list></claim-record-list>
          </el-form-item>
        </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="createUserName" label="编制人">
          <label class="label-style">{{dataForm.createUserName}}</label>
        </el-form-item>
        <el-form-item slot="col_2" prop="createUserDeptName" label="编制人部门">
            <label class="label-style">{{dataForm.deptName}}</label>
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
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import ListSearchForm from '@/components/basic/fromLayout/listSearchForm.vue';
import AmountInput from '@/components/basic/numberInput/amountInput.vue';
import TextInput from '@/components/basic/elInput/textInput.vue';
import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
import UploaderFile from '@/components/basic/uploaderFile/index.vue';
import ClaimRecordList from './components/claimRecordList.vue'
import { getDataDictByConfigType } from '@/Api/dataDict.js';
import comMixin from '../minix';
import moment from 'moment';
import { PROJECT_CODE_BANK_MODEL } from '@/views/businessModule/enum/param'

const requiredFiled = ['']

export default {
  name: 'searchFrom',
  components: {
    RowLayout,
    SelectDialog,
    ListSearchForm,
    AmountInput,
    TextInput,
    UploaderFile,
    ClaimRecordList
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
      projectCodeModal: PROJECT_CODE_BANK_MODEL,  //项目编号
      payeeModal: {},  //收款方
      payBillTypeModel: {},  //付款单类型
      payBillCodeModel: {},  //付款单号
      paymentInitiatorModel: {},  //付款发起人
      marketCodeModel: {},  //投标名称
      projectLoanCodeModel: PROJECT_LOAN_MODEL,  //项目借款
      personLoanCodeModel: {},  //员工借款
      isFirstPaymentArray: [],  //是否首次到款
      subjectItemArray: [],  //收支项目
      collectionMethodArray: [], //设计费收取方式
      claimStatusArray:[],  //领取状态
      dataForm: {
        id:'',
        code: '',
        sqVoinceMoney:'',
        tradeDate: '',  //交易日期
        pay: '',  //付款方
        payCccount: '',  //付款账号
        collectedAmount: '',  //收款金额
        payee:'',  //本方单位
        payeeAccount:'',  //本方银行账号
        remark: '',  //备注
        subjectItem: '',  //收支项目
        projectCode: '',  //项目编号
        projectName: '',  //项目名称
        projectManager: '',  //项目负责人
        buyerAddressAndPhone: '',  //合同总金额
        paymentInitiator: '', //计税方式
        sqVoinceMoney: '', //已申请开票金额
        payBillType: '',  //付款单类型
        payBillCode:'',  //付款单号
        managerDept: '', //管理部门
        isFirstPayment: '',  //是否首次到款
        marketCode: '',  //投标名称
        projectLoanCode: '',  //项目借款
        personLoanCode:'', //员工借款
        bidGuaranteeApplyCode: '', //履约保证金支付申请
        collectionMethod: '', //设计费收取方式
        instructions:'',//备注说明
        settlementMethod:'',//结算方式
        claimStatus:'',//认领状态
        claimantUser:'',//认领人
        claimDept:'',//认领人部门
        claimTime:'',//认领时间
        fileInfoList:[],//附件
        createUserName:'',//编制人
        createUserDeptName:'',//编制人部门
        createTime:'',//编制时间
      },
      msgTip: RuleRequired.tipMsg,
      isOpen: false,
      defaultRadioGroup: [
        { configValue: '1', configName: '是' },
        { configValue: '0', configName: '否' }
      ],
      ppData: [],
      disabledFiled: {
        'code': true, //单据编号
        'claimantUser': true,  //认领人
        'claimTime': true,  //认领时间
        'claimDept': true,  //认领人部门
      },
      dataRule: RuleRequired.dataRule(requiredFiled),
      currencyArray: [],  //币种
      pushStatusArray:[],  //推送状态
      paymentStatusArray:[],  //付款状态
      invoiceStatusArray: [],
      isRedTicketArray: [],
      invoiceTypeArray:[]
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
      //发票状态判断
      this.invoiceStatusJudage();
    },
    //项目编号
    projectCodeChange() { },
    //付款单类型
    payBillTypeChange(e) {
      console.log("付款单类型===:",e);
    },
    //付款单号
    payBillCodeChange(e) {
      console.log("付款单号===:",e);
    },
    //投标名称
    marketCodeChange() { 
      console.log("投标名称===:",e);
    },
    //项目借款
    projectLoanCodeChange(e) {
      console.log("项目借款===:",e);
    },
    //员工借款
    personLoanCodeChange(e) { 
      console.log("员工借款===:",e);
    },
    contractInCodeChange() { },
    async getDataDictByConfigType() {
      const configTypes = '推送状态,付款状态,币种,是否首次到款';
      let { data, success } = await getDataDictByConfigType({ params: { configTypes: configTypes } });
      if (success) {
        if (data && data.length > 0) {
          //推送状态
          this.pushStatusArray = data.find(item => item.dataDictType === '推送状态')?.dataDict || [];
          //付款状态
          this.paymentStatusArray = data.find(item => item.dataDictType === '付款状态')?.dataDict || [];
          //币种
          this.currencyArray = data.find(item => item.dataDictType === '币种')?.dataDict || [];
        }
      }
    },
    //付款发起人
    paymentInitiatorChange(e) {
      console.log("付款发起人===:",e);
    },
    //收款方
    payeeChange(e) {
       console.log("收款方===:",e);
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
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../style/form.scss';
// @import "../../style/searchForm.scss";


</style>
