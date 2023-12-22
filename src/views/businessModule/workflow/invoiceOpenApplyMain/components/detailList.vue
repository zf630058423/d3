<template>
  <div class="detail-list">
    <el-form ref="subFrom" :model="subFormData" :rules="rules">
      <div class="detail-list_btns">
        <el-button type="primary" size="mini" v-show="!readOnly" icon="el-icon-plus" @click="addRow">添加</el-button>
        <el-button type="primary" size="mini" v-show="!readOnly" icon="el-icon-delete" @click="delRow">删除</el-button>
        <el-button type="primary" size="mini" v-show="!readOnly && Number(isRedTicket) !== 1" icon="el-icon-edit-outline" @click="importList">导入</el-button>
        <el-button type="primary" size="mini" icon="el-icon-edit" @click="exportList">导出</el-button>
      </div>
      <el-table 
      :data="subFormData.detailList"
      style="width: 100%"
      show-summary
      :summary-method="getSummaries"
      @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" fixed="left"></el-table-column>
        <el-table-column prop="rowIndex" width="55" :align="alignCenter" label="序号" fixed="left">
          <template slot-scope="scope">
            <span>{{ scope.row.rowIndex }}</span>
          </template>
        </el-table-column>
        <el-table-column label="优惠政策" prop="preferentialPolicy" :align="alignCenter" width="200">
          <template slot-scope="scope">
            <el-select v-model="scope.row.preferentialPolicy" :disabled="getDisFiled('preferentialPolicy')">
              <el-option
                v-for="item in preferentialPolicyArray"
                :key="item.configValue"
                :label="item.configName"
                :value="item.configValue">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="商品服务分类" prop="baseServiceClassificationArchiveName" width="200" :align="alignCenter">
          <template slot-scope="scope">
            <select-dialog :disabled="true" :btnDisabled="getDisFiled('baseServiceClassificationArchiveName')" :width="800" :modelData="goodClassifcaModel" :height="360" :value="scope.row.baseServiceClassificationArchiveName" @updateValue="baseServiceClassificationArchiveNameChange($event,scope.row)" dynamicModel="customDialog"></select-dialog>
          </template>
        </el-table-column>
        <el-table-column label="开票内容" prop="contentMakeOutInvoice" :align="alignCenter" width="180">
          <template slot-scope="scope">
            <text-input v-model="scope.row.contentMakeOutInvoice" :disabled="getDisFiled('contentMakeOutInvoice')"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="规格/型号" prop="specification" :align="alignCenter" width="180">
          <template slot-scope="scope">
            <text-input v-model="scope.row.specification" :disabled="getDisFiled('specification')"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="税率" prop="taxRate" :align="alignCenter" width="150">
          <template slot-scope="scope">
            <select-dialog :disabled="true" :btnDisabled="getDisFiled('taxRate')" :width="800" :modelData="taxRateModel" :height="360" :value="scope.row.taxRate" @updateValue="taxRateChange($event, scope.row)" dynamicModel="customDialog"></select-dialog>
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="unit" :align="alignCenter" width="150">
          <template slot-scope="scope">
            <text-input v-model="scope.row.unit" :disabled="getDisFiled('unit')"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="objectNumber" :align="alignCenter" width="150">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.objectNumber" :disabled="getDisFiled('objectNumber')" @change="objectNumberChange($event, scope.row)"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="单价(含税)" prop="unitPriceTax" width="150" :align="alignCenter">
          <template slot-scope="scope">
            <!-- 保留两位小数 -->
            <amount-input v-model="scope.row.unitPriceTax" :disabled="getDisFiled('unitPriceTax')" :decimalNum="2" @change="taxUnitPriceChange($event, scope.row)"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="单价(无税)" prop="unitPriceUntax" width="150" :align="alignCenter">
          <template slot-scope="scope">
            <!-- 保留16小数 -->
            <amount-input v-model="scope.row.unitPriceUntax" :decimalNum="16" :disabled="getDisFiled('unitPriceUntax')" @change="noTaxUnitPriceChange($event, scope.row)"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="金额(含税)" prop="amountTax" width="150" :align="alignCenter">
          <template slot-scope="scope">
            <!-- 保留两位小数 -->
            <amount-input v-model="scope.row.amountTax" :disabled="getDisFiled('amountTax')" :decimalNum="2" @change="amountTaxAmount($event, scope.row)"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="税额" prop="tax" width="150" :align="alignCenter">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.tax" :disabled="getDisFiled('tax')" @change="taxChange($event, scope.row)"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="金额(无税)" prop="amountUntax" width="150" :align="alignCenter">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.amountUntax" :disabled="getDisFiled('amountUntax')" @change="amountUntaxChange($event, scope.row)"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operate" fixed="right" v-if="!readOnly" :align="alignCenter" width="110">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <d3Pagination :sourceData="keepData" ref="d3Pagination" :page-size="pageData.pageSize" v-model="subFormData.detailList" />

    </el-form>
    <uploader-details :visible.sync="importData.visible" :keyword="importData.key" :uploaderUrl="importData.url" @importSuccess="importSuccess"></uploader-details>
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
import { detailExport, detailImport } from '@/Api/invoice/invoiceApplyApi';
import UploaderDetails from '@/components/basic/importTemplateDialog/uploaderDetails.vue';

/**
 * 开票申请， 审批明细列表
 */
export default {
  name: 'detailList',
  components: {
    SelectDialog,
    TextInput,
    AmountInput,
    d3Pagination,
    UploaderDetails
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
    },
    isRedTicket: {
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
      // preferentialPolicyArray: constParams.PREFERENTIAL_POLICY,  //优惠政策
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
     },
    preferentialPolicyArray() {
      return (this.ppData && this.ppData.length > 0) ? this.ppData : constParams.PREFERENTIAL_POLICY;
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
    addRow() {
      const rowId = MyFun.getQueryString('rowId');
      let _keepData = this.keepData;
      let key = _keepData && _keepData.length > 0 ? Math.max(..._keepData.map(item => item.rowIndex)) + 1 : 1;
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
      _keepData.push(obj);
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
      // this.keepData = this.regSortList(this.keepData);
      this.$nextTick(() => {
        this.keepData = this.regSortList(this.keepData);
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
        rowIndex: (index + 1)
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
      this.currentCalculateAmount(_key);
     },
    //单价（无税）
    noTaxUnitPriceChange(e,item) { 
      console.log("单价（无税）===:", e);
      this.currentCalculateAmount(item.key);
    },
    //金额（含税）
    amountTaxAmount(e, item) {
      console.log("金额(含税)===:", e);
      this.currentCalculateAmount(item.key);
      console.log("parent===:", this.$parent);
      this.mayApplyInvoiceAmountTaxMethod();
     },
    //税额
    taxChange(e, item) {
      console.log("税额===：", e, item);
      
      this.currentCalculateAmount(item.key);
     },
    //金额(无税)
    amountUntaxChange(e, item) { 
      console.log("金额(无税)===：", e);
      this.currentCalculateAmount(item.key);
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
      obj.unitPriceTax = unitPriceUntax ? MyFun.getTofixed(MyFun.getNumMulti(unitPriceUntax.toString(), taxRateNum.toString()).toString(), 2) : ''; //单价(含税) 2位
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