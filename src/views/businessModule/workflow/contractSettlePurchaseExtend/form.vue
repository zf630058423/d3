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
      </row-layout>
      <row-layout :title="'合同信息'" :cols="3">
        <el-form-item slot="col_1" prop="contractOutMainId" label="主合同编号：">
          <selector-dialog :model-data="purchaseContractDialog" :value="dataForm.masterContractCode" dynamic-model="customDialog" @updateValue="updatePurchaseContractValue" :btnDisabled="setting.readonly"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="主合同名称：">
          <el-input v-model="dataForm.masterContractName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" label="合同总金额(含税)(元)：">
          <el-input v-model="dataForm.purchaseContractAmount" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="合同甲方：">
          <el-input v-model="dataForm.contractPartyAName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" label="合同乙方：">
          <el-input v-model="dataForm.contractPartyBName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" label="入库金额(含税)(元)：">
          <el-input v-model="dataForm.amountInStorageTax" disabled size="small" placeholder="自动计算" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="入库金额(无税)(元)：">
          <el-input v-model="dataForm.amountInStorageTaxFree" disabled size="small" placeholder="自动计算" />
        </el-form-item>
        <el-form-item slot="col_2" label="调价金额(含税)(元)：">
          <el-input v-model="dataForm.priceAdjustmentAmountTax" disabled size="small" placeholder="自动计算" />
        </el-form-item>
        <el-form-item slot="col_3" label="调价金额(无税)(元)：">
          <el-input v-model="dataForm.priceAdjustmentAmountTaxFree" disabled size="small" placeholder="自动计算" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="退货金额(含税)(元)：">
          <el-input v-model="dataForm.returnAmountTax" disabled size="small" placeholder="自动计算" />
        </el-form-item>
        <el-form-item slot="col_2" label="退货金额(无税)(元)：">
          <el-input v-model="dataForm.returnAmountTaxFree" disabled size="small" placeholder="自动计算" />
        </el-form-item>
        <el-form-item slot="col_3" label="结算金额(含税)(元)：">
          <el-input v-model="dataForm.settlementAmountTax" disabled size="small" placeholder="自动计算" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="结算金额(无税)(元)：">
          <el-input v-model="dataForm.settlementAmountTaxFree" disabled size="small" placeholder="自动计算" />
        </el-form-item>
        <el-form-item slot="col_2" label="质保金：">
          <el-input :value="retentionMoney" disabled size="small" placeholder="自动计算" />
        </el-form-item>
        <el-form-item slot="col_3" prop="retentionMoneyDueDate" label="质保金到期日期：">
           <el-date-picker
            v-model="dataForm.retentionMoneyDueDate"
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
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="3000" />
        </el-form-item>
      </row-layout>
      <form-title :title="'增减项'"></form-title>
      <el-button type="primary" size="small" @click="addSectionDetail">新增</el-button>
      <el-table :summary-method="getSummaries" :show-summary="true" :data="dataForm.sectionDetail" style="width: 100%" size="small" class="f2bpmui-datagrid-vuetable">
        <el-table-column label="内容">
          <template slot-scope="scope">
            <el-input v-model="scope.row.content" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="税率">
          <template slot-scope="scope">
            <selector-dialog :model-data="taxRateDialog" :value="scope.row.taxRate" dynamic-model="customDialog" @updateValue="updateTaxRateValue($event,scope.row,scope.$index)"></selector-dialog>
          </template>
        </el-table-column>
        <el-table-column prop="amountTax" label="金额(含税)">
          <template slot-scope="scope">
            <amountInput v-model="scope.row.amountTax" @change="changeAmountTax($event,scope.row,scope.$index)"></amountInput>
          </template>
        </el-table-column>
        <el-table-column prop="taxAmount" label="税额">
          <template slot-scope="scope">
            <el-input v-model="scope.row.taxAmount" size="small" placeholder="自动计算" :disabled="true" />
          </template>
        </el-table-column>
        <el-table-column prop="amountUntax" label="金额(无税)">
          <template slot-scope="scope">
            <amountInput v-model="scope.row.amountUntax"></amountInput>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="delSectionDetail(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <form-title :title="'附件'"></form-title>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="deliveryNote" label="送货单：">
          <update-files v-model="dataForm.deliveryNote"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="warehouseReceipt" label="出入库：">
          <update-files v-model="dataForm.warehouseReceipt"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="contract" label="合同：">
          <update-files v-model="dataForm.contract"></update-files>
        </el-form-item>
      </row-layout> 
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="statementAccount" label="结算书：">
          <update-files v-model="dataForm.statementAccount"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="其他附件：">
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
import numberInput from '@/components/basic/numberInput/index.vue';
import FormTitle from '@/components/basic/formTitle/index.vue';
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
import { getAmount } from '@/Api/workflowBusssion/contract.js'
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import tools from '@/utils/fun.js';
const requiredArray = ['contractOutMainId', 'constructArchiveMainId', 'retentionMoneyDueDate', 'deliveryNote', 'warehouseReceipt', 
  'warehouseReceipt','contract', 'statementAccount']
export default {
  components: { amountInput, FormTitle, RowLayout, selectorDialog, updateFiles, numberInput },
   mixins: [comMixin],
  data() {
    return {
      dataForm: {
        code: '',
        remark: '',
        masterContractCode: '',
        masterContractName: '',
        contractOutMainId: '',
        contractPartyAName: '',
        contractPartyBName: '',
        constructArchiveMainId: '',
        constructArchiveMainCode: '',
        retentionMoneyDueDate: '',
        amountInStorageTaxFree: '',
        priceAdjustmentAmountTaxFree: '',
        amountInStorageTax: '',
        returnAmountTaxFree: '',
        priceAdjustmentAmountTax: '',
        purchaseContractAmount: '',
        returnAmountTax: '',
        settlementAmountTax: '',
        settlementAmountTaxFree: '',
        retentionMoneyScale: '',
        sectionDetail: [],
        deliveryNote: [],
        warehouseReceipt: [],
        contract: [],
        statementAccount: [],
        fileInfoList: []
      },
      taxRateDialog: { code: 'base_tax_rate_archive', customDialog: 'base_tax_rate_archive', isSetHead: 1, isMulti: false, initailData: [] },
      purchaseContractDialog:{ code: 'v_contract_out_main_purchase', customDialog: 'v_contract_out_main_purchase', isSetHead: 1, isMulti: false, initailData: [], parm: {varParams:[{key:'constructArchiveMainId',value:''}]} },
      masterContractDialog: { code: 'v_construct_archive_main_purchase', customDialog: 'v_construct_archive_main_purchase', isSetHead: 1, isMulti: false, initailData: [] },
      dataRule: RuleRequired.dataRule(requiredArray)
    };
  },
  computed: {
    /**
     * 质保金 = 结算金额 * 质保金支付比例（retentionMoneyScale）
     */
    retentionMoney() {
      const retentionMoney = tools.getNumMulti(this.dataForm.settlementAmountTax||0,this.dataForm.retentionMoneyScale||0);
      this.dataForm.retentionMoney = retentionMoney;
      return retentionMoney;
    },
    /**
     * 增减项 的 金额(含税)
     */
    totalAmountTax() {
      const price = this.dataForm.sectionDetail.reduce((prev, curr) => {
        const currValue = Number(curr.amountTax);
        if (!isNaN(currValue)) {
          return tools.getNumAdd(prev,currValue);
        } else {
          return prev;
        }
      },0)
      // 【结算金额(含税)(元)】 系统计算=入库金额(含税) + 调价金额(含税)(元)-退货金额(含税)(元)+增减项 的 金额(含税)合计值
      
      const { amountInStorageTax, priceAdjustmentAmountTax, returnAmountTax } = this.dataForm;
      this.dataForm.settlementAmountTax = tools.getNumSub(tools.getNumAdd(amountInStorageTax,priceAdjustmentAmountTax),tools.getNumSub(returnAmountTax,price))
      return price;
    },
    /**
     * 增减项 的 金额(无税)
     */
    totalAmountUntax() {
      const price = this.dataForm.sectionDetail.reduce((prev, curr) => {
        const currValue = Number(curr.amountUntax);
        if (!isNaN(currValue)) {
          return tools.getNumAdd(prev,currValue);
        } else {
          return prev;
        }
      },0)
      // 【结算金额(无税)(元)】不可编辑，系统计算= 入库金额(无税)+调价金额(无税)(元)-退货金额(无税)(元)+ 增减项 的 金额(无税)合计值
      const { amountInStorageTaxFree, priceAdjustmentAmountTaxFree, returnAmountTaxFree } = this.dataForm;
      this.dataForm.settlementAmountTaxFree = tools.getNumSub(tools.getNumAdd(amountInStorageTaxFree,priceAdjustmentAmountTaxFree),tools.getNumSub(returnAmountTaxFree,price))
      return price;
    }
  },
  created() {},
  mounted() {},
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
        data.map(item => Number(column.property?item[column.property]:''));
        // 【税额】 = 金额（含税）- 金额（无税）
        if (column.property === 'taxAmount') {
          param.data.forEach(e=>{
            e.taxAmount = tools.getNumSub(e.amountTax,e.amountUntax)
          })
        }
        if (column.property === 'amountTax') sums[index] =  _this.totalAmountTax
        if (column.property === 'amountUntax') sums[index] =  _this.totalAmountUntax
      });
      return sums;
    },
    /**
    * 给表头加必填符号*
    */
    addRedStar(h, { column }) {
      const columnLabels = "内容，税率，金额(含税)，税额，金额(无税)，备注"
      if(columnLabels.indexOf(column.label) == -1) {
        return h("span", " " + column.label);
      }
      return [
        h("span", " " + column.label),
        h("span", { style: "color: red" }, "*")
      ];
    },
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
      this.purchaseContractDialog.parm.varParams[0].value = id;
    },
    /**
     * 采购合同
     */
    updatePurchaseContractValue(data) {
      if(data && data.length <= 0) return;
      const { id, name, contractPartyAName, contractPartyBName, code } = data[0];
      this.dataForm.contractOutMainId = id;
      this.dataForm.masterContractName = name;
      this.dataForm.masterContractCode = code;
      this.dataForm.contractPartyAName = contractPartyAName;
      this.dataForm.contractPartyBName = contractPartyBName;
      this.getAmount()
    },
    /**
     * 采购合同数据
     */
    async getAmount() {
      const params = {
        contractOutMainId: this.dataForm.contractOutMainId
      }
      console.log('采购合同数据 == ', params)
      const res = await getAmount(params)
      if(res.code == 200) {
        const { amountInStorageTax, amountInStorageTaxFree, priceAdjustmentAmountTax, purchaseContractAmount,retentionMoney,
          priceAdjustmentAmountTaxFree, returnAmountTax, returnAmountTaxFree, retentionMoneyScale } = res.data;
        this.dataForm.amountInStorageTax = amountInStorageTax;
        this.dataForm.amountInStorageTaxFree = amountInStorageTaxFree;
        this.dataForm.priceAdjustmentAmountTax = priceAdjustmentAmountTax;
        this.dataForm.priceAdjustmentAmountTaxFree = priceAdjustmentAmountTaxFree;
        this.dataForm.returnAmountTax = returnAmountTax;
        this.dataForm.returnAmountTaxFree = returnAmountTaxFree;
        this.dataForm.retentionMoney = retentionMoney;
        this.dataForm.retentionMoneyScale = retentionMoneyScale;
        this.dataForm.purchaseContractAmount = purchaseContractAmount;
      }
    },
    /**
     * 税率
     * @param {*} data 
     */
    updateTaxRateValue(data,row,index) {
      if (data && data.length <= 0) return;
      const { taxRate } = data[0];
      this.$set(this.dataForm.sectionDetail[index],'taxRate', taxRate)
      // 【金额(无税) 】金额(含税)/(1+税率)，2位小数位，编制人可修改
      const amountUntax = tools.getNumDiv(row.amountTax,1+Number(taxRate));
      this.$set(this.dataForm.sectionDetail[index],'amountUntax', tools.getTofixed(amountUntax,2))
      this.$forceUpdate()
    },
    /**
     * 新增增减项
     */
    addSectionDetail() {
      this.dataForm.sectionDetail.push({
        amountTax: '',
        taxRate: '',
        amountTax: '',
        taxAmount: '',
        amountUntax: '',
        remark: '',
      })
    },
    /**
     * 金额（含税）变更
     */
    changeAmountTax(val, row, index) {
      // 【金额（无税）】 = 金额（含税）/1+税率
      const amountUntax = tools.getNumDiv(val,1+Number(row.taxRate));
      this.$set(this.dataForm.sectionDetail[index],'amountUntax', tools.getTofixed(amountUntax,2))
      this.$forceUpdate()
    },
    /**
     * 删除增减项
     */
    delSectionDetail(index) {
      this.dataForm.sectionDetail.splice(index,1)
    },
    beforeInit() {
    },
    afterInit() { },
    /**
     * 获取表单数据
     */
    getDataForm() {
      const dataForm = JSON.parse(JSON.stringify(this.dataForm));
      return dataForm;
    },
    /**
     * 校验增减项
     */
    validateSectionDetail() {
      const validObj = {
        content: '内容',
        taxRate: '税率',
        amountTax: '金额(含税)',
        amountUntax: '金额(无税)'
      }
      for (let index in this.dataForm.sectionDetail) {
        for (let key in validObj) {
          let _row = this.dataForm.sectionDetail[index]
          if (!_row[key]) {
            this.$message.error(`增减项信息：第 ${parseInt(index) + 1} 行 ${validObj[key]} 不能为空`)
            return false
          }
        }
      }
      return true;
    },
    /**
     * 表单校验
     */
    async validateForm() {
      const _this = this;
      const bank = await _this.validateSectionDetail();
      if(!bank) return false;
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
