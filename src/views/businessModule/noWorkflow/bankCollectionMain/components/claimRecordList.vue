<template>
  <div class="detail-list">
    <el-form ref="subFrom" :model="subFormData" :rules="rules">
      <el-table 
      :data="subFormData.detailList"
      style="width: 100%"
      show-summary
      class="f2bpmui-datagrid-vuetable"
      :summary-method="getSummaries"
      @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" fixed="left"></el-table-column>
        <el-table-column prop="rowIndex" width="55" :align="alignCenter" label="序号" fixed="left">
          <template slot-scope="scope">
            <span>{{ scope.row.rowIndex }}</span>
          </template>
        </el-table-column>
        <el-table-column label="撤销认领编号" prop="code" width="200" :align="alignCenter">
          <template slot-scope="scope">
            <!-- <select-dialog :disabled="true" :btnDisabled="getDisFiled('baseServiceClassificationArchiveName')" :width="800" :modelData="goodClassifcaModel" :height="360" :value="scope.row.baseServiceClassificationArchiveName" @updateValue="baseServiceClassificationArchiveNameChange($event,scope.row)" dynamicModel="customDialog"></select-dialog> -->
            <text-input v-model="scope.row.code" :disabled="getDisFiled('code')"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="撤销当前项目编号" prop="constructCode" :align="alignCenter" width="180">
          <template slot-scope="scope">
            <text-input v-model="scope.row.constructCode" :disabled="getDisFiled('constructCode')"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="撤销前项目名称" prop="constructName" :align="alignCenter" width="180">
          <template slot-scope="scope">
            <text-input v-model="scope.row.constructName" :disabled="getDisFiled('constructName')"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="撤销认领人" prop="invoiceClaimantUserId" :align="alignCenter">
          <template slot-scope="scope">
            <!-- <select-dialog :disabled="true" :btnDisabled="getDisFiled('taxRate')" :width="800" :modelData="taxRateModel" :height="360" :value="scope.row.taxRate" @updateValue="taxRateChange($event, scope.row)" dynamicModel="customDialog"></select-dialog> -->
            <text-input v-model="scope.row.invoiceClaimantUserId" :disabled="getDisFiled('invoiceClaimantUserId')"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="撤销认领时间" prop="claimTime" :align="alignCenter">
          <template slot-scope="scope">
            <el-date-picker v-model="scope.row.claimTime" type="date" :disabled="getDisabledField('claimTime')" placeholde="选择日期"></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="单据状态" prop="status" :align="alignCenter">
          <template slot-scope="scope">
            <el-select v-model="scope.row.status" :disabled="getDisabledField('status')" clearable :placeholder="msgTip.SELECT_PLACEHOLDER">
                <el-option :label="item.configName" :value="item.configValue" :key="item.configValue" v-for="item in claimStatusArray"></el-option>
            </el-select>
          </template>
        </el-table-column>
        
        <!-- <el-table-column label="操作" prop="operate" fixed="right" v-if="!readOnly" :align="alignCenter" width="110">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column> -->
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
import { detailExport, detailImport } from '@/Api/invoice/invoiceApplyApi';

/**
 * 开票申请， 审批明细列表
 */
export default {
  name: 'detailList',
  components: {
    SelectDialog,
    TextInput,
    AmountInput,
    d3Pagination
  },
  props: {
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
      importData: {
        visible: false,
        url: '/invoice/invoiceOpenApplyDetail/importData',
        key:'invoiceImport'
      },
      selectRows:[],
      alignCenter: 'center',
      alignRight:'right',
      dataList: [],  //总的数组
      dataListCopy:[], //深拷贝后的数组
      keepData: [],
      goodClassifcaModel: GOODS_CLASSIFICATION,  //商品服务分类
      taxRateModel: TAX_RATE_ARCHIVE_MODEL,  //税率
      disabledFiled: {
        'preferentialPolicy': false,  //优惠政策
        'baseServiceClassificationArchiveName': false, //商品服务分类名称
        'contentMakeOutInvoice': false,  //开票内容
        'specification': false,  //规格/型
        'taxRate': false,//税率
        'unit': false,  //单位
        'objectNumber': false,  //数量
        'unitPriceTax': true,  //单价含税
        'unitPriceUntax': true,  //单价(无税)	
        'amountTax': false,  //金额含税
        'tax': true,  //税额
        'amountUntax': true //金额(无税)
      },
      rules: {
        // identityCard: [
        //   { validator: this.validateIdCard, trigger: ['change', 'blur'] }
        // ],
      },
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
            taxRate: item.taxRate ? this.judageString(item.taxRate) + '%' : '',  //税率
            unitPriceTax: this.judageString(item.unitPriceTax),
            unitPriceUntax: this.judageString(item.unitPriceUntax),
            amountTax: this.judageString(item.amountTax),
            tax: this.judageString(item.tax),
            amountUntax: this.judageString(item.amountUntax),
            amountTax: this.judageString(item.amountTax)
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
      return (num !== null) ? num.toString() : '';
    },
    handleSelectionChange(rows) {
      this.selectRows = rows;
    },
    //商品服务分类
    baseServiceClassificationArchiveNameChange(data, item) {
      console.log("商品服务分类：", data, item);
      const _key = item.key;
      item.baseServiceClassificationArchiveName = data[0].name;
      item.baseServiceClassificationArchiveId = data[0].id;
      // this.keepData.find(item => item.key === _key).baseServiceClassificationArchiveName = data[0].name;
    },
    //税率
    taxRateChange(data, item) {
      const _key = item.key;
      const rate = data[0].taxRate * 100 + '%';
      this.keepData.find(item => item.key === _key).taxRate = rate;
      this.currentCalculateAmount(_key);
    },
    validateForm() {
      // const validObj = {
      //   name: '被委托人',
      //   identityCard: '身份证',
      //   sex: '性别',
      //   age: '年龄'
      // }
      // const _keepData = this.keepData
      // let _d3Pagination = this.$refs.d3Pagination
      // //源数据当前页下标
      // let _pageSize = _d3Pagination.pageSize
      // for (let index in _keepData) {
      //   let _row = _keepData[index]
      //   console.log(_row, 112)
      //   let _currentPage = parseInt((index + 1) / _pageSize) + 1
      //   for (let key in validObj) {
      //     if (!_row[key]) {
      //       this.$message.error(`被委托人信息第 ${_currentPage} 页，第 ${parseInt(index) + 1} 行 ${validObj[key]} 不能为空`)
      //       return false
      //     }
      //   }
      // }
      return this.keepData;
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
        if (index === 2) { //第一列
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        //单价(含税)、单价无税、金额(含税)、金额(无税)
        let columArray = ['unitPriceTax','unitPriceUntax','amountTax','tax','amountUntax'];
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
    //导出
    async exportList() {
      const dataParams = {
        mainId: this.id
      }
      await detailExport(dataParams)
    },
    //导入
    importList() {
      this.importData.visible = true;
    },
    //导入成功
    importSuccess(data) { 
      this.keepData = (data && data.length > 0) ? data.map((item,index) => ({
        ...item,
        rowIndex: index + 1
      })) : [];
      this.importData.visible = false;
    },
    getDataList() {
      return this.keepData;
     }
  }
}
</script>

<style lang="scss" scoped>

@import url('../../../style/form.scss');

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