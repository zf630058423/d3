<template>
  <!-- 发票信息采集 -->
  <div class="priceDetail">
    <div class="bthGround">
      <el-button type="primary" size="mini" @click="handleAdd" icon="el-icon-plus">新增</el-button>
      <el-button type="primary" size="mini" @click="importFile" icon="el-icon-edit">导入</el-button>
      <el-form>
        <el-button type="primary" size="mini" @click="exportFile" :disabled="rowId?false:true" icon="el-icon-edit">导出</el-button>
      </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%" size="small" fit class="f2bpmui-datagrid-vuetable">
      <el-table-column label="序号" type="index" width="50" :align="'center'"></el-table-column>
      <el-table-column prop="invoiceNo" label="发票号码" :render-header="addRedStar">
        <template slot-scope="scope">
          <custom-table-dialog :value="scope.row.invoiceNo" :dialogParams="dialogParams"
            @updateValue="updateInvoiceValue($event,scope.$index)" :btnDisabled="disabled"></custom-table-dialog>
        </template>
      </el-table-column>
      <el-table-column label="发票代码">
        <template slot-scope="scope">
          <el-input v-model="scope.row.invoiceCode" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="开票日期">
        <template slot-scope="scope">
          <el-input v-model="scope.row.invoiceCreateTime" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="发票类型">
        <template slot-scope="scope">
          <el-input v-model="scope.row.invoiceType" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="销售方名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.sellerName" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="发票金额(含税)">
        <template slot-scope="scope">
          <el-input v-model="scope.row.invoiceAmountTax" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="税额">
        <template slot-scope="scope">
          <el-input v-model="scope.row.tax" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="发票金额(无税)">
        <template slot-scope="scope">
          <el-input v-model="scope.row.invoiceAmountUntax" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="占用发票(元)">
        <template slot-scope="scope">
          <el-input v-model="scope.row.invoiceOccupancyAmount" size="small" placeholder="自动带出" disabled />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80px">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleDelete(scope.$index)">删除</el-button>
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
import AmountInput from '@/components/basic/numberInput/amountInput.vue';
import NumberInput from '@/components/basic/numberInput/index.vue';
import UploaderDetails from '@/components/basic/importTemplateDialog/uploaderDetails.vue';
import CustomTableDialog from '@/components/workflow/customDialog/customTableDialog.vue';
export default {
  name: "payinFromTab",
  components: { d3Pagination, selectorDialog, AmountInput, NumberInput, UploaderDetails, CustomTableDialog },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => []
    },
    invoiceParams: {
      type: Object,
      default: () => { }
    },
  },
  data () {
    return {
      tableData: [],
      scoureData: [],
      importData: {
        visible: false,
        url: '/finance/financePayoutRelateInvoiceDetail/importData',
        key:'financePayoutRelateInvoiceDetail'
      },
      id: '',
      dialogParams: {
        apiUrl: '/finance/financePayoutRelateInvoiceDetail/queryFinancePayoutInvoiceControl', // 接口
        searchParams: [{
          property: 'buyerName', // 	购方名称
          label: '购方名称', 
          value: null,
        },{
          property: 'sellerName', // 销售方名称
          label: '销售方名称',
          value: null,
        },{
          property: 'constructArchiveMainId', // 项目 - id(项目档案表 - construct_archive_main)
          value: null,
        },{
          property: 'contractOutMainId', // 合同 - id(支出类合同主表 - contract_out_main)	
          value: null,
        },{
          property: 'invoiceNo', // 发票号码
          value: null,
        },{
          property: 'moduleType', // 模块类型(1-劳务付款；2-专业分包付款；3-材料付款；4-租赁付款；5-其他付款；6-项目费用报销；7-员工费用报销；8-集采付款；)
          value: null, 
        },{
          
        }], // 请求参数
        isMulti: false, //是否多选
        columns: [
          {property:'buyerName',label:'购方名称'},
          {property:'sellerName',label:'销售方名称'},
          {property:'invoiceNo',label:'发票号码'},
          {property:'invoiceCode',label:'发票代码'}
        ], // 字段
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
    },
    invoiceParams: {
      handler: function (val, old) {
        for (let key in val) {
          const index = this.dialogParams.searchParams.findIndex(res=>{
            return key == res.property
          })
          if(index!= -1) this.dialogParams.searchParams[index].value = val[key]||"";
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    rowId() {
      return this.$route.query.rowId;
    }
  },
  methods: {
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
        id: item.invoiceCollectionMainId
      })) : [];
      this.scoureData.push(...list)
      this.importData.visible = false;
    },
    /**
     * 选择发票后得数据
     * @param {*} data 
     * @param {*} row 
     */
    updateInvoiceValue(data, index) {
      if(data && data.length<=0) return;
      let _scoureData = this.scoureData //源数据
      let _d3Pagination = this.$refs.d3Pagination
      let _sourceIndex = (_d3Pagination.currentPage - 1) * _d3Pagination.pageSize + index
      if(!_sourceIndex) return;
      this.$set(_scoureData,_sourceIndex,data[0])
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
        buyerName: '',
        invoiceAmountTax: '',
        invoiceAmountUntax: '',
        invoiceCode: '',
        invoiceCreateTime: '',
        invoiceNo: '',
        invoiceType: '',
        residueApprovePaymentAmountTax: '',
        sellerName: '',
        tax: ''
      };
      _scoureData.push(obj)
    },
    exportFile() {
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
        invoiceNo: '发票号码',
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
            this.$message.error(`关联发票：第 ${_currentPage} 页，第 ${(parseInt(index) + 1)%_pageSize} 行 ${validObj[key]} 不能为空`)
            return false
          }
        }
      }
      return this.scoureData
    }
  }
};
</script>
