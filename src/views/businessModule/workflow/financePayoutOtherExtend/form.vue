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
        <el-form-item slot="col_2" prop="payoutObject" label="付款对象：">
          <el-radio-group v-model="dataForm.payoutObject" @change="changePayoutObject">
            <el-radio v-for="(item,index) in payoutObjectOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" label="本次申请金额(元)：">
          <el-input v-model="dataForm.applyAmount" disabled size="small" placeholder="系统计算" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" v-if="dataForm.payoutObject=='1'">
        <el-form-item slot="col_1" prop="marketMainId" label="立项编号：">
          <selector-dialog :model-data="masterContractDialog" :value="dataForm.marketCode"
            dynamic-model="customDialog" @updateValue="updateMasterContractValue" :btnDisabled="setting.readonly"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="立项名称：">
          <el-input v-model="dataForm.marketName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" label="业务单元：">
          <el-input v-model="dataForm.marketUnitName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <div v-if="dataForm.payoutObject=='2'">
        <row-layout :cols="3">
          <el-form-item slot="col_1" prop="isContractOut" label="有无合同：">
            <el-select v-model="dataForm.isContractOut" placeholder="请选择" @change="isContractOutChange">
              <el-option v-for="(item,index) in isContractOutOptions" :key="index" :value="item.configValue" :label="item.configName">
                {{ item.configName }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item slot="col_2" prop="constructArchiveMainId" label="项目编号：">
            <selector-dialog :model-data="constructArchiveMainDialog" :value="dataForm.constructCode"
              dynamic-model="customDialog" @updateValue="updateConstructArchiveMainValue" :btnDisabled="setting.readonly"></selector-dialog>
          </el-form-item>
          <el-form-item slot="col_3" label="项目名称：">
            <el-input v-model="dataForm.constructName" disabled size="small" placeholder="自动填写" />
          </el-form-item>
        </row-layout>
        <row-layout :cols="3">
          <el-form-item slot="col_1" prop="contractOutMainId" label="支出类合同编号：">
            <selector-dialog :model-data="contractOutDialog" :value="dataForm.contractOutCode"
              dynamic-model="customDialog" @updateValue="updateContractOutValue" :btnDisabled="setting.readonly"></selector-dialog>
          </el-form-item>
          <el-form-item slot="col_2" label="支出类合同名称：">
            <el-input v-model="dataForm.contractOutName" disabled size="small" placeholder="自动填写" />
          </el-form-item>
          <el-form-item slot="col_3" label="管理部门：">
            <el-input v-model="dataForm.constructionUnitName" disabled size="small" placeholder="自动填写" />
          </el-form-item>
        </row-layout>
      </div>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="payOutOrgId" label="付款财务组织：">
          <selector-dialog :width="600" :height="360" :value="dataForm.payOutOrgName"
              @updateValue="updatePayOutOrgValue" dynamicModel="selectOrg"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="payOutAccountId" label="付款账号：">
          <selector-dialog :model-data="payOutAccountDialog" :value="dataForm.payOutAccountNo"
              dynamic-model="customDialog" @updateValue="updatePayOutAccountValue" :btnDisabled="setting.readonly"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="invoiceSituation" label="发票情况：">
          <el-select v-model="dataForm.invoiceSituation" placeholder="请选择">
            <el-option v-for="(item,index) in invoiceSituationOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="payInId" label="收款方：">
          <selector-dialog :model-data="payInNameDialog" :value="dataForm.payInName"
            dynamic-model="customDialog" @updateValue="updatePayInNameValue" :btnDisabled="setting.readonly"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="payInAccountId" label="收款账号：">
          <el-select v-model="dataForm.payInAccountNo" placeholder="请选择" @change="changePayInAccount">
            <el-option v-for="(item,index) in billBankList" :key="index" :value="item.payInAccountId" :label="item.payInAccountNo">
              {{ item.payInAccountNo }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_3" prop="payInBankName" label="收款银行：">
          <el-input v-model="dataForm.payInBankName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="收款银行联行号：">
          <el-input v-model="dataForm.subBankNo" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" label="退款金额(元)：">
          <el-input v-model="dataForm.refundAmount" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form v-if="dataForm.payoutObject=='1'" slot="col_3" :model="dataForm" :rules="dataRule" :disabled="isRequiredInvoice" label-width="160px">
          <el-form-item prop="isOriginalInvoice" label="是否收到发票原件：">
            <el-radio-group v-model="dataForm.isOriginalInvoice">
              <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-form-item prop="relatedExpenses" v-if="dataForm.payoutObject=='2'" slot="col_3" label="关联费用预提单：">
          <el-radio-group  v-model="dataForm.relatedExpenses">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <div v-if="dataForm.payoutObject=='2'">
        <row-layout :cols="3">
          <el-form slot="col_1" :model="dataForm" :rules="dataRule" :disabled="isRequiredInvoice" label-width="160px">
            <el-form-item prop="isOriginalInvoice" label="是否收到发票原件：">
              <el-radio-group v-model="dataForm.isOriginalInvoice">
                <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <el-form-item slot="col_2" prop="isRepay" label="是否甲方代付：">
            <el-radio-group v-model="dataForm.isRepay">
              <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item slot="col_3" prop="settlementMethod" label="结算方式：">
            <el-select v-model="dataForm.settlementMethod" placeholder="请选择">
              <el-option v-for="(item,index) in settlementMethodOptions" :key="index" :value="item.configValue" :label="item.configName">
                {{ item.configName }}
              </el-option>
            </el-select>
          </el-form-item>
      </row-layout>
      </div>
      <row-layout :cols="3" cell="1-2">
        <el-form-item v-if="dataForm.payoutObject=='1'" slot="col_1" prop="settlementMethod" label="结算方式：">
          <el-select v-model="dataForm.settlementMethod" placeholder="请选择">
            <el-option v-for="(item,index) in settlementMethodOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" label="回单/网银备注：">
          <el-input v-model="dataForm.bankRemark" maxlength="14" size="small" placeholder="14个汉字以内，如有特殊要求请写在“备注”中" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" />
        </el-form-item>
      </row-layout>
      <form-title title="付款明细"></form-title>
      <payoutOtherDetail :value="dataForm.payoutOtherDetailList" @updateApplyAmount="updateApplyAmount"></payoutOtherDetail>
      <form-title title="关联发票"></form-title>
      <invoiceCollectionDetail v-model="dataForm.relateInvoiceDetailList" :invoiceParams="invoiceParams"></invoiceCollectionDetail>
      <div v-if="dataForm.relatedExpenses=='1'">
        <form-title title="关联费用预提单"></form-title>
        <relateExpenseDetail :value="dataForm.relateExpenseDetailList"></relateExpenseDetail>
      </div>
      <form-title :title="'附件'" />
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
import { getAutomaticData, getPayInAccountNo, getPayOutAccountNo } from '@/Api/workflowBusssion/finance.js'
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import payoutOtherDetail from './components/payoutOtherDetail.vue';
import relateExpenseDetail from './components/relateExpenseDetail.vue';
import invoiceCollectionDetail from '../../components/invoiceCollectionDetail.vue';
const requiredArray = ['paymentType', 'constructArchiveMainId', 'supplierId', 'contractOutMainId', 'payoutObject', 'payOutAccountId',
  'supplierId', 'prepay', 'paymentOrgId', 'paymentAccountNumber', 'applyAmount', 'invoiceSituation', 'marketMainId', 'payInId',
  'limitAccept', 'payeeBankAcc', 'amountCharged', 'paymentPartyA', 'isContractOut', 'relatedExpenses', 'fileInfoList',
  'payInAccountId', 'isRepay', 'settlementMethod']
export default {
  components: { amountInput, numberInput, FormTitle, RowLayout, selectorDialog, updateFiles,
     payoutOtherDetail, relateExpenseDetail, invoiceCollectionDetail },
   mixins: [comMixin],
  data() {
    return {
      dataForm: {
        code: '',
        constructionUnitName: '',
        isRepay: '',
        constructionUnitId: '',
        contractOutMainId: '',
        contractOutCode: '',
        contractOutName: '',
        marketMainId: '',
        payoutObject: '',
        applyAmount: '',
        marketCode: '',
        marketName: '',
        marketUnitName: '',
        payOutOrgId: '',
        payOutOrgName: '',
        payOutAccountId: "",
        payOutAccountNo: '',
        invoiceSituation: '',
        payInId: '',
        payInName: '',
        payInAccountId: '',
        payInAccountNo: '',
        payInBankName: '',
        subBankNo: '',
        refundAmount: '',
        isOriginalInvoice: '',
        bankRemark: '',
        remark: '',
        settlementMethod: '',
        relatedExpenses: '0',
        payoutOtherDetailList: [],
        relateInvoiceDetailList: [],
        relateExpenseDetailList: [],
      },
      invoiceParams: {
        constructArchiveMainId:null,
        contractOutMainId:null,
        moduleType:"5",
      },
      payInAccountOptions: [],
      settlementMethodOptions: [],
      payoutObjectOptions: [],
      invoiceSituationOptions: [],
      isContractOutOptions: [],
      billBankList: [],
      radioOptions: [],
      // 立项编号 【营销立项】+【预选承包商入库】
      masterContractDialog: { code: 'market_main_CP467', customDialog: 'market_main_CP467', isSetHead: 1, isMulti: false, initailData: [] },
      // 项目编号 【项目档案】
      constructArchiveMainDialog: { code: 'v_construct_archive_main_purchase', customDialog: 'v_construct_archive_main_purchase', isSetHead: 1, isMulti: false, initailData: [] },
      // 支出类合同编号 【支出类合同主表】
      contractOutDialog: { code: 'ZhiChuLeiHeTong', customDialog: 'ZhiChuLeiHeTong', isSetHead: 1, isMulti: false, initailData: [], parm: {varParams:[{key:'constructArchiveMainId',value:''}]} },
      // 付款账号 【银行档案】控件
      payOutAccountDialog: {code: 'YinXingDangAn', customDialog: 'YinXingDangAn', isSetHead: 1, isMulti: false, initailData: [] },
      // 收款方 【客商】控件
      payInNameDialog: { code: 'KeShangDangAn', customDialog: 'KeShangDangAn', isSetHead: 1, isMulti: false, initailData: [] },
      // 收款银行 【银行支行】控件
      payInBankDialog: {code: 'YinXingZhiXing', customDialog: 'YinXingZhiXing', isSetHead: 1, isMulti: false, initailData: [] },
      dataRule: RuleRequired.dataRule(requiredArray),
      materialDetailAmount: 0,
      paymentOrg: {}
    };
  },
  computed: {
    /**
     * 是否收到发票原件(是否必填)
     * 仅在“项目会计”、“项目会计2”、“设计项目台账会计”、“幕墙财务会计”、“建工项目会计”、“园林项目会计”、“园林项目会计2”审核节点可填，且必填
     */
    isRequiredInvoice() {
      const index = ['项目会计','项目会计2','设计项目台账会计','幕墙财务会计','建工项目会计','园林项目会计','园林项目会计2'].indexOf(WFContext.currentActivityName);
      let isApprove = this.pageBaseInfo.buttons.find((res)=>{return res.buttonName == '审批'})
      this.dataRule['isOriginalInvoice'] = RuleRequired.curFiledRule(index != -1 && isApprove);
      return !(index != -1 && isApprove);
    },
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 有无合同
     */
    isContractOutChange(val){
      this.dataRule['contractOutMainId'] = RuleRequired.curFiledRule(val == '1');
    },
    /**
     * 更新本次申请金额总计
     */
    updateApplyAmount(val){
      this.dataForm.applyAmount = val;
    },
    /**
     * 获取付款账号
     */
    async getPayOutAccountNo() {
      let params = {
        constructArchiveMainId:this.dataForm.constructArchiveMainId, // 项目档案主表主键id
        constructionUnitName: this.dataForm.constructionUnitId, // 管理部门
        payOutOrgId:this.dataForm.payOutOrgId, // 付款财务组织id
      }
      const res = await getPayOutAccountNo(params)
      if(res.code == 200) {
        const {payOutAccountId, payOutAccountNo} = res.data;
        this.dataForm.payOutAccountId = payOutAccountId
        this.dataForm.payOutAccountNo = payOutAccountNo
      }
    },
    /**
     * 付款对象
     */
    changePayoutObject(val) {
      this.dataRule['marketMainId'] = RuleRequired.curFiledRule(val == '1');
      this.dataRule['constructArchiveMainId'] = RuleRequired.curFiledRule(val == '2');
      if(val == '1') {
        this.removeFieldValue(['marketMainId','marketCode','marketName', 'marketUnitName'])
      } else {
        this.removeFieldValue(['constructCode','constructName','constructionUnitName',
         'constructionUnitId','constructArchiveMainId', 'constructArchiveMainId'])
      }
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
     * 委托收款银行（更新）
     */
    updateBankValue(data) {
      if(data && data.length <= 0) return;
      const { bankId, bankName} = data[0];
      this.dataForm.entrustedBank = bankName;
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
     * 更新供应商信息
     */
    updateSupplierValue(data,filedName,filedValue){
      if(data && data.length <= 0) return;
      const { id, customerName } = data[0];
      this.dataForm[filedValue] = id;
      this.dataForm[filedName] = customerName;
      this.$forceUpdate()
    },
    /**
    /**
     * 立项编号
     */
    updateMasterContractValue(data) {
      if(data && data.length <= 0) return;
      const { id, CODE, marketUnitName, NAME} = data[0];
      this.dataForm.marketCode = CODE;
      this.dataForm.marketName = NAME;
      this.dataForm.marketUnitName = marketUnitName;
      this.dataForm.marketMainId = id;
      this.$forceUpdate();
    },
    /**
     * 项目编号
     */
    updateConstructArchiveMainValue(data){
      if(data && data.length <= 0) return;
      const { id, code, name, constructionUnitName, constructionUnitId} = data[0];
      this.dataForm.constructCode = code;
      this.dataForm.constructName = name;
      this.dataForm.constructionUnitName = constructionUnitName;
      this.dataForm.constructionUnitId = constructionUnitId;
      this.dataForm.constructArchiveMainId = id;
      this.invoiceParams.constructArchiveMainId = id;
      // 根据合同编号过滤 == 支出类合同编号
      this.contractOutDialog.parm.varParams[0].value = id;
      // 获取付款账号
      this.getPayOutAccountNo();
      this.$forceUpdate();
    },
    /**
     * 更新付款账号
     */
    updatePayOutAccountValue(data){
      if(data && data.length <= 0) return;
      const { id, bank_account_no} = data[0];
      this.dataForm.payOutAccountId = id;
      this.dataForm.payOutAccountNo = bank_account_no;
    },
    /**
     * 付款财务组织
     */
    updatePayOutOrgValue(data){
      if(data && data.length <= 0) return;
      const { text, value } = data[0];
      this.dataForm.payOutOrgName = text
      this.dataForm.payOutOrgId = value
      // 获取付款账号
      this.getPayOutAccountNo();
    },
    /***
     * 收款方变更
     */
    updatePayInNameValue(data){
      if(data && data.length <= 0) return;
      const { id, customerName } = data[0];
      this.dataForm.payInId = id;
      this.dataForm.payInName = customerName;
      this.getPayInAccountNo()
    },
    /**
     * 收款账号切换
     */
    changePayInAccount(val){
      let obj = this.billBankList.find(res=> {return res.payInAccountId == val})
      if(obj) {
        this.dataForm.payInAccountId = obj.payInId;
        this.dataForm.payInAccountNo = obj.payInAccountNo;
        this.dataForm.payInName = obj.payInName;
        this.dataForm.payInBankName = obj.payInBankName;
        this.dataForm.subBankNo = obj.subBankNo;
      }
    },
    /**
     * 根据收款账号信息
     */
    async getPayInAccountNo(){
      const res = await getPayInAccountNo({payInId:this.dataForm.payInId})
      if(res.code == 200){
        this.billBankList = res.data ? JSON.parse(res.data) : [];
      }
    },
    /**
     * 根据客商id获取立项/项目信息
     */
    async getAutomaticData(){
      let params = {
        marketMainId: this.dataForm.marketMainId,
        constructArchiveMainId: this.dataForm.constructArchiveMainId,
      }
      const res = await getAutomaticData(params)
      if(res.code == 200){
        const { constructCode, constructName, constructionUnitName, } = res.data;
      }
    },
    /**
     * 支出类合同编号变更
     */
    updateContractOutValue(data) {
      if(data && data.length <= 0) return;
      const { id, code, name } = data[0]
      this.dataForm.contractOutMainId = id;
      this.dataForm.contractOutCode = code;
      this.dataForm.contractOutName = name;
      this.invoiceParams.contractOutMainId = id;
      this.$forceUpdate();
    },
    /**
     * 删除字段值
     */
    removeFieldValue(array){
      array.forEach(e=>{
        this.dataForm[e] = ''
      })
    },
    /**
     * 字段控制必填
     */
    initRuleRequired() {
      // 有无合同
      this.isContractOutChange(this.dataForm.isContractOut)
      // 付款对象
      this.changePayoutObject(this.dataForm.payoutObject)
    },
    beforeInit() {
      this.initRuleRequired()
      this.getDataDictByConfigType()
      const { rowId } = this.$route.query;
      // 付款账号 = 根据【付款账号配置】默认带出
      if(!rowId) this.getPayOutAccountNo();
      
    },
    afterInit() { },
    /**
     * 获取表单数据
     */
    getDataForm() {
      const dataForm = JSON.parse(JSON.stringify(this.dataForm));
      dataForm.materialDetail =  this.$refs['materialDetail'] ? this.$refs['materialDetail'].scoureData : [];
      dataForm.relateInvoiceDetailList = 
        dataForm.relateInvoiceDetailList.map((res)=> { return {...res, financePayoutMainId:res.id } })
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
        '付款对象-其他付款,结算方式,是或否,发票情况,有无合同' }})
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '付款对象-其他付款':
              this.payoutObjectOptions = ele.dataDict;
              break;
            case '发票情况':
              this.invoiceSituationOptions = ele.dataDict;
              break;
            case '是或否':
              this.radioOptions = ele.dataDict;
              break;
            case '结算方式':
              this.settlementMethodOptions = ele.dataDict;
              break;
            case '有无合同':
              this.isContractOutOptions = ele.dataDict;
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
