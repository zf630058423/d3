<template>
  <div class="flow-form">
       <el-form class="class" ref="dataForm" :rules="dataRule" :model="dataForm" label-suffix="：" label-width="142px">
          <row-layout title="付款信息" :cols="3">
            <el-form-item slot="col_1" label="单据编号" prop="code">
              <el-input v-model="dataForm.code" clearable :placeholder="msgTip.AUTO_PLACEHOLDER" :disabled="getDisabledField('code')"></el-input>
            </el-form-item>
            <el-form-item slot="col_2" label="付款单号" prop="invoiceNo">
              <el-input v-model="dataForm.invoiceNo" clearable :disabled="getDisabledField('invoiceNo')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
            <el-form-item slot="col_3" label="菜单名" prop="invoiceCode">
              <el-input v-model="dataForm.invoiceCode" clearable :disabled="getInvoiceCodeByInvoice" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
        </row-layout>
        <row-layout :cols="3">
           <el-form-item slot="col_1" label="项目编号" prop="projectCode">
            <select-dialog :disabled="true" :btnDisabled="false" :width="800" :modelData="projectCodeModal" :height="360" :value="dataForm.projectCode" @updateValue="contractInCodeChange" dynamicModel="customDialog"></select-dialog>
            </el-form-item>
            <el-form-item slot="col_2" label="项目名称" prop="sellerName">
              <el-input v-model="dataForm.sellerName" clearable :disabled="getDisabledField('sellerName')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
            <el-form-item slot="col_3" label="本次付款金额" prop="buyerName">
              <el-input v-model="dataForm.buyerName" clearable :disabled="getDisabledField('buyerName')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
        </row-layout>
        <row-layout :cols="3">
           <el-form-item slot="col_1" label="付款财务组织" prop="invoiceType">
              <select-dialog :disabled="true" :btnDisabled="false" :width="800" :modelData="payeeModal" :height="360" :value="dataForm.payee" @updateValue="payeeChange" dynamicModel="customDialog"></select-dialog>
            </el-form-item>
            <el-form-item slot="col_2" label="付款账号" prop="sellerTaxIdentificationNumber">
              <el-input v-model="dataForm.sellerTaxIdentificationNumber" clearable :disabled="getDisabledField('sellerTaxIdentificationNumber')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
            <el-form-item slot="col_3" label="出纳" prop="buyerTaxIdentificationNumber">
              <el-input v-model="dataForm.buyerTaxIdentificationNumber" clearable :disabled="getDisabledField('buyerTaxIdentificationNumber')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
        </row-layout>
        <row-layout :cols="3">
           <el-form-item slot="col_1" label="收款方" prop="payee">
              <select-dialog :disabled="true" :btnDisabled="false" :width="800" :modelData="payeeModal" :height="360" :value="dataForm.payee" @updateValue="payeeChange" dynamicModel="customDialog"></select-dialog>
            </el-form-item>
            <el-form-item slot="col_2" label="收款账号" prop="sellerAddressAndPhone">
              <el-input v-model="dataForm.sellerAddressAndPhone" clearable :disabled="getDisabledField('sellerAddressAndPhone')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
            <el-form-item slot="col_3" label="收款银行联行号" prop="buyerAddressAndPhone	">
              <el-input v-model="dataForm.buyerAddressAndPhone" clearable :disabled="getDisabledField('buyerAddressAndPhone')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
        </row-layout>
        <row-layout :cols="3">
           <el-form-item slot="col_1" label="付款发起人" prop="paymentInitiator">
              <select-dialog :disabled="true" :btnDisabled="false" :width="800" :modelData="paymentInitiatorModel" :height="360" :value="dataForm.projectCode" @updateValue="paymentInitiatorChange" dynamicModel="customDialog"></select-dialog>
            </el-form-item>
            <el-form-item slot="col_2" label="推送状态" prop="pushStatus">
              <el-select v-model="dataForm.pushStatus" :disabled="getDisabledField('pushStatus')" clearable :placeholder="msgTip.SELECT_PLACEHOLDER">
                <el-option :label="item.configName" :value="item.configValue" :key="item.configValue" v-for="item in pushStatusArray"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item slot="col_3">
            </el-form-item>
        </row-layout>
        <row-layout title="银行返回" :cols="3">
           <el-form-item slot="col_1" label="资金系统单据编号" :prop="djCode">
              <el-input v-model="dataForm.djCode" clearable :disabled="getDisabledField('djCode')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
            <el-form-item slot="col_2" label="付款状态" prop="paymentStatus">
              <el-select v-model="dataForm.paymentStatus" :disabled="getDisabledField('paymentStatus')" clearable :placeholder="msgTip.SELECT_PLACEHOLDER">
                <el-option :label="item.configName" :value="item.configValue" :key="item.configValue" v-for="item in paymentStatusArray"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item slot="col_3" label="付款时间" prop="invoiceVerificationCode	">
              <el-input v-model="dataForm.invoiceVerificationCode" :disabled="getDisabledField('invoiceVerificationCode')" clearable :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
        </row-layout>
        <row-layout :cols="3">
           <el-form-item slot="col_1" label="对私付款" prop="invoiceAmountTax">
              <el-radio-group v-model="dataForm.applicationRedInformation" :disabled="getDisabledField('applicationRedInformation')">
                <el-radio :label="item.configValue" :key="item.configValue" v-for="item in defaultRadioGroup">{{ item.configName}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item slot="col_2" label="地域标志" prop="invoiceAmountUntax">
              <amount-input v-model="dataForm.invoiceAmountUntax" clearable :disabled="getDisabledField('invoiceAmountUntax')" :placeholder="msgTip.ENTER_PLACEHOLDER"></amount-input>
            </el-form-item>
            <el-form-item slot="col_3" label="用途" prop="tax">
              <el-input v-model="dataForm.invoiceCode" clearable :disabled="getInvoiceCodeByInvoice" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
            </el-form-item>
        </row-layout>
        <row-layout :cols="3">
           <el-form-item slot="col_1" label="币种" prop="applicationRedInformation">
              <el-select v-model="dataForm.invoiceStatus" :disabled="getDisabledField('sellerOpenBankAndAccount')" clearable :placeholder="msgTip.SELECT_PLACEHOLDER">
                <el-option :label="item.configName" :value="item.configValue" :key="item.configValue" v-for="item in currencyArray"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item slot="col_2" label="加急标志" prop="redCharge">
              <text-input v-model="dataForm.redCharge" :row="5" clearable :disabled="getDisabledField('invoiceRemark')" :placeholder="msgTip.AUTO_PLACEHOLDER"></text-input>
            </el-form-item>
            <el-form-item slot="col_3" label="期望付款日期" prop="redCharge">
              <el-date-picker v-model="dataForm.claimTime" type="date" :disabled="getDisabledField('claimTime')" placeholde="选择日期"></el-date-picker>
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
import { getDataDictByConfigType } from '@/Api/dataDict.js';
import comMixin from '../minix';
import moment from 'moment';

const requiredFiled = ['']

export default {
  name: 'searchFrom',
  components: {
    RowLayout,
    SelectDialog,
    ListSearchForm,
    AmountInput,
    TextInput,
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
      projectCodeModal: {},  //项目编号
      payeeModal: {},  //收款方
      paymentInitiatorModel: {},  //付款发起人
      dataForm: {
        id:'',
        code: '',
        invoiceNo: '',
        invoiceCode: '',  //发票代码
        sellerName: '',  //销售方
        buyerName: '',  //购方
        payee:'',  //收款方
        invoiceType:'',  //发票类型
        invoiceCreateTime: '',  //开票日期
        sellerTaxIdentificationNumber: '',  //销售方纳税识别号
        buyerTaxIdentificationNumber: '',  //购方纳税识别号
        invoiceStatus: '',  //发票状态
        sellerAddressAndPhone: '',  //销售方地址及电话
        isRedTicket: '',  //是否红票
        sellerOpenBankAndAccount: '', //销售方开户行及账号
        buyerOpenBankAndAccount: '', //购方开户行及账号
        djCode: '',  //单据编号
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
         
        ],  //项目信息列表
      },
      msgTip: RuleRequired.tipMsg,
      isOpen: false,
      defaultRadioGroup: [
        { configValue: '1', configName: '是' },
        { configValue: '0', configName: '否' }
      ],
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
    contractInCodeChange() { },
    async getDataDictByConfigType() {
      const configTypes = '推送状态,付款状态,币种';
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
