<template>
  <div class="detail-list">
    <el-form ref="subFrom" :model="subFormData" :rules="rules">
      <div class="detail-list_btns">
        <el-button type="primary" size="mini" v-show="!readOnly" icon="el-icon-plus" @click="addRow">添加</el-button>
        <el-button type="primary" size="mini" v-show="!readOnly" icon="el-icon-delete" @click="delRow">删除</el-button>
      </div>
      <el-table 
      :data="subFormData.detailList"
      style="width: 100%"
      :header-cell-class-name="headerCellClass"
      @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" fixed="left"></el-table-column>
        <el-table-column prop="rowIndex" width="55" :align="alignCenter" label="序号" fixed="left">
          <template slot-scope="scope">
            <span>{{ scope.row.rowIndex }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发票号码" prop="invoiceNo" :align="alignCenter" width="200">
          <template slot-scope="scope">
            <el-form-item :prop="`detailList.${scope.$index}.invoiceNo`" :rules="rules.invoiceNo">
              <select-dialog :disabled="true" :btnDisabled="getDisFiled('invoiceNo')" :width="800" :modelData="invoiceNoModel" :height="360" :value="scope.row.invoiceNo" @updateValue="invoiceNoChange($event, scope.row)" dynamicModel="customDialog"></select-dialog>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="发票代码" prop="invoiceCode" width="200" :align="alignCenter">
          <template slot-scope="scope">
            <text-input v-model="scope.row.invoiceCode" :disabled="getDisFiled('invoiceCode')" :placeholder="msgTip.AUTO_PLACEHOLDER"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="开票日期" prop="invoiceCreateTime" :align="alignCenter" width="180">
          <template slot-scope="scope">
            <el-date-picker v-model="scope.row.invoiceCreateTime" type="date" :disabled="getDisFiled('invoiceCreateTime')" :placeholder="msgTip.AUTO_PLACEHOLDER"></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="是否重开" prop="isReInvoice" :align="alignCenter" width="150">
          <template slot-scope="scope">
            <el-select v-model="scope.row.isReInvoice" :disabled="getDisFiled('isReInvoice')" :placeholder="msgTip.SELECT_PLACEHOLDER">
              <el-option v-for="item in isReInvoiceData" :key="item.configValue" :label="item.configName" :value="item.configValue"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="项目编号" prop="constructArchiveMainCode" :align="alignCenter" width="150">
          <template slot-scope="scope">
            <text-input v-model="scope.row.constructArchiveMainCode" :disabled="getDisFiled('constructArchiveMainCode')" :placeholder="msgTip.AUTO_PLACEHOLDER"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="项目名称" prop="constructArchiveMainName" :align="alignCenter" width="150">
          <template slot-scope="scope">
            <text-input v-model="scope.row.constructArchiveMainName" :disabled="getDisFiled('constructArchiveMainName')" :placeholder="msgTip.AUTO_PLACEHOLDER"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="收入合同编号" prop="contractInMainCode" width="150" :align="alignCenter">
          <template slot-scope="scope">
            <text-input v-model="scope.row.contractInMainCode" :disabled="getDisFiled('contractInMainCode')" :decimalNum="2" :placeholder="msgTip.AUTO_PLACEHOLDER"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="收入合同名称" prop="contractInMainName" width="150" :align="alignCenter">
          <template slot-scope="scope">
            <text-input v-model="scope.row.contractInMainName" :decimalNum="16" :disabled="getDisFiled('contractInMainName')" :placeholder="msgTip.AUTO_PLACEHOLDER"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="管理部门" prop="constructionUnitName" width="150" :align="alignCenter">
          <template slot-scope="scope">
            <text-input v-model="scope.row.constructionUnitName" :disabled="getDisFiled('constructionUnitName')" :decimalNum="2" :placeholder="msgTip.AUTO_PLACEHOLDER"></text-input>
          </template>
        </el-table-column>
        <el-table-column label="数据源" prop="dataSource" width="150" :align="alignCenter">
          <template slot-scope="scope">
            <el-radio v-model="scope.row.dataSource" :name="scope.row.dataSource" :disabled="getDisFiled('dataSource')"></el-radio>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operate" fixed="right" v-if="!readOnly" :align="alignCenter" width="110">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <span class="link">链接</span>
          </template>
        </el-table-column>
      </el-table>
      <d3Pagination :sourceData="keepData" ref="d3Pagination" :page-size="pageData.pageSize" v-model="subFormData.detailList" />
    </el-form>
  </div>
</template>

<script>
import MyFun from '@/utils/fun';
import { GOODS_CLASSIFICATION, TAX_RATE_ARCHIVE_MODEL, VOUCHER_CANCEL_MODEL } from '@/views/businessModule/enum/param';
import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
import TextInput from '@/components/basic/elInput/textInput.vue';
import d3Pagination from "@/components/basic/pagination/index.vue";
import AmountInput from '@/components/basic/numberInput/amountInput.vue';
// import constParams from '../constParams';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import { detailExport, detailImport } from '@/Api/invoice/invoiceApplyApi';
import UploaderDetails from '@/components/basic/importTemplateDialog/uploaderDetails.vue';

/**
 * 开票作废申请， 审批明细列表
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
    }
  },
  data() { 
    return {
      subFormData: {
        detailList: []
      },
      msgTip: RuleRequired.tipMsg,
      importData: {
        visible: false,
        url: '/invoice/invoiceOpenApplyDetail/importData',
        key:'invoiceImport'
      },
      selectRows: [],
      isReInvoiceData: [
        { configValue: '1', configName: '是' },
        { configValue:'0', configName:'否'}
      ],
      alignCenter: 'center',
      alignRight:'right',
      dataList: [],  //总的数组
      dataListCopy:[], //深拷贝后的数组
      keepData: [],
      // preferentialPolicyArray: constParams.PREFERENTIAL_POLICY,  //优惠政策
      goodClassifcaModel: GOODS_CLASSIFICATION,  //商品服务分类
      taxRateModel: TAX_RATE_ARCHIVE_MODEL,  //税率
      invoiceNoModel: VOUCHER_CANCEL_MODEL,  //开票号码
      disabledFiled: {
        'invoiceNo': false,  //发票号码
        'invoiceCode': true, //发票代码 不可填 自动带出
        'invoiceCreateTime':true,  //开票日期 不可天 自动带出
        'isReInvoice': false,  //是否重开
        'constructArchiveMainCode': true,//项目编号 不可填  自动带出
        'constructArchiveMainName': true,  //项目名称 不可填  自动带出
        'contractInMainCode': true,  //收入合同编号 不可填  自动带出
        'contractInMainName': true,  //收入合同名称 不可填  自动带出
        'constructionUnitName': true,  //管理部门 不可填  自动带出
        'dataSource': true,  //数据源 不可填  自动带出
      },
      // rules: RuleRequired.dataRule(['invoiceNo', 'isReInvoice']),  //必填字段
      rules: {
        invoiceNo: [
          { required: true, message:'请选择发票号码', trigger: ['change', 'blur'] }
          // { validator: this.validateIdCard, trigger: ['change', 'blur'] }
        ],
      },
      pageData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      cancellationObj: {  //作废信息
        rowIndex: 1,
        id: '',
        invoiceNo: '',  //发票号码
        invoiceOpenMainId:'',  //开票主表id
        invoiceCode: '',  //发票代码
        invoiceCreateTime: '',   //开票日期
        isReInvoice: "",  //是否重开	
        constructArchiveMainCode: '',  //项目编号
        constructArchiveMainName: '',  //项目名称
        contractInMainCode: '',  //收入合同编号
        contractInMainName: '',  //收入合同名称
        constructionUnitName: '',  //管理部门
        dataSource: '', //数据源
        projectManagerId: '', //项目负责人id
        constructionUnitId: '', //管理部门id
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
      return this.ppData;
    }
  },
  watch: {
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
    headerCellClass ({ row, column, rowIndex, columnIndex }) {
      const setIndexArr = [2, 5]; //想要改变列的索引
      if (setIndexArr.includes(columnIndex)) {
        //有出现的话就返回
        return "is_required";
      }
    },
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
    //发票号码
    invoiceNoChange(data, item) {
      console.log("发票号码====：", data);
      if (data.length > 0) { 
        item.id = data[0].id || '';
        item.invoiceOpenMainId = data[0].id || '';
        item.invoiceCode = data[0].invoiceCode || '';  //发票代码 constructarchivemainname
        item.invoiceCreateTime = data[0].invoiceCreateTime;  //开票日期
        item.invoiceNo = data[0].invoiceNo || '';   //发票号码
        // item.constructArchiveMainCode = data[0].code || '';  //项目编号
        item.constructArchiveMainName = data[0].constructarchivemainname || '';  //项目名称
        item.contractInMainName = data[0].contractinmainname || '';  //收入合同名称
        item.constructionUnitName = data[0].constructionunitname || '';  //管理部门
        item.dataSource = data[0].dataSource || '';  //数据源
        item.projectManagerId = data[0].projectManagerId || ''; //项目负责人id
        item.contractInMainCode = data[0].contractinmaincode || '';  //收入合同编号
        item.constructionUnitId = data[0].constructionUnitId || '';  //管理部门id
        item.constructArchiveMainCode = data[0].constructarchivemaincode || ''; //项目编号
        console.log("keepalive:",this.keepData);  
      }
      
    },
    validateForm() {
      const validObj = {
        invoiceNo: '发票号码',
        isReInvoice: '是否重开'
      }
      const _keepData = this.keepData
      let _d3Pagination = this.$refs.d3Pagination
      //源数据当前页下标
      let _pageSize = _d3Pagination.pageSize
      if (_keepData.length === 0) {
        this.$message.error('作废申请不能为空');
        return false;
       }
      for (let index in _keepData) {
        let _row = _keepData[index]
        // console.log(_row, 112)
        let _currentPage = parseInt((index + 1) / _pageSize) + 1
        for (let key in validObj) {
          if (!_row[key] && key === 'invoiceNo') {
            this.$message.error(`第${_currentPage}页，第${parseInt(index) + 1}行${validObj[key]}不能为空`);
            return false
          }
        }
      }
      return this.keepData;
    },
    addRow() {
      let _keepData = this.keepData;
      let key = _keepData && _keepData.length > 0 ? Math.max(..._keepData.map(item => item.rowIndex)) + 1 : 1;
      const obj = {
        ...this.cancellationObj,
        key,
        rowIndex: key
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
    getDataList() {
      return this.keepData;
     }
  }
}
</script>

<style lang="scss" scoped>
// @import '../../../style/form.scss';
@import "~@/views/businessModule/style/form.scss";

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