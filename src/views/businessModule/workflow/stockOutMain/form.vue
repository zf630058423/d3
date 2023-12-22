<template>
   <!-- 合同变更 -->
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
        <el-form-item slot="col_3" prop="dateDelivery" label="出库日期：">
          <el-date-picker
            v-model="dataForm.dateDelivery"
            type="date"
            placeholder="请选择"
            size="small"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
      </row-layout>
      <form-title title="材料明细"></form-title>
      <materialDetail ref="materialDetail" :value="dataForm.materialDetail" :constructArchiveMainId="dataForm.constructArchiveMainId" @exportFile="exportFile" />
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
import materialDetail from './components/materialDetail.vue';
import { exportStockOutMainDetails } from '@/Api/workflowBusssion/stock.js'
import updateFiles from '@/components/basic/uploaderFile/index.vue';
const requiredArray = ['dateDelivery']
export default {
  components: { amountInput, FormTitle, RowLayout, selectorDialog, materialDetail, updateFiles },
   mixins: [comMixin],
  data() {
    return {
      dataForm: {
        code: '',
        constructArchiveMainId: '',
        constructArchiveMainCode: '',
        constructArchiveMainName: '',
        constructionUnitName: '',
        deptName: '',
        dateDelivery: '',
        materialDetail: [],
        fileInfoList: []
      },
      masterContractDialog: { code: 'v_construct_archive_main_purchase', customDialog: 'v_construct_archive_main_purchase', isSetHead: 1, isMulti: false, initailData: [] },
      dataRule: RuleRequired.dataRule(requiredArray)
    };
  },
  created() {},
  mounted() {},
  methods: {
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
    },
    afterInit() { },
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
      const materialDetail = await _this.$refs['materialDetail'].validateForm();
      if (!materialDetail) return resolve(false);
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
