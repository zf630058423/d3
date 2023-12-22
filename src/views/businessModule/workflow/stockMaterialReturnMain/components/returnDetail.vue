<template>
  <div class="priceDetail">
    <div class="bthGround">
      <el-button type="primary" size="mini" @click="handleAdd" icon="el-icon-plus">新增</el-button>
      <el-button type="primary" size="mini" @click="exportFile" :disabled="scoureData.length<=0" icon="el-icon-edit">导出</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" size="small" fit class="f2bpmui-datagrid-vuetable" :summary-method="getSummaries" :show-summary="true">
      <el-table-column label="序号" type="index" width="50" :align="'center'"></el-table-column>
      <el-table-column label="名称" :render-header="addRedStar">
        <template slot-scope="scope">
          <custom-table-dialog :value="scope.row.fileName" :dialogParams="dialogParams"  @updateValue="updateStockMaterialValue($event,scope.row)" :btnDisabled="disabled"></custom-table-dialog>
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
      <el-table-column label="可用数量" :render-header="addRedStar">
        <template slot-scope="scope">
          <el-input v-model="scope.row.numberAvailable" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="退货数量" :render-header="addRedStar">
        <template slot-scope="scope">
          <number-input v-model="scope.row.returnsNumber" placeholder="请输入" />
        </template>
      </el-table-column>
      <el-table-column label="退货单价（含税）" :render-header="addRedStar">
        <template slot-scope="scope">
          <el-input v-model="scope.row.returnUnitPrice" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="退货单价（无税）">
        <template slot-scope="scope">
          <el-input v-model="scope.row.returnUnitPriceTaxFree" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="税率" :render-header="addRedStar">
        <template slot-scope="scope">
          <el-input v-model="scope.row.taxRate" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额（含税）">
        <template slot-scope="scope">
          <el-input v-model="scope.row.amount" size="small" placeholder="自动计算" disabled />
        </template>
      </el-table-column>
      <el-table-column prop="amountTaxFree" label="金额（无税）">
        <template slot-scope="scope">
          <el-input v-model="scope.row.amountTaxFree" size="small" placeholder="自动计算" disabled />
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
import { getStockReturnDetail } from '@/Api/workflowBusssion/stock.js';
import CustomTableDialog from '@/components/workflow/customDialog/customTableDialog.vue';
import tools from '@/utils/fun.js';
export default {
  name: "payinFromTab",
  components: { d3Pagination, selectorDialog, AmountInput, NumberInput, CustomTableDialog },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => { }
    },
    paramDetail: {
      type: Object,
      default: () => { return {} }
    },
  },
  data () {
    return {
      tableData: [],
      scoureData: [],
      stockMaterialDialog: { code: 'stock_material_main', customDialog: 'stock_material_main', isSetHead: 1, isMulti: false, initailData: [], parm: {varParams:[{key:'constructArchiveMainId',value:''}]}},
      id: '',
      dialogParams: {
        apiUrl: '/stock/stockMaterialReturnMain/getDetail', // 接口
        searchParams: [{
          property: 'fileName',
          label: '名称',
          value: '',
        },{
          property: 'constructArchiveMainId',
          value: '',
        },{
          property: 'contractSupplierId',
          value: '',
        },{
          property: 'purchaseContractId',
          value: '',
        }], // 请求参数
        isMulti: false, //是否多选
        columns: [
          {property:'fileName',label:'名称'},
          {property:'brand',label:'品牌'},
          {property:'specification',label:'规格/型号'},
          {property:'unit',label:'单位'}
        ], // 字段
      }
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
    paramDetail: {
      handler: function (val, old) {
        if(val) {
          this.dialogParams.searchParams[1].value = val.constructArchiveMainId
          if(val.returnType == 1) {
            this.dialogParams.searchParams[3].value = val.purchaseContractId
          } else if(val.returnType == 2){
            this.dialogParams.searchParams[2].value = val.contractSupplierId
          }
          this.scoureData = []
        }
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
        data.map(item => column.property?Number(item[column.property]):'');
          // 【金额（含税） 元】 =  退货数量*退货单价（含税）
          if(column.property === 'amount') {
            param.data.forEach(e=>{
              e.amount = tools.getTofixed(tools.getNumMulti(e.returnsNumber,e.returnUnitPrice),2)
            })
          }
          // 【金额（无税） 元】 =  金额（含税）元/1+税率
          if(column.property === 'amountTaxFree') {
            param.data.forEach(e=>{
              e.amountTaxFree = tools.getTofixed(tools.getNumDiv(e.amount,1+Number(e.taxRate)),2)
            })
          }
		      if (column.property === 'amount' || column.property === 'amountTaxFree') {
            const price = _this.tableData.reduce((prev, curr) => {
            const currValue = Number(curr[column.property]);
            if (!isNaN(currValue)) {
              return tools.getNumAdd(prev,currValue);
            } else {
              return prev;
            }
          },0)
					sums[index] = price
          // 【本次入库金额(含税)(元)】 入库信息页签 的 金额(含税)(元) 合计值
          if(column.property === 'amount' && sums[index]) _this.$emit('changeAmount', sums[index])
          if(column.property === 'amountTaxFree' && sums[index]) _this.$emit('changeAmountTaxFree', sums[index])
		     }
      });
      return sums;
    },
    /**
     * 选择材料明细
     * 当 退货类型=合同退货 ，材料控件可选值为：根据选择的“主合同编号”带出该合同下的所有材料（按名称+品牌+规格型号+单位+单价）
     * 当 退货类型=无合同退货，材料控件可选值为：根据选择的“项目编号”带出该项目下入库的所有材料（按名称+品牌+规格型号+单位+单价）
     * @param {*} data 
     * @param {*} row 
     */
    updateStockMaterialValue(data,row) {
      if(data && data.length<=0) return;
      const index = this.tableData.findIndex(res=>{return row.id == res.id});
      if(index == -1) return;
      let { fileName, brand, specification, unit, numberAvailable, returnUnitPrice, returnUnitPriceTaxFree, taxRate, amount, amountTaxFree } = data[0];
      this.$set(this.tableData[index],'fileName', fileName);
      this.$set(this.tableData[index],'brand', brand);
      this.$set(this.tableData[index],'specification', specification);
      this.$set(this.tableData[index],'unit', unit);
      this.$set(this.tableData[index],'numberAvailable', numberAvailable);
      this.$set(this.tableData[index],'returnUnitPrice', returnUnitPrice);
      this.$set(this.tableData[index],'returnUnitPriceTaxFree', returnUnitPriceTaxFree);
      this.$set(this.tableData[index],'taxRate', taxRate);
      this.$set(this.tableData[index],'amount', amount);
      this.$set(this.tableData[index],'amountTaxFree', amountTaxFree);
    },
    /**
     * 获取材料信息
     * 编制人必填，材料控件选择，显示名称
     * 当 退货类型=合同退货 ，材料控件可选值为：根据选择的“主合同编号”带出该合同下的所有材料（按名称+品牌+规格型号+单位+单价）
     * 当 退货类型=无合同退货，材料控件可选值为：根据选择的“项目编号”带出该项目下入库的所有材料（按名称+品牌+规格型号+单位+单价）
     * @param {*} index 
     */
    async getStockReturnDetail(data,index) {
      const params = {};
      if(this.paramDetail.returnType == 1) {
        params.purchaseContractId = data.id
        params.contractSupplierId = data.id
      } else if(this.paramDetail.returnType == 2){
        params.constructArchiveMainId = data.construct_archive_main_id
      }
      const res = await getStockReturnDetail(params);
      if(res.code == 200) {
        
      }
    },
    /**
    * 给表头加必填符号*
    */
    addRedStar(h, { column }) {
      const columnLabels = "名称，退货数量"
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
        numberAvailable: '',
        returnsNumber: '',
        returnUnitPrice: '',
        returnUnitPriceTaxFree: '',
        taxRate: '',
        amount: '',
        amountTaxFree: ''
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
        returnsNumber: '退货数量',
      }
      const _scoureData = this.scoureData
      let _d3Pagination = this.$refs.d3Pagination
      //源数据当前页下标
      let _pageSize = _d3Pagination.pageSize
      for (let index in _scoureData) {
        let _row = _scoureData[index]
        let _currentPage = parseInt((index + 1) / _pageSize) + 1
        for (let key in validObj) {
          if (!_row[key]) {
            this.$message.error(`退货信息：第 ${_currentPage} 页，第 ${parseInt(index) + 1} 行 ${validObj[key]} 不能为空`)
            return false
          }
        }
      }
      return this.scoureData
    }
  }
};
</script>
