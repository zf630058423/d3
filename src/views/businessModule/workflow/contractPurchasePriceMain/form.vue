<template>
  <!-- 客户信息登记 -->
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
        <el-form-item slot="col_1" label="单据编号：">
          <el-input v-model="dataForm.code" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="constructArchiveMainId" label="项目编号：">
          <selector-dialog :disabled="setting.readonly" :dataId="dataForm.constructArchiveMainId" :model-data="masterContractDialog" :value="dataForm.constructArchiveMainName" dynamic-model="customDialog" @updateValue="updateArchiveMainValue"></selector-dialog>
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
          <el-input v-model="dataForm.projectManagerName" size="small" placeholder="自动填写" disabled />
        </el-form-item>
      </row-layout>
      <row-layout :title="'调价信息'" :cols="3">
        <el-form-item slot="col_1" prop="purchaseContractId" label="主合同编号：">
          <selector-dialog :disabled="setting.readonly" :dataId="dataForm.purchaseContractId" :model-data="mainContractDialog" :value="dataForm.purchaseContractName" dynamic-model="customDialog" @updateValue="updateMainContractValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="主合同名称：">
          <el-input v-model="dataForm.purchaseContractName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" prop="effectiveDate" label="生效日期：">
          <el-date-picker
            v-model="dataForm.effectiveDate"
            type="date"
            placeholder="请选择"
            size="small"
            value-format="yyyy-MM-dd"
            :disabled="setting.readonly"
          >
          </el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="备注：">
          <el-input :disabled="setting.readonly" v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" />
        </el-form-item>
      </row-layout>
      <form-title :title="'调价明细信息'"></form-title>
      <price-detail ref="priceDetail" :disabled="setting.readonly" :value="dataForm.priceDetail" :purchaseContractId="dataForm.purchaseContractId" @exportFile="exportFile"></price-detail>
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
import { exportDataDetail } from '@/Api/workflowBusssion/contractPurchasePriceMain.js';
import FormTitle from '@/components/basic/formTitle/index.vue';
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import AmountInput from '@/components/basic/numberInput/amountInput.vue';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
import priceDetail from './components/priceDetail.vue';
const requiredArray = ['constructArchiveMainId', 'purchaseContractId', 'effectiveDate', 'fileInfoList'];
export default {
  components: { FormTitle, selectorDialog, RowLayout, updateFiles, AmountInput, priceDetail },
  mixins: [comMixin],
  data() {
    return {
      loading: false,
      dataForm: {
        code: '',
        constructArchiveMainId: '',
        constructArchiveMainName: '',
        purchaseContractId: '',
        purchaseContractName: '',
        priceDetail: [],
        fileInfoList: []
      },
      masterContractDialog: { code: 'v_construct_archive_main_purchase', customDialog: 'v_construct_archive_main_purchase', isSetHead: 1, isMulti: false, initailData: [] },
      mainContractDialog: { code: 'v_contract_out_main_purchase', customDialog: 'v_contract_out_main_purchase', isSetHead: 1, isMulti: false, initailData: [], parm: {varParams:[{key:'constructArchiveMainId',value:''}]} },
      dataRule: RuleRequired.dataRule(requiredArray)
    };
  },
  computed: { },
  mounted() { },
  methods: {
    /**
     * 项目编号
    */
    updateArchiveMainValue(data) {
      if (data && data.length <= 0) return;
      const { id, name, constructionUnitName, projectManagerName } = data[0];
      this.dataForm.constructArchiveMainId = id;
      this.dataForm.constructArchiveMainName = name;
      this.dataForm.constructionUnitName = constructionUnitName;
      this.dataForm.projectManagerName = projectManagerName;
      this.mainContractDialog.parm.varParams[0].value = id;
      this.$forceUpdate()
    },
    /**
     * 主合同编号
    */
    updateMainContractValue(data) {
      if (data && data.length <= 0) return;
      const { id, name} = data[0];
      this.dataForm.purchaseContractId = id;
      this.dataForm.purchaseContractName = name;
      this.$forceUpdate()
    },
    /**
     * 导出
     */
    async exportFile() {
      const res = await exportDataDetail(this.dataForm.priceDetail);
    },
    /**
     * 添加调价明细信息
     */
    addPriceDetail() {
      const rowId = Object.toQueryString('rowId')
      this.dataForm.priceDetail.unshift({
        id: rowId,

      })
    },
    /**
     * 删除调价明细信息
     */
    delPriceDetail(index) {
      this.dataForm.priceDetail.splice(index, 1)
    },
    beforeInit() {
    },
    afterInit() {
    },
    /**
     * 获取表单数据
     */
    getDataForm() {
      const dataForm = JSON.parse(JSON.stringify(this.dataForm));
      return dataForm;
    },
    /**
     * 表单校验
     */
    async validateForm() {
      const _this = this;
      const priceDetailData = await _this.$refs['priceDetail'].validateForm();
      if (!priceDetailData) return resolve(false);
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
