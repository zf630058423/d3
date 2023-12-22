<template>
  <!-- 税款信息 -->
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
        <el-table-column label="预征栏目" prop="hadColumns" width="200" :align="alignCenter">
          <template slot-scope="scope">
           <text-input v-model="scope.row.hadColumns" :disabled="getDisFiled('hadColumns')"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="税基(元)" prop="taxBase" :align="alignCenter" width="180">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.taxBase" :disabled="getDisFiled('taxBase')"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="扣除金额" prop="deductAmount" :align="alignCenter" width="150">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.deductAmount" :disabled="getDisFiled('deductAmount')"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="预征率%" prop="taxRate" :align="alignCenter" width="150">
          <template slot-scope="scope">
             <select-dialog :disabled="true" :btnDisabled="getDisFiled('taxRate')" :width="800" :modelData="taxRateModel" :height="360" :value="scope.row.taxRate" dynamicModel="customDialog"></select-dialog>
          </template>
        </el-table-column>
        <el-table-column label="应预缴税额" prop="taxDueAdvance" :align="alignCenter">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.taxDueAdvance" :disabled="getDisFiled('actualAdvanceTax')"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="实际预缴税额" prop="actualAdvanceTax" :align="alignCenter">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.actualAdvanceTax" :disabled="getDisFiled('actualAdvanceTax')"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="单据编号" prop="voucherCode" :align="alignCenter">
          <template slot-scope="scope">
            <text-input v-model="scope.row.voucherCode" :disabled="getDisFiled('voucherCode')"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operate" fixed="right" v-if="!readOnly" :align="alignCenter" width="110">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <d3Pagination v-if="keepData.length" :sourceData="keepData" ref="d3Pagination" :page-size="pageData.pageSize" layout="->,total, sizes, prev, pager, next" v-model="subFormData.detailList" />
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
        'hadColumns': false, //预征栏目
        'taxBase': false,  //税基(元)
        'deductAmount': false,//扣除金额
        'taxRate': false,  //预征率%
        'actualAdvanceTax': false,  //实际预缴税额
        'voucherCode': true,  //单据编号
      },
      sourceInvoiceType: '', //根据发票来源判断子表字段的计算
      pageData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
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
            taxRate: item.taxRate ? this.judageString(MyFun.getFixed(item.taxRate * 100, 2)) + '%' : '',  //税率
            taxBase: this.judageString(item.taxBase),  //应预缴税额
            deductAmount: this.judageString(item.deductAmount),  //扣除金额
            taxDueAdvance: this.judageString(item.taxDueAdvance), //应预缴税额
            actualAdvanceTax: this.judageString(item.actualAdvanceTax) //实际预缴税额
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
    }
  },
  methods: {
    judageString(num) {
      return (num !== null && num !== '') ? num.toString() : '';
    },
    handleDelete(index, item) {
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
    delRow() {
      if (this.selectRows.length === 0) {
        this.$message({
          message: '请选择一条数据',
          type: 'warning'
        });
        return;
      }
      this.selectRows.forEach(item => {
        this.keepData = MyFun.removeByKey(this.keepData, 'key', item.key);
      })
      this.$nextTick(() => {
        this.keepData = this.regSortList(this.keepData);
      })
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
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 4) { //第一列
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        //应预缴税额，实际预缴税额
        let columArray = ['taxDueAdvance','actualAdvanceTax'];
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
        //实际预警税额合计
        if (column.property === 'actualAdvanceTax') {
          this.$emit('actualAdvanceChange', sums[index]);
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
// @import url('../../../style/form.scss');
// @import "../../../style/form.scss";

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