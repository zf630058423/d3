<template>
  <!-- 关联费用预提单 -->
  <div class="priceDetail">
    <div class="bthGround">
      <el-button type="primary" size="mini" @click="handleAdd" icon="el-icon-plus">新增</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" size="small" fit class="f2bpmui-datagrid-vuetable">
      <el-table-column label="序号" type="index" width="50" :align="'center'"></el-table-column>
      <el-table-column label="单据编号" :render-header="addRedStar">
        <template slot-scope="scope">
          <selector-dialog :model-data="relateExpenseDialog" :value="scope.row.invoiceExtractExpenseCode"
            dynamic-model="customDialog" @updateValue="updateRelateExpenseValue($event,scope.$index)" :btnDisabled="disabled"></selector-dialog>
        </template>
      </el-table-column>
      <el-table-column label="预提项目编号">
        <template slot-scope="scope">
          <el-input v-model="scope.row.constructCode" disabled size="small" placeholder="自动带出" />
        </template>
      </el-table-column>
      <el-table-column label="预提项目名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.constructName" disabled size="small" placeholder="自动带出" />
        </template>
      </el-table-column>
      <el-table-column label="预提总金额(元)">
        <template slot-scope="scope">
          <el-input v-model="scope.row.sumAmount" disabled size="small" placeholder="自动带出" />
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
  name: "relateExpenseDetail",
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
  },
  data () {
    return {
      tableData: [],
      scoureData: [],
      balaTypeOptions: [],
      relateExpenseDialog: {code: 'v_finance_payout_relate_expense', customDialog: 'v_finance_payout_relate_expense', isSetHead: 1, isMulti: false, initailData: [] },
      revenueExpenseItemOptions: []
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
  },
  methods: {
    /**
     * 关联费用预提单
     */
    updateRelateExpenseValue(data, index){
      if(data && data.length <= 0) return;
      let _scoureData = this.scoureData //源数据
      let _d3Pagination = this.$refs.d3Pagination
      let _sourceIndex = (_d3Pagination.currentPage - 1) * _d3Pagination.pageSize + index
      const fieldNameList = ['constructCode','constructName','invoiceExtractExpenseCode','invoiceExtractExpenseMainId','sumAmount']
      fieldNameList.forEach(e=>{
        this.$set(_scoureData[_sourceIndex],e,data[0][e])
      })
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
      let obj = {
        id: "",
        constructCode: '',
        constructName: '',
        invoiceExtractExpenseCode: '',
        invoiceExtractExpenseMainId: '',
        sumAmount: ''
      };
      obj.id =  new Date().getTime() + '_'+ Math.round(Math.random() * 100000);
      _scoureData.push(obj)
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
        invoiceExtractExpenseCode: '单据编号'
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
            this.$message.error(`关联费用预提单：第 ${_currentPage} 页，第 ${(parseInt(index) + 1)%_pageSize} 行 ${validObj[key]} 不能为空`)
            return false
          }
        }
      }
      return this.scoureData
    }
  }
};
</script>
