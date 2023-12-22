<template>
  <div class="priceDetail">
    <div class="bthGround">
      <el-button type="primary" size="mini" @click="handleAdd" icon="el-icon-plus">新增</el-button>
      <el-button type="primary" size="mini" @click="importFile" icon="el-icon-edit-outline">导入</el-button>
      <el-button type="primary" size="mini" @click="exportFile" icon="el-icon-edit" :disabled="tableData.length<=0">导出</el-button>
    </div>
    <el-table :data="tableData" size="small" fit class="f2bpmui-datagrid-vuetable" border>
      <el-table-column label="名称" :render-header="addRedStar">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" size="small" placeholder="请输入" />
        </template>
      </el-table-column>
      <el-table-column label="品牌" :render-header="addRedStar">
        <template slot-scope="scope">
          <el-input v-model="scope.row.brand" size="small" placeholder="请输入" />
        </template>
      </el-table-column>
      <el-table-column label="规格/型号" :render-header="addRedStar">
        <template slot-scope="scope">
          <el-input v-model="scope.row.specification" size="small" placeholder="请输入" />
        </template>
      </el-table-column>
      <el-table-column label="税率(%)" :render-header="addRedStar">
        <template slot-scope="scope">
          <selector-dialog :model-data="taxRateDialog" :value="scope.row.taxRate" dynamic-model="customDialog" @updateValue="updateTaxRateValue($event,scope.row,scope.$index)"></selector-dialog>
        </template>
      </el-table-column>
      <el-table-column label="单位" :render-header="addRedStar">
        <template slot-scope="scope">
          <el-input v-model="scope.row.unit" size="small" placeholder="请输入" />
        </template>
      </el-table-column>
      <el-table-column label="数量" :render-header="addRedStar">
        <template slot-scope="scope">
          <number-input v-model="scope.row.quantity"></number-input>
        </template>
      </el-table-column>
      <el-table-column label="单价（含税）" :render-header="addRedStar">
        <template slot-scope="scope">
          <amount-input v-model="scope.row.unitPriceTax"></amount-input>
        </template>
      </el-table-column>
      <el-table-column label="单价（无税）">
        <template slot-scope="scope">
          <el-input :value="getUnitPriceTaxFree(scope.row)" size="small" disabled placeholder="自动计算" />
        </template>
      </el-table-column>
      <el-table-column label="金额(含税)">
        <template slot-scope="scope">
          <el-input :value="getAmountTax(scope.row)" size="small" disabled placeholder="自动计算" />
        </template>
      </el-table-column>
      <el-table-column label="税额">
        <template slot-scope="scope">
          <el-input :value="getTaxPayable(scope.row)" size="small" disabled placeholder="自动计算" />
        </template>
      </el-table-column>
      <el-table-column label="金额(无税)">
        <template slot-scope="scope">
          <el-input :value="getAmountTaxFree(scope.row)" size="small" disabled placeholder="自动计算" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80px">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <d3Pagination :sourceData="scoureData" ref="d3Pagination" v-model="tableData" />
    <uploader-details :visible.sync="importData.visible" :keyword="importData.key"
     :uploaderUrl="importData.url" @importSuccess="importSuccess"></uploader-details>
  </div>
</template>

<script>
import d3Pagination from "@/components/basic/pagination/index.vue";
import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
import amountInput from '@/components/basic/numberInput/amountInput.vue';
import numberInput from '@/components/basic/numberInput/index.vue';
import tools from '@/utils/fun.js';
import UploaderDetails from '@/components/basic/importTemplateDialog/uploaderDetails.vue';
import { exportDataDetails } from '@/Api/workflowBusssion/index.js'
export default {
  name: "payinFromTab",
  components: { d3Pagination, selectorDialog,amountInput,numberInput, UploaderDetails },
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
      importData: {
        visible: false,
        url: '/construct/contractOutPurchaseExtend/importDetail',
        key:'purchaseDetail'
      },
      taxRateDialog: { code: 'base_tax_rate_archive', customDialog: 'base_tax_rate_archive', isSetHead: 1, isMulti: false, initailData: [] },
      tableData: [],
      scoureData: [],
      rules: {
      },
    };
  },
  watch: {
    value: {
      handler: function (val) {
        this.scoureData = val;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    /**
     * 单价（无税）不可编辑，系统计算=单价(含税)/(1+税率)，4位小数位
     */
    getUnitPriceTaxFree(row){
      const index = this.tableData.findIndex(res=>{return row.id == res.id})
      if(index == -1) return;
      const { unitPriceTax, taxRate } = this.tableData[index];
      let unitPriceTaxFree = '';
      if(!taxRate) {
        unitPriceTaxFree = '';
      } else {
        unitPriceTaxFree = tools.getNumDiv(unitPriceTax,tools.getNumAdd(1,taxRate))
        unitPriceTaxFree = tools.getTofixed(unitPriceTaxFree,4);
      }
      this.$set(this.tableData[index],'unitPriceTaxFree', unitPriceTaxFree)
      return unitPriceTaxFree;
    },
    /**
     * 金额(含税) 系统计算=单价(含税)*数量 ，保留2位小数位，不可修改；
     */
    getAmountTax(row) {
      const index = this.tableData.findIndex(res=>{return row.id == res.id})
      if(index == -1) return;
      const { unitPriceTax, quantity } = this.tableData[index];
      let amountTax = tools.getNumMulti(unitPriceTax,quantity)
      amountTax = tools.getTofixed(amountTax,2);
      this.$set(this.tableData[index],'amountTax', amountTax)
      return amountTax;
    },
    /**
     * 税额 不可编辑，系统计算=金额(含税)- 金额(无税)
     */
    getTaxPayable(row){
      const index = this.tableData.findIndex(res=>{return row.id == res.id})
      if(index == -1) return;
      const { amountTax, amountTaxFree } = this.tableData[index];
      let taxPayable = tools.getNumSub(amountTax,amountTaxFree)
      this.$set(this.tableData[index],'taxPayable', taxPayable)
      return taxPayable;
    },
    /**
     *  金额(无税) 系统计算 =金额(含税)/(1+税率)，保留2位小数位，编制人可修改
     */
    getAmountTaxFree(row){
      const index = this.tableData.findIndex(res=>{return row.id == res.id})
      if(index == -1) return;
      const { amountTax, taxRate } = this.tableData[index];
      let amountTaxFree = '';
      if(!taxRate) {
        amountTaxFree = '';
      } else {
        amountTaxFree = tools.getNumDiv(amountTax,tools.getNumAdd(1,taxRate))
        amountTaxFree = tools.getTofixed(amountTaxFree,2);
      }
      this.$set(this.tableData[index],'amountTaxFree', amountTaxFree)
      return amountTaxFree;
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
    /**
     * 税率
     */
    updateTaxRateValue(data,row,sIndex) {
      if (data.length <= 0) return;
      const index = this.tableData.findIndex(res=>{return row.id == res.id})
      if(index == -1) return;
      this.$set(this.tableData[index],'taxRateId', data[0].id)
      this.$set(this.tableData[index],'taxRateName', data[0].name)
      this.$set(this.tableData[index],'taxRate', data[0].taxRate)

      this.$set(this.scoureData[sIndex],'taxRateId', data[0].id)
      this.$set(this.scoureData[sIndex],'taxRateName', data[0].name)
      this.$set(this.scoureData[sIndex],'taxRate', data[0].taxRate)

    },
    handleAdd () {
      let _scoureData = this.scoureData
      let obj = {
        id: '',
        amountTax: '',
        amountTaxFree: '',
        contractOutId: '',
        id: '',
        name: '',
        brand: '',
        quantity: '',
        specification: '',
        taxPayable: '',
        taxRate: '',
        taxRateiD: '',
        unit: '',
        unitPriceTax: '',
        unitPriceTaxFree: '',
      };
      obj.id = new Date().getTime() + '_'+ Math.round(Math.random() * 100000);
      _scoureData.push(obj)
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
    /**
     * 导出
     */
    async exportFile() {
      await exportDataDetails('/construct/contractOutPurchaseExtend/exportDetail',this.scoureData)
    },
     /**
      * 导入
      */
    importFile() {
      this.importData.visible = true;
    },
    /**
     * 导入成功
     */
    importSuccess(data) { 
      const list = (data && data.length > 0) ? data.map((item,index) => ({
        ...item,
        id: new Date().getTime() + '_'+ Math.round(Math.random() * 100000)
      })) : [];
      this.scoureData.push(...list)
      this.importData.visible = false;
    },
    validateForm () {
      const validObj = {
        name: '名称',
        brand: '品牌',
        specification: '规格/型号',
        taxRate: '税率(%)',
        unit: '单位',
        quantity: '数量',
        unitPriceTax: '单价（含税）',
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
            this.$message.error(`调价明细信息：第 ${_currentPage} 页，第 ${(parseInt(index) + 1)%_pageSize} 行 ${validObj[key]} 不能为空`)
            return false
          }
        }
      }
      const list =new Set(this.scoureData.map(
        item=>item.name+item.brand+item.specification+item.taxRate+item.unit)).size;
      if(this.scoureData.length>list){
        this.$message.error('同一表单内 名称+品牌+税率+规格/型号+单位 不能重复')
        return false;
      }
      return this.scoureData
    }
  }
};
</script>

<style scoped>
::v-deep.el-table .is_required .cell::after {
  content: "*";
  color: #f56c6c;
  margin-left: 4px;
}
</style>
