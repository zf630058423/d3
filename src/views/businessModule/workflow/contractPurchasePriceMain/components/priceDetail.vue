<template>
  <div class="priceDetail">
    <div class="bthGround">
      <el-button type="primary" size="mini" @click="handleAdd" icon="el-icon-plus">新增</el-button>
      <el-button type="primary" size="mini" @click="exportFile" :disabled="scoureData.length<=0" icon="el-icon-edit">导出</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" size="small" fit class="f2bpmui-datagrid-vuetable">
      <el-table-column label="序号" type="index" width="50" :align="'center'"></el-table-column>
      <el-table-column prop="fileName" label="名称" :render-header="addRedStar">
        <template slot-scope="scope">
          <selector-dialog :btnDisabled="disabled" :dataId="scope.row.id" :model-data="purchasePriceDialog" :value="scope.row.fileName" dynamic-model="customDialog" @updateValue="updateFileName($event,scope.row,scope.$index)"></selector-dialog>
        </template>
      </el-table-column>
      <el-table-column label="品牌">
        <template slot-scope="scope">
          <el-input v-model="scope.row.brand" size="small" placeholder="自动带出" disabled/>
        </template>
      </el-table-column>
      <el-table-column label="规格/型号">
        <template slot-scope="scope">
          <el-input v-model="scope.row.specification" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="单位">
        <template slot-scope="scope">
          <el-input v-model="scope.row.unit" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="税率">
        <template slot-scope="scope">
          <el-input v-model="scope.row.taxRate" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="调前单价（含税）">
        <template slot-scope="scope">
          <el-input v-model="scope.row.unitPriceAdjustment" size="small" placeholder="自动带出"  disabled/>
        </template>
      </el-table-column>
      <el-table-column label="调前单价（无税）">
        <template slot-scope="scope">
          <el-input v-model="scope.row.unitPriceAdjustmentTaxFree" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="调后单价（含税）" :render-header="addRedStar">
        <template slot-scope="scope">
          <MultipleDecimalsInput :disabled="disabled" v-model="scope.row.adjustedUnitPrice" :decimalNum="16"></MultipleDecimalsInput>
        </template>
      </el-table-column>
      <el-table-column label="调后单价（无税）">
        <template slot-scope="scope">
          <el-input :value="getAdjustedUnitPriceTaxFree(scope.row)" size="small" placeholder="自动带出"  disabled/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80px">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <d3Pagination :sourceData="scoureData" ref="d3Pagination" v-model="tableData" />
  </div>
</template>

<script>
import d3Pagination from "@/components/basic/pagination/index.vue";
import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
import AmountInput from '@/components/basic/numberInput/amountInput.vue';
import MultipleDecimalsInput from '@/components/basic/numberInput/multipleDecimalsInput.vue';
import tools from "@/utils/fun.js"
export default {
  name: "payinFromTab",
  components: { d3Pagination, selectorDialog, AmountInput, MultipleDecimalsInput },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => { }
    },
    purchaseContractId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tableData: [],
      scoureData: [],
      rules: {
      },
      purchasePriceDialog: { code: 'v_contract_out_purchase_price', customDialog: 'v_contract_out_purchase_price', isSetHead: 1, isMulti: false, initailData: [], parm: {varParams:[{key:'id',value:''}]} },
      id: ''
    };
  },
  watch: {
    value: {
      handler: function (val) {
        this.scoureData = val;
      },
      deep: true,
      immediate: true
    },
    purchaseContractId: {
      handler: function (val) {
        if(val) {
          this.purchasePriceDialog.parm.varParams[0].value = val;
        } else {
          this.purchasePriceDialog.parm.varParams[0].value = 'null';
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    /**
     * 获取调后单价（无税）
     */
    getAdjustedUnitPriceTaxFree(row){
      return tools.getTofixed(tools.getNumDiv(row.adjustedUnitPrice||0,tools.getNumAdd(1,row.taxRate||0)),2);
    },
    /**
     * 调价明细信息
     * @param {*} data 
     */
    updateFileName(data,row,pIndex) {
      if (data && data.length <= 0) return;
      const { id, name, brand, specification, unit, taxRate, taxRateId,
        unitPriceTax, unitPriceTaxFree, amountTax, amountTaxFree } = data[0];
      const index = this.tableData.findIndex(res=>{return row.id == res.id})
      if(index == -1) return;
      this.$set(this.tableData[index],'fileNameId', id)
      this.$set(this.tableData[index],'fileName', name)
      this.$set(this.tableData[index],'brand', brand)
      this.$set(this.tableData[index],'specification', specification)
      this.$set(this.tableData[index],'unit', unit)
      this.$set(this.tableData[index],'taxRate', taxRate)
      this.$set(this.tableData[index],'taxRateId', taxRateId)
      this.$set(this.tableData[index],'unitPriceAdjustment', unitPriceTax)
      this.$set(this.tableData[index],'unitPriceAdjustmentTaxFree', unitPriceTaxFree)
      // this.$set(this.tableData[index],'adjustedUnitPrice', amountTax)
      this.$set(this.tableData[index],'adjustedUnitPriceTaxFree', amountTaxFree)

      // this.$set(this.scoureData[pIndex],'fileNameId', id)
      // this.$set(this.scoureData[pIndex],'fileName', name)
      // this.$set(this.scoureData[pIndex],'brand', brand)
      // this.$set(this.scoureData[pIndex],'specification', specification)
      // this.$set(this.scoureData[pIndex],'unit', unit)
      // this.$set(this.scoureData[pIndex],'taxRate', taxRate)
      // this.$set(this.scoureData[pIndex],'taxRateId', taxRateId)
      // this.$set(this.scoureData[pIndex],'unitPriceAdjustment', unitPriceTax)
      // this.$set(this.scoureData[pIndex],'unitPriceAdjustmentTaxFree', unitPriceTaxFree)
      // this.$set(this.scoureData[pIndex],'adjustedUnitPrice', amountTax)
      // this.$set(this.scoureData[pIndex],'adjustedUnitPriceTaxFree', amountTaxFree)
      this.$forceUpdate()
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
    handleAdd () {
      let _scoureData = this.scoureData
      const obj = {
        id: new Date().getTime() + '_'+ Math.round(Math.random() * 100000) || "",
        adjustedUnitPrice: '',
        adjustedUnitPriceTaxFree: '',
        brand: '',
        fileName: '',
        specification: '',
        taxRate: '',
        unit: '',
        unitPriceAdjustment: '',
        unitPriceAdjustmentTaxFree: '',
      };
      _scoureData.unshift(obj)
    },
    exportFile() {
      this.$emit('exportFile')
    },
    handleDelete (index, row) {
      let _scoureData = this.scoureData //源数据
      let _d3Pagination = this.$refs.d3Pagination
      //源数据当前页下标
      let _sourceIndex = (_d3Pagination.currentPage - 1) * _d3Pagination.pageSize + index
      if (_scoureData.length === 1) {
        this.$message.info("至少保留一条数据");
        return false;
      }
      _scoureData.splice(_sourceIndex, 1)
    },
    validateForm () {
      const validObj = {
        fileName: '名称',
        adjustedUnitPrice: '调后单价（含税）',
      }
      const _scoureData = this.scoureData
      let _d3Pagination = this.$refs.d3Pagination
      //源数据当前页下标
      let _pageSize = _d3Pagination.pageSize
      for (let index in _scoureData) {
        let _row = _scoureData[index]
        let _currentPage = parseInt((Number(index) + 1) / _pageSize) + 1
        for (let key in validObj) {
          if (!_row[key]) {
            debugger
            this.$message.error(`调价明细信息：第 ${_currentPage} 页，第 ${(parseInt(index) + 1)%_pageSize} 行 ${validObj[key]} 不能为空`)
            return false
          }
        }
      }
      return this.scoureData
    }
  }
};
</script>
