<template>
   <!-- 材料入库 -->
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
      </row-layout>
      <row-layout :title="'合同信息'" :cols="3">
        <el-form-item slot="col_1" prop="dateDeliveryNote" label="送货单日期：">
          <el-date-picker
            v-model="dataForm.dateDeliveryNote"
            type="date"
            placeholder="请选择"
            size="small"
            value-format="yyyy-MM-dd"
            @change="changeDateDeliveryNote"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item slot="col_2" prop="storageType" label="入库类型：">
          <el-select v-model="dataForm.storageType" placeholder="请选择" @change="changeStorageType">
            <el-option v-for="(item,index) in storageTypeOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_3" prop="purchaseContractId" label="合同编号：">
          <selector-dialog v-if="dataForm.storageType==1" :model-data="mainContractDialog" :value="dataForm.purchaseContractCode" dynamic-model="customDialog" @updateValue="updateMainContractValue"></selector-dialog>
          <el-input v-else v-model="dataForm.purchaseContractCode" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="contractSupplierId" label="供应商：">
         <selector-dialog :model-data="customerDialog" :value="dataForm.contractSupplierName" dynamic-model="customDialog" @updateValue="updateCustomerValue($event,'contractSupplierName','contractSupplierId')"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="合同名称：">
          <el-input v-model="dataForm.purchaseContractName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" label="合同金额(含税)(元)：" v-show="dataForm.storageType==1">
          <el-input v-model="dataForm.contractAmountTax" disabled size="small" placeholder="自动计算" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="amountThisTimeTax" label="本次入库金额(含税)(元)：">
          <amount-input v-model="dataForm.amountThisTimeTax"></amount-input>
        </el-form-item>
      </row-layout>
      <form-title title="入库信息"></form-title>
      <materialDetail ref="materialDetail" :rowId="dataForm.id" :value="dataForm.materialDetail" :tockParams="tockParams"
       :storageType="dataForm.storageType" @exportFile="exportFile" @changeAmount="changeAmount" @changeAmountTaxFree="changeAmountTaxFree" />
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
import FormTitle from '@/components/basic/formTitle/index.vue';
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
import materialDetail from './components/materialDetail.vue';
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import { exportDetails } from '@/Api/workflowBusssion/stock.js'
import updateFiles from '@/components/basic/uploaderFile/index.vue';
const requiredArray = ['fileInfoList', 'amountThisTimeTax', 'storageType', 'dateDeliveryNote',
  'constructArchiveMainId', 'purchaseContractId', 'contractSupplierId']
export default {
  components: { amountInput, FormTitle, RowLayout, selectorDialog, materialDetail, updateFiles },
   mixins: [comMixin],
  data() {
    return {
      dataForm: {
        code: '',
        dateDeliveryNote: '',
        amountThisTimeTax: '',
        amountThisTimeTaxFree: '',
        constructArchiveMainCode: '',
        constructArchiveMainName: '',
        constructArchiveMainId: '',
        contractSupplierName: '',
        contractSupplierId: '',
        purchaseContractId: '',
        purchaseContractName: '',
        purchaseContractCode: '',
        storageType: '',
        materialDetail: [],
        fileInfoList: []
      },
      tockParams: { storageType: '', purchaseContractId: '', dateDeliveryNote: '' },
      storageTypeOptions: [],
      mainContractDialog: { code: 'v_contract_out_main_purchase', customDialog: 'v_contract_out_main_purchase', isSetHead: 1, isMulti: false, initailData: [], parm: {varParams:[{key:'constructArchiveMainId',value:''}]} },
      masterContractDialog: { code: 'v_construct_archive_main_purchase', customDialog: 'v_construct_archive_main_purchase', isSetHead: 1, isMulti: false, initailData: [] },
      customerDialog: { code: 'KeShangDangAn_CP058', customDialog: 'KeShangDangAn_CP058', isSetHead: 1, isMulti: false, initailData: [] },
      dataRule: RuleRequired.dataRule(requiredArray),
      materialDetailAmount: 0,
    };
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 本次入库金额(含税)(元) 更新
     * @param {*} val
     */
    changeAmount(val) {
      this.materialDetailAmount = val;
      this.dataForm.amountThisTimeTax = val;
    },
    /**
     * 本次入库金额(无税)(元) 更新
     */
    changeAmountTaxFree(val) {
      this.dataForm.amountThisTimeTaxFree = val;
    },
    /**
     * 导出
     */
    async exportFile() {
      let scoureData = this.$refs['materialDetail'] ? this.$refs['materialDetail'].scoureData : [];
      if(scoureData && scoureData.length > 0) await exportDetails(scoureData);
    },
    /**
     * 送货单日期
     */
    changeDateDeliveryNote(val){
      this.tockParams.dateDeliveryNote = val;
      this.setTockParams();
      this.$forceUpdate()
    },
    /**
     * 入库类型
     */
    changeStorageType(val) {
      this.dataRule['purchaseContractId'] = RuleRequired.curFiledRule(val == '1');
      this.dataRule['contractSupplierId'] = RuleRequired.curFiledRule(val == '2');
      if(val != 1) {
        this.dataForm.purchaseContractId = ''
        this.dataForm.purchaseContractCode = ''
        this.dataForm.purchaseContractName = ''
      }
      this.tockParams.storageType = val;
      this.setTockParams();
      this.$forceUpdate();
    },
    /**
     * 主合同名称(控件)
     */
    updateMainContractValue(data) {
      if(data && data.length <= 0) return;
      const { id, code, name, contractPartyBName, contract_party_b_id, contract_amount_tax } = data[0];
      this.dataForm.purchaseContractId = id;
      this.dataForm.purchaseContractCode = code;
      this.dataForm.purchaseContractName = name;
      this.tockParams.purchaseContractId = id;
      this.dataForm.contractSupplierName = contractPartyBName;
      this.dataForm.contractSupplierId = contract_party_b_id;
      this.dataForm.contractAmountTax = contract_amount_tax;
      this.setTockParams();
      this.$forceUpdate()
    },
    /**
     * 更新入库信息参数
     */
    setTockParams() {
      this.tockParams = {
        storageType: this.dataForm.storageType,
        purchaseContractId: this.dataForm.purchaseContractId,
        dateDeliveryNote: this.dataForm.dateDeliveryNote
      }
    },
    /**
     * 更新供应商信息
     */
    updateCustomerValue(data,filedName,filedValue){
      if(data && data.length <= 0) return;
      const { id, customerName } = data[0];
      this.dataForm[filedValue] = id;
      this.dataForm[filedName] = customerName;
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
      this.dataRule['purchaseContractId'] = RuleRequired.curFiledRule(this.dataForm.storageType == '1');
    },
    /**
     * 字段控制必填
     */
    initRuleRequired() {
      this.dataRule['purchaseContractId'] = RuleRequired.curFiledRule(this.dataForm.storageType == '1');
    },
    beforeInit() {
      this.getDataDictByConfigType()
      this.initRuleRequired()
    },
    afterInit() {
      // 合同编号参数配置
      this.mainContractDialog.parm.varParams[0].value = this.dataForm.constructArchiveMainId;
      this.dataRule['purchaseContractId'] = RuleRequired.curFiledRule(this.dataForm.storageType == '1');
      this.dataRule['contractSupplierId'] = RuleRequired.curFiledRule(this.dataForm.storageType == '2');
      this.initRuleRequired()
    },
    /**
     * 获取表单数据
     */
    getDataForm() {
      const dataForm = JSON.parse(JSON.stringify(this.dataForm));
      dataForm.materialDetail =  this.$refs['materialDetail'] ? this.$refs['materialDetail'].scoureData : [];
      return dataForm;
    },
    /**
     * 表单校验
     */
    async validateForm() {
      const _this = this;
      const materialDetail = await _this.$refs['materialDetail'].validateForm(this.dataForm.storageType);
      if (!materialDetail) return false;
      // “本次入库金额(含税)(元)”与入库信息tab中的“金额(含税)”列之和进行比较，金额相差不得超过正负1。
      if(Math.abs(Number(this.materialDetailAmount)-Number(this.dataForm.amountThisTimeTax)) > 1) {
        this.$message.error(`“本次入库金额(含税)(元)”与入库信息tab中的“金额(含税)”列之和进行比较，金额相差不得超过正负1`)
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

      const res = await getDataDictByConfigType({ params: { configTypes: '入库类型' }})
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '入库类型':
              this.storageTypeOptions = ele.dataDict;
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
