<template>
  <!-- 发票明细 -->
  <div class="detail-list">
    <el-form ref="subFrom" :model="subFormData">
      <el-table 
      :data="subFormData.detailList"
      style="width: 100%"
      class="table-form"
      show-summary
      :summary-method="getSummaries">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="rowIndex" width="55" :align="alignCenter" label="序号">
          <template slot-scope="scope">
            <span>{{ scope.row.rowIndex }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发票号码" prop="invoiceNo" width="200" :align="alignCenter">
          <template slot-scope="scope">
           <text-input v-model="scope.row.invoiceNo" :disabled="getDisFiled('invoiceNo')"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="发票代码" prop="invoiceCode" :align="alignCenter" width="180">
          <template slot-scope="scope">
            <text-input v-model="scope.row.invoiceCode" :disabled="getDisFiled('invoiceCode')"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="购方名称" prop="buyerName" :align="alignCenter" width="150">
          <template slot-scope="scope">
            <text-input v-model="scope.row.buyerName" :disabled="getDisFiled('buyerName')"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="发票类型" prop="invoiceType" :align="alignCenter" width="150">
          <template slot-scope="scope">
            <!-- <text-input v-model="scope.row.invoiceType" :disabled="getDisFiled('invoiceType')"></text-input> -->
            <el-select v-model="scope.row.invoiceType" placeholder="请输入" :disabled="getDisFiled('invoiceStatus')">
              <el-option :label="item.configName" :value="item.configValue" :key="item.configValue" v-for="item in invoiceTypeArray">{{ item.configName }}</el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="发票金额(含税)" prop="invoiceAmountTax" :align="alignCenter">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.invoiceAmountTax" :disabled="getDisFiled('invoiceAmountTax')"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="税额" prop="tax" :align="alignCenter">
          <template slot-scope="scope">
            <!-- 保留16小数 -->
            <amount-input v-model="scope.row.tax" :decimalNum="16" :disabled="getDisFiled('tax')"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="发票金额(无税)" prop="invoiceAmountUntax" :align="alignCenter">
          <template slot-scope="scope">
            <!-- 保留两位小数 -->
            <amount-input v-model="scope.row.invoiceAmountUntax" :disabled="getDisFiled('invoiceAmountUntax')" :decimalNum="2" @change="amountTaxAmount($event, scope.row)"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="开票日期" prop="invoiceCreateTime" :align="alignCenter">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.invoiceCreateTime"
              type="datetime"
              :disabled="getDisFiled('invoiceCreateTime')"
              placeholder="选择日期时间">
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="发票状态" prop="invoiceStatus" :align="alignCenter">
          <template slot-scope="scope">
            <el-select v-model="scope.row.invoiceStatus" placeholder="请输入" :disabled="getDisFiled('invoiceStatus')">
              <el-option :label="item.configName" :value="item.configValue" :key="item.configValue" v-for="item in invoiceStatusArray">{{ item.configName }}</el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operate" fixed="right" width="140" :align="alignCenter">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleHref(scope.$index, scope.row)">链接</el-button>
            <el-button size="small" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <d3Pagination v-if="keepData.length" :sourceData="keepData" ref="d3Pagination" layout="->,total, sizes, prev, pager, next" :page-size="pageData.pageSize" v-model="subFormData.detailList" />
    </el-form>
  </div>
</template>

<script>
import MyFun from '@/utils/fun';
import { TAX_RATE_ARCHIVE_MODEL } from '@/views/businessModule/enum/param';
import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
import TextInput from '@/components/basic/elInput/textInput.vue';
import d3Pagination from "@/components/basic/pagination/index.vue";
import AmountInput from '@/components/basic/numberInput/amountInput.vue';
import UploaderDetails from '@/components/basic/importTemplateDialog/uploaderDetails.vue';

/**
 * 开票申请， 审批明细列表
 */
export default {
  name: 'InvoiceDetailList',
  components: {
    SelectDialog,
    TextInput,
    AmountInput,
    d3Pagination,
    UploaderDetails
  },
  props: {
    rowData: {
      type: Object,
      default: () => { }
    },
    //发票来源
    sourceInvoice: {
      type: String,
      default: ''
    },
    //发票类型
    invoiceType: {
      type: String,
      default: ''
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => []
    },
    ppData: {
      type: Array,
      default: () => []
    },
    //主表的id
    id: {
      type: String,
      default: ''
    }
  },
  data() { 
    return {
      subFormData: {
        detailList: []
      },
      selectRows:[],
      alignCenter: 'center',
      alignRight:'right',
      dataList: [],  //总的数组
      dataListCopy:[], //深拷贝后的数组
      keepData: [],
      taxRateModel: TAX_RATE_ARCHIVE_MODEL,  //税率
      disabledFiled: {
        'invoiceNo': false, //发票号码
        'invoiceCode': false,  //发票代码
        'buyerName': false,//购方名称
        'invoiceType': false,  //发票类型
        'invoiceAmountTax': false,  //发票金额
        'tax': true,  //税额	
        'invoiceAmountUntax': false,  //发票金额(无税)
        'invoiceCreateTime': true,  //开票日期
        'invoiceStatus': true //发票状态
      },
      sourceInvoiceType: '', //根据发票来源判断子表字段的计算
      pageData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      invoiceStatusArray: [],  //发票状态
      invoiceTypeArray:[],  //发票类型
    }
  },
  computed: {
    getDisFiled() {
      return (field) => {
        return this.disabledFiled[field] ? this.disabledFiled[field] : false;
      }
     }
  },
  watch: {
    value: {
      handler:function(val) {
        if (val) { 
          this.keepData = (val && val.length > 0) ? val.map((item,index) => ({
            ...item,
            rowIndex: (index + 1),
            invoiceAmountTax: this.judageString(item.invoiceAmountTax),
            invoiceAmountUntax: this.judageString(item.invoiceAmountUntax),
            tax: this.judageString(item.tax)
            // amountUntax: this.judageString(item.amountUntax)
          })) : [];
          if (this.readOnly) {
            Object.keys(this.disabledFiled).forEach(key => { 
              this.disabledFiled[key] = true;
            })
          }
        }
      },
      deep: true,
      immediate: true
    },
    ppData: {
      handler: function (val) {
        if (val) {
          this.invoiceStatusArray = val.find(item => item.dataDictType === '发票状态')?.dataDict || [];
          this.invoiceTypeArray = val.find(item => item.dataDictType === '发票类型')?.dataDict || [];
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
    },
    judageString(num) {
      return (num !== null && num !== '') ? num.toString() : '';
    },
    handleDelete(index, item) {
      // this.keepData = MyFun.removeByKey(this.keepData, 'key', item.key);
      let _keepData = this.keepData //源数据
      let _d3Pagination = this.$refs.d3Pagination;
      //源数据当前页下标
      let _sourceIndex = (_d3Pagination.currentPage - 1) * _d3Pagination.pageSize + index
      if (_keepData.length === 1) {
        this.$message.info("至少保留一条数据");
        return false;
      }
      _keepData.splice(_sourceIndex, 1);
      //  this.keepData = MyFun.removeByKey(this.keepData, 'key', item.key);
      this.$nextTick(() => {
        this.keepData = this.regSortList(_keepData);
      })
    },

    //链接
    handleHref(index, item) {
      alert(10);
     },
    
    //默认第一页
    selectPage(e) {
      const { dataList } = this;
      this.pageData.pageNum = e;  //当前页
      let _dataList = this.regSortList(dataList);
      this.keepData = _dataList.filter((item, index) => ((e - 1) * 10) <= index && index < (e * 10));
    },
    //重新排序
    regSortList(arr) {
      return arr.length ? arr.map((item, index) => ({
        ...item,
        rowIndex: (index + 1)
      })) : [];
    },
    //合计
    getSummaries(param) { 
      // console.log("param", param);
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 4) { //第一列
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        //发票金额(含税)、税额、发票金额(无税)
        let columArray = ['invoiceAmountTax','tax','invoiceAmountUntax'];
        if (columArray.includes(column.property)) {
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += "";
          } else {
            sums[index] = "";
          }
        } else { 
          sums[index] = "";
        }
        //发票金额含税合计
        if (column.property === 'invoiceAmountTax') {
          this.$emit('invoiceAmountChange', sums[index]);
        }
      });
      const total = sums.map(n => (n && MyFun.isNumber(n)) ? MyFun.getTofixed(n, 2) : n);
      return total;
    },
    getDataList() {
      return this.keepData;
     }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/views/businessModule/style/form.scss";
// @import "~@/views/businessModule/style/searchForm.scss";

.detail-list{

  &_btns{
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
}

 //调整表头高度
  ::v-deep .el-table__header tr,
  .el-table__header th {
    padding: 0;
    height: 35px;
    font-size: 12px;
  }
  //调整表格高度
  ::v-deep .el-table__body tr,
  .el-table__body td {
    padding: 0;
    height: 35px;
    font-size: 12px;
  }

  ::v-deep .el-table .el-table__cell{
    padding:  4px 0;
  }

   .wf-box-section-title{
     height: 30px;
     line-height: 30px;
  }

  .pagination-el{
    margin: 8px 0;
  }
</style>