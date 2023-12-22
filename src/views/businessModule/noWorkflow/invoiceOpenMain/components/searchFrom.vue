<template>
  <list-search-form @handelIsOpen="handelIsOpen" @search="searchFn" @reset="resetFn">
    <template slot="form">
        <el-form ref="dataForm" :model="formDataPop" label-width="120px" inline>
            <row-layout row-layout :cols="3" cell="1-1-1" :marginStyle="marginStyle">
              <el-form-item slot="col_1" label="发票号码：" prop="invoiceNo">
                <el-input class="business-input" v-model="formDataPop.invoiceNo" clearable :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
              </el-form-item>
              <el-form-item slot="col_2" label="项目编号：" prop="constructArchiveMainCode">
                <el-input class="business-input" v-model="formDataPop.constructArchiveMainCode" clearable :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
              </el-form-item>
              <el-form-item slot="col_3" label="项目名称：" prop="constructArchiveMainName">
                <el-input class="business-input" v-model="formDataPop.constructArchiveMainName" clearable :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
              </el-form-item>
            </row-layout>
            <row-layout :cols="3" :marginStyle="marginStyle">
              <el-form-item slot="col_1" label="开票申请单号：" prop="invoiceOpenApplyMainCode">
                <el-input class="business-input" v-model="formDataPop.invoiceOpenApplyMainCode" clearable :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
              </el-form-item>
              <el-form-item slot="col_2" label="收入合同编号：" prop="contractInMainCode">
                <el-input class="business-input" v-model="formDataPop.contractInMainCode" clearable :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
              </el-form-item>
              <el-form-item slot="col_3" label="收入合同名称：" prop="contractInMainName">
                <el-input class="business-input" v-model="formDataPop.contractInMainName" clearable :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
              </el-form-item>
            </row-layout>
            <div v-if="isOpen">
              <row-layout :cols="3" v-if="fold" :marginStyle="marginStyle">
                <el-form-item slot="col_1" prop="invoiceCreateTime" label="开票日期：">
                  <el-input class="business-input" v-model="formDataPop.invoiceCreateTime" clearable></el-input>
                </el-form-item>
                <el-form-item slot="col_2" prop="sellerName" label="销售方：">
                  <el-input class="business-input" v-model="formDataPop.sellerName" clearable :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
                </el-form-item>
                <el-form-item slot="col_3" prop="buyerName" label="购方：">
                  <el-input class="business-input" v-model="formDataPop.buyerName" clearable :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
                </el-form-item>
              </row-layout>
              <row-layout :cols="3" :marginStyle="marginStyle">
                <el-form-item slot="col_1" label="管理部门：" prop="constructionUnitName">
                  <el-input class="business-input" v-model="formDataPop.constructionUnitName" clearable :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
                </el-form-item>
                <el-form-item slot="col_2" label="开票分类：" prop="makeOutInvoiceType">
                  <el-select v-model="formDataPop.makeOutInvoiceType" clearable>
                    <el-option :value="rItem.configValue" :label="rItem.configName" :key="rItem.configValue" v-for="rItem in invoiceTypeArry"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item slot="col_3" label="对应蓝字发票号码：" prop="blueFontInvoiceNo">
                  <el-input class="business-input" v-model="formDataPop.blueFontInvoiceNo" clearable :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
                </el-form-item>
              </row-layout>
              <row-layout :cols="3" :marginStyle="marginStyle">
                <el-form-item slot="col_1" label="是否红票：" prop="isRedTicket">
                  <el-select v-model="formDataPop.isRedTicket" clearable>
                    <el-option :value="rItem.configValue" :label="rItem.configName" :key="rItem.configValue" v-for="rItem in isRedTicketArray"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item slot="col_2" label="开票状态：" prop="invoiceStatus">
                  <el-select v-model="formDataPop.invoiceStatus" clearable>
                    <el-option :value="rItem.configValue" :label="rItem.configName" :key="rItem.configValue" v-for="rItem in invoiceStatusArray"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item slot="col_3" label="单据编号：" prop="code">
                  <el-input class="business-input" v-model="formDataPop.code" clearable :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
                </el-form-item>
              </row-layout>
              <row-layout :cols="3" :marginStyle="marginStyle">
                <el-form-item slot="col_1" label="对接状态：" prop="dockingStatus">
                  <el-select v-model="formDataPop.dockingStatus" clearable>
                    <el-option :value="rItem.configValue" :label="rItem.configName" :key="rItem.configValue" v-for="rItem in dockingStatusArray"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item slot="col_2" label="编制人：" prop="createUserName">
                  <el-input class="business-input" v-model="formDataPop.createUserName" clearable :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
                </el-form-item>
                <el-form-item slot="col_3" label="编制时间：" prop="createTime">
                  <el-date-picker v-model="formDataPop.createTime" range-separator="至" type="daterange" :placeholder="msgTip.DATE_PLACEHOLDER"></el-date-picker>
                </el-form-item>
              </row-layout>
            </div>
        </el-form>
    </template>
   </list-search-form>
</template>

<script>
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import ListSearchForm from '@/components/basic/fromLayout/listSearchForm.vue';

export default {
  name: 'searchFrom',
  components: { RowLayout, ListSearchForm },
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
  data() { 
    return {
      createTime:[],
      marginStyle: 'margin:0;',
      formDataPop: this.formData,   // 处理父子组件渲染报错问题
      fold: false,  // 是否展开
      invoiceStatusArray: [],  //开票状态
      dockingStatusArray: [], //对接状态
      invoiceTypeArry: [],  //开票分类
      isRedTicketArray:[], //是否红票
      isOpen: false,
      msgTip: RuleRequired.tipMsg,
    }
  },
  watch:{
    formData:{
      handler(newValue,oldVal){
        this.formDataPop = newValue;
      },
      deep:true,
      immediate:true
    },
    dataDictArray: {
      handler(data, oldVal) { 
        if (data) { 
          //发票类型
          this.invoiceTypeData = data.find(item => item.dataDictType === '发票类型')?.dataDict || [];
          //开票状态
          this.invoiceStatusArray = data.find(item => item.dataDictType === '开票状态')?.dataDict || [];
          //对接状态
          this.dockingStatusArray = data.find(item => item.dataDictType === '对接状态')?.dataDict || [];
          //开票分类
          this.invoiceTypeArry = data.find(item => item.dataDictType === '开票分类')?.dataDict || [];
          //是否红票
          this.isRedTicketArray = data.find(item => item.dataDictType === '是否红票')?.dataDict || [];
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handelIsOpen() { 
      this.isOpen = !this.isOpen;
    },
    //查询
    searchFn() { 
      this.$emit('search',this.formDataPop)
    },
    //重置
    resetFn() { 
      this.clearFormData();
      this.$emit('search',this.formDataPop)
    },
    clearFormData() { 
      this.formDataPop = {};
    },
    btnclick(){   // 自定义按钮 删除后重置事件
      this.clearFormData();
    },
    // 展开 折叠
    unfold(){
      this.fold = !this.fold;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../style/form.scss';
@import "../../../style/searchForm.scss";

.search-form{
  width: auto;
  min-width: 100%;
}

::v-deep .el-input__inner{
  height: 32px;
  line-height: 32px;
}

.el-form-item{
    margin-bottom: 0px;
    margin-right: 15px;
  }
  .el-form-item__content .el-input-group {
    vertical-align: middle;
  }

  ::v-deep .el-form-item__label{
    font-family: PingFang SC;
    font-weight: 500;
    color: #56576C;
  }

 
</style>