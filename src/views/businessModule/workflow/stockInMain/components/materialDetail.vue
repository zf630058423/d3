<template>
  <div class="priceDetail">
    <div class="bthGround">
      <el-button v-if="storageType != 1 && storageType" type="primary" size="mini" @click="handleAdd" icon="el-icon-plus">新增</el-button>
      <el-button type="primary" size="mini" @click="exportFile" :disabled="scoureData.length<=0" icon="el-icon-edit">导出</el-button>
    </div>
    <el-table :summary-method="getSummaries" :show-summary="true" :data="tableData" style="width: 100%" size="small" fit class="f2bpmui-datagrid-vuetable">
      <el-table-column label="序号" type="index" width="50" :align="'center'"></el-table-column>
      <el-table-column label="名称" :render-header="addRedStar">
        <template slot-scope="scope">
          <el-input v-model="scope.row.fileName" size="small" placeholder="请输入" :disabled="storageType == 1"/>
        </template>
      </el-table-column>
      <el-table-column label="品牌" :render-header="addRedStar">
        <template slot-scope="scope">
          <el-input v-model="scope.row.brand" size="small" placeholder="自动带出" :disabled="storageType == 1"/>
        </template>
      </el-table-column>
      <el-table-column label="规格/型号" :render-header="addRedStar">
        <template slot-scope="scope">
          <el-input v-model="scope.row.specification" size="small" placeholder="自动带出" :disabled="storageType == 1" />
        </template>
      </el-table-column>
      <el-table-column label="单位" :render-header="addRedStar">
        <template slot-scope="scope">
          <el-input v-model="scope.row.unit" size="small" placeholder="自动带出" :disabled="storageType == 1" />
        </template>
      </el-table-column>
      <el-table-column label="入库数量" :render-header="addRedStar">
        <template slot-scope="scope">
          <multipleDecimalsInput v-model="scope.row.inventoryQuantity" size="small" :decimalNum="4"
           @change="changeTableFiledValue($event,scope.row,'inventoryQuantity')"/>
        </template>
      </el-table-column>
      <el-table-column label="可入库数量">
        <template slot-scope="scope">
          <el-input v-model="scope.row.quantityAvailableStorage" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="单价（含税）" :render-header="addRedStar">
        <template slot-scope="scope">
          <multipleDecimalsInput  v-if="storageType==2" v-model="scope.row.contractUnitPriceTax" size="small"
            :decimalNum="4" @change="changeTableFiledValue($event,scope.row,'contractUnitPriceTax')"/>
          <multipleDecimalsInput v-else v-model="scope.row.contractUnitPriceTax" size="small" placeholder="自动带出" disabled :decimalNum="4"/>
        </template>
      </el-table-column>
      <el-table-column label="税率" :render-header="addRedStar">
        <template slot-scope="scope">
          <selector-dialog v-if="storageType==2" :model-data="taxRateDialog" :value="scope.row.taxRate" dynamic-model="customDialog" @updateValue="updateTaxRateValue($event,scope.row)"></selector-dialog>
          <el-input v-else v-model="scope.row.taxRate" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="单价（无税）">
        <template slot-scope="scope">
          <multipleDecimalsInput v-model="scope.row.contractUnitPriceTaxFree" size="small" placeholder="自动计算" disabled :decimalNum="4"/>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额（含税）">
        <template slot-scope="scope">
          <amount-input v-model="scope.row.amount" placeholder="自动带出" disabled></amount-input>
        </template>
      </el-table-column>
      <el-table-column prop="amountTaxFree" label="金额（无税）">
        <template slot-scope="scope">
          <amount-input v-if="storageType==2" v-model="scope.row.amountTaxFree"
            @change="changeTableFiledValue($event,scope.row,'amountTaxFree')"></amount-input>
          <multipleDecimalsInput v-else v-model="scope.row.amountTaxFree" placeholder="自动带出" disabled :decimalNum="2"></multipleDecimalsInput>
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
import multipleDecimalsInput from '@/components/basic/numberInput/multipleDecimalsInput.vue';
import { getStockInDetails } from '@/Api/workflowBusssion/stock.js'
import tools from '@/utils/fun.js';
export default {
  name: "payinFromTab",
  components: { d3Pagination, selectorDialog, AmountInput, NumberInput, multipleDecimalsInput },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => { }
    },
    rowId: {
      type: String,
      default: ''
    },
    storageType: {
      type: String,
      default: ''
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
      taxRateDialog: { code: 'base_tax_rate_archive', customDialog: 'base_tax_rate_archive', isSetHead: 1, isMulti: false, initailData: [] },
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
    tockParams: {
      handler: function (obj, old) {
        if(obj.storageType == 1 && obj.purchaseContractId && obj.dateDeliveryNote) {
          this.getStockInDetails(obj.purchaseContractId, obj.dateDeliveryNote);
        } else {
          this.scoureData = [];
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
        data.map(item => Number(item[column.property]));
		     if (column.property === 'amount' || column.property === 'amountTaxFree') {
          const price = _this.tableData.reduce((prev, curr) => {
            const currValue = Number(curr[column.property]);
            if (!isNaN(currValue)) {
              return tools.getNumAdd(prev,currValue);
            } else {
              return prev;
            }
          },0)
					sums[index] = tools.getTofixed(price,2)
          // 【本次入库金额(含税)(元)】 入库信息页签 的 金额(含税)(元) 合计值
          if(column.property === 'amount' && sums[index]) _this.$emit('changeAmount', sums[index])
          if(column.property === 'amountTaxFree' && sums[index]) _this.$emit('changeAmountTaxFree', sums[index])
		     }
      });
      return sums;
    },
    /**
     * 获取入库信息
     * 当 入库类型=合同入库，根据所选的【采购合同】带出该合同的还未全部入库的材料信息，不允许增行，可删行
     */
    async getStockInDetails(purchaseContractId, dateDeliveryNote) {
      const res = await getStockInDetails({id:this.rowId, contractOutMainId: purchaseContractId, dateDeliveryNote: dateDeliveryNote });
      if(res.code == 200){
        // 【金额(含税)(元)】当 入库类型=合同入库，根据 所选 合同信息页签 的 单价(含税) 带出，不可修改；
        // 【金额(无税)(元)】当 入库类型=合同入库，根据 所选 合同信息页签 的 单价(无税) 带出，不可修改；
        res.data.forEach(e=>{
          // 【单价(无税)(元)】 = 单价(含税)/(1+税率)
          e.contractUnitPriceTaxFree = tools.getNumDiv(e.contractUnitPriceTax||0,(1+Number(e.taxRate)))
          // 【金额(含税)(元)】
          e.amount = e.contractUnitPriceTax
          // 【金额(无税)(元)】
          e.amountTaxFree = e.contractUnitPriceTaxFree
        })
        this.scoureData = res.data;
      }
    },
    /**
     * 更新表格字段值
     */
    changeTableFiledValue(val, row, filedName){
      const index = this.tableData.findIndex(res=>{return row.id == res.id})
      this.$set(this.tableData[index],filedName, val)
      this.updateMaterialDetail(row,index);
    },
    /**
     * 税率
     * @param {*} data 
     */
    updateTaxRateValue(data,row) {
      if (data && data.length <= 0) return;
      const { taxRate } = data[0];
      this.changeTableFiledValue(taxRate,row,'taxRate');
    },
    updateMaterialDetail(row,index) {
      if(index == -1) return;
      //【单价(无税)(元)】 系统计算=单价(含税)/(1+税率)，4位小数位(小数位后是0的不显示)
      let taxRate = tools.getNumDiv(row.contractUnitPriceTax,1+Number(row.taxRate));
      this.$set(this.tableData[index],'contractUnitPriceTaxFree', Object.formatMultipleNumber(taxRate,4));

      //【金额(含税)(元)】 系统计算=单价(含税)*数量 ，2位小数位，不可修改
      let amount = tools.getNumMulti(row.contractUnitPriceTax,Number(row.inventoryQuantity));
      this.$set(this.tableData[index],'amount', tools.getTofixed(amount,2))

      //【金额(无税)(元)】 系统计算=金额(含税)/(1+税率)，2位小数位，编制人可修改；
      let amountTaxFree = tools.getNumDiv(amount,1+Number(row.taxRate));
      this.$set(this.tableData[index],'amountTaxFree', Object.formatMultipleNumber(amountTaxFree,4))
      this.$forceUpdate()
    },
    /**
    * 给表头加必填符号*
    * 【storageType】1,合同入库 2,无合同入库 3,甲供材
    * 
    * 【名称，品牌，规格/型号，单位，入库数量】
    * 当 入库类型=合同入库，根据 所选 合同信息页签 带出，不可修改；当 入库类型=无合同入库 或 甲供材，则编制人必填，文本框
    * 
    * 【单价(含税)(元)】
    * 当 入库类型=合同入库
    * 1）根据 所选合同编号及送货单日期自动带出合同的各项材料的实时 单价(含税) ，不可修改；
    * 当 入库类型=无合同入库，则编制人必填，数值，4位小数位(小数位后是0的不显示)；
    * 当 入库类型=甲供材，非必填，不可编辑
    * 
    * 【税率】
    * 当 入库类型=合同入库，根据 所选 合同信息页签 的 税率 带出，不可修改；
    * 当 入库类型=无合同入库，则编制人必填，【税率】选择控件，显示税种名称
    * 当 入库类型=甲供材，非必填，不可编辑
    */
    addRedStar(h, { column }) {
      const columnLabels = "名称，品牌，规格/型号，单位"
      if(columnLabels.indexOf(column.label) != -1 && this.storageType == 1) {
        return h("span", " " + column.label);
      } else if(column.label == '单价（含税）' && this.storageType != 2) {
        return h("span", " " + column.label);
      } else if(column.label == '税率' && this.storageType != 2) {
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
        quantityAvailableStorage: '',
        taxRate: '',
        amount: '',
        amountTaxFree: '',
        contractUnitPriceTax: '',
        contractUnitPriceTaxFree: '',
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
    validateForm (storageType) {
      const validObj = {
        fileName: '名称',
        brand: '品牌',
        specification: '规格/型号',
        unit: '单位',
        inventoryQuantity: '入库数量',
      }
      // 【价(含税)(元)，税率】当 入库类型=无合同入库，则编制人必填
      if(storageType == 2) {
        validObj['contractUnitPriceTax'] = '单价（含税）'
        validObj['taxRate'] = '税率'
      }
      
      const _scoureData = this.scoureData
      let _d3Pagination = this.$refs.d3Pagination
      //源数据当前页下标
      let _pageSize = _d3Pagination.pageSize
      for (let index in _scoureData) {
        let _row = _scoureData[index]
        let _currentPage = parseInt((Number(index) + 1) / _pageSize) + 1
        // 【入库数量】 入库类型=合同入库 提交时校验：入库数量 ≤可入库数量；
        if(storageType==1 && Number(_row.inventoryQuantity) > Number(_row.quantityAvailableStorage)) {
          FUI.Window.showMsg('入库数量必须≤可入库数量')
          return false;
        }
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
