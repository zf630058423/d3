<template>
  <!-- 送货信息 -->
  <div class="priceDetail">
    <div class="bthGround">
      <el-button type="primary" size="mini" @click="exportFile" :disabled="scoureData.length<=0" icon="el-icon-edit">导出</el-button>
      <el-button type="primary" size="mini" @click="exportFile" :disabled="scoureData.length<=0" icon="el-icon-edit">导入</el-button>
    </div>
    <el-table :summary-method="getSummaries" :show-summary="true" :data="tableData" style="width: 100%" size="small" fit class="f2bpmui-datagrid-vuetable">
      <el-table-column label="序号" type="index" width="50" :align="'center'"></el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.fileName" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="品牌">
        <template slot-scope="scope">
          <el-input v-model="scope.row.brand" size="small" placeholder="自动带出" disabled />
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
      <el-table-column label="合同单价(含税)">
        <template slot-scope="scope">
          <el-input v-model="scope.row.unitPrice" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="税率(%)">
        <template slot-scope="scope">
          <el-input v-model="scope.row.taxRate" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="合同单价(无税)">
        <template slot-scope="scope">
          <el-input v-model="scope.row.unitPriceTaxFree" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="待送货数量">
        <template slot-scope="scope">
          <el-input v-model="scope.row.canDeliveredQuantity" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="送货数量" :render-header="addRedStar">
        <template slot-scope="scope">
          <amount-input v-model="scope.row.deliveredQuantity"></amount-input>
        </template>
      </el-table-column>
      <el-table-column label="确认送货数量" :render-header="addRedStar">
        <template slot-scope="scope">
          <amount-input v-model="scope.row.confirmDeliveryQuantity"></amount-input>
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
  },
  data () {
    return {
      tableData: [],
      scoureData: [],
      // 集采对账单控件 = 待选值为所选集采供应商的【集采对账单】数据，且对账未付金额为0的数据需要过滤掉
      reconcileBillMainDialog: { code: 'invoice_collection_main', customDialog: 'invoice_collection_main', isSetHead: 1, isMulti: false, initailData: [] },
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
  },
  methods: {
    isEditConfirmDeliveryQuantity(){
      // if(!WFContext.JumpToTaskId) return true;
      return false;
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
        data.map(item =>  column.property?Number(item[column.property]):'');
		     if (column.property === 'deliveredQuantity' || column.property === 'ConfirmDeliveryQuantity') {
          const price = _this.tableData.reduce((prev, curr) => {
            const currValue = Number(curr[column.property]);
            if (!isNaN(currValue)) {
              return tools.getNumAdd(prev,currValue);
            } else {
              return prev;
            }
          },0)
					sums[index] = tools.getTofixed(price,2)
		     }
      });
      return sums;
    },
   
    /**
    * 给表头加必填符号*
    */
    addRedStar(h, { column }) {
      if(column.label == '确认送货数量' && !WFContext.JumpToTaskId) {
        return h("span", " " + column.label);
      };
      return [
        h("span", " " + column.label),
        h("span", { style: "color: red" }, "*")
      ];
    },
    handleAdd () {
      let _scoureData = this.scoureData
      const obj = {
        id: new Date().getTime() + '_'+ Math.round(Math.random() * 100000) || "",
        reconcileBillMainCode: '',
        constructArchiveMainCode: '',
        constructArchiveMainName: '',
        reconcileBillMainId: '',
        estimatedPaymentDate: '',
        createTime: '',
        reconcilingUnpaidAmount: ''
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
        deliveredQuantity: '送货数量'
      }
      if(!this.isEditConfirmDeliveryQuantity()) {
        validObj['confirmDeliveryQuantity'] = '确认送货数量'
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
            this.$message.error(`送货信息：第 ${_currentPage} 页，第 ${(parseInt(index) + 1)%_pageSize} 行 ${validObj[key]} 不能为空`)
            return false
          }
        }
      }
      return this.scoureData
    }
  }
};
</script>

<style scoped>
.bthGround {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
</style>
