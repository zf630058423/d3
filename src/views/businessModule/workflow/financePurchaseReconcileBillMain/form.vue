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
        <el-form-item slot="col_2" prop="contractOutMainId" label="合同编号：">
          <selector-dialog :model-data="contractOutMainDialog" :value="dataForm.contractOutMainCode" dynamic-model="customDialog" 
            @updateValue="updateContractOutMainValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="合同名称：">
          <el-input v-model="dataForm.contractOutMainName" size="small" placeholder="自动带出" disabled />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="供应商：">
          <el-input v-model="dataForm.supplierName" size="small" placeholder="自动带出" disabled />
        </el-form-item>
        <el-form-item slot="col_2" label="项目编号：">
          <el-input v-model="dataForm.constructArchiveMainCode" size="small" placeholder="自动带出" disabled />
        </el-form-item>
        <el-form-item slot="col_3" label="项目名称：">
          <el-input v-model="dataForm.constructArchiveMainName" size="small" placeholder="自动带出" disabled />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="管理部门：">
          <el-input v-model="dataForm.constructionUnitName" size="small" placeholder="自动带出" disabled />
        </el-form-item>
        <el-form-item slot="col_2" label="项目负责人：">
          <el-input v-model="dataForm.projectManagerName" size="small" placeholder="自动带出" disabled />
        </el-form-item>
        <el-form-item slot="col_3" prop="estimatedPaymentDate" label="预计付款日期：">
          <el-date-picker
            v-model="dataForm.estimatedPaymentDate"
            type="date"
            placeholder="请选择"
            size="small"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="对账金额(元)：">
          <el-input v-model="dataForm.reconcilingAmount" size="small" placeholder="自动计算" disabled />
        </el-form-item>
        <el-form-item slot="col_2" label="对账未付金额(元)：">
          <el-input :value="reconcilingUnpaidAmount" size="small" placeholder="自动计算" disabled />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="remark" label="摘要备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" />
        </el-form-item>
      </row-layout>
      <form-title :title="'材料入库单'"></form-title>
      <div>
        <el-button type="primary" size="small" @click="addPurchaseRecord">新增</el-button>
      </div>
      <el-table :data="dataForm.purchaseReconcileBillInStorage" :show-summary="true" :summary-method="getSummaries" class="f2bpmui-datagrid-vuetable" border>
        <el-table-column label="序号"  type="index" width="80px" />
        <el-table-column label="单据编号" :render-header="addRedStar">
          <template slot-scope="scope">
            <selector-dialog :model-data="stockInMainCodeDialog" :value="scope.row.stockInMainCode" dynamic-model="customDialog" 
              @updateValue="updateStockInMainValue($event,scope.$index)"></selector-dialog>
          </template>
        </el-table-column>
        <el-table-column label="送货单日期">
          <template slot-scope="scope">
            <el-input v-model="scope.row.dateDeliveryNote" size="small" placeholder="自动带出" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="amountThisTimeTax" label="入库金额(元)">
          <template slot-scope="scope">
            <el-input v-model="scope.row.amountThisTimeTax" size="small" placeholder="自动计算" disabled />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="delTableRow('purchaseReconcileBillInStorage', scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <form-title :title="'材料退货单'"></form-title>
      <div>
        <el-button type="primary" size="small" @click="addPurchaseRecordReturn">新增</el-button>
      </div>
      <el-table :data="dataForm.purchaseReconcileBillReturn" :show-summary="true" :summary-method="getSummaries" class="f2bpmui-datagrid-vuetable" border>
        <el-table-column label="序号"  type="index" width="80px" />
        <el-table-column label="单据编号">
          <template slot-scope="scope">
            <selector-dialog :model-data="materialReturnMainDialog" :value="scope.row.stockMaterialReturnMainCode" dynamic-model="customDialog" 
              @updateValue="updateMaterialReturnMainValue($event,scope.$index)"></selector-dialog>
          </template>
        </el-table-column>
        <el-table-column label="退货日期">
          <template slot-scope="scope">
            <el-input v-model="scope.row.returnDate" size="small" placeholder="自动带出" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="returnAmountTax" label="退货金额(元)">
          <template slot-scope="scope">
            <el-input v-model="scope.row.returnAmountTax" size="small" placeholder="自动计算" disabled />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="delTableRow('purchaseReconcileBillReturn', scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <form-title :title="'附件'"></form-title>
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
import FormTitle from '@/components/basic/formTitle/index.vue';
import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import cascSelect from '@/components/basic/cascSelect/index.vue'
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import tools from '@/utils/fun.js'
import moment from 'moment'
const requiredArray = ['contractOutMainId', 'estimatedPaymentDate']
export default {
  components: { FormTitle, selectorDialog, RowLayout, cascSelect, updateFiles },
  mixins: [comMixin],
  data() {
    return {
      loading: false,
      isReadOnly: false,
      dataForm: {
        code: '',
        contractOutMainId: '',
        contractOutMainCode: '',
        contractOutMainName: '',
        supplierName: '',
        constructArchiveMainCode: '',
        constructArchiveMainName: '',
        constructionUnitName: '',
        projectManagerName: '',
        estimatedPaymentDate: '',
        reconcilingAmount: '',
        reconcilingUnpaidAmount: '',
        remark: '',
        purchaseReconcileBillInStorage: [],
        purchaseReconcileBillReturn: [],
        fileInfoList: [],
        fileInfo: [],
      },
      contractOutMainDialog: { code: 'v_contract_out_main_purchase', customDialog: 'v_contract_out_main_purchase', isSetHead: 1, isMulti: false, initailData: [] },
      stockInMainCodeDialog: { code: 'v_stock_in_main_purchase_reconcile_bill', customDialog: 'v_stock_in_main_purchase_reconcile_bill',
       isSetHead: 1, isMulti: false, initailData: [], varParams:[{ key:'purchaseContractId',value: null }]},
      materialReturnMainDialog: { code: 'v_stock_material_return_main_purchase_reconcile_bill', 
      customDialog: 'v_stock_material_return_main_purchase_reconcile_bill', 
      isSetHead: 1, isMulti: false, initailData: [], varParams:[{ key:'constructArchiveMainId',value: null }] },
      dataRule: RuleRequired.dataRule(requiredArray),
      amountThisTimeTax: '',
      returnAmountTax: '',
    };
  },
  computed: {
    /**
     * 对账未付金额
     */
    reconcilingUnpaidAmount() {
      if(this.dataForm.reconcilingUnpaidAmount) return this.dataForm.reconcilingUnpaidAmount;
      return this.dataForm.reconcilingAmount;
    }
  },
  mounted() { },
  methods: {
    //指定列求和
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      const _this = this;
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => column.property?Number(item[column.property]):[]);
		    if (column.property === 'amountThisTimeTax' || column.property === 'returnAmountTax') {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return tools.getNumAdd(prev, curr);
            } else {
              return prev;
            }
          }, 0);
          if(column.property === 'amountThisTimeTax' && sums[index]) _this.amountThisTimeTax = sums[index];
          if(column.property === 'returnAmountTax' && sums[index]) _this.returnAmountTax = sums[index];
          _this.getAmountTax()
		     }
      });
      return sums;
    },
    /**
     * 【对账金额】= 材料入库单中的入库金额(元)之和-材料退货单中的退货金额(元)之和
     * 【对账未付金额(元)】 = 对账金额 - 与该对账单相关的已审批通过的集采付款单中该对账单的本次申请金额之和
     *  amountThisTimeTax = 入库金额(元)之和
     *  returnAmountTax = 退货金额(元)之和
     */
    getAmountTax() {
      // 对账金额 
      this.dataForm.reconcilingAmount = tools.getNumSub(this.amountThisTimeTax,this.returnAmountTax);
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
     * 材料入库单新增
     */
    addPurchaseRecord() {
      this.dataForm.purchaseReconcileBillInStorage.push({
        stockInMainCode: '',
        stockInMainId: '',
        dateDeliveryNote: '',
        amountThisTimeTax: '',
      })
    },
    /**f
     * 材料退货单新增
     */
    addPurchaseRecordReturn() {
      this.dataForm.purchaseReconcileBillReturn.push({
        stockMaterialReturnMainCode: '',
        stockMaterialReturnMainId: '',
        returnDate: '',
        returnAmountTax: '',
      })
    },
    /**
     * 删除子表
     */
    delTableRow(tableName, index){
      this.dataForm[tableName].splice(index,1);
    },
    /**
     * 合同编号更新
     */
    updateContractOutMainValue(data) {
      if(data && data.length <= 0) return;
      const {id, code, name,amountThisTimeTax, contractPartyBName, constructArchiveMainCode, 
        constructArchiveMainName, constructionUnitName, projectManagerName} = data[0];
      this.dataForm.contractOutMainId = id;
      this.dataForm.contractOutMainCode = code;
      this.dataForm.contractOutMainName = name;
      this.dataForm.supplierName = contractPartyBName;
      this.dataForm.amountThisTimeTax = amountThisTimeTax;
      this.dataForm.constructArchiveMainCode = constructArchiveMainCode;
      this.dataForm.constructArchiveMainName = constructArchiveMainName;
      this.dataForm.constructionUnitName = constructionUnitName;
      this.dataForm.projectManagerName = projectManagerName;
      this.materialReturnMainDialog.varParams[0].value = id;
      this.stockInMainCodeDialog.varParams[0].value = id;
    },
    /**
     * 材料入库单 单据编号
     */
    updateStockInMainValue(data, index){
      if(data && data.length <= 0) return;
      const {code, id, dateDeliveryNote, amountThisTimeTax} = data[0];
      this.$set(this.dataForm.purchaseReconcileBillInStorage[index],'stockInMainId',id)
      this.$set(this.dataForm.purchaseReconcileBillInStorage[index],'stockInMainCode',code)
      this.$set(this.dataForm.purchaseReconcileBillInStorage[index],'dateDeliveryNote',moment(dateDeliveryNote).format('YYYY-MM-DD'))
      this.$set(this.dataForm.purchaseReconcileBillInStorage[index],'amountThisTimeTax',amountThisTimeTax)
    },
    /**
     * 材料退货单 单据编号
     */
    updateMaterialReturnMainValue(data, index){
      if(data && data.length <= 0) return;
      const {code, id, returnDate, returnAmountTax} = data[0];
      this.$set(this.dataForm.purchaseReconcileBillReturn[index],'stockMaterialReturnMainId',id)
      this.$set(this.dataForm.purchaseReconcileBillReturn[index],'stockMaterialReturnMainCode',code)
      this.$set(this.dataForm.purchaseReconcileBillReturn[index],'returnDate',moment(returnDate).format('YYYY-MM-DD'))
      this.$set(this.dataForm.purchaseReconcileBillReturn[index],'returnAmountTax',returnAmountTax)
    },
    beforeInit() {
    },
    afterInit() {
    },
    /**
     * 获取表单数据
     */
    getDataForm() {
      let dataForm = JSON.parse(JSON.stringify(this.dataForm));
      // （新增/编辑）对账未付金额 = 对账金额
      dataForm.reconcilingUnpaidAmount = dataForm.reconcilingAmount;
      return dataForm;
    },
    /**
     * 表单校验
     */
    async validateForm() {
      const _this = this;
      // 材料入库单检验
      const purchaseRecord = await this.vaildPurchaseRecord();
      if(!purchaseRecord) return false;
      // 材料退货单检验
      const purchaseRecordReturn = await this.vaildPurchaseRecordReturn();
      if(!purchaseRecordReturn) return false;
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
     * 材料入库单检验
     */
    vaildPurchaseRecord() {
      if(this.dataForm.purchaseReconcileBillInStorage.length <= 0) {
        this.$message.info('材料入库单至少要有一行数据')
        return false;
      }
      for (let index in this.dataForm.purchaseReconcileBillInStorage) {
        let _row = this.dataForm.purchaseReconcileBillInStorage[index]
        if (!_row.stockInMainId) {
          this.$message.error(` 材料入库单：第 ${(parseInt(index) + 1)} 行 单据编号 不能为空`)
          return false
        }
      }
      return true;
    },
    /**
     * 材料退货单检验
     */
    vaildPurchaseRecordReturn() {
      for (let index in this.dataForm.purchaseReconcileBillReturn) {
        let _row = this.dataForm.purchaseReconcileBillReturn[index]
        if (!_row.stockMaterialReturnMainId) {
          this.$message.error(` 材料退货单：第 ${(parseInt(index) + 1)} 行 单据编号 不能为空`)
          return false
        }
      }
      return true;
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
