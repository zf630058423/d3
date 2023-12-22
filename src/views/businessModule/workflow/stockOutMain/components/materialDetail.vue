<template>
  <div class="priceDetail">
    <div class="bthGround">
      <el-button type="primary" size="mini" @click="handleAdd" icon="el-icon-plus">新增</el-button>
      <el-button type="primary" size="mini" @click="exportFile" :disabled="scoureData.length<=0" icon="el-icon-edit">导出</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" size="small" fit class="f2bpmui-datagrid-vuetable">
      <el-table-column label="序号" type="index" width="50" :align="'center'"></el-table-column>
      <el-table-column label="名称" :render-header="addRedStar">
        <template slot-scope="scope">
          <selector-dialog :model-data="stockMaterialDialog" :value="scope.row.fileName" dynamic-model="customDialog" @updateValue="updateStockMaterialValue($event,scope.row)"></selector-dialog>
        </template>
      </el-table-column>
      <el-table-column label="品牌" :render-header="addRedStar">
        <template slot-scope="scope">
          <el-input v-model="scope.row.brand" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="规格/型号" :render-header="addRedStar">
        <template slot-scope="scope">
          <el-input v-model="scope.row.specification" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="单位" :render-header="addRedStar">
        <template slot-scope="scope">
          <el-input v-model="scope.row.unit" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="库存数量" :render-header="addRedStar">
        <template slot-scope="scope">
          <el-input v-model="scope.row.inventoryQuantity" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="出库数量" :render-header="addRedStar">
        <template slot-scope="scope">
          <number-input v-model="scope.row.outboundQuantity" placeholder="请输入" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80px">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleDelete(scope.$index)">删除</el-button>
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
import NumberInput from '@/components/basic/numberInput/index.vue';
export default {
  name: "payinFromTab",
  components: { d3Pagination, selectorDialog, AmountInput, NumberInput },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => { }
    },
    constructArchiveMainId: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      tableData: [],
      scoureData: [],
      stockMaterialDialog: { code: 'stock_material_main', customDialog: 'stock_material_main', isSetHead: 1, isMulti: false, initailData: [], parm: {varParams:[{key:'constructArchiveMainId',value:''}]}},
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
    constructArchiveMainId: {
      handler: function (val, old) {
        this.stockMaterialDialog.parm.varParams[0].value = val || 'null';
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    /**
     * 选择材料明细
     * @param {*} data 
     * @param {*} row 
     */
    updateStockMaterialValue(data,row) {
      if(data && data.length<=0) return;
      const { brand, specification, unit, name, stock_quantity} = data[0];
      const index = this.tableData.findIndex(res=>{return row.id == res.id});
      if(index == -1) return;
      this.$set(this.tableData[index],'brand', brand);
      this.$set(this.tableData[index],'specification', specification);
      this.$set(this.tableData[index],'unit', unit);
      this.$set(this.tableData[index],'fileName', name);
      this.$set(this.tableData[index],'inventoryQuantity', stock_quantity);
    },
    /**
    * 给表头加必填符号*
    */
    addRedStar(h, { column }) {
      const columnLabels = "名称，出库数量"
      if(columnLabels.indexOf(column.label) == -1) {
        return h("span", " " + column.label);
      }
      return [
        h("span", " " + column.label),
        h("span", { style: "color: red" }, "*")
      ];
    },
    handleAdd () {
      let _scoureData = this.scoureData
      const obj = {
        id: new Date().getTime() + '_'+ Math.round(Math.random() * 100000) || "",
        fileName: '',
        brand: '',
        specification: '',
        unit: '',
        inventoryQuantity: '',
        outboundQuantity: ''
      };
      _scoureData.push(obj)
    },
    exportFile() {
      this.$emit('exportFile')
    },
    handleDelete (index) {
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
        outboundQuantity: '出库数量',
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
            this.$message.error(`入库信息：第 ${_currentPage} 页，第 ${(parseInt(index) + 1)%_pageSize} 行 ${validObj[key]} 不能为空`)
            return false
          }
        }
      }
      return this.scoureData
    }
  }
};
</script>
