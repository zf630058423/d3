<template>
  <div class="accountInfoClass">
    <el-form ref="subFrom" :model="subFormData" :rules="rules" :disabled="disabled">
      <el-form>
        <div class="bthGround">
          <el-button type="primary" size="mini" @click="handleAdd" icon="el-icon-plus" :disabled="disabled">新增</el-button>
        </div>
      </el-form>
      <el-table :data="subFormData.detailList" style="width: 100%" size="small" fit class="f2bpmui-datagrid-vuetable"
        :header-cell-class-name="headerCellClass">
        <el-table-column label="序号" type="index" width="50" :align="'center'"></el-table-column>
        <el-table-column label="内容" :align="'center'" min-width="250">
          <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.content" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="税率" :align="'center'" min-width="200">
          <template slot-scope="scope">
            <select-dialog :width="800" :height="360" :value="scope.row.taxRateName"
              @updateValue="(val) => updateTaxRateValue(scope.$index, val)" :modelData="taxRateDialog"
              dynamicModel="customDialog"></select-dialog>
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
            <el-input type="text" v-model="scope.row.taxAmount" size="small"  @change="updateContractAmount" disabled placeholder="自动计算" />
          </template>
        </el-table-column>
        <el-table-column label="金额（无税）" :align="'center'">
          <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.amountUntax" size="small"  @change="updateContractAmount" disabled placeholder="自动计算" />
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
  </div>
</template>

<script>
import d3Pagination from "@/components/basic/pagination/index.vue";
import SelectDialog from "@/components/workflow/selector/selectorDialog.vue";
export default {
  name: "subFromTab",
  components: { d3Pagination, SelectDialog },
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
      let setIndexArr = []
      if (setIndexArr.includes(columnIndex)) {
        //有出现的话就返回
        return "is_required";
      }
    },
    handleAdd () {
      const rowId = Object.toQueryString('rowId')
      let _keepData = this.keepData
      const obj = {
        contractSettleMainId: rowId || "", //结算主表id
        amountTax: "", //金额(含税)
        amountUntax: "", //金额(无税)
        content: "", //内容
        taxAmount: "", //税额
        taxRateName: "", //	税率
        taxRate: "", //	税率
        taxRateId: "", //	税率id
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
      this.$emit('changeContractAmount', { contractAmountTax, contractAmountTaxFree, type: 'settleOtherSection' })
    },
    validateForm () {
      if (this.disabled) return this.keepData
      const _keepData = this.keepData
      let _d3Pagination = this.$refs.d3Pagination
      //源数据当前页下标
      let _pageSize = _d3Pagination.pageSize
      let contractAmountTax = 0
      let contractAmountTaxFree = 0
      let validArr = ['content', 'taxRate', 'amountTax']
      for (let index = 0; index < _keepData.length; index++) {
        let _row = _keepData[index]
        let _currentPage = parseInt((index + 1) / _pageSize) + 1
        if (validArr.some(i => _keepData[index][i])) {
          let _isRequired = validArr.every(i => _keepData[index][i])
          if (!_isRequired) {
            this.$message.error(`增减项信息：第 ${_currentPage} 页，第 ${(parseInt(index) + 1) % _pageSize} 行的 内容、税率、金额 需同时填写`)
            return false
          }
        }
        contractAmountTax = contractAmountTax + Number(_row.amountTax)
        contractAmountTaxFree = contractAmountTaxFree + Number(_row.amountUntax)
      }
      this.$emit('changeContractAmount', { contractAmountTax, contractAmountTaxFree, type: 'settleOtherSection' })
      return this.keepData
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
    margin-left: 3px;
  }
}

::v-deep.el-table .is_required .cell::after {
  content: "*";
  color: #f56c6c;
  margin-left: 4px;
}
</style>
