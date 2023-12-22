<template>
  <!-- 开票表单 -->
  <div v-loading="loading"  class="flow-form">
    <el-form class="class" :model="dataForm" ref="dataForm" label-suffix="：" :rules="dataRule" label-width="180px">
      <row-layout title="项目信息" :cols="3">
        <el-form-item label="单据编号" slot="col_1" prop="code">
          <el-input v-model="dataForm.code" :disabled="getDisabledField('code')" placeholder="单据编号"></el-input>
        </el-form-item>
        <el-form-item label="项目编号" slot="col_2" prop="constructArchiveMainCode">
          <el-input v-model="dataForm.constructArchiveMainCode" :disabled="getDisabledField('constructArchiveMainCode')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" slot="col_3" prop="constructArchiveMainName">
          <el-input v-model="dataForm.constructArchiveMainName" :disabled="getDisabledField('constructArchiveMainName')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item label="部门管理" slot="col_1" prop="constructionUnitName">
          <el-input v-model="dataForm.constructionUnitName" :disabled="getDisabledField('constructionUnitName')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item label="项目负责人" slot="col_2" prop="projectManagerName">
          <el-input v-model="dataForm.projectManagerName" :disabled="getDisabledField('projectManagerName')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item label="收入合同编号" slot="col_3" prop="contractInMainCode">
          <el-input v-model="dataForm.contractInMainCode" :disabled="getDisabledField('contractInMainCode')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item label="收入合同名称" slot="col_1" prop="contractInMainName">
          <el-input v-model="dataForm.contractInMainName" :disabled="getDisabledField('contractInMainName')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item slot="col_2"></el-form-item>
        <el-form-item slot="col_3"></el-form-item>
      </row-layout>
      <row-layout title="申请信息" :cols="3">
         <el-form-item label="开票申请单号" slot="col_1" prop="invoiceOpenApplyMainCode">
          <select-dialog :disabled="true" :isLinkBtn="true" :btnDisabled="setting.readonly" :width="800" :modelData="invoiceOpenApplyMainCodeModel" :height="360" :placeholder="msgTip.AUTO_PLACEHOLDER" :value="dataForm.invoiceOpenApplyMainCode" @updateValue="invoiceOpenApplyMainCodeChange" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item label="是否红票" slot="col_2" prop="isRedTicket">
          <el-radio-group :disabled="getDisabledField('isRedTicket')" v-model="dataForm.isRedTicket" @change="isRedTicketChange">
              <el-radio :label="rItem.label" :key="rItem.label" :name="rItem.name" v-for="rItem in isRedTicketRadio">{{rItem.name}}</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="对应蓝字发票号码" slot="col_3" prop="blueFontInvoiceNo">
           <el-input v-model="dataForm.blueFontInvoiceNo" :disabled="getDisabledField('blueFontInvoiceNo')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="3">
        <el-form-item label="红字开票申请原因" slot="col_1" prop="redInvoiceRemark">
          <el-input type="textarea" v-model="dataForm.redInvoiceRemark" :disabled="getDisabledField('redInvoiceRemark')" :rows="5" placeholder="红字开票申请原因"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout title="开票信息" :cols="3">
         <el-form-item label="发票号码" slot="col_1" prop="invoiceNo">
          <el-input v-model="dataForm.invoiceNo" :disabled="getDisabledField('invoiceNo')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item label="发票代码" slot="col_2" prop="invoiceCode">
          <el-input v-model="dataForm.invoiceCode" :disabled="getDisabledField('invoiceCode')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item label="发票类型" slot="col_3" prop="invoiceType">
           <el-select v-model="dataForm.invoiceType" :disabled="getDisabledField('invoiceType')" :placeholder="msgTip.AUTO_PLACEHOLDER">
            <el-option v-for="item in invoiceTypeData" :key="item.configValue" :label="item.configName" :value="item.configValue"></el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item label="开票日期" slot="col_1" prop="invoiceCreateTime">
          <el-date-picker v-model="dataForm.invoiceCreateTime" type="datetime" :disabled="getDisabledField('invoiceCreateTime')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-date-picker>
        </el-form-item>
        <el-form-item label="开票状态" slot="col_2" prop="invoiceStatus">
          <el-select v-model="dataForm.invoiceStatus" :disabled="getDisabledField('invoiceStatus')">
            <el-option v-for="item in invoiceStatusSelect" :key="item.configValue" :label="item.configName" :value="item.configValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开票人" slot="col_3" prop="submitUserName">
          <el-input v-model="dataForm.submitUserName" :disabled="getDisabledField('submitUserName')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item label="销售方" slot="col_1" prop="sellerName">
          <select-dialog :disabled="true" :isLinkBtn="true" :btnDisabled="setting.readonly" :width="600" :height="360" :value="dataForm.sellerName" @updateValue="sellerNameChange" dynamicModel="selectOrg" :placeholder="msgTip.AUTO_PLACEHOLDER"></select-dialog>
        </el-form-item>
        <el-form-item label="销售方纳税识别号" slot="col_2" prop="sellerTaxIdentificationNumber">
          <text-input v-model="dataForm.sellerTaxIdentificationNumber" :disabled="getDisabledField('sellerTaxIdentificationNumber')" :placeholder="msgTip.ENTER_PLACEHOLDER"></text-input>
        </el-form-item>
        <el-form-item label="销售方地址" slot="col_3" prop="sellerAddress">
          <el-input v-model="dataForm.sellerAddress" :disabled="getDisabledField('sellerAddress')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item label="销售方电话" slot="col_1" prop="sellerPhone">
          <el-input v-model="dataForm.sellerPhone" :disabled="getDisabledField('sellerPhone')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item label="销售方开户行" slot="col_2" prop="sellerOpenAccountBank">
          <el-input v-model="dataForm.sellerOpenAccountBank" :disabled="getDisabledField('sellerOpenAccountBank')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item label="销售方账号" slot="col_3" prop="sellerAccountNumber">
          <el-input v-model="dataForm.sellerAccountNumber" :disabled="getDisabledField('sellerAccountNumber')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item label="购方" slot="col_1" prop="buyerName">
          <el-input v-model="dataForm.buyerName" :disabled="getDisabledField('buyerName')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item label="购方纳税识别号" slot="col_2" prop="buyerTaxIdentificationNumber">
          <el-input v-model="dataForm.buyerTaxIdentificationNumber" :disabled="getDisabledField('buyerTaxIdentificationNumber')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item label="购方地址" slot="col_3" prop="buyerAddress">
          <el-input v-model="dataForm.buyerAddress" :disabled="getDisabledField('buyerAddress')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item label="购方电话" slot="col_1" prop="buyerPhone">
          <el-input v-model="dataForm.buyerPhone" :disabled="getDisabledField('buyerPhone')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item label="购方开户行" slot="col_2" prop="buyerOpenAccountBank">
          <el-input v-model="dataForm.buyerOpenAccountBank" :disabled="getDisabledField('buyerOpenAccountBank')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item label="购方账号" slot="col_3" prop="buyerAccountNumber">
          <el-input v-model="dataForm.buyerAccountNumber" :disabled="getDisabledField('buyerAccountNumber')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item label="开票金额(含税)(元)" slot="col_1" prop="invoiceAmountTax">
          <amount-input v-model="dataForm.invoiceAmountTax" :disabled="getDisabledField('invoiceAmountTax')" :placeholder="msgTip.SYSTEM_PLACEHOLDER"></amount-input>
        </el-form-item>
        <el-form-item label="开票金额(无税)(元)" slot="col_2" prop="invoiceAmountUntax">
          <amount-input v-model="dataForm.invoiceAmountUntax" :disabled="getDisabledField('invoiceAmountUntax')" :placeholder="msgTip.SYSTEM_PLACEHOLDER"></amount-input>
        </el-form-item>
        <el-form-item label="税额" slot="col_3" prop="tax">
          <amount-input v-model="dataForm.tax" :disabled="getDisabledField('tax')" :placeholder="msgTip.SYSTEM_PLACEHOLDER"></amount-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item label="数据源" slot="col_1" prop="dataSource">
          <el-radio-group v-model="dataForm.dataSource">
            <el-radio :label="1">百望</el-radio>
          </el-radio-group>
          <!-- <el-radio v-model="dataForm.dataSource" :label="dataForm.dataSource">百望</el-radio> -->
        </el-form-item>
        <el-form-item label="对接状态" slot="col_2" prop="dockingStatus">
          <el-select v-model="dataForm.dockingStatus" :disabled="getDisabledField('dockingStatus')">
            <el-option v-for="dItem in dockingStatusData" :key="dItem.configValue" :label="dItem.configName" :value="dItem.configValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="对接备注" slot="col_3" prop="dockingRemark">
          <el-input v-model="dataForm.dockingRemark" :disabled="getDisabledField('dockingRemark')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="3">
        <el-form-item label="发票备注" slot="col_1" prop="invoiceRemark">
          <el-input type="textarea" v-model="dataForm.invoiceRemark" :disabled="getDisabledField('invoiceRemark')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout title="开票明细信息" :cols="3" cell="3">
        <el-form-item slot="col_1" label-width="0" prop="detailList">
          <detail-list v-model="dataForm.detailList" :id="dataForm.id" :readOnly="setting.readonly" :ppData="ppData" ref="subFromData"></detail-list>
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
import CascSelect from '@/components/basic/cascSelect/index.vue';
import UploaderFile from '@/components/basic/uploaderFile/index.vue';
import {RADIO_GROUP} from '@/views/businessModule/enum/param';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import TextInput from '@/components/basic/elInput/textInput.vue'; //清除空格组件
import PercentageInput from '@/components/basic/numberInput/percentageInput.vue';  //百分比
import LinkInput from '@/components/basic/elInput/linkInput.vue';
import DetailList from './components/detailList.vue';  //开票明细信息
import moment from 'moment'

import comMixin from '../minix';
import { INVOICE_CODE_MODEL } from '@/views/businessModule/enum/param';
import myFun from '@/utils/fun';
import { getDataDictByConfigType } from '@/Api/dataDict';
import service from '@/utils/services';


//必填字段
const requiredFileds = ['invoiceOpenApplyMainCode', 'invoiceNo', 'invoiceCode', 'invoiceCreateTime',
  'sellerName', 'buyerName', 'sellerTaxIdentificationNumber', 'buyerTaxIdentificationNumber', 'sellerAddress',
'sellerPhone','sellerOpenAccountBank','sellerAccountNumber'];

export default {
  components: {
    FormTitle, RowLayout, SelectDialog, AmountInput, CascSelect, UploaderFile, TextInput,
    PercentageInput,LinkInput, DetailList
  },
  mixins: [comMixin],
  data() { 
    return {
      loading: false,
      msgTip: RuleRequired.tipMsg,
      isRedTicketRadio: RADIO_GROUP,
      dataForm: {
        id: '',
        code: '',  //单据编号
        constructArchiveMainCode:'',  //项目编号
        constructArchiveMainName:'',  //项目名称
        constructionUnitName:'',  //管理部门
        projectManagerName:'',  //项目负责人
        contractInMainCode:'',  //收入合同编号
        contractInMainName: '',  //收入合同名称
        blueFontInvoiceNo:'',  //对应蓝字发票号码
        invoiceOpenApplyMainCode: '',  //开票申请单号
        isRedTicket: '',  //是否红票
        invoiceNo:'', //发票号码
        invoiceCode:'',//发票代码
        invoiceType: '', //发票类型
        invoiceStatus:'',  //开票状态
        invoiceCreateTime: '',  //开票日期
        submitUserName:'',//开票人
        sellerName: '', //销售方
        sellerTaxIdentificationNumber:'',//销售方纳税识别号
        sellerAddress: '', //销售方地址
        sellerPhone: '', //销售方电话
        sellerOpenAccountBank:'',//销售方开户行
        sellerAccountNumber: '',//销售方账号
        buyerName: '',  //购方
        buyerTaxIdentificationNumber:'',//购方纳税识别号
        buyerAddress: '',  //购方地址
        buyerPhone:'',//购方电话
        buyerOpenAccountBank:'',//购方开户行
        buyerAccountNumber: '', //购方账号
        invoiceAmountTax:'',//开票金额(含税)(元)
        invoiceAmountUntax:'',//开票金额(无税)(元)
        tax: '',//税额
        dataSource: '', //数据源
        dockingStatus: '',//对接状态
        dockingRemark: '',//对接备注
        invoiceRemark: '',  //发票备注
        detailList:[],  //开票明细信息
      },
      invoiceTypeData: [], //发票类型
      invoiceOpenApplyMainCodeModel: INVOICE_CODE_MODEL,
      invoiceStatusSelect: [],  //开票状态
      dockingStatusData: [],  //对接状态
      ppData:[], //优惠政策
      dataRule: RuleRequired.dataRule(requiredFileds),  //必填字段
      disabledFiled: { //不可编辑字段
        'code': true, //单据编号
        'constructArchiveMainCode': true,  //项目编号
        'constructArchiveMainName': true,  //项目名称
        'constructionUnitName': true, //管理部门
        'projectManagerName': true, //项目负责人
        'contractInMainCode': true, //收入合同编号
        'contractInMainName': true, //收入合同名称
        'isRedTicket': true,  //是否红票
        'blueFontInvoiceNo': true, //对应蓝字发票号码
        'invoiceAmountTax': true, //开票金额(含税)(元)
        'invoiceAmountUntax': true, //开票金额(无税)(元)
        'tax': true, //税额
        'submitUserName': true,  //开票人
        'invoiceRemark': true,  //发票备注
        'dockingStatus': false,  //对接状态
        'dockingRemark': true, //对接备注
      }
    }
  },
  computed: {
    getDisabledField() {
      return (field) => {
        return this.disabledFiled[field] ? this.disabledFiled[field] : false;
      }
    },
  },
  methods: {
    beforeInit() {
      //获取开票人信息
      const obj = FUI.Sys.getAuthor();
      this.dataForm.submitUserName = decodeURIComponent(obj.realName) || '';
      this.getDataDictByConfigType();
    },
    afterInit() {
      //如果是详情 所有无流程表单不可编辑
      if (this.setting.readonly) { 
        Object.keys(this.dataForm).forEach(key => {
          this.disabledFiled[`${key}`] = true;
        })
        this.disabledFiled['invoiceCreateTime'] = true;
      }
      if (this.dataForm.dataSource === null) { 
        this.dataForm.dataSource = '';
      }
    },
    //获取数据字典的信息
   async getDataDictByConfigType() {
        const configTypes = '发票类型,开票状态,对接状态,优惠政策';
        const { data, success } = await getDataDictByConfigType({ params: { configTypes: configTypes } });
        if (success) {
          //发票类型
          this.invoiceTypeData = data.find(item => item.dataDictType === '发票类型')?.dataDict || [];
          //开票状态
          this.invoiceStatusSelect = data.find(item => item.dataDictType === '开票状态')?.dataDict || [];
          //对接状态
          this.dockingStatusData = data.find(item => item.dataDictType === '对接状态')?.dataDict || [];
          //优惠政策
          this.ppData = data.find(item => item.dataDictType === '优惠政策')?.dataDict || '';
        }
    },
    async validateForm() {
      const _this = this;
      const { invoiceCreateTime } = _this.dataForm;
      const subFromData = await _this.$refs['subFromData'].validateForm();
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid) {
            _this.dataForm.procInstState = '1'; //1：草稿  3：已完成
            console.log("subFromData===:", subFromData);
            // _this.dataForm.detailList = subFromData;
            _this.dataForm.dataSource = _this.dataForm.dataSource ? _this.dataForm.dataSource.toString() : '';
            _this.dataForm.invoiceCreateTime = moment(invoiceCreateTime).format('YYYY-MM-DD HH:mm:ss');
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
        // id: item.id,
        id: this.dataForm.id ? item.id : '',
        preferentialPolicy: item.preferentialPolicy,  //优惠政策
        nameGoodsTaxableService: item.nameGoodsTaxableService,  //开票内容	
        specification: item.specification,  //规格/型号
        taxRate: this.taxRateResult(item.taxRate),  //税率 
        unit: item.unit,  //单位
        objectNumber: item.objectNumber ? Number(item.objectNumber) : '',  //数量
        unitPriceTax: item.unitPriceTax ? Number(item.unitPriceTax) : '',  //单价含税
        unitPriceUntax: item.unitPriceUntax ? Number(item.unitPriceUntax) : '', //单价(无税)	
        amountTax: item.amountTax ? Number(item.amountTax) : '',  //金额含税
        tax: item.tax ? Number(item.tax) : '',  //税额	
        amountUntax: item.amountUntax || '',  //金额无税
      })) : []
    },
    taxRateResult(taxRate) { 
      let result = '';
      if (taxRate && taxRate.indexOf('%') > -1) { 
        result = taxRate.replace('%', '');
      }
      return result ? Number(result / 100) : 0;
    },
    //是否红票
    isRedTicketChange(e) {
      console.log("是否红票===：",e);
    },
    //开票申请单号
    invoiceOpenApplyMainCodeChange(data) {
      console.log("开票申请单号===:", data);
      if (data.length > 0) { 
        this.dataForm.invoiceOpenApplyMainCode = data[0].invoiceOpenApplyMainCode || ''; //开票申请单号
        this.dataForm.constructArchiveMainCode = data[0].constructArchiveMainCode || ''; //项目编号
        this.dataForm.constructArchiveMainName = data[0].constructArchiveMainName || ''; //项目名称
        this.dataForm.constructionUnitName = data[0].constructionUnitName || '';  //管理部门
        this.dataForm.projectManagerName = data[0].projectManagerName || '';  //项目负责人
        this.dataForm.contractInMainCode = data[0].contractInMainCode || '';  //收入合同编号
        this.dataForm.contractInMainName = data[0].contractInMainName || ''; //收入合同名称
      }
    },
    //销售方
    sellerNameChange(data) {
      console.log("销售方===:", data);
      this.dataForm.sellerName = data[0].text; //获取销售方
      
     }
  }
}
</script>

<style>

</style>