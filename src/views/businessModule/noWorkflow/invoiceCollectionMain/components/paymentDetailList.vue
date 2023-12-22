<template>
  <!-- 付款信息列表 -->
  <div class="detail-list">
    <el-form ref="subFrom" :model="subFormData">
      <div class="detail-list_btns">
        <el-button type="primary" size="mini" icon="el-icon-edit" @click="paymentExport">导出</el-button>
      </div>
      <el-table 
      :data="subFormData.detailList"
      style="width: 100%"
      show-summary
      :summary-method="getSummaries">
        <el-table-column type="selection" width="55" fixed="left"></el-table-column>
        <el-table-column prop="rowIndex" width="55" :align="alignCenter" label="序号" fixed="left">
          <template slot-scope="scope">
            <span>{{ scope.row.rowIndex }}</span>
          </template>
        </el-table-column>
        <el-table-column label="付款单据编号" prop="financePayoutMainCode" width="200" :align="alignCenter">
          <template slot-scope="scope">
            <select-dialog :disabled="true" :btnDisabled="getDisFiled('financePayoutMainCode')" :width="800" :modelData="goodClassifcaModel" :height="360" :value="scope.row.financePayoutMainCode" @updateValue="financePayoutMainCodeChange($event,scope.row)" dynamicModel="customDialog"></select-dialog>
          </template>
        </el-table-column>
        <el-table-column label="菜单名" prop="moduleType" :align="alignCenter" width="180">
          <template slot-scope="scope">
            <text-input v-model="scope.row.moduleType" :disabled="getDisFiled('moduleType')"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="项目编号" prop="constructArchiveMainCode" :align="alignCenter">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.constructArchiveMainCode" :disabled="getDisFiled('constructArchiveMainCode')"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="项目名称" prop="constructArchiveMainName" :align="alignCenter">
          <template slot-scope="scope">
            <text-input v-model="scope.row.constructArchiveMainName" :disabled="getDisFiled('constructArchiveMainName')"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="支出合同编号" prop="contractOutMainCode" :align="alignCenter">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.contractOutMainCode" :disabled="getDisFiled('contractOutMainCode')"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="支出合同名称" prop="contractOutMainName" :align="alignCenter">
          <template slot-scope="scope">
            <text-input v-model="scope.row.contractOutMainName" :disabled="getDisFiled('contractOutMainName')"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="本次申请金额(元)" prop="currApplicationAmount" :align="alignCenter">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.currApplicationAmount" :disabled="getDisFiled('currApplicationAmount')"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="退款金额(含税)(元)" prop="refundAmountTax" :align="alignCenter">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.refundAmountTax" :disabled="getDisFiled('refundAmountTax')"></amount-input>
          </template> 
        </el-table-column>
        <el-table-column label="单据状态" prop="procInstState" :align="alignCenter">
          <template slot-scope="scope">
            <el-input v-model="scope.row.procInstState" :disabled="getDisFiled('procInstState')"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="占用发票(元)" prop="invoiceOccupancyAmount" :align="alignCenter">
          <template slot-scope="scope">
            <el-input v-model="scope.row.invoiceOccupancyAmount" :disabled="getDisFiled('invoiceOccupancyAmount')"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <d3Pagination :sourceData="keepData" ref="d3Pagination" :page-size="pageData.pageSize" v-model="subFormData.detailList" />
    </el-form>
  </div>
</template>

<script>
import MyFun from '@/utils/fun';
import { GOODS_CLASSIFICATION, TAX_RATE_ARCHIVE_MODEL } from '@/views/businessModule/enum/param';
import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
import TextInput from '@/components/basic/elInput/textInput.vue';
import d3Pagination from "@/components/basic/pagination/index.vue";
import AmountInput from '@/components/basic/numberInput/amountInput.vue';
import { exportDataPaymentApi } from '@/Api/invoice/invoiceApplyApi';

/**
 * 付款信息列表
 */
export default {
  name: 'InvoiceDetailList',
  components: {
    SelectDialog,
    TextInput,
    AmountInput,
    d3Pagination
  },
  props: {
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
    mayApplyInvoiceAmountTaxMethod: {
      type: Function,
      default: null
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
      alignCenter: 'center',
      alignRight:'right',
      dataList: [],  //总的数组
      keepData: [],
      goodClassifcaModel: GOODS_CLASSIFICATION,  //商品服务分类
      disabledFiled: {
        'financePayoutMainCode': false, //付款单据编号	
        'constructArchiveMainCode': false,  //项目编号
        'constructArchiveMainName': false,//项目名称
        'contractOutMainCode': false,  //支出合同编号
        'contractOutMainName': false,  //支出合同名称
        'currApplicationAmount': false,  //本次申请金额(元)	
        'invoiceOccupancyAmount': false,  //占用发票(元)	
        'moduleType': false,  //	菜单名
        'refundAmountTax':false, //退款金额(含税)(元)
        'procInstState': false //单据状态
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
    //发票来源
    sourceInvoice(newVal) { 
      console.log("发票来源===：", newVal);  //1:录入  2：下载
      this.sourceInvoiceType = newVal;
      let status = (newVal === '2') ? true : false;
      //货物或应税劳务、服务名称;规格/型号;税率;单位;数量;单价(无税);金额(含税);税额;金额(无税) 当发票来源为下载时不可修改
      const arr = ['nameGoodsTaxableService', 'specification', 'taxRate', 'objectNumber', 'unitPriceUntax', 'amountTax', 'tax', 'amountUntax'];
      arr.forEach(filed => { 
        this.disabledFiled[filed] = status;
      })
      //根据发票来源判断子表字段
      this.sourceInvoiceJuadge(newVal);
    },
    //发票类型
    invoiceType(newVal) {},
    value: {
      handler:function(val) {
        if (val) { 
          this.keepData = val;
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
    //付款导出
    async paymentExport() {
      await exportDataPaymentApi();
    },
    sourceInvoiceJuadge(newVal) { 
      const _keepData = this.keepData;
      if (newVal === '1') {  //如果发票来源等于录入
        this.keepData.forEach(item => { 
          let amountTax = item.amountTax || 0;  //金额含税
          let num = item.objectNumber || 0;  //数量
          let taxRate = (item.taxRate && item.taxRate.indexOf("%")) ? item.taxRate.replace("%", '') : 0; //税率
          let taxRateNum = MyFun.getNumAdd(1, taxRate);  //1+税率
          //金额(无税) = 金额(含税)/(1+税率)
          item.amountUntax = MyFun.getTofixed(MyFun.getNumDiv(amountTax, taxRateNum).toString(), 2);  //保留两位小数
          //税额=金额(含税)-金额(无税)
          item.tax = MyFun.getNumSub(amountTax.toString(), item.amountUntax.toString());
          //单价(无税)=金额(无税)/数量  保留16位小数
          item.unitPriceUntax = MyFun.getNumDiv(item.amountUntax.toString(),num.toString(), 16);
        })
      }
    },
    judageString(num) {
      return (num !== null) ? num.toString() : '';
    },
    //付款单据编号
    financePayoutMainCodeChange(data, item) {
      console.log("付款单据编号===：", data, item);
    },
    validateForm() {
      // const validObj = {
      //   nameGoodsTaxableService: '货物或应税劳务、服务名称',
      //   taxRate: '税率',
      //   amountTax: '金额(含税)',
      //   amountUntax: '金额(无税)'
      // }
      // const _keepData = this.keepData
      // let _d3Pagination = this.$refs.d3Pagination
      // // //源数据当前页下标
      // let _pageSize = _d3Pagination.pageSize
      // for (let index in _keepData) {
      //   let _row = _keepData[index]
      // //   console.log(_row, 112)
      //   let _currentPage = parseInt((index + 1) / _pageSize) + 1
      //   for (let key in validObj) {
      //     if (!_row[key]) {
      //       this.$message.error(`第 ${_currentPage} 页，第 ${parseInt(index) + 1} 行 ${validObj[key]} 不能为空`)
      //       return false
      //     }
      //   }
      // }
      return this.keepData;
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
     //计算：注意计算顺序
     //金额(无税)=金额(含税)/(1+税率）
    //单价(无税)=金额(无税)/数量  
    //单价(含税)= 单价(无税)*（1+税率）
    //税额=金额(含税)-金额(无税)
    currentCalculateAmount(key) { 
      let obj = this.keepData.find(item => item.key === key);
      let taxRate = (obj.taxRate && obj.taxRate.indexOf("%")) ? obj.taxRate.replace("%", '') : 0; //税率
      let taxRateNum = MyFun.getNumAdd(1, taxRate);
      let amountTaxP = obj.amountTax || 0;  //金额(含税)
      let num = obj.objectNumber || 0; //数量 
      obj.amountUntax = MyFun.getTofixed(MyFun.getNumDiv(amountTaxP, taxRateNum).toString(), 2);//金额(无税) 金额(含税)/(1+税率）默认保留两位
      let amountUntax = obj.amountUntax || 0;  //金额(无税)
      obj.unitPriceUntax = (amountUntax && num) ? MyFun.getNumDiv(amountUntax.toString(), num.toString()).toString() : ''; //单价无税 相除  16位
      let unitPriceUntax = obj.unitPriceUntax || 0;
      obj.tax = MyFun.getTofixed(MyFun.getNumSub(amountTaxP.toString(), amountUntax.toString()).toString(), 2); //税额 2位
      // console.log("查看计算===：",this.keepData);
    },
    //合计
    getSummaries(param) { 
      // console.log("param", param);
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 2) { //第一列
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        //本次申请金额(元)
        let columArray = ['currApplicationAmount'];
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

// @import url('../../../style/form.scss');
// @import "../../../style/form.scss";

  // ::v-deep .el-form-item__content{
  //    width: 100%;
  // }

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