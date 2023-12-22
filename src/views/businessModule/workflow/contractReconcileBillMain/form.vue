<template>
   <!-- 对账单 -->
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
          <selector-dialog :modelData="constructArchiveMainDialog" :value="dataForm.constructArchiveMainName"
            dynamic-model="customDialog" @updateValue="updateConstructArchiveValue"></selector-dialog>
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
        <el-form-item slot="col_1" prop="contractOutMainCode" label="主合同编号：">
          <selector-dialog :modelData="contractOutMainDialog" :value="dataForm.contractOutMainCode" 
            dynamicModel="customDialog" @updateValue="updateContractOutMainValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="主合同名称：">
          <el-input v-model="dataForm.contractOutMainName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" label="乙方：">
          <el-input v-model="dataForm.contractPartyBName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="甲方：">
          <el-input v-model="dataForm.contractPartyAName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="reconciliationDate" label="对账日期：">
          <el-date-picker
            v-model="dataForm.reconciliationDate"
            type="date"
            placeholder="请选择"
            size="small"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item slot="col_3" label="本次对账金额(含税)(元)：">
          <el-input v-model="dataForm.reconcilingAmount" disabled size="small" placeholder="自动计算" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" />
        </el-form-item>
      </row-layout>
      <form-title title="入库信息"></form-title>
      <contractReconcileBillDetail ref="contractReconcileBillDetail" :contractOutMainId="dataForm.contractOutMainId"
        :value="dataForm.contractReconcileBillInStorage" @getTotalReconcilingAmount="getTotalReconcilingAmount" />
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
import contractReconcileBillDetail from './components/contractReconcileBillDetail.vue';
import { importDataDetails } from '@/Api/workflowBusssion/index.js'
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import { getSupplierCooperateMainById } from '@/Api/supplier/index';
const requiredArray = ['constructArchiveMainId', 'reconciliationDate', 'fileInfoList', 'contractOutMainCode']
export default {
  components: { amountInput, FormTitle, RowLayout, selectorDialog, contractReconcileBillDetail, updateFiles },
  mixins: [comMixin],
  data() {
    return {
      dataForm: {
        code: '',
        constructArchiveMainId: '',
        constructArchiveMainCode: '',
        constructArchiveMainName: '',
        constructionUnitName: '',
        projectManagerName: '',
        reconcilingAmount: '',
        contractOutMainId: '',
        contractOutMainCode: '',
        contractOutMainName: '',
        contractPartyBName: '',
        contractPartyAName: '',
        reconciliationDate: '',
        remark: '',
        contractReconcileBillInStorage: [],
        fileInfoList: []
      },
      // 【项目档案】= 排除 是否old项目=是 的数据
      constructArchiveMainDialog: { code: 'v_construct_archive_main_purchase', customDialog: 'v_construct_archive_main_purchase', isSetHead: 1, isMulti: false, initailData: [] },
      // 【采购合同】= 审核通过的采购合同+采购类型=采购合同+合同类别=主合同
      contractOutMainDialog: { code: 'v_contract_out_main_purchase', customDialog: 'v_contract_out_main_purchase',
       isSetHead: 1, isMulti: false, initailData: [], parm: {varParams:[{key:'constructArchiveMainId',value:''}]} },
      dataRule: RuleRequired.dataRule(requiredArray),
      materialDetailAmount: 0,
    };
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 获取本次对账金额(含税)
     */
    getTotalReconcilingAmount(val) {
      console.log('获取本次对账金额 == ',val)
      this.dataForm.reconcilingAmount = val;
    },
    /**
     * 导出
     */
    async exportFile() {
      let scoureData = this.$refs['contractReconcileBillDetail'] ? this.$refs['contractReconcileBillDetail'].scoureData : [];
      if(scoureData && scoureData.length > 0) await importDataDetails('/contract/contractDeliverBillMain/exportData', scoureData);
    },
    /**
    /**
     * 项目编号
     */
    updateConstructArchiveValue(data) {
      if(data && data.length <= 0) return;
      const { id, code, constructionUnitName, projectManagerName, name, contractOutMainId} = data[0];
      this.dataForm.constructArchiveMainCode = code;
      this.dataForm.constructArchiveMainName = name;
      this.dataForm.constructionUnitName = constructionUnitName;
      this.dataForm.projectManagerName = projectManagerName;
      this.dataForm.constructArchiveMainId = id;
      // 合同编号
      this.contractOutMainDialog.parm.varParams[0].value = id;
      this.dataForm.contractOutMainId = ""
      this.dataForm.contractOutMainCode = ""
      this.dataForm.contractOutMainName = ""
      this.dataForm.contractPartyBName = ""
      this.dataForm.contractPartyAName = ""
    },
    /**
     * 合同编号
     */
    updateContractOutMainValue(data) {
      if(data && data.length <= 0) return;
      const {id, code, name, contractPartyBName, contractPartyAName } = data[0];
      this.dataForm.contractOutMainId = id;
      this.dataForm.contractOutMainCode = code;
      this.dataForm.contractOutMainName = name;
      this.dataForm.contractPartyBName = contractPartyBName;
      this.dataForm.contractPartyAName = contractPartyAName;
    },
    async beforeInit() {
      const { supplierId } = this.$route.query;
      if( supplierId ) {
        const res = await getSupplierCooperateMainById(supplierId)
        if(res.code == 200){
          res.data.contractReconcileBillInStorage = [];
          this.dataForm = res.data;
          this.dataForm.id = "";
        }
      }
    },
    afterInit() { },
    /**
     * 获取表单数据
     */
    getDataForm() {
      const dataForm = JSON.parse(JSON.stringify(this.dataForm));
      dataForm.contractReconcileBillInStorage =  this.$refs['contractReconcileBillDetail'] ? this.$refs['contractReconcileBillDetail'].scoureData : [];
      return dataForm;
    },
    /**
     * 表单校验
     */
    async validateForm() {
      const _this = this;
      const contractReconcileBillInStorage = await _this.$refs['contractReconcileBillDetail'].validateForm();
      if (!contractReconcileBillInStorage) return resolve(false);
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
  },
};
</script>

<style scoped lang="scss">
</style>
