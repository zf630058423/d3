<template>
  <!-- 费用预提单 -->
  <div class="flow-form">
    <el-form class="class" ref="dataForm" :model="dataForm" label-suffix="：" label-width="142px">
      <row-layout :cols="3" title="基本信息">
        <el-form-item slot="col_1" label="单据编号" prop="code">
          <el-input v-model="dataForm.code" clearable :placeholder="msgTip.AUTO_PLACEHOLDER" disabled></el-input>
        </el-form-item>
        <el-form-item slot="col_2" label="预提项目编号" prop="constructCode">
          <select-dialog :disabled="true" :isLinkBtn="true" :btnDisabled="getDisabledField('constructCode')" :width="800" :modelData="constructCodeModel" :height="360" :placeholder="msgTip.AUTO_PLACEHOLDER" :value="dataForm.constructCode" @updateValue="constructCodeChange" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="预提项目名称" prop="constructName">
          <el-input v-model="dataForm.constructName" clearable :placeholder="msgTip.AUTO_PLACEHOLDER" :disabled="getDisabledField('code')"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="管理部门" prop="constructionUnitName">
          <el-input v-model="dataForm.constructionUnitName" clearable :placeholder="msgTip.AUTO_PLACEHOLDER" :disabled="getDisabledField('constructionUnitName')"></el-input>
        </el-form-item>
        <el-form-item slot="col_2" label="项目负责人" prop="projectManagerName">
          <el-input v-model="dataForm.projectManagerName" clearable :placeholder="msgTip.AUTO_PLACEHOLDER" :disabled="getDisabledField('projectManagerName')"></el-input>
        </el-form-item>
        <el-form-item slot="col_3" label="购方名称" prop="buyerName">
          <el-input v-model="dataForm.buyerName" clearable :placeholder="msgTip.ENTER_PLACEHOLDER" :disabled="getDisabledField('buyerName')"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="预提总金额" prop="sumAmount">
          <amount-input v-model="dataForm.sumAmount" clearable :placeholder="msgTip.AUTO_PLACEHOLDER" :disabled="getDisabledField('sumAmount')"></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" label="付款状态" prop="payStatus">
          <el-select v-model="payStatusVal" placeholder="请选择" :disabled="getDisabledField('payStatus')">
            <el-option :label="item.configName" :value="item.configValue" :key="item.configValue" v-for="item in payStatusArray">{{ item.configName }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_3" label="来源" prop="sourceType">
          <el-input v-model="sourceTypeStatus" clearable :placeholder="msgTip.AUTO_PLACEHOLDER" :disabled="getDisabledField('sourceType')"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout cell="3" :cols="3">
        <el-form-item slot="col_1" label="备注" prop="remark">
          <el-input type="textarea" placeholder="最多可输入400字" rows="5" v-model="dataForm.remark" :disabled="getDisabledField('remark')"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout v-if="dataForm.sourceType === 1" title="发票信息" :cols="3" cell="3">
        <el-form-item slot="col_1" label-width="0" prop="invoiceDetailList">
          <invoice-detail-list v-model="dataForm.invoiceDetailList" :readOnly="true" :ppData="ppData" :rowData="rowData" :id="dataForm.id" @invoiceAmountChange="invoiceAmountChange"></invoice-detail-list>
        </el-form-item>
      </row-layout>
      <row-layout v-if="dataForm.sourceType === 2" title="税款信息" :cols="3" cell="3">
        <el-form-item slot="col_1" label-width="0" prop="taxDetailList">
          <tax-detail-list v-model="dataForm.taxDetailList" :readOnly="true" :rowData="rowData" :id="dataForm.id"></tax-detail-list>
        </el-form-item>
      </row-layout>
      <row-layout title="附加税费信息" :cols="3" cell="3" v-if="dataForm.sourceType === 2">
        <el-form-item slot="col_1" label-width="0" prop="additionTaxDetailList">
          <addit-detail-list v-model="dataForm.additionTaxDetailList" :readOnly="true" :rowData="rowData" :id="dataForm.id" @taxesChange="taxesChange"></addit-detail-list>
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
          <label class="label-style">{{dataForm.createTime}}</label>
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
import InvoiceDetailList from './components/invoiceDetailList.vue';  //发票明细	
import TaxDetailList from './components/taxDetailList.vue';  //税款信息
import AdditDetailList from './components/additionDetailList.vue';  //附加税费信息
import UploaderFile from '@/components/basic/uploaderFile/index.vue';
import { getDataDictByConfigType } from '@/Api/dataDict.js';
import { checkExtractExpenseApi, checkInvoiceApi } from '@/Api/invoice/invoiceExtractExpenseMain.js';
import comMixin from '../minix';
import myFun from '@/utils/fun';

export default {
  name: '',
  components: {
    RowLayout,
    SelectDialog,
    AmountInput,
    TextInput,
    InvoiceDetailList,
    TaxDetailList,
    AdditDetailList
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
      msgTip: RuleRequired.tipMsg,
      constructCodeModel: {
        code:'YuTiXiangMuBianHao',
          parm: {
            isEnableAuthor: 0,
            data: [],
            isMulti: false
          }
      },
      dataForm: {
        code:'',  //单据编号
        constructCode: '',  //预提项目编号
        constructName: '',  //项目名称
        constructionUnitName: '',  //管理部门
        projectManagerName: '',  //项目负责人
        buyerName: '',  //购方名称
        sumAmount: '',  //预提总金额
        payStatus: '',  //付款状态
        sourceType: '',  //来源
        remark: '',  //备注
        invoiceDetailList: [], //发票明细
        taxDetailList: [], //税款明细	
        additionTaxDetailList: [],//附加费明细	
        createUserDeptName: '',
        createUserName:'', 
        createTime: '',
      },
      payStatusArray: [], 
      disabledFiled: {
        'constructCode': true,  //预提项目编号
        'sumAmount': true,  //预提总金额不可编辑
        'payStatus': true,  //不可编辑
      },
      ppData: [],
      invoiceAmountTotal: 0,  //发票金额含税合计  发票信息
      actualAdvanceTotal: 0,  //实际预缴税额合计	税款明细 
      taxesTotal: 0, //缴纳税金合计 附加税费
    }
  },
  computed: {
    getDisabledField() { 
      return (field) => {
        return this.disabledFiled[field] ? this.disabledFiled[field] : false;
      }
    },
    //来源
    sourceTypeStatus() { 
      const { sourceType } = this.dataForm;
      return (sourceType === 1) ? '发票信息采集' : (sourceType === 2 ? '预缴完税凭证' : '');
    },
    //付款状态
    payStatusVal() {
      const { payStatus } = this.dataForm;
      if (payStatus === '') {
        return this.payStatusArray.find(item => item.configValue === '1')?.configValue || '';
      } else { 
        return this.payStatusArray.find(item => item.configValue === payStatus)?.configValue || '';
      }
     }
  },
  methods: {
    beforeInit() { 
      this.getDataDictByConfigType();
    },
    async getDataDictByConfigType() { 
      const configTypes = '付款状态(3态),发票状态,发票类型';
      const { data, success } = await getDataDictByConfigType({ params: { configTypes: configTypes } });
      if (success) {
        if (data && data.length > 0) {
          this.ppData = data; 
          //付款状态
          this.payStatusArray = data.find(item => item.dataDictType === '付款状态(3态)')?.dataDict || [];
        }
      }
    },
    afterInit() { 
      const { sourceType } = this.dataForm;
      const noDisabledFields = ['constructCode', 'constructName', 'constructionUnitName'];
      //如果来源是发票信息采集 发票信息采集来源的不可编辑字段
      if (sourceType === 1) {  //发票信息采集
        noDisabledFields.forEach(filed => {
          this.disabledFiled[filed] = true;
        })
      } else if (sourceType === 2) { //2 预缴完税凭证
        noDisabledFields.forEach(filed => {
          this.disabledFiled[filed] = false;
        })
        this.dataForm.remark = '';  //备注默认为空
      }
    },
    //发票金额含税合计
    invoiceAmountChange(tax) {
      this.invoiceAmountTotal = tax;
      this.sumAmountTotal();
    },
    //附加税信息
    taxesChange(tax) {
      this.taxesTotal = tax;
      this.sumAmountTotal();
    },
    //实际预缴税额
    actualAdvanceChange(tax) {
      this.actualAdvanceTotal = tax;
      this.sumAmountTotal();
    },
    //预提总金额 计算
    sumAmountTotal() {
      let sum = myFun.getNumAdd(this.taxesTotal.toString(), this.invoiceAmountTotal.toString())
      this.dataForm.sumAmount = myFun.getNumAdd(sum, this.actualAdvanceTotal.toString());
    },
    //预提项目编号
    constructCodeChange(data) {
      this.dataForm.constructCode = data[0].code;
    },
    //提交表单校验
    validateForm() { 
      const _this = this;
      return new Promise(resolve => { 
        _this.$refs['dataForm'].validate(valid => { 
          if (valid && _this.checkInvoiceData()) {
            return resolve(_this.dataForm)
          } else { 
            return resolve(false);
          }
        })
      })
    },
    //校验发票是否均未付款 
    async checkInvoiceData() { 
      const { invoiceDetailList } = this.dataForm;
      const invoiceMainIds = invoiceDetailList.length ? invoiceDetailList.map(filed => filed.id).join(',') : '';
      const { code, msg } = await checkInvoiceApi(invoiceMainIds);
      if (code === 200) {
        return true;
      } else { 
        this.$message.error(msg);
        return false;
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>