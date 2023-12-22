<template>
  <!-- 采购合同 -->
  <div v-loading="loading">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      :disabled="setting.readonly"
      label-width="140px"
      class="new-data-form-css"
    >
      <row-layout :title="'基础信息'" :cols="3">
        <el-form-item slot="col_1" label="合同编号：">
          <el-input v-model="dataForm.code" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="constructArchiveMainCode" label="项目编号：">
          <selector-dialog :model-data="masterContractDialog" :value="dataForm.constructArchiveMainCode" dynamic-model="customDialog" @updateValue="updateMasterContractValue"></selector-dialog>
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
        <el-form-item slot="col_3" label="材料费目标成本(元)：">
          <el-input v-model="dataForm.totalTargetAmountTax" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :title="'合同信息'" :cols="3">
        <el-form-item slot="col_1" label="累计已购材料(元)：">
          <el-input v-model="dataForm.accumulatedMaterialsPurchased" disabled size="small" placeholder="自动计算" />
        </el-form-item>
        <el-form-item slot="col_2" label="施工总金额(元)：">
          <el-input v-model="dataForm.totalConstructionCost" disabled size="small" placeholder="自动计算" />
        </el-form-item>
        <el-form-item slot="col_3" label="累计已购材料比例：">
          <el-input v-model="dataForm.cumulativeProportionMaterialsPurchased" disabled size="small" placeholder="自动计算" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="purchaseType" label="采购类型：">
          <el-radio-group v-model="dataForm.purchaseType">
            <el-radio v-for="(item,index) in purchaseTypeOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" prop="contractCategory" label="合同类别：">
          <el-radio-group v-model="dataForm.contractCategory">
            <el-radio v-for="(item,index) in contractCategoryOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" prop="masterContractCode" label="主合同编号：">
          <selector-dialog :model-data="mainContractDialog" :value="dataForm.masterContractCode" dynamic-model="customDialog"
           @updateValue="updateMainContractValue" :btnDisabled="dataForm.contractCategory=='1'"></selector-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="主合同名称：">
          <el-input v-model="dataForm.masterContractName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="name" label="合同名称：">
          <el-input v-model="dataForm.name" size="small" placeholder="请输入" maxlength="50" />
        </el-form-item>
        <el-form-item slot="col_3" prop="purchaseAgreementCode" label="采购协议编号：">
          <selector-dialog :model-data="purchaseAgreementDialog" :value="dataForm.purchaseAgreementCode" dynamic-model="customDialog"
           @updateValue="updatePurchaseAgreementValue"></selector-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="采购协议名称：">
          <el-input v-model="dataForm.purchaseAgreementName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="contractPartyAId" label="合同甲方：">
          <selector-dialog :width="500" :model-data="orgDialog" :value="dataForm.contractPartyAName" dynamic-model="selectOrg" @updateValue="updateOrgValue($event)" :btnDisabled="isMainContract"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="contractPartyBId" label="合同乙方：">
          <selector-dialog :model-data="customerDialog" :value="dataForm.contractPartyBName" dynamic-model="customDialog" @updateValue="updateCustomerValue($event,'contractPartyBName','contractPartyBId')" :btnDisabled="isMainContract"></selector-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="合同丙方：">
          <selector-dialog :model-data="customerDialog" :value="dataForm.contractPartyCName" dynamic-model="customDialog" @updateValue="updateCustomerValue($event,'contractPartyCName','contractPartyCId')" :btnDisabled="isMainContract"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="合同金额(含税)(元)：">
          <el-input :value="getContractAmountTax('contractAmountTax')" disabled size="small" placeholder="自动计算" />
        </el-form-item>
        <el-form-item slot="col_3" label="合同金额(无税)(元)：">
          <el-input :value="getContractAmountTax('contractAmountTaxFree')" disabled size="small" placeholder="自动计算" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="signDate" label="合同签订日期：">
          <el-date-picker
            v-model="dataForm.signDate"
            type="date"
            placeholder="请选择"
            size="small"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item slot="col_2" prop="copies" label="合同份数：">
          <numberInput v-model="dataForm.copies"></numberInput>
        </el-form-item>
        <el-form-item slot="col_3" prop="contractVersion" label="合同版本：">
          <el-select v-model="dataForm.contractVersion" placeholder="请选择">
            <el-option v-for="(item,index) in contractVersionOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="purchaseMaterialsType" label="采购材料类型：">
          <el-select v-model="dataForm.purchaseMaterialsType" placeholder="请选择">
            <el-option v-for="(item,index) in purchaseMaterialsTypeOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" label="现合同金额(含税)：">
          <el-input v-model="dataForm.currentContractAmount" disabled size="small" placeholder="自动计算" />
        </el-form-item>
        <el-form-item slot="col_3" label="合同是否归档：">
          <el-radio-group v-model="dataForm.archivist" :disabled="true">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="电子合同状态：">
          <el-input v-model="dataForm.electronContractStatus" disabled size="small" placeholder="系统自动回填" />
        </el-form-item>
        <el-form-item slot="col_2" label="盖章模式：">
          <el-radio-group v-model="dataForm.stampMode" @change="changeStampMode">
            <el-radio v-for="(item,index) in stampModeOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" label="盖章顺序：">
          <el-radio-group v-model="dataForm.stampSort">
            <el-radio v-for="(item,index) in stampSortOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 6}" size="small" placeholder="请输入" maxlength="250" />
        </el-form-item>
      </row-layout>
      <form-title :title="'合同明细信息'"></form-title>
      <purchase-detail :value="dataForm.purchaseDetail" ref="purchaseDetail"></purchase-detail>
      <form-title :title="'支付条款'"></form-title>
      <el-table :data="dataForm.purchasePayoutDetail" class="f2bpmui-datagrid-vuetable" border>
        <el-table-column label="支付类型" prop="paymentType" width="120">
          <template slot-scope="scope">
            {{ getPaymentType(scope.row.paymentType) }}
          </template>
        </el-table-column>
        <el-table-column label="支付方式" :render-header="addRedStar">
          <template slot-scope="scope">
            <el-select v-model="scope.row.paymentMethodId" placeholder="请选择">
              <el-option v-for="(item,index) in paymentMethodOptions" :key="index" :value="item.configValue" :label="item.configName">
                {{ item.configName }}
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="支付比例(%)" :render-header="addRedStar">
          <template slot-scope="scope">
            <percentageInput v-model="scope.row.paymentMethodScale" 
              :minValue="(scope.row.paymentType=='预付款'||scope.row.paymentType=='质保金')?0:-1"/>
          </template>
        </el-table-column>
      </el-table>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="prepaymentDeductionMethod" label="预付款扣除方式：">
          <el-radio-group v-model="dataForm.prepaymentDeductionMethod">
            <el-radio v-for="(item,index) in prepaymentDeductionMethodOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <form-title :title="'附件'"></form-title>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="fileInfoList" label="附件文件：">
          <update-files v-model="dataForm.fileInfoList"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="electronicContract" label="电子合同附件：">
          <update-files v-model="dataForm.electronicContract"></update-files>
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
import FormTitle from '@/components/basic/formTitle/index.vue';
import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import { getRealTimeData } from '@/Api/workflowBusssion/construct.js'
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import amountInput from '@/components/basic/numberInput/amountInput.vue';
import cascSelect from '@/components/basic/cascSelect/index.vue'
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import numberInput from '@/components/basic/numberInput/index.vue';
import percentageInput from '@/components/basic/numberInput/percentageInput.vue';
import moment from 'moment'
import purchaseDetail from './components/purchaseDetail.vue';
import tools from '@/utils/fun.js';
const requiredArray = ['constructArchiveMainCode', 'purchaseType', 'contractCategory','name', 'electronicContract', 'masterContractCode',
'contractPartyAId', 'contractPartyBId', 'signDate', 'copies', 'contractVersion','fileInfoList', 'prepaymentDeductionMethod', 'purchaseAgreementCode'];
export default {
  components: { FormTitle, selectorDialog, RowLayout, amountInput,numberInput,percentageInput, cascSelect, updateFiles, purchaseDetail },
  mixins: [comMixin],
  data() {
    return {
      loading: false,
      formVisible: false,
      isReadOnly: false,
      dataForm: {
        code: '',
        constructArchiveMainCode: '',
        constructArchiveMainName: '',
        constructArchiveMainId: '',
        totalTargetAmountTax: '',
        contractPartyAId: '',
        contractPartyAName: '',
        contractPartyBId: '',
        contractPartyBName: '',
        contractPartyCId: '',
        contractPartyCName: '',
        accumulatedMaterialsPurchased: '',
        totalConstructionCost: '',
        cumulativeProportionMaterialsPurchased: '',
        purchasePayoutDetail: [{
          id: '',
          paymentType: '1',
          paymentMethodScale: '',
          paymentMethodId: '',
          paymentMethod: ''
        },{
          id: '',
          paymentType: '2',
          paymentMethodScale: '',
          paymentMethodId: '',
          paymentMethod: ''
        },{
          id: '',
          paymentType: '3',
          paymentMethodScale: '',
          paymentMethodId: '',
          paymentMethod: ''
        },{
          id: '',
          paymentType: '4',
          paymentMethodScale: '',
          paymentMethodId: '',
          paymentMethod: ''
        },{
          id: '',
          paymentType: '5',
          paymentMethodScale: '',
          paymentMethodId: '',
          paymentMethod: ''
        }],
        purchaseDetail: [],
        fileInfoList: [],
        electronicContract: []
      },
      purchaseTypeOptions: [],
      contractCategoryOptions: [],
      contractVersionOptions: [],
      purchaseMaterialsTypeOptions: [],
      stampModeOptions: [],
      stampSortOptions: [],
      paymentTypeOptions: [],
      paymentMethodOptions: [],
      radioOptions: [],
      prepaymentDeductionMethodOptions: [],
      masterContractDialog: { code: 'v_construct_archive_main_purchase', customDialog: 'v_construct_archive_main_purchase', isSetHead: 1, isMulti: false, initailData: [] },
      mainContractDialog: { code: 'v_contract_out_main_purchase', customDialog: 'v_contract_out_main_purchase', isSetHead: 1, isMulti: false, initailData: [], parm: {varParams:[{key:'constructArchiveMainId',value:''}]} },
      // 【采购协议】控件
      purchaseAgreementDialog: { code: 'CaiGouXieYi', customDialog: 'CaiGouXieYi', isSetHead: 1, isMulti: false, initailData: [], parm: {varParams:[{key:'constructArchiveMainId',value:''}]} },
      orgDialog: { resultFieldKey: 'groupId', code: 'selectOrg', customDialog: 'selectOrg', isSetHead: 1, isMulti: false, initailData: [], parm: { singleSelect: true }},
      customerDialog: { code: 'KeShangDangAn_CP236', customDialog: 'KeShangDangAn_CP236', isSetHead: 1, isMulti: false, initailData: [] },
      dataRule: RuleRequired.dataRule(requiredArray)
    };
  },
  computed: {
    /**
     * 合同类别=增补合同，根据主合同带出，不可修改
     */
    isMainContract() {
      this.dataRule['masterContractCode'] = RuleRequired.curFiledRule(this.dataForm.contractCategory=='2');
      this.dataRule['purchaseAgreementCode'] = RuleRequired.curFiledRule(this.dataForm.contractCategory=='2');
      return this.dataForm.contractCategory == 2 ? true: false
    }
  },
  mounted() { },
  methods: {
    /**
     * 支付类型
     */
    getPaymentType(val){
      const obj = this.paymentTypeOptions.find(res=>{ return res.configValue == val});
      if(obj) return obj.configName;
      return '';
    },
    /**
     * 计算合同金额（含税/无税）= 合同明细信息页签的  金额
     */
    getContractAmountTax(filedName){
      let contractAmount = '';
      this.dataForm[filedName] = contractAmount;
      if(!this.$refs['purchaseDetail']) return contractAmount;
      const purchaseDetailList = this.$refs['purchaseDetail'].scoureData;
      if(purchaseDetailList.length <= 0) return contractAmount;
      contractAmount = purchaseDetailList.reduce((prev, e) => { 
        const value = Number(filedName == 'contractAmountTax'?e.amountTax:e.amountTaxFree);
        if (!isNaN(value)) {
          return tools.getNumAdd(prev, filedName == 'contractAmountTax'?e.amountTax:e.amountTaxFree);
        } else {
          return filedName == 'contractAmountTax'?prev.amountTax:prev.amountTaxFree;
        }
      },0)
      this.dataForm[filedName] = contractAmount;
      return contractAmount
    },
    /**
     * 盖章模式
     */
    changeStampMode(val){
      this.dataRule['electronicContract'] = RuleRequired.curFiledRule(val==1);
    },
    /**
    * 给表头加必填符号*
    */
    addRedStar(h, { column }) {
      return [
        h("span", " " + column.label),
        h("span", { style: "color: red" }, "*")
      ];
    },
    /**
     * 更新组织（合同甲方）
     */
    updateOrgValue(data){
      if(data && data.length <= 0) return;
      const { value, text } = data[0];
      this.dataForm.contractPartyAId = value;
      this.dataForm.contractPartyAName = text;
    },
    /**
     * 更新客商信息（合同乙方，合同丙方）
     */
    updateCustomerValue(data,filedName,filedValue){
      if(data && data.length <= 0) return;
      const { id, customerName } = data[0];
      this.dataForm[filedValue] = id;
      this.dataForm[filedName] = customerName;
      this.$forceUpdate()
    },
    /**
     * 获取采购合同实时数据
     */
    async getRealTimeData() {
      const res = await getRealTimeData({id: this.dataForm.id,projectId: this.dataForm.constructArchiveMainId})
      if(res.code == 200) {
        const {accumulatedMaterialsPurchased,cumulativeProportionMaterialsPurchased,currentContractAmount,totalConstructionCost} = res.data;
        this.dataForm.accumulatedMaterialsPurchased = accumulatedMaterialsPurchased;
        this.dataForm.cumulativeProportionMaterialsPurchased = cumulativeProportionMaterialsPurchased;
        this.dataForm.currentContractAmount = currentContractAmount;
        this.dataForm.totalConstructionCost = totalConstructionCost;
      }
    },
    /**
     * 项目编号
     */
    updateMasterContractValue(data) {
      if(data && data.length <= 0) return;
      const { id, code, constructionUnitName, projectManagerName, name, totalTargetAmountTax} = data[0];
      this.dataForm.constructArchiveMainCode = code;
      this.dataForm.constructArchiveMainName = name;
      this.dataForm.constructionUnitName = constructionUnitName;
      this.dataForm.projectManagerName = projectManagerName;
      this.dataForm.constructArchiveMainId = id;
      this.dataForm.totalTargetAmountTax = totalTargetAmountTax;
      this.mainContractDialog.parm.varParams[0].value = id;
      this.getRealTimeData();
      this.$forceUpdate()
    },
    /**
     * 采购协议（控件）
     */
    updatePurchaseAgreementValue(data) {
      if(data && data.length <= 0) return;
      const { id, code, name} = data[0];
      this.dataForm.purchaseAgreementId = id;
      this.dataForm.purchaseAgreementCode = code;
      this.dataForm.purchaseAgreementName = name;
      this.$forceUpdate()
    },
    /**
     * 主合同名称(控件)
     */
    updateMainContractValue(data) {
      if(data && data.length <= 0) return;
      const { id, code, name, purchaseAgreementCode, purchaseAgreementName,
        contract_party_b_id,contractPartyCName,contract_party_c_id,purchaseAgreementId,
        contractPartyBName,contractPartyAName,contract_party_a_id} = data[0];
      this.dataForm.masterContractId = id;
      this.dataForm.masterContractCode = code;
      this.dataForm.masterContractName = name;
      this.dataForm.purchaseAgreementCode = purchaseAgreementCode;
      this.dataForm.purchaseAgreementName = purchaseAgreementName;
      this.dataForm.purchaseAgreementId = purchaseAgreementId;
      this.dataForm.contractPartyAName = contractPartyAName;
      this.dataForm.contractPartyAId = contract_party_a_id;
      this.dataForm.contractPartyBName = contractPartyBName;
      this.dataForm.contractPartyBId = contract_party_b_id;
      this.dataForm.contractPartyCName = contractPartyCName;
      this.dataForm.contractPartyCId = contract_party_c_id;
      this.$forceUpdate()
    },
    beforeInit() {
      this.getDataDictByConfigType()
      if(this.dataForm.constructArchiveMainId) this.getRealTimeData() 
      this.initRuleRequired()
    },
    afterInit() {
      if (this.dataForm.businessStartTime && this.dataForm.businessEndTime) this.dataForm.businessTime = [this.dataForm.businessStartTime, this.dataForm.businessEndTime]
      this.initRuleRequired()
    },
    /**
     * 初始化表单校验
     */
    initRuleRequired() {
      this.dataRule['electronicContract'] = RuleRequired.curFiledRule(this.dataForm.stampMode==1);
    },
    /**
     * 获取表单数据
     */
    getDataForm() {
      const dataForm = JSON.parse(JSON.stringify(this.dataForm));
      dataForm.purchaseDetail = this.$refs['purchaseDetail'].tableData;
      if (this.dataForm.businessTime && this.dataForm.businessTime.length > 0) {
        dataForm.businessStartTime = moment(this.dataForm.businessTime[0]).format('YYYY-MM-DD')
        dataForm.businessEndTime = moment(this.dataForm.businessTime[1]).format('YYYY-MM-DD')
      }
      return dataForm;
    },
    /**
     * 表单校验
     */
    async validateForm() {
      const _this = this;
      const purchaseDetailData = await _this.$refs['purchaseDetail'].validateForm();
      if (!purchaseDetailData) return false;

      for (let key in this.dataForm.purchasePayoutDetail) {
        if(!this.dataForm.purchasePayoutDetail[key].paymentMethodId) {
          this.$message.info('支付方式不能为空')
          return false
        }
        if(!this.dataForm.purchasePayoutDetail[key].paymentMethodScale) {
          this.$message.info('支付比例不能为空')
          return false
        }
      }
      // 进度款(%)≥预收款(%)
      if(Number(this.dataForm.purchasePayoutDetail[1].paymentMethodScale) < Number(this.dataForm.purchasePayoutDetail[0].paymentMethodScale)) {
        FUI.Window.showMsg('进度款(%)≥预收款(%)')
        return false
      }
      // 完工款≥进度款
      if(Number(this.dataForm.purchasePayoutDetail[2].paymentMethodScale) < Number(this.dataForm.purchasePayoutDetail[1].paymentMethodScale)) {
        FUI.Window.showMsg('完工款(%)≥进度款(%)')
        return false
      }
      // 结算款≥完工款
      if(Number(this.dataForm.purchasePayoutDetail[3].paymentMethodScale) < Number(this.dataForm.purchasePayoutDetail[2].paymentMethodScale)) {
        FUI.Window.showMsg('结算款(%)≥完工款(%)')
        return false
      }
      if(tools.getNumAdd(this.dataForm.purchasePayoutDetail[3].paymentMethodScale, this.dataForm.purchasePayoutDetail[4].paymentMethodScale) != 1) {
        this.$message.info('结算款+质保金≠100%')
        return false
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
        '采购类型,合同类别,采购合同版本,采购材料类型,盖章模式,盖章顺序,结算方式,是或否,预付款扣除方式,付款性质' }})
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '采购类型':
              this.purchaseTypeOptions = ele.dataDict;
              break;
            case '合同类别':
              this.contractCategoryOptions = ele.dataDict;
              break;
            case '采购合同版本':
              this.contractVersionOptions = ele.dataDict;
              break;
            case '采购材料类型':
              this.purchaseMaterialsTypeOptions = ele.dataDict;
              break;
            case '盖章模式':
              this.stampModeOptions = ele.dataDict;
              break;
            case '盖章顺序':
              this.stampSortOptions = ele.dataDict;
              break;
            case '结算方式':
              this.paymentMethodOptions = ele.dataDict;
              break;
            case '付款性质':
              this.paymentTypeOptions = ele.dataDict;
              break;
            case '是或否':
              this.radioOptions = ele.dataDict;
              break;
            case '预付款扣除方式':
              this.prepaymentDeductionMethodOptions = ele.dataDict;
              break;
            default:
              break;
          }
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
::v-deep .designPrice {
  .el-input-group__append {
    padding: 0 12px;
  }
}
</style>
