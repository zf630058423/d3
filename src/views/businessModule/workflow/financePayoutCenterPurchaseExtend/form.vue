<template>
   <!-- 集采付款 -->
  <div v-loading="loading">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      :disabled="setting.readonly"
      label-width="180px"
      class="new-data-form-css"
    >
      <row-layout :title="'基础信息'" :cols="3">
        <el-form-item slot="col_1" label="单据编号：">
          <el-input v-model="dataForm.code" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="supplierId" label="集采供应商：">
          <selector-dialog :model-data="supplierDialog" :value="dataForm.supplierName" dynamic-model="customDialog" @updateValue="updateSupplierValue" :btnDisabled="setting.readonly"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="本次申请金额（元）：">
          <el-input :value="getApplyAmount()" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="paymentOrgId" label="付款财务组织：">
					<selector-dialog :width="500" :model-data="orgDialog" :value="dataForm.paymentOrgName" dynamic-model="selectOrg"
					 @updateValue="updateOrgValue($event,'paymentOrgName','paymentOrgId')" :btnDisabled="setting.readonly"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="paymentAccountNumber" label="付款账号：">
          <selector-dialog :model-data="paymentAccountDialog" :value="dataForm.paymentAccountNumber" dynamic-model="customDialog"
					 @updateValue="updatePaymentAccountValue" :btnDisabled="setting.readonly"></selector-dialog>
        </el-form-item>
				<el-form v-show="isShowCheckNo">
					<el-form-item slot="col_3" prop="checkNo" label="票据号：">
						<el-input v-model="dataForm.checkNo" size="small" placeholder="请输入" />
					</el-form-item>
				</el-form>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="invoiceSituation" label="发票情况：">
					<el-select v-model="dataForm.invoiceSituation" placeholder="请选择">
            <el-option v-for="(item,index) in invoiceSituationOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" prop="balaType" label="结算方式：">
					<el-select v-model="dataForm.balaType" placeholder="请选择" @change="balaTypeChange">
            <el-option v-for="(item,index) in balaTypeOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_3" prop="limitAccept" label="承兑期限：">
          <el-select v-model="dataForm.limitAccept" placeholder="请选择">
            <el-option v-for="(item,index) in limitAcceptOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="payeeBankAccId" label="收款账号：">
          <el-select v-model="dataForm.payeeBankAccId" placeholder="请选择" @change="changePayeeBankAcc">
            <el-option v-for="(item,index) in purchasePayInAccountList" :key="index" :value="item.id" :label="item.account">
              {{ item.account }}
            </el-option>
          </el-select>
				</el-form-item>
        <el-form-item slot="col_2" label="收款银行：">
          <el-input v-model="dataForm.payeeBank" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" label="收款银行联行号：">
					<el-input v-model="dataForm.interBankNo" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="退款金额：">
          <el-input v-model="dataForm.refundAmount" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="500" clearable/>
        </el-form-item>
      </row-layout>
      <form-title title="对账单"></form-title>
      <financePayoutReconcileBillDetails ref="financePayoutReconcileBillDetails" v-model="dataForm.financePayoutReconcileBill"></financePayoutReconcileBillDetails>
      <form-title title="付款明细"></form-title>
			<financePayoutPurchaseDetail ref="financePayoutPurchaseDetail" v-model="dataForm.financePayoutPurchaseDetail"></financePayoutPurchaseDetail>
      <form-title :title="'关联发票'"></form-title>
      <invoiceCollectionDetail ref="invoiceCollectionDetail" v-model="dataForm.financePayoutInvoice" :invoiceParams="invoiceParams"></invoiceCollectionDetail>
      <form-title title="附件"></form-title>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="附件文件：">
          <update-files v-model="dataForm.fileInfoList"></update-files>
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
  </div>
</template>

<script>
import comMixin from '../minix';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import amountInput from '@/components/basic/numberInput/amountInput.vue';
import FormTitle from '@/components/basic/formTitle/index.vue';
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
import { exportStockOutMainDetails } from '@/Api/workflowBusssion/stock.js'
import { getPurchasePayOutAccountNo, getPurchasePayInAccountNo, getPayOrg } from '@/Api/workflowBusssion/finance.js'
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import financePayoutReconcileBillDetails from './components/financePayoutReconcileBillDetails.vue'
import financePayoutPurchaseDetail from './components/financePayoutPurchaseDetail.vue'
import invoiceCollectionDetail from '../../components/invoiceCollectionDetail.vue';
import tools from '@/utils/fun.js';
const requiredArray = ['supplierId','paymentOrgId','paymentAccountNumber','invoiceSituation','balaType',
  'limitAccept', 'payeeBankAccId']
export default {
  components: { amountInput, FormTitle, RowLayout, selectorDialog, updateFiles,
		financePayoutReconcileBillDetails, invoiceCollectionDetail, financePayoutPurchaseDetail },
   mixins: [comMixin],
  data() {
    return {
      dataForm: {
        code: '',
        supplierId: '',
        supplierName: '',
        paymentOrgId: '',
        paymentOrgName: '',
        payeeBank: '',
        constructArchiveMainId: '',
        constructArchiveMainCode: '',
        constructArchiveMainName: '',
        constructionUnitName: '',
        paymentAccountNumber: '',
        payeeBankAcc: '',
        payeeBankAccId: '',
        deptName: '',
        dateDelivery: '',
        financePayoutReconcileBill: [],
        financePayoutInvoice: [],
        financePayoutPurchaseDetail: [],
        fileInfoList: []
      },
			invoiceSituationOptions: [],
			balaTypeOptions: [],
			limitAcceptOptions: [],
      invoiceParams: {
        constructArchiveMainId:null,
        contractOutMainId:null,
        moduleType:"6",
      },
			// 【客商档案】控件 = 【客商档案】中客商类别为‘材料供应商’，‘零星供应商’的数据
      supplierDialog: { code: 'KeShangDangAn_CP149', customDialog: 'KeShangDangAn_CP149', isSetHead: 1, isMulti: false, initailData: [] },
      // 【组织架构】控制
			orgDialog: { resultFieldKey: 'groupId', code: 'selectOrg', customDialog: 'selectOrg', isSetHead: 1, isMulti: false, initailData: [], parm: { singleSelect: true }},
      // 【银行档案】选择控件
			paymentAccountDialog: { code: 'YinXingDangAn', customDialog: 'YinXingDangAn', isSetHead: 1, isMulti: false, initailData: [] },
			payeeBankAccDialog: { code: 'v_construct_archive_main_purchase', customDialog: 'v_construct_archive_main_purchase', isSetHead: 1, isMulti: false, initailData: [] },
      dataRule: RuleRequired.dataRule(requiredArray),
      financePayoutReconcileTotal: 0,
      financePayoutPurchaseTotal: 0,
      purchasePayInAccountList: []
    };
  },
	computed: {
		/**
		 * 【票据号】是否显示
		 * 【结算方式】= 【商业承兑汇票 10、银行承兑汇票 9、商业承兑汇票背书 14、银行承兑汇票背书 13、智付单支付 21】资金出纳环节审批时必填此项，
		 * 	提示“票据号为空，请输入票据号！”，不属于以上五类时，票据号隐藏；
		 */
		isShowCheckNo() {
      const balaType = ['10','9','14','13','21'].indexOf(this.dataForm.balaType) != -1
      // 非出纳审批环节不可编辑此字段
      const approveNote = WFContext.CurrentActivityName.trim() == '出纳';
      // 是否审批状态
      let isApprove = this.pageBaseInfo.buttons.find((res)=>{return res.buttonName == '审批'})
      this.dataRule['checkNo'] = RuleRequired.curFiledRule(balaType&&approveNote&&isApprove);
			return balaType&&approveNote&&approveNote;
		},
	},
  created() {},
  mounted() {},
  methods: {
    // 【本次申请金额（元）】 = 付款明细table“本次申请金额”之和+对账单tab“本次申请金额”之和
    getApplyAmount() {
      let applyAmount = 0
      if(this.$refs.financePayoutReconcileBillDetails) {
        const applyAmount1 = this.$refs.financePayoutReconcileBillDetails.$data.applyAmount
        const applyAmount2 = this.$refs.financePayoutPurchaseDetail.$data.applyAmount
        applyAmount = tools.getNumAdd(applyAmount1,applyAmount2);
      }
      this.dataForm.applyAmount = applyAmount;
      return applyAmount;
    },
    /**
     * 获取付款账号 -- 根据【付款账号配置】带出
     */
    async getPurchasePayOutAccountNo() {
      const res = await getPurchasePayOutAccountNo({orgId:this.dataForm.paymentOrgId})
      if(res.code == 200 && res.data) {
        this.dataForm.paymentAccountNumber = res.data.account;
        
      }
    },
    /**
     * 获取收款账号
     * 根据选择的集采供应商自动带出其在【客商档案 】中的银行账号（有多个时，默认取第一行的账号，可选择客商档案中的其他收款账号）
     */
    async getPurchasePayInAccountNo() {
      const res = await getPurchasePayInAccountNo({customerId: this.dataForm.supplierId})
      if(res.code == 200 && res.data) {
        this.purchasePayInAccountList = res.data;
        if(res.data.length > 0) {
          const { id, account, bankName, combineNum } = res.data[0];
          this.dataForm.payeeBankAcc = account;
          this.dataForm.payeeBankAccId = id;
          this.dataForm.payeeBank = bankName;
          this.dataForm.interBankNo = combineNum;
        }
      }
    },
    /**
     * 付款财务组织
     * 根据 编制人所属部门找到【业务单元】中对应的“关联部门”，找到这条数据的“财务组织”，可修改
     */
    async getPayOrg() {
      const { orgId } = FUI.Sys.getAuthor();
      const res = await getPayOrg({orgId:orgId})
      if(res.code == 200 && res.data) {
        this.dataForm.paymentOrgId = res.data.orgId;
        this.dataForm.paymentOrgName = res.data.orgName;
        this.getPurchasePayOutAccountNo();
      }
    },
    /**
     * 切换收款账号
     */
    changePayeeBankAcc(val) {
      const obj = this.purchasePayInAccountList.find(res=>{return val == res.id})
      if(obj) {
        this.dataForm.payeeBankAcc = obj.account;
        this.dataForm.payeeBank = obj.bankName;
        this.dataForm.interBankNo = obj.combineNum;
      }
    },
		/**
		 * 采集供应商更新
		 */
		updateSupplierValue(data) {
			if (data && data.length <= 0) return;
      const { id, customerName } = data[0];
      this.dataForm.supplierId = id;
      this.dataForm.supplierName = customerName;
      // 重新选择集采供应商时需要清空对账单tab的数据
      this.dataForm.financePayoutReconcileBill = [];
      this.getPurchasePayInAccountNo();
      this.dataForm.payeeBankAcc = ""
      this.dataForm.payeeBank = ""
      this.dataForm.interBankNo = ""
      this.$forceUpdate()
		},
		/**
		 * 付款财务组织更新
		 */
		updateOrgValue(data, filedName, filedValue) {
			if (data && data.length <= 0) return;
      const { value, text } = data[0];
      this.dataForm[filedValue] = value;
      this.dataForm[filedName] = text;
      this.getPurchasePayOutAccountNo();
      this.$forceUpdate()
		},
    /**
     * 付款账号
     */
    updatePaymentAccountValue(data) {
      if(data && data.length <= 0) return;
      const {bank_account_no} = data[0]
      this.dataForm.paymentAccountNumber = bank_account_no;
    },
		/**
		 * 收款账号更新
		 */
		updatePayeeBankAccValue(data) {
			if(data && data.length <= 0) return;
			let { payeeBankAcc, payeeBank, interBankNo} = data[0];
			this.dataForm.payeeBankAcc = payeeBankAcc;
			this.dataForm.payeeBank = payeeBank;
			this.dataForm.interBankNo = interBankNo;
		},
		/**
		 * 结算方式更新
		 */
		balaTypeChange(val) {
			// 【承兑期限】选项为“商业承兑汇票”或“银行承兑汇票”必填，其他不必填
			this.dataRule['limitAccept'] = RuleRequired.curFiledRule(['10','9'].indexOf(val) != -1);
      // 【付款账号】当结算方式=网银（银行转账）或者对私网银，编制人必填，显示账号。否则不必填；
			this.dataRule['paymentAccountNumber'] = RuleRequired.curFiledRule(['1','19'].indexOf(val) != -1);
		},
    /**
     * 导出
     */
    async exportFile() {
      let scoureData = this.$refs['materialDetail'] ? this.$refs['materialDetail'].scoureData : [];
      if(scoureData && scoureData.length > 0) await exportStockOutMainDetails(scoureData);
    },
    /**
    /**
     * 项目编号
     */
    updateMasterContractValue(data) {
      if(data && data.length <= 0) return;
      const { id, code, constructionUnitName, projectManagerName, name} = data[0];
      this.dataForm.constructArchiveMainCode = code;
      this.dataForm.constructArchiveMainName = name;
      this.dataForm.constructionUnitName = constructionUnitName;
      this.dataForm.projectManagerName = projectManagerName;
      this.dataForm.constructArchiveMainId = id;
    },
    beforeInit() {
      this.getDataDictByConfigType();
      this.getPurchasePayOutAccountNo();
      this.getPayOrg();
      this.initRuleRequired()
    },
    afterInit() {
      this.initRuleRequired()
      this.getPurchasePayInAccountNo()
    },
    /**
     * 字段校验
     */
    initRuleRequired() {
      this.balaTypeChange(this.dataForm.balaType)
    },
    /**
     * 获取表单数据
     */
    getDataForm() {
      let dataForm = JSON.parse(JSON.stringify(this.dataForm));
      dataForm.financePayoutReconcileBillDetails =  this.$refs['financePayoutReconcileBillDetails'] ? this.$refs['financePayoutReconcileBillDetails'].scoureData : [];
      dataForm.financePayoutPurchaseDetail =  this.$refs['financePayoutPurchaseDetail'] ? this.$refs['financePayoutPurchaseDetail'].scoureData : [];
      let tableData = this.$refs['invoiceCollectionDetail'] ? this.$refs['invoiceCollectionDetail'].scoureData : [];
      dataForm.financePayoutInvoice = (tableData && tableData.length > 0) ? tableData.map((item,index) => ({
        ...item,
        id: item.id||item.invoiceCollectionMainId
      })) : [];
      return dataForm;
    },
    /**
     * 表单校验
     */
    async validateForm() {
      const _this = this;
      const financePayoutReconcileBillDetails = await _this.$refs['financePayoutReconcileBillDetails'].validateForm();
      if (!financePayoutReconcileBillDetails) return resolve(false);
      const financePayoutPurchaseDetail = await _this.$refs['financePayoutPurchaseDetail'].validateForm();
      if (!financePayoutPurchaseDetail) return resolve(false);
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid) {
            return resolve(_this.getDataForm());
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
      const res = await getDataDictByConfigType({ params: { configTypes: '发票情况,结算方式,承兑期限' }})
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '发票情况':
              this.invoiceSituationOptions = ele.dataDict;
              break;
            case '结算方式':
              this.balaTypeOptions = ele.dataDict;
              break;
            case '承兑期限':
              this.limitAcceptOptions = ele.dataDict;
              break;
            default:
              break;
          }
        });
      }
    }
  },
};
</script>

<style scoped lang="scss">
</style>
