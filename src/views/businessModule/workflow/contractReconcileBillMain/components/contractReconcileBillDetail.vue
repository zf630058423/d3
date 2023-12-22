<template>
  <!-- 对账材料入库单 -->
  <div class="priceDetail">
    <div class="bthGround">
      <el-button type="primary" size="mini" @click="handleAdd" icon="el-icon-plus">新增</el-button>
    </div>
    <el-table :summary-method="getSummaries" :show-summary="true" :data="tableData" style="width: 100%" size="small" fit class="f2bpmui-datagrid-vuetable">
      <el-table-column label="序号" type="index" width="50" :align="'center'"></el-table-column>
      <el-table-column label="入库单号" :render-header="addRedStar">
        <template slot-scope="scope">
          <selector-dialog :model-data="stockInMainDialog" :value="scope.row.stockInMainCode"
            dynamic-model="customDialog" @updateValue="updateStockInMainValue($event,scope.$index)"></selector-dialog>
        </template>
      </el-table-column>
      <el-table-column label="送货单日期">
        <template slot-scope="scope">
          <el-input v-model="scope.row.dateDeliveryNote" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="入库日期">
        <template slot-scope="scope">
          <el-input v-model="scope.row.warehousingDate" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="入库金额(含税)">
        <template slot-scope="scope">
          <el-input v-model="scope.row.amountThisTimeTax" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="本次对账金额(含税)" prop="reconcilingAmount" :render-header="addRedStar">
        <template slot-scope="scope">
          <amount-input v-model="scope.row.reconcilingAmount"></amount-input>
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
import tools from '@/utils/fun.js';
export default {
  name: "payinFromTab",
  components: { d3Pagination, selectorDialog, AmountInput },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    contractOutMainId: {
      type: String,
      default: ''
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
      // 集采对账单控件 = 待选值为所选集采供应商的【集采对账单】数据，且对账未付金额为0的数据需要过滤掉
      stockInMainDialog: { code: 'RuKuDanZhuBiao', customDialog: 'RuKuDanZhuBiao',
       isSetHead: 1, isMulti: false, initailData: [], parm: {varParams:[{key:'purchaseContractId',value:null}]} },
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
    contractOutMainId: {
      handler: function (val) {
        this.stockInMainDialog.parm.varParams[0].value = val||null;
      },
      deep: true,
      immediate: true
    }
  },
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
        data.map(item => column.property?Number(item[column.property]):'')
		     if (column.property === 'reconcilingAmount') {
          const price = _this.tableData.reduce((prev, curr) => {
            const currValue = Number(curr[column.property]);
            if (!isNaN(currValue)) {
              return tools.getNumAdd(prev,currValue);
            } else {
              return prev;
            }
          },0)
					sums[index] = tools.getTofixed(price,2)
          if(sums[index]) this.$emit('getTotalReconcilingAmount', sums[index])
		     }
      });
      return sums;
    },
    updateStockInMainValue(data,index){
      if(data && data.length <= 0) return;
      const {dateDeliveryNote,amountThisTimeTax,createTime,id,code} = data[0];
      this.$set(this.scoureData[index],'stockInMainCode',code);
      this.$set(this.scoureData[index],'dateDeliveryNote',dateDeliveryNote);
      this.$set(this.scoureData[index],'warehousingDate',createTime);
      this.$set(this.scoureData[index],'amountThisTimeTax',amountThisTimeTax);
      this.$set(this.scoureData[index],'stockInMainId',id);
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
        stockInMainId: '',
        stockInMainCode: '',
        dateDeliveryNote: '',
        warehousingDate: '',
        amountThisTimeTax: '',
        reconcilingAmount: ''
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
      _scoureData.splice(_sourceIndex, 1)
    },
    validateForm () {
      const validObj = {
        stockInMainCode: '入库单号',
        reconcilingAmount: '本次对账金额(含税)'
      }
      const _scoureData = this.scoureData
      let _d3Pagination = this.$refs.d3Pagination
      //源数据当前页下标
      let _pageSize = _d3Pagination.pageSize
      for (let index in _scoureData) {
        let _row = _scoureData[index]
        let _currentPage = parseInt((Number(index) + 1) / _pageSize) + 1
        for (let key in validObj) {
          if(_row.amountThisTimeTax < _row.reconcilingAmount) {
            this.$message.error(`入库单：第 ${_currentPage} 页，第 ${(parseInt(index) + 1)%_pageSize} 行 ${validObj[key]} 本次对账金额(含税)不能大于入库金额(含税)`)
            return false
          }
          if (!_row[key]) {
            this.$message.error(`入库单：第 ${_currentPage} 页，第 ${(parseInt(index) + 1)%_pageSize} 行 ${validObj[key]} 不能为空`)
            return false
          }
        }
      }
      return this.scoureData
    }
  }
};
</script>
