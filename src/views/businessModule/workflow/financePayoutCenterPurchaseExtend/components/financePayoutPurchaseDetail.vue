<template>
  <!-- 付款明细 -->
  <div class="priceDetail">
    <div class="bthGround">
      <el-button type="primary" size="mini" @click="handleAdd" icon="el-icon-plus">新增</el-button>
      <el-button type="primary" size="mini" @click="exportFile" :disabled="scoureData.length<=0" icon="el-icon-edit">导出</el-button>
    </div>
    <el-table :summary-method="getSummaries" :show-summary="true" :data="tableData" style="width: 100%" size="small" fit class="f2bpmui-datagrid-vuetable">
      <el-table-column label="序号" type="index" width="50" :align="'center'"></el-table-column>
      <el-table-column label="项目编号" :render-header="addRedStar">
        <template slot-scope="scope">
          <selector-dialog :model-data="constructArchiveMainDialog" :value="scope.row.constructArchiveMainCode" dynamic-model="customDialog" 
            @updateValue="updateconstructArchiveMainValue($event,scope.$index)"></selector-dialog>
        </template>
      </el-table-column>
      <el-table-column label="项目名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.constructArchiveMainName" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column prop="applyAmount" label="本次申请金额（元）" :render-header="addRedStar">
        <template slot-scope="scope">
          <amount-input v-model="scope.row.applyAmount"></amount-input>
        </template>
      </el-table-column>
      <el-table-column label="说明">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" size="small" placeholder="请输入" />
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
    value: {
      type: Array,
      default: () => { }
    },
    // 【purchaseContractId】合同编号【storageType】 1,合同入库 2,无合同入库 3,甲供材
    invoiceParams: {
      type: Object,
      default: () => { return {} }
    },
  },
  data () {
    return {
      tableData: [],
      scoureData: [],
      constructArchiveMainDialog: { code: 'XiangMuDangAnYinXingDangAn_CP146', customDialog: 'XiangMuDangAnYinXingDangAn_CP146', isSetHead: 1, isMulti: false, initailData: [] },
      id: '',
      applyAmount: ''
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
    invoiceParams: {
      handler: function (obj, old) {
        // if(obj.storageType == 1 && obj.purchaseContractId && obj.dateDeliveryNote) {
        //   this.getStockInDetails(obj.purchaseContractId, obj.dateDeliveryNote);
        // } else {
        //   this.scoureData = [];
        // }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    /**
     * 项目档案更新
     */
    updateconstructArchiveMainValue(data){
      if(data && data.length <= 0) return ;
      let {id, code, name} = data[0];
      let _scoureData = this.scoureData //源数据
      let _d3Pagination = this.$refs.d3Pagination
      //源数据当前页下标
      let _sourceIndex = (_d3Pagination.currentPage - 1) * _d3Pagination.pageSize + index
      this.$set(_scoureData[index],'constructArchiveMainId',id)
      this.$set(_scoureData[index],'constructArchiveMainCode',code)
      this.$set(_scoureData[index],'constructArchiveMainName',name)
    },
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
        data.map(item => Number(item[column.property]));
		     if (column.property === 'applyAmount') {
          const price = _this.tableData.reduce((prev, curr) => {
            const currValue = Number(curr[column.property]);
            if (!isNaN(currValue)) {
              return tools.getNumAdd(prev,currValue);
            } else {
              return prev;
            }
          },0)
					sums[index] = tools.getTofixed(price,2)
          _this.applyAmount = sums[index]
		     }
      });
      return sums;
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
        constructArchiveMainId: '',
        constructArchiveMainCode: '',
        constructArchiveMainName: '',
        applyAmount: '',
        remark: ''
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
      // if (_scoureData.length === 1) {
      //   this.$message.info("至少保留一条数据");
      //   return false;
      // }
      _scoureData.splice(_sourceIndex, 1)
    },
    validateForm () {
      const validObj = {
        constructArchiveMainCode: '项目编号',
        applyAmount: '本次申请金额（元）'
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
            this.$message.error(`付款明细信息：第 ${_currentPage} 页，第 ${(parseInt(index) + 1)%_pageSize} 行 ${validObj[key]} 不能为空`)
            return false
          }
        }
        }
      return this.scoureData
    }
  }
};
</script>
