<template>
  <list-search-form @handelIsOpen="handelIsOpen" @search="searchFn" @reset="resetFn">
    <template slot="form">
      <el-form ref="sDataFrom" :model="formDataPop" label-width="120px" inline label-suffix="：">
        <row-layout :cols="3" cell="1-1-1">
          <el-form-item label="单据编号" slot="col_1" prop="code">
             <text-input v-model="formDataPop.code" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
          </el-form-item>
          <el-form-item label="付款单号" slot="col_2" prop="sellerName">
             <text-input v-model="formDataPop.sellerName" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
          </el-form-item>
          <el-form-item label="资金系统付款单号" slot="col_3" prop="buyerName">
             <text-input v-model="formDataPop.buyerName" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3">
          <el-form-item label="项目编号" slot="col_1" prop="invoiceStatus">
             <text-input v-model="formDataPop.buyerName" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
          </el-form-item>
          <el-form-item label="推送状态" slot="col_2" prop="invoiceType">
            <el-select v-model="formDataPop.invoiceType" :placeholder="msgTip.SELECT_PLACEHOLDER" clearable>
               <el-option :label="item.configName" :value="item.configValue" :key="item.configValue" v-for="item in selectData.invoiceTypeArray"></el-option>
             </el-select>
          </el-form-item>
          <el-form-item label="付款状态" slot="col_3" prop="invoiceCreateTime">
             <el-select v-model="formDataPop.invoiceStatus" :placeholder="msgTip.SELECT_PLACEHOLDER" clearable>
               <el-option :label="item.configName" :value="item.configValue" :key="item.configValue" v-for="item in selectData.invoiceStatusArray"></el-option>
             </el-select>
          </el-form-item>
        </row-layout>
        <div v-if="isOpen">
          <row-layout :cols="3">
            <el-form-item label="付款发起人" slot="col_1" prop="nameGoodsTaxableService">
              <text-input v-model="formDataPop.nameGoodsTaxableService" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
            </el-form-item>
            <el-form-item label="菜单名" slot="col_2" prop="constructArchiveMainCode">
              <text-input v-model="formDataPop.constructArchiveMainCode" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
            </el-form-item>
            <el-form-item label="编制时间" slot="col_3" prop="constructArchiveMainName">
              <el-date-picker size="small" style="width: cac(100% - 122px)" v-model="ticketTimeArray" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
            </el-form-item>
          </row-layout>
        </div>
      </el-form>
    </template>
  </list-search-form>
</template>

<script>
// 发票信息采集搜索条件
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import ListSearchForm from '@/components/basic/fromLayout/listSearchForm.vue';
import TextInput from '@/components/basic/elInput/textInput.vue';

export default {
  components: {
    RowLayout,
    ListSearchForm,
    TextInput
  },
  props: {
    formData: {
      type: Object,
      default: () => { }
    },
    dataDictArray: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    dataDictArray: {
      handler(newData, newVal) { 
        if (newData) { 
          //发票状态
          this.selectData.invoiceStatusArray = this.curSelectArray(newData,'发票状态');
          //发票类型
          this.selectData.invoiceTypeArray = this.curSelectArray(newData,'发票类型');
          //发票错误类型
          this.selectData.invoiceErrorTypeArray = this.curSelectArray(newData, '发票错误类型');
          //发票有错误类型
          this.selectData.isHaveInvoiceErrorTypeArray = this.curSelectArray(newData, '发票有错误类型');
          //是否红票
          this.selectData.isRedTicketArray = this.curSelectArray(newData, '是否红票');
          //是否收到发票原件
          this.selectData.haveReceivedOriginalInvoice = this.curSelectArray(newData, '是否收到发票原件');
          //认领状态
          this.selectData.claimStatusArray = this.curSelectArray(newData, '认领状态');
          //复核状态
          this.selectData.reviewStatusArray = this.curSelectArray(newData, '复核状态');
          //发票业务类型
          this.selectData.invoiceBizTypeArray = this.curSelectArray(newData, '发票业务类型');
          //是否推费用预提单
          this.selectData.accrualExpenseStatusArray = this.curSelectArray(newData, '是否推费用预提单');
          //已申请红字信息表
          this.selectData.applicationRedInformationArray = this.curSelectArray(newData, '已申请红字信息表');
          //发票来源
          this.selectData.sourceInvoiceArray = this.curSelectArray(newData, '发票来源');
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() { 
    return {
      msgTip: RuleRequired.tipMsg,
      formDataPop: this.formData,   // 处理父子组件渲染报错问题
      selectData: {
        invoiceStatusArray: [],  //发票状态
        invoiceTypeArray: [],  //发票类型
        invoiceErrorTypeArray: [],  //发票错误类型 单选
        isHaveInvoiceErrorTypeArray: [],  //发票有错误类型 单选
        isRedTicketArray: [],  //是否红票
        haveReceivedOriginalInvoice: [],  //是否收到发票原件
        claimStatusArray: [],  //认领状态
        reviewStatusArray: [],  //复核状态
        invoiceBizTypeArray: [],  //发票业务类型
        checkWhetherArray: [],  //是否勾选
        accrualExpenseStatusArray: [], ///是否推费用预提单
        applicationRedInformationArray: [],//已申请红字信息表
        sourceInvoiceArray:[]  //发票来源
      },
      isOpen: false,
      invoiceCreateTimeArray: [],  //开票日期
      ticketTimeArray: [],  //收票时间
      claimTimeArray: [],  //认领时间
      checkTimeTimeArray: [], //复核时间
      periodOutputTimeArray: [],  //进项转出期间
      createTimeArray:[],  //编制时间
    }
  },
  methods: {
    curSelectArray(arr, name) {
      return name ? arr.find(item => item.dataDictType === name)?.dataDict : [];
     },
    handelIsOpen() { 
      this.isOpen = !this.isOpen;
    },
    searchFn() { 
      this.$emit('search',this.formDataPop);
    },
    resetFn() { 
      this.formDataPop = {};
      this.$emit('search',this.formDataPop);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../style/form.scss';
@import "../../../style/searchForm.scss";

.el-form-item {
  margin-bottom: 0px;
}

::v-deep .fold-label .el-form-item__label{
  line-height: 18px;
}

::v-deep .form-layout-row{
  margin: 3px 8px;
}
</style>