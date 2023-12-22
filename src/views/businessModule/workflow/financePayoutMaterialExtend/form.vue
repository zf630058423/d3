<template>
   <!-- 材料付款 -->
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
        <el-form-item slot="col_2" prop="constructArchiveMainId" label="项目编号：">
          <selector-dialog :model-data="masterContractDialog" :value="dataForm.constructArchiveMainCode"
            dynamic-model="customDialog" @updateValue="updateMasterContractValue" :btnDisabled="setting.readonly"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="项目名称：">
          <el-input v-model="dataForm.constructArchiveMainName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="管理部门：">
          <el-input v-model="dataForm.constructionUnitName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" label="项目负责人：">
          <el-input v-model="dataForm.projectManagerName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :title="'付款信息'" :cols="3">
        <el-form-item slot="col_1" prop="paymentType" label="付款类型：">
          <el-select v-model="dataForm.paymentType" placeholder="请选择" @change="changePaymentType">
            <el-option v-for="(item,index) in paymentTypeOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" prop="contractOutMainId" label="支出合同编号：">
          <selector-dialog :model-data="mainContractDialog" :value="dataForm.contractOutMainCode"
            dynamic-model="customDialog" @updateValue="updateContractOutMainValue"
            :btnDisabled="setting.readonly || dataForm.paymentType=='2'"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="支出合同名称：">
          <el-input v-model="dataForm.contractOutMainName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="合同总金额(含税)(元)：">
          <el-input v-model="dataForm.totalContractAmount" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="supplierId" label="供应商：">
          <selector-dialog :model-data="customerDialog" :value="dataForm.supplierName"
            dynamic-model="customDialog" @updateValue="updateSupplierValue($event,'supplierName','supplierId')"
            :btnDisabled="setting.readonly || dataForm.paymentType=='1'"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="结算金额(含税)(元)：">
          <el-input v-model="dataForm.settlementAmount" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="累计入库(含税)(元)：">
          <el-input v-model="dataForm.totalWarehouseAmount" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" label="累计已付：">
          <el-input v-model="dataForm.accumulatedPaid" disabled size="small" placeholder="自动计算" />
        </el-form-item>
        <el-form-item slot="col_3" label="累计对账(含税)(元)：">
          <el-input v-model="dataForm.reconciliationAmount" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="调价金额(含税)(元)：">
          <el-input v-model="dataForm.priceAdjustmentAmountTax" disabled size="small" placeholder="自动计算" />
        </el-form-item>
        <el-form-item slot="col_2" prop="prepay" label="付款性质：">
          <el-select v-model="dataForm.prepay" placeholder="请选择" @change="changePrepay">
            <el-option v-for="(item,index) in prepayOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_3" label="支付控制比例：">
          <el-input v-model="dataForm.paymentControlRatio" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="应付金额(含税)(元)：">
          <el-input v-model="dataForm.amountPayable" disabled size="small" placeholder="自动计算" />
        </el-form-item>
        <el-form-item slot="col_2" prop="paymentOrgId" label="付款财务组织：">
          <selector-dialog :width="500" :model-data="paymentOrgDialog" :value="dataForm.paymentOrgName"
            dynamic-model="selectOrg" @updateValue="updateOrgValue($event,'paymentOrgName','paymentOrgId')"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="paymentAccountNumber" label="付款账号：">
          <selector-dialog :model-data="baseBankDialog" :value="dataForm.paymentAccountNumber"
            dynamic-model="customDialog" @updateValue="updatePaymentAccountValue" :btnDisabled="setting.readonly"></selector-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="applyAmount" label="本次申请金额(元)：">
          <amount-input v-model="dataForm.applyAmount"></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" label="实付金额(元)：">
          <el-input v-model="getActualAmountPaid" disabled size="small" placeholder="自动计算" />
        </el-form-item>
        <el-form-item slot="col_3" prop="invoiceSituation" label="发票情况：">
          <el-select v-model="dataForm.invoiceSituation" placeholder="请选择" :disabled="dataForm.balaType=='21'">
            <el-option v-for="(item,index) in invoiceSituationOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="balaType" label="结算方式：">
          <el-select v-model="dataForm.balaType" placeholder="请选择" @change="changeBalaType">
            <el-option v-for="(item,index) in balaTypeOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form :disabled="currentActivityName!='出纳'">
          <el-form-item slot="col_2" prop="checkNo" label="票据号：" v-show="isShowCheckNo">
            <el-input v-model="dataForm.checkNo" size="small" placeholder="请输入" />
          </el-form-item>
        </el-form>
        <el-form-item slot="col_3" prop="limitAccept" label="承兑期限：">
          <el-select v-model="dataForm.limitAccept" placeholder="请选择" :disabled="isDisabledStorage">
            <el-option v-for="(item,index) in limitAcceptOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="payeeBankAcc" label="收款账号：">
          <selector-dialog :model-data="payeeBankAccDialog" :value="dataForm.payeeBankAcc"
            dynamic-model="customDialog" @updateValue="updatePayeeBankAccValue" :btnDisabled="setting.readonly"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="收款银行：">
          <el-input v-model="dataForm.payeeBank" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" label="收款银行联行号：">
          <el-input v-model="dataForm.interBankNo" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="借款单号：">
          <selector-dialog :model-data="debitSlipNumberDialog" :value="dataForm.debitSlipNumber"
            dynamic-model="customDialog" @updateValue="updateEebitSlipNumberValue"
            :btnDisabled="setting.readonly||dataForm.paymentType=='1'"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="amountCharged" label="冲借款金额：">
          <amount-input v-model="dataForm.amountCharged" :disabled="dataForm.paymentType=='1'"></amount-input>
        </el-form-item>
        <el-form-item slot="col_3" label="退款金额(元)：">
          <el-input v-model="dataForm.refundAmount" disabled size="small" placeholder="自动计算" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" v-if="dataForm.paymentType=='1'">
        <el-form-item slot="col_1" prop="paymentPartyA" label="是否甲方代付：">
          <el-radio-group v-model="dataForm.paymentPartyA">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" />
        </el-form-item>
      </row-layout>
      <row-layout title="委托收款" :cols="3">
        <el-form-item slot="col_1" prop="entrustedPayeeId" label="被委托收款人：">
          <selector-dialog :width="900" :height="360" :value="dataForm.entrustedPayeeName" @updateValue="updateEntrustedPayeeValue"
            dynamicModel="selectUsers" :btnDisabled="setting.readonly"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="委托收款账号：">
          <numberInput v-model="dataForm.entrustedAccount"></numberInput>
        </el-form-item>
        <el-form-item slot="col_3" label="委托收款银行：">
          <selector-dialog :model-data="baseBankDialog" :value="dataForm.entrustedBank"
            dynamic-model="customDialog" @updateValue="updateBankValue" :btnDisabled="setting.readonly"></selector-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="委托收款银行联行号：">
          <el-input v-model="dataForm.entrustedBankNo" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <form-title title="关联发票"></form-title>
      <invoiceCollectionDetail ref="invoiceCollectionDetail" :value="dataForm.financePayoutInvoice" :invoiceParams="invoiceParams"></invoiceCollectionDetail>
      <form-title :title="'附件'"></form-title>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="fileInfoList" label="附件文件：">
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
import numberInput from '@/components/basic/numberInput/index.vue';
import FormTitle from '@/components/basic/formTitle/index.vue';
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import { exportDetails } from '@/Api/workflowBusssion/stock.js'
import { getCurrentData } from '@/Api/workflowBusssion/finance.js'
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import tools from '@/utils/fun.js';
import invoiceCollectionDetail from '../../components/invoiceCollectionDetail.vue';
const requiredArray = ['paymentType', 'constructArchiveMainId', 'supplierId', 'contractOutMainId',
  'supplierId', 'prepay', 'paymentOrgId', 'paymentAccountNumber', 'applyAmount', 'invoiceSituation',
  'balaType', 'limitAccept', 'payeeBankAcc', 'amountCharged', 'paymentPartyA', 'fileInfoList']
export default {
  components: { amountInput, numberInput, FormTitle, RowLayout, selectorDialog, updateFiles, invoiceCollectionDetail },
   mixins: [comMixin],
  data() {
    return {
      dataForm: {
        code: '',
        contractOutMainCode: '',
        constructArchiveMainName: '',
        constructArchiveMainId: '',
        constructArchiveMainCode: '',
        paymentType: '',
        contractOutMainId: '',
        contractOutMainName: '',
        totalContractAmount: '',
        reconciliationAmount: '',
        settlementAmount: '',
        supplierId: '',
        supplierName: '',
        prepay: '',
        paymentOrgId: '',
        paymentAccountNumber: '',
        applyAmount: '',
        invoiceSituation: '',
        balaType: '',
        limitAccept: '',
        payeeBankAcc: '',
        amountCharged: '',
        paymentPartyA: '',
        paymentOrgName: '',
        paymentOrgId: '',
        entrustedPayeeId: '',
        entrustedPayeeName: '',
        fileInfoList: [],
        financePayoutInvoice: [],
      },
      invoiceParams: {
        constructArchiveMainId:null,
        contractOutMainId:null,
        moduleType:"3",
      },
      prepayOptions: [],
      radioOptions: [],
      paymentTypeOptions: [],
      invoiceSituationOptions: [],
      balaTypeOptions: [],
      limitAcceptOptions: [],
      baseBankDialog: { code: 'YinXingDangAn', customDialog: 'YinXingDangAn', isSetHead: 1, isMulti: false, initailData: [] },
      mainContractDialog: { code: 'v_contract_out_main_purchase', customDialog: 'v_contract_out_main_purchase', isSetHead: 1, isMulti: false, initailData: [], parm: {varParams:[{key:'constructArchiveMainId',value:''}]} },
      masterContractDialog: { code: 'v_construct_archive_main_purchase', customDialog: 'v_construct_archive_main_purchase', isSetHead: 1, isMulti: false, initailData: [] },
      customerDialog: { code: 'KeShangDangAn', customDialog: 'KeShangDangAn', isSetHead: 1, isMulti: false, initailData: [] },
      paymentOrgDialog: { resultFieldKey: 'groupId', isSetHead: 1, isMulti: false, initailData: [] },
      // 【收款账号】根据供应商从【供应商】档案带出 默认账号，若供应商有多个账号可选择任意账号
      payeeBankAccDialog: { code: 'YinXingDangAn', customDialog: 'YinXingDangAn', isSetHead: 1, isMulti: false, initailData: [] },
      // 【项目借款申请】
      debitSlipNumberDialog: { code: 'XiangMuJieKuanDan', customDialog: 'XiangMuJieKuanDan', isSetHead: 1, isMulti: false, initailData: [] },
      dataRule: RuleRequired.dataRule(requiredArray),
      paymentOrg: {}
    };
  },
  computed: {
    /**
     * 当前环节
     */
    currentActivityName() {
      return WFContext.currentActivityName;
    },
    /**
     * 实付金额(元)】
     * 当 付款类型=有合同付款：默认值与申请金额(元)一致，根据集中支付平台的计算规则自动更新值
     * 当 付款类型=无合同付款：自动计算，实付金额(元)=本次申请金额(元) - 冲借款金额
     * 注：单据对接资金系统时的付款金额以本字段值为准
     */
    getActualAmountPaid() {
      let amount = '';
      if(this.dataForm.paymentType == '1') {
        amount = this.dataForm.applyAmount;
      } else {
        amount = tools.getNumSub(this.dataForm.applyAmount,this.dataForm.amountCharged)
      }
      this.dataForm.actualAmountPaid = amount;
      return amount;
    },
    /**
     * 【票据号】 
     * 当结算方式为 商业承兑汇票、银行承兑汇票、商业承兑汇票背书、银行承兑汇票背书、智付单支付
     * 资金出纳环节审批时必填此项，不填写不允许审批通过 提示【票据号为空，请输入票据号！】
     * 不属于以上五类时，票据号隐藏
     */
    isShowCheckNo() {
      const index = ['10','9','13','14','21'].indexOf(this.dataForm.balaType);
      this.dataRule['checkNo'] = RuleRequired.curFiledRule(index!=-1);
      if(index != -1) {
        return true;
      }
      return false;
    },
    /**
     * 承兑期限是否只读
     * 当结算方式为银行承兑汇票、商业承兑汇票、智付单支付时为必填，如果为其他结算方式为只读，
     */
    isDisabledStorage() {
      const index = ['10','9','21'].indexOf(this.dataForm.balaType);
      this.dataRule['limitAccept'] = RuleRequired.curFiledRule(index!=-1);
      if(index != -1) {
        return false;
      }
      return true;
    },
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 付款类型变更 1，有合同付款，2，无合同付款
     * 【支出合同编号】
     * 当 付款类型=有合同付款，编制人可编辑，且必填，待选值为已审批通过的该项目的【采购合同】数据，显示编号；
     * 当 付款类型=无合同付款，非必填，不可编辑
     * 【供应商】
     * 当 付款类型=有合同付款，不可编辑，所选 支出合同编号 合同信息页签的供应商
     * 当 付款类型=无合同付款，必填，【供应商】选择控件，显示名称
     * 【付款性质】
     * 当 付款类型=有合同付款：编制人必填，可编辑，下拉选项，下拉控件“付款性质”
     * 当 付款类型=无合同付款：显示为空
     * 【冲借款金额】
     * 当 付款类型=有合同付款：不可编辑，为空
     * 当 付款类型=无合同付款：数字输入，保留2位小数；
     * 需校验借款单号对应的还款金额之和不得大于该借款单未还金额，未还金额指材料付款、
     * 项目费用报销涉及该借款编号的（审核中、已审核、未审核）状态的数据
     */
    changePaymentType(val) {
      // 无合同付款，清空【付款性质，支付控制比例,供应商，支出合同数据】
      if(val == '2'){
        this.removeFieldValue(['supplierId', 'supplierName', 'contractOutMainCode',
         'contractOutMainId','contractOutMainName', 'prepay', 'paymentControlRatio'])
      }
      this.dataRule['contractOutMainId'] = RuleRequired.curFiledRule(val == '1');
      this.dataRule['supplierId'] = RuleRequired.curFiledRule(val == '2');
      this.dataRule['prepay'] = RuleRequired.curFiledRule(val == '2');
      this.dataRule['amountCharged'] = RuleRequired.curFiledRule(val == '2');
      // 设置付款财务组织
      this.setPaymentOrgName()
    },
    /**
     * 当 付款类型=有合同付款 默认=所选 支出合同编号 合同信息页签的客户
     */
    setPaymentOrgName() {
      if(this.dataForm.paymentType == '2') return;
      this.dataForm.paymentOrgId = this.paymentOrg.paymentOrgId;
      this.dataForm.paymentOrgName = this.paymentOrg.paymentOrgName
    },
    /**
     * 付款性质更改
     * 【支付控制比例，】
     */
    changePrepay(val) {
      this.getCurrentData()
    },
    /**
     * 【发票情况】
     * 结算方式更改
     * 当结算方式为智付单支付时必须为有票
     */
    changeBalaType(val) {
      if(val == '21') {
        this.dataForm.invoiceSituation = '1'
      }
      // 【收款账号】当结算方式=网银时，必填。根据供应商从【供应商】档案带出 默认账号，若供应商有多个账号可选择任意账号
      this.dataRule['payeeBankAcc'] = RuleRequired.curFiledRule(val == '1');
    },
    /**
     * 导出
     */
    async exportFile() {
      let scoureData = this.$refs['invoiceCollectionDetail'] ? this.$refs['invoiceCollectionDetail'].scoureData : [];
      if(scoureData && scoureData.length > 0) await exportDetails(scoureData);
    },
    /**
     * 材料付款实时数据
     */
    async getCurrentData() {
      const params = {
        id: this.dataForm.id,
        constructArchiveMainId: this.dataForm.constructArchiveMainId, // 项目id 
        contractOutMainId: this.dataForm.contractOutMainId, // 合同id （有合同付款必填)
        contractSupplierId: this.dataForm.supplierId, // 商id (无合同付款必填)
        prepay: this.dataForm.prepay, // 付款性质（有合同付款必填)
        type: this.dataForm.paymentType // 1，有合同付款 2，无合同付款
      }
      let {constructArchiveMainId,contractOutMainId,contractSupplierId,prepay,type} = params;
      if(constructArchiveMainId && type && (( type == '1' && contractOutMainId && prepay) || ( type == '2' && contractSupplierId)) ) {
        const res = await getCurrentData(params)
        if(res.code == 200){
          const { accumulatedPaid, amountPayable, priceAdjustmentAmountTax, reconciliationAmount,
            settlementAmount, totalContractAmount, totalWarehouseAmount} = res.data;
          this.dataForm.accumulatedPaid = accumulatedPaid;
          this.dataForm.reconciliationAmount = reconciliationAmount;
          this.dataForm.amountPayable = amountPayable;
          this.dataForm.priceAdjustmentAmountTax = priceAdjustmentAmountTax;
          this.dataForm.priceAdjustmentAmountTax = priceAdjustmentAmountTax;
          this.dataForm.settlementAmount = settlementAmount;
          this.dataForm.totalContractAmount = totalContractAmount;
          this.dataForm.totalWarehouseAmount = totalWarehouseAmount;
        }
      }
    },
    /**
     * 委托收款银行（更新）
     */
    updateBankValue(data) {
      if(data && data.length <= 0) return;
      const { id, bank_account_name, bank_account_no} = data[0];
      this.dataForm.entrustedBankId = id;
      this.dataForm.entrustedBank = bank_account_name;
      this.dataForm.entrustedBankNo = bank_account_no;
    },
    /**
     * 付款账号（更新）
     */
    updatePaymentAccountValue(data) {
      if(data && data.length <= 0) return;
      const { bank_account_no } = data[0];
      this.dataForm.paymentAccountNumber = bank_account_no;
    },
    /**
     * 被委托收款人更新
     */
    updateEntrustedPayeeValue(data) {
      if(data && data.length <= 0) return;
      const { userId, realName } = data[0];
      this.dataForm.entrustedPayeeId = userId
      this.dataForm.entrustedPayeeName = realName
    },
    /**
     * 收款账号变更
     */
    updatePayeeBankAccValue(data){
      if(data && data.length <= 0) return;
      const { bank_account_no } = data[0];
      this.dataForm.payeeBankAcc = bank_account_no;
    },
    /**
     * 借款单号变更
     */
    updateEebitSlipNumberValue(data) {
      if(data && data.length <= 0) return;
      const { code } = data[0];
      this.dataForm.debitSlipNumber = code;
    },
    /**
     * 付款财务组织
     */
    updateOrgValue(data,filedName,filedValue){
      if(data && data.length <= 0) return;
      const { value, text } = data[0]
      this.dataForm[filedName] = text;
      this.dataForm[filedValue] = value;
    },
    /**
     * 采购合同(控件)
     */
    updateContractOutMainValue(data) {
      if(data && data.length <= 0) return;
      const { id, code, name, contract_party_b_id, contractPartyBName, paymentOrgId, paymentOrgName } = data[0];
      this.dataForm.contractOutMainId = id;
      this.dataForm.contractOutMainCode = code;
      this.dataForm.contractOutMainName = name;
      //【供应商】 当 付款类型=有合同付款，不可编辑，所选 支出合同编号 合同信息页签的供应商
      this.dataForm.supplierId = contract_party_b_id;
      this.dataForm.supplierName = contractPartyBName;

      //合同信息页签的客户
      this.paymentOrg = {
        paymentOrgId: paymentOrgId,
        paymentOrgName: paymentOrgName
      }
      // 设置付款财务组织
      this.setPaymentOrgName()
      // 获取实时数据
      this.getCurrentData()
      this.$forceUpdate()
    },
    /**
     * 更新供应商信息
     */
    updateSupplierValue(data,filedName,filedValue){
      if(data && data.length <= 0) return;
      const { id, customerName } = data[0];
      this.dataForm[filedValue] = id;
      this.dataForm[filedName] = customerName;
      // 获取实时数据
      this.getCurrentData()
      this.$forceUpdate()
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
      this.mainContractDialog.parm.varParams[0].value = id;
      this.removeFieldValue(['contractOutMainId','contractOutMainName', 'totalContractAmount', 
        'reconciliationAmount', 'settlementAmount', 'supplierId', 'supplierName',
        'paymentOrgId', 'paymentOrgName'])
      this.getCurrentData()
    },
    /**
     * 删除字段值
     */
    removeFieldValue(array){
      array.forEach(e=>{
        this.dataForm[e] = ''
      })
    },
    beforeInit() {
      this.getDataDictByConfigType();
      this.initRuleRequired();
    },
    afterInit() { 
      this.getCurrentData();
      this.initRuleRequired();
    },
    /**
     * 初始化必填字段
     */
    initRuleRequired() {
      // 付款类型
      this.dataRule['contractOutMainId'] = RuleRequired.curFiledRule(this.dataForm.paymentType == '1');
      this.dataRule['supplierId'] = RuleRequired.curFiledRule(this.dataForm.paymentType == '2');
      this.dataRule['prepay'] = RuleRequired.curFiledRule(this.dataForm.paymentType == '2');
      this.dataRule['amountCharged'] = RuleRequired.curFiledRule(this.dataForm.paymentType == '2');
      // 结算方式
      this.dataRule['payeeBankAcc'] = RuleRequired.curFiledRule(this.dataForm.balaType == '1');
    },
    /**
     * 获取表单数据
     */
    getDataForm() {
      let dataForm = JSON.parse(JSON.stringify(this.dataForm));
      let tableData = this.$refs['invoiceCollectionDetail'] ? this.$refs['invoiceCollectionDetail'].scoureData : [];
      dataForm.materialDetail = (tableData && tableData.length > 0) ? tableData.map((item,index) => ({
        ...item,
        id: item.invoiceCollectionMainId
      })) : [];
      return dataForm;
    },
    /**
     * 表单校验
     */
    async validateForm() {
      const _this = this;
      // 本次申请金额(元)≤应付金额(含税)(元)
      if(Number(_this.dataForm.applyAmount)>Number(_this.dataForm.amountPayable)) {
        this.$message.error(`本次申请金额(元)需要≤应付金额(含税)(元)`)
        return false;
      }
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
      
      const res = await getDataDictByConfigType({ params: { configTypes: 
        '付款类型,结算方式,发票情况,承兑期限,付款性质,是或否' }})
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '付款类型':
              this.paymentTypeOptions = ele.dataDict;
              break;
            case '发票情况':
              this.invoiceSituationOptions = ele.dataDict;
              break;
            case '结算方式':
              this.balaTypeOptions = ele.dataDict;
              break;
            case '承兑期限':
              this.limitAcceptOptions = ele.dataDict;
              break;
            case '付款性质':
              this.prepayOptions = ele.dataDict;
              break;
            case '是或否':
              this.radioOptions = ele.dataDict;
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
