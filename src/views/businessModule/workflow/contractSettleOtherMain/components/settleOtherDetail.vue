<template>
  <div class="accountInfoClass">
    <el-form ref="subFrom" :model="subFormData" :rules="rules" :disabled="disabled">
      <el-form>
        <div class="bthGround">
          <el-button type="primary" size="mini" @click="importList" icon="el-icon-edit-outline"
            :disabled="disabled">导入</el-button>
          <el-button type="primary" size="mini" @click="exportFile" icon="el-icon-edit">导出</el-button>
          <el-button type="primary" size="mini" @click="handleAdd" icon="el-icon-plus" :disabled="disabled">新增</el-button>
        </div>
      </el-form>
      <el-table :data="subFormData.detailList" style="width: 100%" size="small" fit class="f2bpmui-datagrid-vuetable"
        :header-cell-class-name="headerCellClass">
        <el-table-column label="序号" type="index" width="50" :align="'center'"></el-table-column>
        <el-table-column label="名称" :align="'center'" min-width="160">
          <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.name" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="品牌" :align="'center'">
          <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.brand" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="规格/型号" :align="'center'">
          <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.specification" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="税率" :align="'center'" min-width="180">
          <template slot-scope="scope">
            <select-dialog :width="800" :height="360" :value="scope.row.taxRateName"
              @updateValue="(val) => updateTaxRateValue(scope.$index, val)" :modelData="taxRateDialog"
              dynamicModel="customDialog"></select-dialog>
          </template>
        </el-table-column>
        <el-table-column label="单位" :align="'center'">
          <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.unit" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="数量" :align="'center'">
          <template slot-scope="scope">
            <el-form-item :prop="`detailList.${scope.$index}.number`" :rules="rules.number4">
              <el-input type="text" v-model="scope.row.number" size="small" placeholder="请输入"
                @change="computeTaxRate(scope.$index)" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="单价（含税）" :align="'center'">
          <template slot-scope="scope">
            <el-form-item :prop="`detailList.${scope.$index}.unitPriceTax`" :rules="rules.number4">
              <el-input type="text" v-model="scope.row.unitPriceTax" size="small" @change="computeTaxRate(scope.$index)"
                placeholder="请输入" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="单价（无税）" :align="'center'">
          <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.unitPriceUntax" size="small" disabled placeholder="自动计算" />
          </template>
        </el-table-column>
        <el-table-column label="金额（含税）" :align="'center'">
          <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.amountTax" size="small" :disabled="!!scope.row.number"
              @change="computeTaxRate(scope.$index)" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="税额" :align="'center'">
          <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.taxAmount" size="small" disabled @change="updateContractAmount" placeholder="自动计算" />
          </template>
        </el-table-column>
        <el-table-column label="金额（无税）" :align="'center'">
          <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.amountUntax" size="small" disabled @change="updateContractAmount" placeholder="自动计算" />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <d3Pagination :sourceData="keepData" ref="d3Pagination" v-model="subFormData.detailList" />
    </el-form>
    <uploader-details :visible.sync="importData.visible" :keyword="importData.key" :uploaderUrl="importData.url"
      @importSuccess="importSuccess"></uploader-details>
  </div>
</template>

<script>
import d3Pagination from "@/components/basic/pagination/index.vue";
import SelectDialog from "@/components/workflow/selector/selectorDialog.vue";
import UploaderDetails from '@/components/basic/importTemplateDialog/uploaderDetails.vue';
import { exportFile } from './index.js'
export default {
  name: "subFromTab",
  components: { d3Pagination, SelectDialog,UploaderDetails },
  props: {
    value: {
      type: Array,
      default: () => { return [] }
    },
    settlementDict: {
      type: Array,
      default: () => { }
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      subFormData: {
        detailList: []
      },
      keepData: [],
      rules: {
        number4: [
          { validator: this.validateNumber4, trigger: ['change', 'blur'] }
        ],
      },
      importData: {
        visible: false,
        url: '/contract/contractSettleOtherMain/importData',
        key: 'contractSettleOtherDetail'
      },
      taxRateDialog: { code: 'base_tax_rate_archive', customDialog: 'base_tax_rate_archive', isSetHead: 1, isMulti: false, initailData: [] },//税率
    };
  },
  watch: {
    value: {
      handler: function (val) {
        if (val) this.keepData = val
        this.updateContractAmount()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    //最多保留4位小数
    validateNumber4 (rule, value, callback) {
      if (!value) return callback()
      let pattern = /^[\d]+(.[\d]{1,4})*$/;
      let field = rule.field.split('.')
      if (!pattern.test(value)) {
        return callback(new Error("请输入的数字"))
      } else {
        this.subFormData[field[0]][field[1]][field[2]] = parseFloat(value)
      }
      callback()
    },
    /**税率 */
    updateTaxRateValue (index, data) {
      if (data.length === 0) return;
      let row = this.subFormData.detailList[index]
      row.taxRate = data[0].taxRate + ''
      row.taxRateName = data[0].name
      row.taxRateId = data[0].id
      console.log(row, 21232)
      this.computeTaxRate(index)
    },
    computeTaxRate (index) {
      let row = this.subFormData.detailList[index]
      if (!row.taxRate) return false
      if (row.unitPriceTax) row.unitPriceUntax = Object.tofixed(Number(row.unitPriceTax) / (Number(row.taxRate) + 1), 2)
      if (row.unitPriceTax && row.number) row.amountTax = Object.tofixed(Number(row.unitPriceTax) * (Number(row.number)), 2)
      if (row.amountTax) row.amountUntax = Object.tofixed(Number(row.amountTax) / (Number(row.taxRate) + 1), 2)
      if (row.amountUntax && row.amountTax) row.taxAmount = Object.tofixed(Number(row.amountTax) - Number(row.amountUntax), 2)
      this.updateContractAmount()
    },
    headerCellClass ({ row, column, rowIndex, columnIndex }) {
      const setIndexArr = [1, 4, 9];
      if (setIndexArr.includes(columnIndex)) {
        //有出现的话就返回
        return "is_required";
      }
    },
    handleAdd () {
      const rowId = Object.toQueryString('rowId')
      let _keepData = this.keepData
      const obj = {
        amountTax: "", //金额(含税)
        amountUntax: "", //	金额(无税)
        brand: "", //品牌
        contractSettleMainId: rowId || "", //结算主表id
        name: "", //名称
        number: "", //	数量
        specification: "", //	规格/型号
        taxAmount: "", //税额
        taxRate: "", //	税率
        taxRateName: "", //	税率
        taxRateId: "", //	税率id
        unit: "", //	单位
        unitPriceTax: "", //	单价(含税)
        unitPriceUntax: "" //	单价(无税)
      };
      _keepData.push(obj)
    },
    handleDelete (index, row) {
      let _keepData = this.keepData //源数据
      let _d3Pagination = this.$refs.d3Pagination
      //源数据当前页下标
      let _sourceIndex = (_d3Pagination.currentPage - 1) * _d3Pagination.pageSize + index
      if (_keepData.length === 1) {
        this.$message.info("至少保留一条数据");
        return false;
      }
      _keepData.splice(_sourceIndex, 1)
    },
    updateContractAmount(){
      const _keepData = this.keepData
      let _d3Pagination = this.$refs.d3Pagination
      //源数据当前页下标
      let contractAmountTax = 0
      let contractAmountTaxFree = 0
      for (let index = 0; index < _keepData.length; index++) {
        let _row = _keepData[index]
        contractAmountTax = contractAmountTax + Number(_row.amountTax)
        contractAmountTaxFree = contractAmountTaxFree + Number(_row.amountUntax)
      }
      this.$emit('changeContractAmount', { contractAmountTax, contractAmountTaxFree, type: 'settleOther' })
    },
    validateForm () {
      if (this.disabled) return this.keepData
      const validObj = {
        name: '名称',
        taxRate: '税率',
        amountTax: '金额',
      }
      const _keepData = this.keepData
      let _d3Pagination = this.$refs.d3Pagination
      //源数据当前页下标
      let _pageSize = _d3Pagination.pageSize

      let contractAmountTax = 0
      let contractAmountTaxFree = 0
      for (let index = 0; index < _keepData.length; index++) {
        let _row = _keepData[index]
        let _currentPage = parseInt((index + 1) / _pageSize) + 1
        if (['unit', 'number', 'unitPriceTax'].some(i => _keepData[index][i])) {
          let _isRequired = ['unit', 'number', 'unitPriceTax'].every(i => _keepData[index][i])
          if (!_isRequired) {
            this.$message.error(`合同明细信息：第 ${_currentPage} 页，第 ${(parseInt(index) + 1) % _pageSize} 行的 单位、数量、单价 需同时填写`)
            return false
          }
        }
        for (let key in validObj) {
          if (!_row[key]) {
            this.$message.error(`合同明细信息：第 ${_currentPage} 页，第 ${(parseInt(index) + 1) % _pageSize} 行 ${validObj[key]} 不能为空`)
            return false
          }
        }
        contractAmountTax = contractAmountTax + Number(_row.amountTax)
        contractAmountTaxFree = contractAmountTaxFree + Number(_row.amountUntax)
      }
      this.$emit('changeContractAmount', { contractAmountTax, contractAmountTaxFree, type: 'settleOther' })
      return this.keepData
    },
    //导入
    importList () {
      this.importData.visible = true;
    },
    //导入成功
    importSuccess (data) {
      this.importData.visible = false;
    },
    /** 导出  */
    async exportFile () {
      const rowId = Object.toQueryString('rowId'); //主表id
      await exportFile({ contractOutMainId: rowId });
    },
  }
};
</script>

<style scoped lang="scss">
::v-deep .el-table td.el-table__cell div {
  overflow: initial;
}

::v-deep .el-table td.el-table__cell .el-form-item__error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 0;
  padding-top: 0px;
  position: absolute;
  top: 100%;
  left: 0;
}

.bthGround {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;

  ::v-deep.el-button {
    margin-left: 5px;
  }
}

::v-deep.el-table .is_required .cell::after {
  content: "*";
  color: #f56c6c;
  margin-left: 4px;
}
</style>
