<template>
  <div class="f2bpm-page-layout costListClass">
    <el-container>
      <el-main class="f2bpm-page-right">
        <searchFrom ref="marketFormRef" :formData='formData' :dataDictArray="dataDictArray" @search="searchFormBtnclick"></searchFrom>

        <workTable ref="grid"
          grid="grid"
          :toolbar="tableToolbar"
          :context-menu="{header: {options: headerMenus},className: 'my-menus'}"
          :pager-config="tablePage"
          :table-data="tableData"
          :columns="tableColumn"
          @toolbar-button-click="toolbarButtonClickEvent"
        />
      </el-main>
    </el-container>
  </div>
</template>
<script>
/**
 * 发票信息采集 列表
 */
import workTable from '@/components/table/workTable'
import searchFrom from './components/searchFrom.vue';
import UpdateUploaderFile from '@/components/basic/importTemplateDialog/updateUploaderFile.vue';
import { getDataDictByConfigType } from '@/Api/dataDict.js';
import { getInvoiceCollectionList } from "@/Api/invoice/invoiceCollectionApi";
import { exportApi } from '@/Api/invoice/invoiceApplyApi';
import MyFun from '@/utils/fun';
  
export default {
  components: {
    workTable, searchFrom, UpdateUploaderFile
  },
  data() {
    return {
      clamiVisible: false,  //批量认领弹框
      visibleInvoice: false, 
      // 表单查询的一些默认条件
      tableForm: {
        titleWidth: 100,
        titleAlign: 'right',
        props: { searchPlaceholder: "" },
        data: {
          "code": "",
          "name": "",
          "enableStatus": "",  // 启用状态
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
      importData: {
        visible: false,
        url: '/invoice/invoiceCollectionMain/importDataInvoiceCollection',
        key:'invoiceCollectionExportModel'
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
        pageSize: 20,
        align: 'center',
        pageSizes: [10, 20, 30, 40, 50, 100, 200, 500],
        layout: 'total, sizes, prev, pager, next, jumper'
      },
      dataDictArray: [],
      // 列表数据源
      tableData: [],
      // 表头字段配置
      tableColumn: [],
      // 表格查询条件
      formData: {
        code: '', // 单据编号
        name: '',  // 班组长姓名
        code: '',  // 身份证号
        teamGrade: '',  // 班组评级
        whetherRealName: '',  // 是否实名
        teamWorkType: '',  // 班组工种
        contactTel: '',  // 联系电话
        excelOrSimilarProject: '',  // 擅长或类似项目
        createUserId: '',  // 编制人
      },
      fileId: '',  //文件的id
      pushStatusArray: [],  //推送状态
      paymentArray:[],  //付款状态
    }
  },
  watch: {
    '$route': function (to, from) { 
      if (from.path === '/noWorkflowForm') { 
        this.dataGridSearch();
      }
    }
  },
  created() {
    this.getDataDictByConfigType();
    this.tableColumn = [
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
        field: "id",
        title: "操作",
        align: "center",
        fixed: 'left',
        width: 135,
        type: "html",
        slots: {
            default: ({ row, column }, h) => {
              const hbtns = [];
              const allbtns = [];
              const item5 = {
                index: 8,
                title: "查看",
                class: "fa fa-edit",
                code: "default.view",
                click: () => this.myOperationViewEvent(row.id, row, 8,'detail'),
              };

              let firstItem = null;
              allbtns.push(item5);
              $.each(allbtns, function (i, item) {
                if (i == 0 && firstItem == null) {
                  firstItem = item;
                } else {
                  var itemBtn = h(
                    "el-dropdown-item",
                    {
                      attrs: {
                        btn_code: item.code,
                        title: item.tip,
                      },
                      class: item.class + " block minw80",
                      nativeOn: { click: item.click },
                    },
                    " " + item.title
                  );
                  hbtns.push(itemBtn);
                }
              });
              var dropMenus = h(
                "el-dropdown",
                {
                  props: {
                    size: "mini",
                    splitButton: true,
                    type: "default",
                  },
                  attrs: {
                    btn_code: firstItem.code,
                  },
                  on: {
                    click: firstItem.click,
                  },
                },
                [
                  h(
                    "i",
                    { class: firstItem.class, attrs: { title: firstItem.tip } },
                    " " + firstItem.title
                  ),
                  h(
                    "el-dropdown-menu",
                    {
                      props: {
                        slot: "dropdown",
                      },
                    },
                    hbtns
                  ),
                ]
              );
              return dropMenus;
            },
        },
      },
      {
        field: "code",
        title: "单据编号",
        align: "center",
        width: MyFun.fnTiteWidth(false,'单据编号', 100),
        type: "html",
      },
      {
        field: "invoiceCode",
        title: "付款单号",
        align: "center",
        width: MyFun.fnTiteWidth(false,'付款单号', 100),
        type: "html",
      },
      {
        field: "nameGoodsTaxableService",
        title: "资金系统付款单号",
        align: "center",
        width: MyFun.fnTiteWidth(false,'资金系统付款单号', 100),
        type: "html",
      },
      {
        field: "invoiceCreateTime",
        title: "项目编号",
        align: "center",
        width: MyFun.fnTiteWidth(false,'项目编号', 100),
        type: "html",
      },
      {
        field: "invoiceType",
        title: "项目名称",
        align: "center",
        width: MyFun.fnTiteWidth(false,'项目名称', 100),
        type: "html"
      },
      {
        field: "invoiceAmountUntax",
        title: "本次付款金额",
        align: "center",
        width: MyFun.fnTiteWidth(false,'本次付款金额', 100),
        type: "html",
      },
      {
        field: "tax",
        title: "推送状态",
        align: "center",
        width: MyFun.fnTiteWidth(false,'推送状态', 100),
        type: "html",
      },
      {
        field: "invoiceAmountTax",
        title: "付款状态",
        align: "center",
        width: MyFun.fnTiteWidth(false,'付款状态', 100),
        type: "html",
      },
      {
        field: "sellerName",
        title: "付款发起人",
        align: "center",
        width: MyFun.fnTiteWidth(false,'付款发起人', 100),
        type: "html",
      },
      {
        field: "buyerName",
        title: "编制时间",
        align: "center",
        width: MyFun.fnTiteWidth(false,'编制时间', 100),
        type: "html",
      }
    ]
  },
  mounted () {
    // window.myvm指向当前页面vue实例
    window.myvm = this;
    // 自适应计算高度
    window.autoPageHeight();
    this.dataGridSearch();
  },
  methods: {
    // 操作列查看按钮事件
    myOperationViewEvent(value, row, index, type) {
      this.showDialogEdit(type, row['id']);
    },
    // 打开无流程表单页面
    showDialogEdit(formAction, id) {
      const queryData = {
        code: 'bankPaymentMain',
        path: '/bankPaymentMain/list',
        encode: 'bankPaymentMain',
        myId: id || '',
        rowId: id || '',
        modelName: 'bankPayment',
        formAction: formAction,
        title: '银企直连付款-详情',
        isInterface: true,  //为true不用自己写保存接口
        fullDev: true  // 全开发页面
      }
      this.$router.push({ path: '/noWorkflowForm', query: queryData })
    },
    async getDataDictByConfigType() {
      const configTypes = '推送状态,付款状态';
      let { data, success } = await getDataDictByConfigType({ params: { configTypes: configTypes } });
      if (success) {
        this.dataDictArray = data;
        //推送状态
        this.pushStatusArray = data.find(item => item.dataDictType === '推送状态')?.dataDict || [];
        // 付款状态
        this.paymentArray = data.find(item => item.dataDictType === '付款状态')?.dataDict || [];
    
      }
    },
    // 工具栏按钮 (添加自定义按钮)
    myToolBarCustomButton() {
      const btns = [
        { code: 'export', status: 'primary', name: '导出', icon: 'icon icon-daochu' }
      ]
      return btns;
    },
    //工具栏按钮事件
    toolbarButtonClickEvent({ btn }, event) {
      const code = btn.code;
      if (code === 'export') { //导出
        this.exportData();
      }
    },
    //导出
    async exportData() { 
      let data = await exportApi('invoice','invoiceCollectionMain',this.formData);
    },
    // 页面初始化/刷新查询方法
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
        // parm.order = that.tablePage.order;
        // 调用请求api
        let res = await getInvoiceCollectionList(parm);
        if (res.code === 200) {
          that.tableData = res.data.list;
          that.tablePage.total = res.data.pagination.total;
          that.tablePage.pageCount = res.data.pagination.currentPage;
        } else {
          FUI.Window.showMsg(res.msg);
        }
    },
    //查询
    searchFormBtnclick(obj) {
      this.formData = obj;
      this.getGridData();
    }
  },
}
</script>

<style lang="scss" scoped>
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

  .abnormal-fine-paid{
    padding: 16px;
    p{
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 16px;
    }

    &_radio{
      text-align: center;
      margin: 0 auto;
      width: 100%;
    }
  }
</style>