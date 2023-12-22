<template>
  <div class="detail-list">
    <el-form ref="subFrom" :rules="rules">
     
      <div class="detail-list_btns">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addRow">添加</el-button>
        <el-button type="primary" size="mini" icon="el-icon-delete" @click="delRow">删除</el-button>
        <el-button type="primary" size="mini" icon="el-icon-edit-outline" @click="exportList">导入</el-button>
        <el-button type="primary" size="mini" icon="el-icon-edit" @click="importList">导出</el-button>
      </div>
      <el-table 
      :data="keepData"
      style="width: 100%"
      show-summary
      :summary-method="getSummaries"
      @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="rowIndex" width="55" :align="alignCenter" label="序号">
          <template slot-scope="scope">
            <span>{{ scope.row.rowIndex }}</span>
          </template>
        </el-table-column>
        <el-table-column label="优惠政策" prop="preferentialPolicy" :align="alignCenter" width="200">
          <template slot-scope="scope">
            <el-select v-model="scope.row.preferentialPolicy">
              <el-option
                v-for="(label,key) in preferentialPolicyArray"
                :key="key"
                :label="label"
                :value="key">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="商品服务分类" prop="baseServiceClassificationArchiveName" width="200" :align="alignCenter">
          <template slot-scope="scope">
            <select-dialog :disabled="true" :btnDisabled="false" :width="800" :modelData="goodClassifcaModel" :height="360" :value="scope.row.baseServiceClassificationArchiveName" @updateValue="baseServiceClassificationArchiveNameChange($event,scope.row)" dynamicModel="customDialog"></select-dialog>
          </template>
        </el-table-column>
        <el-table-column label="开票内容" prop="contentMakeOutInvoice" :align="alignCenter" width="180">
          <template slot-scope="scope">
            <text-input v-model="scope.row.contentMakeOutInvoice"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="规格/型号" prop="specification" :align="alignCenter" width="180">
          <template slot-scope="scope">
            <text-input v-model="scope.row.specification"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="税率" prop="taxRate" :align="alignCenter" width="150">
          <template slot-scope="scope">
            <select-dialog :disabled="true" :btnDisabled="false" :width="800" :modelData="taxRateModel" :height="360" :value="scope.row.taxRate" @updateValue="taxRateChange($event, scope.row)" dynamicModel="customDialog"></select-dialog>
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="unit" :align="alignCenter" width="150">
          <template slot-scope="scope">
            <text-input v-model="scope.row.unit"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="objectNumber" :align="alignCenter" width="150">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.objectNumber" @change="objectNumberChange($event, scope.row)"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="单价(含税)" prop="unitPriceTax" width="150" :align="alignCenter">
          <template slot-scope="scope">
            <!-- 保留两位小数 -->
            <amount-input v-model="scope.row.unitPriceTax" disabled :decimalNum="2" @change="taxUnitPriceChange($event, scope.row)"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="单价(无税)" prop="unitPriceUntax" width="150" :align="alignCenter">
          <template slot-scope="scope">
            <!-- 保留16小数 -->
            <amount-input v-model="scope.row.unitPriceUntax" :decimalNum="16" disabled @change="noTaxUnitPriceChange($event, scope.row)"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="金额(含税)" prop="includingTaxAmount" width="150" :align="alignCenter">
          <template slot-scope="scope">
            <!-- 保留两位小数 -->
            <amount-input v-model="scope.row.includingTaxAmount" :decimalNum="2" @change="includingTaxAmount($event, scope.row)"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="税额" prop="tax" width="150" :align="alignCenter">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.tax" disabled @change="taxChange($event, scope.row)"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="金额(无税)" prop="noTaxAmount" width="150" :align="alignCenter">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.noTaxAmount" disabled @change="noTaxAmountChange($event, scope.row)"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operate" :align="alignCenter" width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" :current-page="pageData.pageNum" :page-size="pageData.pageSize" class="pagination-el" background align="right" layout="prev, pager, next" :total="pageData.total"></el-pagination>
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
import constParams from '../constParams';

/**
 * 开票申请， 审批明细列表
 */
export default {
  name: 'datailList',
  components: {
    SelectDialog,
    TextInput,
    AmountInput,
    d3Pagination
  },
  props: {
    value: {
      type: Array,
      default: () => []
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
      preferentialPolicyArray: constParams.PREFERENTIAL_POLICY,  //优惠政策
      goodClassifcaModel: GOODS_CLASSIFICATION,  //商品服务分类
      taxRateModel: TAX_RATE_ARCHIVE_MODEL,  //税率
      rules: {
        identityCard: [
          { validator: this.validateIdCard, trigger: ['change', 'blur'] }
        ],
      },
      pageData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      spanArr: [],
      position:0
    }
  },
  watch: {
    value: {
      handler:function(val) {
        if (val) { 
          this.dataList = val;
          this.pageSet();
          // this.dataListCopy = JSON.parse(JSON.stringify(this.dataList));
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleSelectionChange(rows) {
      this.selectRows = rows;
    },
    //商品服务分类
    baseServiceClassificationArchiveNameChange(data, item) {
      console.log("商品服务分类：", data, item);
      const _key = item.key;
      this.dataList.find(item => item.key === _key).baseServiceClassificationArchiveName = data[0].name;
    },
    //税率
    taxRateChange(data, item) {
      const _key = item.key;
      const rate = data[0].taxRate * 100 + '%';
      // this.dataList.find(item => item.key === _key).taxRate = rate;
      this.keepData.find(item => item.key === _key).taxRate = rate;
      this.currentCalculateAmount(_key);
    },
    validateIdCard(rule, value, callback) {
    },
    validateForm() {
      console.log("123456");
    },
    addRow() {
      const rowId = MyFun.getQueryString('rowId');
      // const rowId = Object.toQueryString('rowId')
      let _dataList = this.dataList;
      // this.dataListCopy = MyFun.deepCopy(this.dataList);
      let key = this.dataListCopy && this.dataListCopy.length > 0 ? Math.max(...this.dataListCopy.map(item => item.key)) + 1 : 1;
      const obj = {
        key,
        rowIndex: key,
        id: rowId,
        preferentialPolicy: '',  //优惠政策
        baseServiceClassificationArchiveId: '',  //商品服务分类id
        baseServiceClassificationArchiveName: '',   //商品服务分类名称
        contentMakeOutInvoice: "",  //开票内容	
        specification: '',  //规格/型号
        taxRate: '',  //税率
        unit: '',  //单位
        objectNumber: '',  //数量
        unitPriceTax: '',  //单价含税
        unitPriceUntax: '', //单价(无税)	
        amountTax: '',  //金额含税
        tax: '',  //税额	
        amountUntax: '',  //金额无税
      }
      _dataList.push(obj);
      // this.keepData.push(obj);
      console.log("dataListCopy===:",this.dataListCopy);
      this.pageSet();
    },
    handleDelete(index, item) {
      this.dataList = MyFun.removeByKey(this.dataList, 'key', item.key);
      this.pageSet();
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
        this.dataList = MyFun.removeByKey(this.dataList, 'key', item.key);
      })
    },
    //显示当前页的数据
    pageSet() {
      const { pageData, dataList } = this;
      console.log("数据===：",dataList);
      // let dataListCopy = MyFun.deepCopy(dataList, {});
      let dataListCopy = JSON.parse(JSON.stringify(dataList));
      this.pageData.pageSize = 10;   //每页10条数据
      this.pageData.total = dataListCopy.length;  //总条数
      let pageNum = pageData.pageNum;  //获取当前的页
      //总页数
      const totlaPage = dataListCopy.length > 0 ? Math.ceil(dataListCopy.length / 10) : 1;
      const curPage = dataListCopy.length > 0 ? Math.floor(dataListCopy.length / 10) : 1;
      let num = 1;
      if (dataListCopy.length > 10) {
        num = Math.ceil(dataListCopy.length / 10);
      } else {
        num = 1;
      }
      this.pageData.pageNum = num;
      let _dataList = this.regSortList(dataListCopy);  //对序号进行排序
      if (_dataList.length > 10) {
        this.keepData = _dataList.filter((item, index) => ((num - 1) * 10) <= index && index < (num * 10));
      } else {
        this.keepData = _dataList;
      }
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
        rowIndex: index + 1
      })) : [];
    },
    //数量
    objectNumberChange(e, item) { 
      console.log("数量===：", e);
      this.currentCalculateAmount(item.key);
    },
    //单价（含税）
    taxUnitPriceChange(e, item) {
      console.log("单价（含税）===:", e);
      const _key = item.key;
      // this.keepData.find(item => item.key === _key).taxUnitPrice = e;
      this.currentCalculateAmount(_key);
     },
    //单价（无税）
    noTaxUnitPriceChange(e,item) { 
      console.log("单价（无税）===:", e);
      this.currentCalculateAmount(item.key);
    },
    //金额（含税）
    includingTaxAmount(e, item) {
      console.log("金额(含税)===:", e);
      this.currentCalculateAmount(item.key);
     },
    //税额
    taxChange(e, item) {
      console.log("税额===：", e, item);
      
      this.currentCalculateAmount(item.key);
     },
    //金额(无税)
    noTaxAmountChange(e, item) { 
      console.log("金额(无税)===：", e);
      this.currentCalculateAmount(item.key);
    },
    
    calculateAmount() { 
      // const { dataList, keepData } = this;
      this.keepData.forEach(item => { 
        let taxRate = (item.taxRate && item.taxRate.indexOf("%")) ? item.taxRate.replace("%", '') : 0; //税率
        let taxRateNum = MyFun.getNumAdd(1, taxRate);
        let taxUnitPrice = item.unitPriceTax || 0;  //单价(含税)
        let noTaxUnitPrice = item.noTaxUnitPrice || 0;  //单价(无税)
        let includingTaxAmount = item.includingTaxAmount || 0;  //金额(含税)
        let tax = item.tax || 0;  //税额
        let noTaxAmount = item.noTaxAmount || 0;  //金额(无税)
        let num = item.objectNumber || 0; //数量
        item.noTaxUnitPrice = (noTaxAmount && num) ? MyFun.getNumDiv(noTaxAmount, num) : ''; //单价无税 相除
        item.taxUnitPrice = item.noTaxUnitPrice ? MyFun.getNumMulti(item.noTaxUnitPrice, taxRateNum) : ''; //单价(含税)
        item.noTaxAmount = MyFun.getNumDiv(includingTaxAmount.toString(), taxRateNum.toString());//金额(无税) 金额(含税)/(1+税率）
        item.tax = MyFun.getNumSub(includingTaxAmount, item.noTaxAmount); //税额
      })
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
      let includingTaxAmountP = obj.includingTaxAmount || 0;  //金额(含税)
      let num = obj.objectNumber || 0; //数量 
      obj.noTaxAmount = MyFun.getTofixed(MyFun.getNumDiv(includingTaxAmountP, taxRateNum).toString(), 2);//金额(无税) 金额(含税)/(1+税率）默认保留两位
      let noTaxAmount = obj.noTaxAmount || 0;  //金额(无税)
      obj.unitPriceUntax = (noTaxAmount && num) ? MyFun.getNumDiv(noTaxAmount.toString(), num.toString()).toString() : ''; //单价无税 相除  16位
      let unitPriceUntax = obj.unitPriceUntax || 0;
      obj.unitPriceTax = unitPriceUntax ? MyFun.getTofixed(MyFun.getNumMulti(unitPriceUntax.toString(), taxRateNum.toString()).toString(), 2) : ''; //单价(含税) 2位
      obj.tax = MyFun.getTofixed(MyFun.getNumSub(includingTaxAmountP.toString(), noTaxAmount.toString()).toString(), 2); //税额 2位
      // console.log("查看计算===：",this.keepData);
    },
    //合计
    getSummaries(param) { 
      // console.log("param", param);
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 1) { //第一列
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        //单价(含税)、单价无税、金额(含税)、金额(无税)
        let columArray = ['unitPriceTax','unitPriceUntax','includingTaxAmount','tax','noTaxAmount'];
        if (columArray.includes(column.property)) {
          if (column.property === 'tax') { 
            console.log("tax===:",column.property);
          }
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
      console.log("total===:", total);
      return total;
    },
    exportList() { },
    importList() { },
    //当前也改变的时候触发
    currentChange(e) {
      console.log("当前页===：", e);
      this.selectPage(e);
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