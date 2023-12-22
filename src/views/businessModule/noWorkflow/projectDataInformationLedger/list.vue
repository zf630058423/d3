<template>
  <div class="f2bpm-page-layout costListClass">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div class="search-box">
          <searchFrom ref="form" @search="searchFormBtnclick"></searchFrom>
        </div>
        <workTable ref="grid" grid="grid" :toolbar="tableToolbar"
          :context-menu="{ header: { options: headerMenus }, className: 'my-menus' }" :pager-config="tablePage"
          :table-data="tableData" :columns="tableColumn" @toolbar-button-click="toolbarButtonClickEvent"
          @page-change="pageChange" @sort-change="sortChange" @checkbox-change="checkboxChange"
          @checkbox-all="checkboxChangeAll" />
      </el-main>
    </el-container>
  </div>
</template>


<script>
import workTable from '@/components/table/workTable'
import searchFrom from './components/searchFrom.vue';
import { projectDataInformationLedger } from '@/Api/contract/index';
export default {
  components: {
    workTable, searchFrom
  },
  data() {
    return {
      // 表单查询的一些默认条件
      tableForm: {
        titleWidth: 100,
        titleAlign: 'right',
        props: { searchPlaceholder: "" },
        data: {
          "code": "",
          "contractOutMainCode": "",
          "contractOutMainName": "",
          "constructArchiveMainCode": "",
          "constructArchiveMainName": "",
          "contractPartyAName": "",
          "contractPartyBName": "",
        },
      },
      // 工具格 具体使用可找到UI.DataGridProperty去看
      tableToolbar: {
        id: '',
        buttons: [],
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
      // 表格查询条件
      formData: {
        code: '', // 单据编号
        contractOutMainCode: '',  // 主合同编号
        contractOutMainName: '',  // 主合同名称
        constructArchiveMainCode: '',  //	项目编号
        constructArchiveMainName: '',   // 项目名称
        contractPartyAName: '',   // 乙方
        contractPartyBName: '',   // 甲方
      },
      isOpen: false,
      value1: null,
      multipleSelection: [], // 存储列表勾选rows
      // natureOfSupplierList:[],
      customerCategoryNameList: [],
      customerLevelNameList: [],
      enableStateList: [],
      customerStatusList: []
    }
  },
  mounted() {
    // window.myvm指向当前页面vue实例
    window.myvm = this;
    // 自适应计算高度
    window.autoPageHeight();

  },
  beforeDestroy() {
    // this.getDataDictByConfigType();
  },
  created() {
    var that = this;
    // 流程表单ID 找到对应流程应用id(在流程应用关联流程的时候会有) 直接写死 很重要
    that.appId = '';
    // 自主开发需要自定义表头字段
    that.tableColumn = [
      {
        type: "seq",
        title: "序号",
        fixed: 'left',
        width: 35,
        align: "center",
      }, {
        field: "marketCenterName",
        title: "业务中心",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "marketUnitName",
        title: "业务单元",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "marketCode",
        title: "立项编号",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "constructArchiveMainCode",
        title: "项目编号",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "contractInCode",
        title: "合同编号",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "contractAmountTax",
        title: "合同金额(元)",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "constructArchiveMainName",
        title: "项目名称/立项名称",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "projectAddress",
        title: "项目地址",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "customerName",
        title: "客户",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "contactPerson",
        title: "客户联系人",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "contactTitle",
        title: "客户联系人职务",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "contactPhone",
        title: "客户联系人电话",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "superUnit",
        title: "监理单位",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "superUnitLinkMan",
        title: "监理单位联系人",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "superUnitLinkManContactTitle",
        title: "监理单位联系人职务",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "superUnitLinkManTel",
        title: "监理单位联系人电话",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "projectManagerName",
        title: "项目负责人",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "projectManagerTel",
        title: "项目负责人电话",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "constructionTaxRate",
        title: "工程税率",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "performanceBond",
        title: "履约保证金",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "warrantyAmount",
        title: "质保金额",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "projectStatus",
        title: "项目状态",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "contractStartDate",
        title: "合同开工日期",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "contractEndDate",
        title: "合同竣工日期",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "contractDuration",
        title: "合同工期(天)",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "actualCommencementDate",
        title: "实际开工日期",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "actualCompletionDate",
        title: "实际完工日期",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "actualContractDuration",
        title: "实际工期(天)",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "premium",
        title: "保险购买（有/无）",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "premium",
        title: "工程保险购买金额",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "projectSchedule",
        title: "项目累计进度",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "accumulatedPaymentAmount",
        title: "累计回款金额",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "contractAmount",
        title: "累计回款金额比例",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "accumulatedInvoicingAmount",
        title: "累计开票金额",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "outstandingAmountReceivable",
        title: "应收未收金额",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "advPayment",
        title: "预付款比例",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "proPayment",
        title: "进度款比例",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "comPayment",
        title: "完工款比例",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "settlement",
        title: "结算款比例",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "retMoney",
        title: "质保金比例",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "haveBidNotice",
        title: "中标通知书",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "haveContractInMain",
        title: "建安合同",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "haveConstructionPermit",
        title: "施工许可证/项目开工令",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "haveCompletionReport",
        title: "竣工报告",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "contractAmount", // 
        title: "资料上传率",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "haveBuiltDrawings",
        title: "竣工图状态",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "haveStatement",
        title: "结算书",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "accumulatedChangeAmount",
        title: "累计变更金额（元）",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "settlementAmount",
        title: "结算金额",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "laborContractNumber",
        title: "劳务合同份数（工班）",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "laborPaymentInformationNumber",
        title: "劳务付款资料份数",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "laborSubcontractingAmount",
        title: "劳务分包金额",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "laborSettlementAmount",
        title: "劳务结算金额",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "laborPaidAmount",
        title: "劳务款已支付金额",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "laborUnpaidAmount",
        title: "劳务款未支付金额",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "materialContractNumber",
        title: "材料合同份数",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "materialSettlementAmount",
        title: "材料结算金额",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "materialPaidAmount",
        title: "已付材料款金额",
        align: "center",
        width: 200,
        type: "html",
      }, {
        field: "materialUnpaidAmount",
        title: "未付材料款金额",
        align: "center",
        width: 200,
        type: "html",
      }
    ];
    this.dataGridSearch();
    // this.getDataDictByConfigType();
  },
  methods: {
    // 重置
    resetForm() {
      this.$refs.businessFormRef.btnclick('dataGridReSet');
      this.dataGridSearch()
    },
    // 操作列自定义按钮
    myOperationCustomButton(h, value, row, index) {
      var custBtns = [];
      var item = { title: '示自定义', tip: '提示自定义', class: 'fa fa-trash-o', code: 'custom', click: () => this.operationCustomButtonClick(value, row, index) };
      custBtns.push(item);
      return custBtns;
    },
    // 操作列查看按钮事件
    myOperationViewEvent(value, row, index, type) {
      this.showDialogEdit(type, row['id']);
    },
    // 操作列编辑按钮事件
    myOperationEditEvent(value, row, index, type) {
      this.showDialogEdit(type, row['id']);
    },
    // 操作列删除按钮事件
    myOperationDeleteEvent(value, row, index) {
      var that = this;
    },
    // 打开无流程表单页面
    showDialogEdit(formAction, id) {
      this.$router.push({ path: '/supplierCooperate/supplierCooperateForm', query: { rowId: id } })
    },
    // 工具栏按钮事件
    toolbarButtonClickEvent({ btn }, event) {
      const that = this;
      var code = btn.code;
      if (code == 'closeEdit') {
        FUI.Window.closeEdit();
      }
      else if (code == 'search') {
        // 自定义搜索事件
        that.searchFormBtnclick(this.formData);
      }
      else if (code == 'reset') {
        this.formData = {};
        that.dataGridSearch();
      }
      else if (code == 'add') {
        let queryData = {
          code: 'supplierMain',
          path: '/supplierMain/sporadicList',   // 关闭时回到列表页面
          encode: 'supplierMain',
          myId: '',
          formAction: 'add',
          title: '零星供应商-新增',
          fullDev: true  // 全开发页面
        }
        this.$router.push({ path: '/noWorkflowForm', query: queryData })
      } else if (code == 'delete') {
        // 自定义删除事件
        that.handelDelete();
      } else if (code == 'Export') {
        // 自定义导出事件
        // var rows= that.multipleSelection; // 获取选中行数据
        that.exportExcel(that.formData);
      }
      else {
        var fn = that[code];
        fn(code);
      }
    },
    // 刷新列表
    refreshGrid(parentGridId, parm) {
      var that = this;
      that.dataGridSearch();
    },
    // 页面初始化/刷新查询方法
    dataGridSearch() {
      this.tablePage.currentPage = 1;
      this.tablePage.startIndex = 0;
      this.getGridData();
    },
    // 获取table数据  
    async getGridData() {
      const that = this;
      let parm = Object.toClone(that.formData);
      parm.currentPage = that.tablePage.currentPage;
      parm.pageSize = that.tablePage.pageSize;
      parm.sort = that.tablePage.sort;
      // parm.order = that.tablePage.order; 
      // 调用请求api
      var res = await projectDataInformationLedger(parm);
      if (res.code === 200) {
        that.tableData = res.data.list;
        that.tablePage.total = res.data.pagination.total;
        that.tablePage.pageCount = res.data.pagination.currentPage;
      } else {
        FUI.Window.showMsg(res.msg);
      }
    },
    // 切换状态
    handelIsOpen() {
      this.isOpen = !this.isOpen;
    },
    // 删除方法
    handelDelete() {
      var that = this;
      var rows = that.multipleSelection; // 获取选中行数据
      if (rows.length === 0) {
        FUI.Window.showMsg('请先选择要删除的数据');
        return false
      }
      console.log(rows);
      var arr = [];
      for (let i in rows) {
        arr.push(rows[i]['id']);
      }
    },
    // 分页事件
    pageChange(obj) {
      console.log('分页事件1：' + JSON.stringify(obj));
      this.formData.pageIndex = obj.currentPage;
      this.formData.pageSize = obj.pageSize;
      this.getGridData();
    },
    // 分页事件
    sortChange(obj) {
      console.log('分页事件2：' + JSON.stringify(obj));
      this.formData.pageIndex = obj.currentPage;
      this.formData.pageSize = obj.pageSize;
      this.getGridData();
    },
    // 列表复选框事件(单选)
    checkboxChange(obj, selection) {
      console.log(obj, selection);
      this.multipleSelection = selection;

    },
    // 列表复选框事件(全选)
    checkboxChangeAll(obj) {
      console.log(obj);
      var that = this;
      if (obj.checked) {
        that.multipleSelection = obj.selection;
      } else {
        that.multipleSelection = [];
      }

    },
    // 查询 or 重置事件
    searchFormBtnclick(obj) {
      this.formData = obj;
      this.getGridData();
    },
  }
}
</script>

<style>
.inputWidthNum {
  min-width: 200px;
}

.expans-more {
  margin-left: 15px;
  cursor: pointer;
  font-size: 10px;
  color: #0D1126;
}

.costListClass .el-form-item {
  margin-bottom: 10px;
  margin-right: 15px;
}

.el-form-item__content .el-input-group {
  vertical-align: middle;
}
</style>
