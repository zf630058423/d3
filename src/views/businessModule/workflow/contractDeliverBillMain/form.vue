<template>
   <!-- 送货单 -->
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
        <el-form-item slot="col_2" label="项目编号：">
          <el-input v-model="dataForm.constructArchiveMainCode" size="small" placeholder="自动带出" disabled />
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
          <el-input v-model="dataForm.contractOutMainCode" disabled size="small" placeholder="自动填写" />
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
        <el-form-item slot="col_2" prop="deliveryDate" label="送货单日期：">
          <el-date-picker
            v-model="dataForm.deliveryDate"
            type="date"
            placeholder="请选择"
            size="small"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" />
        </el-form-item>
      </row-layout>
      <form-title title="送货信息"></form-title>
      <contractDeliverBillDetail ref="contractDeliverBillDetail" :value="dataForm.contractDeliverBillDetail" />
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
import contractDeliverBillDetail from './components/contractDeliverBillDetail.vue';
import { importDataDetails } from '@/Api/workflowBusssion/index.js'
import { getBillDetail } from '@/Api/workflowBusssion/construct.js'
import { getSupplierCooperateMainById } from '@/Api/supplier/index';
import updateFiles from '@/components/basic/uploaderFile/index.vue';
const requiredArray = ['deliveryDate', 'fileInfoList']
export default {
  components: { amountInput, FormTitle, RowLayout, selectorDialog, contractDeliverBillDetail, updateFiles },
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
        contractOutMainId: '',
        contractOutMainCode: '',
        contractOutMainName: '',
        contractPartyBName: '',
        contractPartyAName: '',
        deliveryDate: '',
        remark: '',
        contractDeliverBillDetail: [],
        fileInfoList: []
      },
      masterContractDialog: { code: 'v_construct_archive_main_purchase', customDialog: 'v_construct_archive_main_purchase', isSetHead: 1, isMulti: false, initailData: [] },
      dataRule: RuleRequired.dataRule(requiredArray),
      materialDetailAmount: 0,
    };
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 获取送货单列表
     */
    async getBillDetail() {
      const { supplierId } = this.$route.query;
      const params = {
        contractOutMainId: this.dataForm.contractOutMainId,
        id: supplierId
      }
      const res = await getBillDetail(params);
      if(res.code == 200) {
        this.dataForm.contractDeliverBillDetail = res.data;
        this.$forceUpdate();
      }
    },
    /**
     * 导出
     */
    async exportFile() {
      let scoureData = this.$refs['contractDeliverBillDetail'] ? this.$refs['contractDeliverBillDetail'].scoureData : [];
      if(scoureData && scoureData.length > 0) await importDataDetails('/contract/contractDeliverBillMain/exportData', scoureData);
    },
    async beforeInit() {
      const { supplierId } = this.$route.query;
      if( supplierId ) {
        const res = await getSupplierCooperateMainById(supplierId)
        if(res.code == 200){
          res.data.contractDeliverBillDetail = [];
          this.dataForm = res.data;
          this.dataForm.id = "";
          this.getBillDetail();
        }
      }
    },
    afterInit() { },
    /**
     * 获取表单数据
     */
    getDataForm() {
      const dataForm = JSON.parse(JSON.stringify(this.dataForm));
      dataForm.contractDeliverBillDetail =  this.$refs['contractDeliverBillDetail'] ? this.$refs['contractDeliverBillDetail'].scoureData : [];
      return dataForm;
    },
    /**
     * 表单校验
     */
    async validateForm() {
      const _this = this;
      const contractDeliverBillDetail = await _this.$refs['contractDeliverBillDetail'].validateForm();
      if (!contractDeliverBillDetail) return resolve(false);
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
