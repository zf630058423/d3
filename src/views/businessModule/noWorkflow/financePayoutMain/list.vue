<template>
  <!--付款台账 -->
  <div class="f2bpm-page-layout costListClass">
    <el-container>
      <el-main class="f2bpm-page-right">
        <!-- <div class="search-box">
          <workSearchForm ref="form" :tableform="tableForm" @expandclick="expandClick" @searchForm-click="searchFormBtnclick"></workSearchForm>
        </div> -->
        <searchFrom @search="searchFormBtnclick" ref="businessFormRef" @exportExcel="exportExcel"></searchFrom>
        <workTable ref="grid"
          grid="grid"
          :toolbar="tableToolbar"
          :context-menu="{header: {options: headerMenus},className: 'my-menus'}"
          :pager-config="tablePage"
          :table-data="tableData"
          :columns="tableColumn"
          @toolbar-button-click="toolbarButtonClickEvent"
          @page-change="pageChange"
          @sort-change="sortChange"
          @checkbox-change="checkboxChange"
          @checkbox-all="checkboxChangeAll"
        />
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import workTable from '@/components/table/workTable'
  // import workSearchForm from '@/components/table/workSearchForm'
  import searchFrom from './components/searchFrom.vue';
  // import {getlaborList, deleteLabor} from '@/Api/supplier/index'; 
  import {getDataDictByConfigType} from '@/Api/dataDict.js'
  // import { exportLabor } from '@/Api/supplier/index';
  import {queryPayoutList, exportPayoutLedger} from '@/Api/supplier/index'; 
  export default {
    components:{
      workTable,searchFrom
    },
    data () {
      return {
        // 表单查询的一些默认条件
        tableForm: {
          titleWidth: 100,
          titleAlign: 'right',
          props: { searchPlaceholder: "" },
          data: {
            "code": "",
            "customerName": "",
            "enableStatus": "",
            "taxRegistrationNum": "",
            "natureOfSupplier": "",
            "customerProperty": "",
          },
        },
        // 工具格 具体使用可找到UI.DataGridProperty去看
        tableToolbar: {
          id: '',
          buttons: this.myToolBarCustomButton(),
        },
        // 表头配置项 // 表头右键菜单{header: {options: headerMenus},className: 'my-menus'}
        headerMenus: [{ code: 'configHead', name: '配置表头', prefixIcon: 'fa fa-cog', }],
        // 分页配置及总数量 配置,pagination:false不分页
        tablePage: {
          pageCount: 0,
          sort: '', // 排序字段
          order: 'asc', // 排序方向
          total: 0,
          currentPage: 1,
          pageSize: 15,
          align: 'center',
          pageSizes: [2, 10, 15, 20, 50, 100, 200, 500],
          layout: 'total, sizes, prev, pager, next, jumper'
        },
        // 列表数据源
        tableData: [],
        // 表头字段配置
        tableColumn: [],
        // 查询条件
        formData: {
          pageIndex:1,
          pageSize: 15
        },
        // 搜索框查询条件
        formSupplierdata: {
          code: '', // 单据编号
          marketMainCode: '', // 立项编号
          constructArchiveMainCode: '', // 项目编号
          paymentFinanceOrgName: '',  // 付款财务组织
          createUserName: '',  // 编制人
          moduleType: '',  //	菜单名
          createTime: '',  // 编制日期
        },
        isOpen: false,
        value1: null,
        multipleSelection: [], // 存储列表勾选rows
        // natureOfSupplierList:[],
        customerCategoryNameList:[],
        customerLevelNameList:[],
        enableStateList:[],
        customerStatusList:[]
      }
    },
    mounted () {
      // window.myvm指向当前页面vue实例
      window.myvm = this;
      // 自适应计算高度
      window.autoPageHeight();

    },
    beforeDestroy(){
      // this.getDataDictByConfigType();
    },
    created () {
      var that = this;
      // 流程表单ID 找到对应流程应用id(在流程应用关联流程的时候会有) 直接写死 很重要
      that.appId = '';
      // 自主开发需要自定义表头字段
      that.tableColumn = [
        {
          type: "checkbox",
          fixed: 'left',
          width: 35,
          align: "center"
        },
        {
          type: "seq",
          title: "序号",
          fixed: 'left',
          width: 35,
          align: "center",
        },
        {
          field: "moduleType",
          title: "菜单名",
          align: "center",
          type: "html",
          width: 150,
          slots: {
            default: ({ row, column }, h) => {
              return (this.getModuleType(row.moduleType))
            },
          }
        },
        {
          field: "code",
          title: "单据编号",
          align: "center",
          width: 150,
          type: "html",
        },
        {
          field: "marketMainCode",
          title: "立项编号",
          align: "center",
          width: 150,
          type: "html",
        },
        {
          field: "marketMainName",
          title: "立项名称",
          align: "center",
          width: 150,
          type: "html",
        },
        {
          field: "businessUnit",
          title: "业务单元",
          align: "center",
          width: 150,
          type: "html",
        },
        {
          field: "businessCenter",
          title: "业务中心",
          align: "center",
          width: 150,
          type: "html",
        //   slots: {
        //     default: ({ row, column }, h) => {
        //       return (this.getSupplier(row.natureOfSupplier))
        //     },
        //   }
        },
        {
          field: "constructArchiveMainCode",
          title: "项目编号",
          align: "center",
          width: 150,
          type: "html",
        },
         {
          field: "constructArchiveMainName",
          title: "项目名称",
          align: "center",
          width: 150,
          type: "html",
        },
        {
          field: "businessUnit",
          title: "项目部",
          align: "center",
          width: 150,
          type: "html",
        },
        {
          field: "constructionUnitName",
          title: "管理部门",
          align: "center",
          width: 150,
          type: "html",
        },
        {
          field: "applyAmount",
          title: "付款金额(元)",
          align: "center",
          width: 150,
          type: "html",
        },
         {
          field: "refundAmount",
          title: "退款金额(元)",
          align: "center",
          width: 150,
          type: "html",
        },
        {
          field: "paymentAccountNumber",
          title: "付款账号",
          align: "center",
          width: 150,
          type: "html",
        },
        {
          field: "payInUserName",
          title: "收款方",
          align: "center",
          width: 150,
          type: "html",
        },
        {
          field: "payeeBankAcc",
          title: "收款账号",
          align: "center",
          width: 150,
          type: "html",
        //   slots: {
        //     default: ({ row, column }, h) => {
        //       return (this.getCustomerStatus(row.strategiccustomerornot))
        //     },
        //   }
        },
        {
          field: "interBankNo",
          title: "收款银行联行号",
          align: "center",
          width: 150,
          type: "html",
        },
        {
          field: "guaranteeStatus",
          title: "保函状态",
          align: "center",
          width: 150,
          type: "html",
        },
        {
          field: "payeeBankAcc",
          title: "收款账号",
          align: "center",
          width: 150,
          type: "html",
        },
        {
          field: "createUserName",
          title: "编制人",
          align: "center",
          width: 150,
          type: "html"
        }, 
        {
          field: "createTime",
          title: "编制时间",
          align: "center",
          width: 150,
          type: "html"
        },
        {
          field: "loanTreatAmount",
          title: "借款待还金额",
          align: "center",
          width: 150,
          type: "html",
        },
         {
          field: "marginBackDate",
          title: "保证金退回日期",
          align: "center",
          width: 150,
          type: "html",
        },
        {
          field: "marginBackAmount",
          title: "保证金退还金额",
          align: "center",
          width: 150,
          type: "html",
        },
        {
          field: "processFinishedTime",
          title: "审批通过时间",
          align: "center",
          width: 150,
          type: "html",
        },
        {
          field: "balaType",
          title: "结算方式",
          align: "center",
          width: 150,
          type: "html",
          slots: {
            default: ({ row, column }, h) => {
              return (this.getBalaType(row.balaType))
            },
          }
        }
      ];
      this.dataGridSearch();
      // this.getDataDictByConfigType();
    },
    watch:{
      formSupplierdata:{
        handler(newValue){
          this.formSupplierdata = newValue
        },
        deep:true
      }
    },
    methods: {
      // 重置
      resetForm () {
        this.$refs.businessFormRef.btnclick('dataGridReSet');
        this.dataGridSearch()
      },
      // 搜索
      searchFn () {
        this.dataGridSearch()
      },
      // 操作列自定义按钮
      myOperationCustomButton (h, value, row, index) {
        var custBtns = [];
        var item = { title: '示自定义', tip: '提示自定义', class: 'fa fa-trash-o', code: 'custom', click: () => this.operationCustomButtonClick(value, row, index) };
        custBtns.push(item);
        return custBtns;
      },
      // 工具栏按钮 (添加自定义按钮)
      myToolBarCustomButton () {
        var btns = [
          { code: 'Export', status: 'primary', name: '导出', alias: 'Export', icon: 'icon icon-daochu' }
        ];
        return btns;
      },
      // 工具栏按钮事件
      toolbarButtonClickEvent ({btn}, event) {
        const that = this;
        var code = btn.code;
        if (code == 'search') {
          // 自定义搜索事件
          // that.searchFormBtnclick(this.formSupplierdata);
          this.searchFormBtnclick();
        }
        else if (code == 'reset') {
          // 自定义重置事件
          this.$refs.businessFormRef.btnclick('dataGridReSet');
          this.searchFormBtnclick()
        }
        else if (code == 'Export') {
          // 自定义导出事件
          that.exportExcel(that.formSupplierdata);
        }
        else {
          var fn = that[code];
          fn(code);
        }
      },
      // 刷新列表
      refreshGrid (parentGridId, parm) {
        var that = this;
        that.dataGridSearch();
      },
      // 刷新查询方法
      dataGridSearch () {
        this.tablePage.currentPage = 1;
        this.tablePage.startIndex = 0;
        this.getGridData();
      },
      // 获取table数据  
      async getGridData () {
        const that = this;
        let parm = Object.toClone(that.formData);
        parm.currentPage = that.tablePage.currentPage;
        parm.pageSize = that.tablePage.pageSize;
        parm.sort = that.tablePage.sort;
        // 调用请求api
        var res = await queryPayoutList(parm);
        if (res.code === 200) {
          that.tableData = res.data.list;
          that.tablePage.total = res.data.pagination.total;
          that.tablePage.pageCount = res.data.pagination.currentPage;
        } else {
          FUI.Window.showMsg(res.msg);
        }
      },
      // 切换状态
      handelIsOpen(){
        this.isOpen = !this.isOpen;
      },
      // 分页事件
      pageChange(obj){
        console.log('分页事件1：'+ JSON.stringify(obj));
        this.formData.pageIndex = obj.currentPage;
        this.formData.pageSize = obj.pageSize;
        this.getGridData();
      },
      // 分页事件
      sortChange(obj){
        console.log('分页事件2：'+JSON.stringify(obj));
        this.formData.pageIndex = obj.currentPage;
        this.formData.pageSize = obj.pageSize;
        this.getGridData();
      },
      // 列表复选框事件(单选)
      checkboxChange(obj, selection){
        console.log(obj,selection);
        this.multipleSelection = selection;

      },
      // 列表复选框事件(全选)
      checkboxChangeAll(obj){
        console.log(obj);
        var that = this;
        if(obj.checked){
          that.multipleSelection = obj.selection;
        }else {
          that.multipleSelection = [];
        }
      },
      // 查询 or 重置事件
      searchFormBtnclick(obj){
        this.formData = obj;
        this.getGridData();
      },
      // 转换供应商性质
      getSupplier(status) {
        return status==="1"?'内部':'外部';
      },
      // 转换菜单名
      getModuleType(moduleType) {
        switch (moduleType) {
          case '1':
            return '劳务付款'
            break
          case '2':
            return '专业分包付款'
            break
          case '3':
            return '材料付款'
            break
          case '4':
            return '租赁付款'
            break
          case '5':
            return '其他付款'
            break
          case '6':
            return '项目费用报销'
            break
          case '7':
            return '员工费用报销'
            break
          case '8':
            return '集采付款'
            break
          case '9':
            return '投标保证金支付申请'
            break
          case '10':
            return '履约保证金支付申请'
            break
           case '100':
            return '项目借款'
            break
          case '101':
            return '员工借款'
            break
          case '102':
            return '保函开具'
            break
        }
        return ''
      },
      // 转换结算方式
      getBalaType(balaType) {
        switch (balaType) {
          case '1':
            return '网银(银行转账)'
            break
          case '2':
            return '转账支票'
            break
          case '3':
            return '冲借款'
            break
          case '4':
            return '现金'
            break
          case '6':
            return '现金支票'
            break
        }
        return ''
      },
      // 导出
      async exportExcel(obj) { 
        let paramData = {
          ...obj
        }
        this.loading = true;
        await exportPayoutLedger(paramData);
        this.loading = false;
      }
    }
  }
</script>

<style>
  .inputWidthNum{
    min-width: 200px;
  }
  .expans-more {
    margin-left: 15px;
    cursor: pointer;
    font-size: 10px;
    color: #0D1126;
  }
  .costListClass .el-form-item{
    margin-bottom: 10px;
    margin-right: 15px;
  }
  .el-form-item__content .el-input-group {
    vertical-align: middle;
  }
</style>
