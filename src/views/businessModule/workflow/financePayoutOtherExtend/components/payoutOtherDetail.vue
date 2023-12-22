<template>
  <!-- 付款明细 -->
  <div class="priceDetail">
    <div class="bthGround">
      <el-button type="primary" size="mini" @click="handleAdd" icon="el-icon-plus">新增</el-button>
    </div>
    <el-table :data="tableData" :summary-method="getSummaries" :show-summary="true" style="width: 100%" size="small" fit class="f2bpmui-datagrid-vuetable">
      <el-table-column label="序号" type="index" width="50" :align="'center'"></el-table-column>
      <el-table-column label="摘要" :render-header="addRedStar">
        <template slot-scope="scope">
          <el-input v-model="scope.row.abstractRemark" size="small" placeholder="请输入" />
        </template>
      </el-table-column>
      <el-table-column label="收支项目" :render-header="addRedStar">
        <template slot-scope="scope">
          <el-select v-model="scope.row.revenueExpenseItem" placeholder="请选择" :disabled="isMainContract">
            <el-option v-for="(item,index) in revenueExpenseItemOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="applyAmount" label="本次申请金额(元)" :render-header="addRedStar">
        <template slot-scope="scope">
          <AmountInput v-model="scope.row.applyAmount" />
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
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import tools from '@/utils/fun.js';
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
  },
  data () {
    return {
      tableData: [],
      scoureData: [],
      balaTypeOptions: [],
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
  created() {
    this.getDataDictByConfigType()
  },
  methods: {
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
          this.$emit('updateApplyAmount',sums[index])
		     }
      });
      return sums;
    },
    /**
     * 初始化字典
     */
    async getDataDictByConfigType() {
      const res = await getDataDictByConfigType({ params: { configTypes: 
        '收支项目属性,结算方式' }})
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '收支项目属性':
              this.revenueExpenseItemOptions = ele.dataDict;
              break;
            case '结算方式':
              this.balaTypeOptions = ele.dataDict;
              break;
            default:
              break;
          }
        });
      }
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
        abstractRemark: '',
        revenueExpenseItem: '',
        settlementMethod: '',
        applyAmount: '',
        invoiceBillNo: ''
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
        abstractRemark: '摘要',
        revenueExpenseItem: '收支项目',
        settlementMethod: '结算方式',
        applyAmount: '次申请金额(元)',
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
            this.$message.error(`付款明细：第 ${_currentPage} 页，第 ${(parseInt(index) + 1)%_pageSize} 行 ${validObj[key]} 不能为空`)
            return false
          }
        }
      }
      return this.scoureData
    }
  }
};
</script>
