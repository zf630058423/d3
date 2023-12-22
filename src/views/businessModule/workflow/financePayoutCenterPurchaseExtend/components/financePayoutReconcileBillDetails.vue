<template>
  <!-- 对账单 -->
  <div class="priceDetail">
    <div class="bthGround">
      <el-button type="primary" size="mini" @click="handleAdd" icon="el-icon-plus">新增</el-button>
      <el-button type="primary" size="mini" @click="exportFile" :disabled="scoureData.length<=0" icon="el-icon-edit">导出</el-button>
    </div>
    <el-table :summary-method="getSummaries" :show-summary="true" :data="tableData" style="width: 100%" size="small" fit class="f2bpmui-datagrid-vuetable">
      <el-table-column label="序号" type="index" width="50" :align="'center'"></el-table-column>
      <el-table-column label="单据编号" :render-header="addRedStar">
        <template slot-scope="scope">
          <selector-dialog :model-data="reconcileBillMainDialog" :value="scope.row.reconcileBillMainCode" dynamic-model="customDialog" 
            @updateValue="updateReconcileBillMainValue($event,scope.$index)"></selector-dialog>
        </template>
      </el-table-column>
      <el-table-column label="项目编号">
        <template slot-scope="scope">
          <el-input v-model="scope.row.constructArchiveMainCode" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="项目名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.constructArchiveMainName" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="集采订单">
        <template slot-scope="scope">
          <el-input v-model="scope.row.reconcileBillMainId" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="预计付款日期">
        <template slot-scope="scope">
          <el-input v-model="scope.row.estimatedPaymentDate" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="编制日期">
        <template slot-scope="scope">
          <el-input v-model="scope.row.reconcileBillCreateTime" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="对账未付金额(元)">
        <template slot-scope="scope">
          <el-input v-model="scope.row.reconcilingUnpaidAmount" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column prop="applyAmount" label="本次申请金额（元）" :render-header="addRedStar">
        <template slot-scope="scope">
          <amount-input v-model="scope.row.applyAmount"></amount-input>
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
    tockParams: {
      type: Object,
      default: () => { return {} }
    },
  },
  data () {
    return {
      tableData: [],
      scoureData: [],
      // 集采对账单控件 = 待选值为所选集采供应商的【集采对账单】数据，且对账未付金额为0的数据需要过滤掉
      reconcileBillMainDialog: { code: 'v_finance_purchase_reconcile_bill', customDialog: 'v_finance_purchase_reconcile_bill', isSetHead: 1, isMulti: false, initailData: [] },
      id: '',
      applyAmount: 0
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
    tockParams: {
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
     * 单据编号切换
     */
    updateReconcileBillMainValue(data,index){
      if(data && data.length <= 0) return ;
      let _scoureData = this.scoureData //源数据
      let _d3Pagination = this.$refs.d3Pagination
      //源数据当前页下标
      let _sourceIndex = (_d3Pagination.currentPage - 1) * _d3Pagination.pageSize + index
      let {id,code,constructArchiveMainCode,constructArchiveMainId,constructArchiveMainName,
        contractOutMainCode,contractOutMainId,createTime,estimatedPaymentDate,reconcilingUnpaidAmount} = data[0]
      this.$set(_scoureData[_sourceIndex],'reconcileBillMainId',id)
      this.$set(_scoureData[_sourceIndex],'reconcileBillMainCode',code)
      this.$set(_scoureData[_sourceIndex],'constructArchiveMainCode',constructArchiveMainCode)
      this.$set(_scoureData[_sourceIndex],'constructArchiveMainId',constructArchiveMainId)
      this.$set(_scoureData[_sourceIndex],'constructArchiveMainName',constructArchiveMainName)
      this.$set(_scoureData[_sourceIndex],'contractOutMainCode',contractOutMainCode)
      this.$set(_scoureData[_sourceIndex],'contractOutMainId',contractOutMainId)
      this.$set(_scoureData[_sourceIndex],'estimatedPaymentDate',createTime)
      this.$set(_scoureData[_sourceIndex],'reconcileBillCreateTime',estimatedPaymentDate)
      this.$set(_scoureData[_sourceIndex],'reconcilingUnpaidAmount',reconcilingUnpaidAmount)
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
        id: "",
        reconcileBillMainId: '',
        reconcileBillMainCode: '',
        constructArchiveMainCode: '',
        constructArchiveMainId: '',
        constructArchiveMainName: '',
        contractOutMainCode: '',
        contractOutMainId: '',
        estimatedPaymentDate: '',
        reconcileBillCreateTime: '',
        reconcilingUnpaidAmount: '',
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
        reconcileBillMainCode: '单据编号',
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
