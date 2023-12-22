<template>
   <!-- 材料退货 -->
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
          <selector-dialog :model-data="masterContractDialog" :value="dataForm.constructArchiveMainCode" dynamic-model="customDialog" @updateValue="updateMasterContractValue" :btnDisabled="setting.readonly"></selector-dialog>
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
      <row-layout :title="'退货信息'" :cols="3">
        <el-form-item slot="col_1" prop="returnType" label="退货类型：">
          <el-select v-model="dataForm.returnType" @change="changeReturnType">
            <el-option v-for="(item,index) in returnTypeOptions" :key="index" :label="item.configName" :value="item.configValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" label="本次退货金额(含税)(元)：">
          <el-input v-model="dataForm.returnAmountTax" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" label="本次退货金额(无税)(元)：">
          <el-input v-model="dataForm.returnAmountTaxFree" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="purchaseContractId" label="主合同编号：">
          <selector-dialog :model-data="purchaseContractDialog" :value="dataForm.purchaseContractCode" dynamic-model="customDialog" @updateValue="updatePurchaseContractValue"
           :btnDisabled="setting.readonly||dataForm.returnType != '1'"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="主合同名称：">
          <el-input v-model="dataForm.purchaseContractName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" prop="contractSupplierId" label="乙方：">
          <selector-dialog :model-data="customerDialog" :value="dataForm.contractSupplierName" dynamic-model="customDialog" 
            @updateValue="updateCustomerValue($event,'contractSupplierName','contractSupplierId')"
            :btnDisabled="setting.readonly||dataForm.returnType == '1'"></selector-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2">
        <el-form-item slot="col_1" prop="returnDate" label="退货日期：">
          <el-date-picker
            v-model="dataForm.returnDate"
            type="date"
            placeholder="请选择"
            size="small"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item slot="col_2" prop="returnReason" label="退货原因：">
          <el-input v-model="dataForm.returnReason" size="small" placeholder="请输入" />
        </el-form-item>
      </row-layout>
      <form-title title="退货信息"></form-title>
      <returnDetail ref="returnDetail" :value="dataForm.returnDetail" :paramDetail="paramDetail" :disabled="setting.readonly"
        @exportFile="exportFile" @changeAmount="changeAmount" @changeAmountTaxFree="changeAmountTaxFree" />
      <form-title :title="'附件'"></form-title>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="fileInfoList" label="附件文件：">
          <update-files v-model="dataForm.fileInfoList"></update-files>
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
import returnDetail from './components/returnDetail.vue';
import { exportStockReturnDetails } from '@/Api/workflowBusssion/stock.js'
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import { getDataDictByConfigType } from '@/Api/dataDict.js'
const requiredArray = ['fileInfoList', 'returnReason', 'purchaseContractId', 'contractSupplierId', 'returnType', 'constructArchiveMainId', 'returnDate']
export default {
  components: { amountInput, FormTitle, RowLayout, selectorDialog, returnDetail, updateFiles },
   mixins: [comMixin],
  data() {
    return {
      dataForm: {
        code: '',
        returnType: '',
        returnReason: '',
        constructArchiveMainId: '',
        constructArchiveMainCode: '',
        constructArchiveMainName: '',
        constructionUnitName: '',
        deptName: '',
        returnDate: '',
        contractSupplierId: '',
        purchaseContractId: '',
        purchaseContractCode: '',
        purchaseContractName: '',
        contractSupplierName: '',
        returnDetail: [],
        fileInfoList: []
      },
      paramDetail: {
        constructArchiveMainId: '',
        purchaseContractId: '',
        returnType: '', // 1,合同退货 2,无合同退货
      },
      returnTypeOptions: [],
      masterContractDialog: { code: 'v_construct_archive_main_purchase', customDialog: 'v_construct_archive_main_purchase', isSetHead: 1, isMulti: false, initailData: [] },
      customerDialog: { code: 'KeShangDangAn_CP013', customDialog: 'KeShangDangAn_CP013', isSetHead: 1, isMulti: false, initailData: [] },
      purchaseContractDialog:{ code: 'v_contract_out_main_purchase', customDialog: 'v_contract_out_main_purchase', isSetHead: 1, isMulti: false, initailData: [], parm: {varParams:[{key:'constructArchiveMainId',value:''}]} },
      dataRule: RuleRequired.dataRule(requiredArray)
    };
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 本次退货金额(含税)(元) 不可编辑，系统计算= 退货信息页签 的 金额(含税)(元) 合计值
     */
    changeAmount(val){
      this.dataForm.returnAmountTax = val;
    },
    /**
     * 本次退货金额(无税)(元) 不可编辑，系统计算= 退货信息页签 的 金额(无税)(元) 合计值
     */
    changeAmountTaxFree(val){
      this.dataForm.returnAmountTaxFree = val;
    },
    /**
     * 更新客商信息（乙方）
     */
    updateCustomerValue(data,filedName,filedValue){
      if(data && data.length <= 0) return;
      const { id, customerName } = data[0];
      this.dataForm[filedValue] = id;
      this.dataForm[filedName] = customerName;
      this.paramDetail.contractSupplierId = id;
      this.$forceUpdate()
    },
    /**
     * 导出
     */
    async exportFile() {
      let scoureData = this.$refs['returnDetail'] ? this.$refs['returnDetail'].scoureData : [];
      if(scoureData && scoureData.length > 0) await exportStockReturnDetails(scoureData);
    },
    /**
     * 当 退货类型=合同退货 ，此字段必填，待选值为所选项目的已审批通过的【采购合同】主合同，显示单据编号，可超链接进入合同详情页面；
     * 当 退货类型=无合同退货，此字段不可填
     */
    changeReturnType(val) {
      this.paramDetail.returnType = val;
      this.dataRule['purchaseContractId'] = RuleRequired.curFiledRule(val == '1');
      this.dataRule['contractSupplierId'] = RuleRequired.curFiledRule(val != '1');
      if(val != '1') {
        this.dataForm.purchaseContractId = '';
        this.dataForm.purchaseContractCode = '';
        this.dataForm.purchaseContractName = '';
        this.dataForm.purchaseContractId = '';
        this.dataForm.purchaseContractCode = '';
      }
      this.dataForm.contractSupplierId = '';
      this.dataForm.contractSupplierName = '';
    },
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
      this.paramDetail.constructArchiveMainId = id;
      this.purchaseContractDialog.parm.varParams[0].value = id;
    },
    /**
     * 主合同编号
     * @param {*} data 
     */
    updatePurchaseContractValue(data) {
      if(data && data.length <= 0) return;
      const { id, code, name, contract_party_b_id, contractPartyBName} = data[0];
      this.dataForm.purchaseContractId = id;
      this.dataForm.purchaseContractCode = code;
      this.dataForm.purchaseContractName = name;
      this.dataForm.contractSupplierId = contract_party_b_id;
      this.dataForm.contractSupplierName = contractPartyBName;
      this.paramDetail.purchaseContractId = id;
      this.$forceUpdate()
    },
    beforeInit() {
      this.dataRule['purchaseContractId'] = RuleRequired.curFiledRule(this.dataForm.returnType == '1');
      this.getDataDictByConfigType();
    },
    afterInit() {
      this.dataRule['purchaseContractId'] = RuleRequired.curFiledRule(this.dataForm.returnType == '1');
    },
    /**
     * 获取表单数据
     */
    getDataForm() {
      const dataForm = JSON.parse(JSON.stringify(this.dataForm));
      dataForm.returnDetail =  this.$refs['returnDetail'] ? this.$refs['returnDetail'].scoureData : [];
      return dataForm;
    },
    /**
     * 表单校验
     */
    async validateForm() {
      const _this = this;
      const returnDetail = await _this.$refs['returnDetail'].validateForm();
      if (!returnDetail) return;
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
      const res = await getDataDictByConfigType({ params: { configTypes: '退货类型' }})
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '退货类型':
              this.returnTypeOptions = ele.dataDict;
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
