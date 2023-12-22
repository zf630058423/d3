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
          @page-change="pageChange"
          @sort-change="sortChange"
          @selection-change="handleSelectionChange"
          @checkbox-change="checkboxChange"
          @checkbox-all="checkboxChangeAll"
        />
      </el-main>
    </el-container>
.
    <!-- 批量认领 弹框 -->
    <fui-dialog :visible.sync="clamiVisible" title="批量认领" cancelText="取消" confirmText="确定" @on-cancel="onClamiCancel" @on-confirm="clamiConfirm">
      <div class="clamipop">
          <div class="clamipop_num">
            <span class="clamipop_num_span">选中个数：</span>
            <span class="clamipop_num_text">{{ clamiNum }}</span>
          </div>
          <div class="clamipop_subject_item">
            <span class="clamipop_subject_item_span">收支项目：</span>
            <span class="clamipop_subject_item_text">
              <el-select v-model="clamiSubjectItem" placeholder="请选择">
                <!-- <el-option :label="" :value=""></el-option> -->
              </el-select>
            </span>
          </div>
      </div>
    </fui-dialog>

    <!-- 导入弹框 -->
    <uploader-details :visible.sync="importData.visible" :keyword="importData.key" :uploaderUrl="importData.url" @importSuccess="importSuccess"></uploader-details>
  </div>
</template>
<script>
/**
 * 银企直连收款 列表
 */
import workTable from '@/components/table/workTable'
import SearchFrom from './components/searchFrom.vue';
import UpdateUploaderFile from '@/components/basic/importTemplateDialog/updateUploaderFile.vue';
import { getDataDictByConfigType } from '@/Api/dataDict.js';
import { getInvoiceCollectionList } from "@/Api/invoice/invoiceCollectionApi";
// import MessageBox from '@/components/basic/messageBox/index.vue';
import FuiDialog from '@/components/basic/FuiDialog/index.vue';
import UploaderDetails from '@/components/basic/importTemplateDialog/uploaderDetails.vue';
import {
  queryInvoiceClaimInfoApi,  //批量认领
  pushExpenseHoldingApi,
  exportApi,
} from '@/Api/invoice/invoiceApplyApi';
import MyFun from '@/utils/fun';
  
export default {
  components: {
    workTable, SearchFrom, UpdateUploaderFile, FuiDialog, UploaderDetails
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
      clamiNum: 0,
      clamiSubjectItem:'',
      invoiceTypeArray: [],  //发票类型
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
      updateInvoiceData: {
        visible: false,
        url: '/invoice/invoiceCollectionMain/importDataUpdateInvoiceCollection',
        key:'updateInvoiceModel'
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
        name: '', 
        code: '',  // 身份证号
        teamGrade: '',  // 班组评级
        whetherRealName: '',  // 是否实名
        teamWorkType: '',  // 班组工种
        contactTel: '',  // 联系电话
        excelOrSimilarProject: '',  // 擅长或类似项目
        createUserId: '',  // 编制人
      },
      selectRows:[], //选择的
      fileId: '',  //文件的id
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
        width: MyFun.fnTiteWidth(false,'code', 100),
        type: "html",
      },
      {
        field: "tradeDate",
        title: "交易日期",
        align: "center",
        width: MyFun.fnTiteWidth(false,'交易日期', 100),
        type: "html",
      },
      {
        field: "pay",
        title: "付款方",
        align: "center",
        width: MyFun.fnTiteWidth(false,'付款方', 100),
        type: "html",
      },
      {
        field: "collectedAmount",
        title: "收款金额",
        align: "center",
        width: MyFun.fnTiteWidth(false,'收款金额', 100),
        type: "html",
      },
      {
        field: "payee",
        title: "本方单位",
        align: "center",
        width: MyFun.fnTiteWidth(false,'本方单位', 100),
        type: "html"
      },
      {
        field: "payeeAccount",
        title: "本方银行账号",
        align: "center",
        width: MyFun.fnTiteWidth(false,'本方银行账号', 100),
        type: "html",
      },
      {
        field: "subjectTtem",
        title: "收支项目",
        align: "center",
        width: MyFun.fnTiteWidth(false,'收支项目', 100),
        type: "html",
      },
      {
        field: "projectCode",
        title: "项目编号",
        align: "center",
        width: MyFun.fnTiteWidth(false,'项目编号', 100),
        type: "html",
      },
      {
        field: "claimStatus",
        title: "认领状态",
        align: "center",
        width: MyFun.fnTiteWidth(false,'认领状态', 100),
        type: "html",
      },
      {
        field: "invoiceClaimant",
        title: "认领人",
        align: "center",
        width: MyFun.fnTiteWidth(false,'认领人', 100),
        type: "html",
      },
      {
        field: "claimTime",
        title: "认领时间",
        align: "center",
        width: MyFun.fnTiteWidth(false,'认领时间', 100),
        type: "html"
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
        code: 'bankCollectionMain',
        path: '/bankCollectionMain/list',
        encode: 'bankCollectionMain',
        myId: id || '',
        rowId: id || '',
        modelName: 'bankCollectionMain',
        formAction: formAction,
        title: '银企直连收款-详情',
        isInterface: true,  //为true不用自己写保存接口
        fullDev: true  // 全开发页面
      }
      this.$router.push({ path: '/noWorkflowForm', query: queryData })
    },
    async getDataDictByConfigType() {
      const configTypes = '认领状态,收支项目';
      let { data, success } = await getDataDictByConfigType({ params: { configTypes: configTypes } });
      if (success) {
        this.dataDictArray = data;
        //认领状态
        this.claimStatusArray = data.find(item => item.dataDictType === '认领状态')?.dataDict || [];
      }
    },
    // 工具栏按钮 (添加自定义按钮)
    myToolBarCustomButton() {
      const btns = [
        { code: 'downloadAtt', status: 'primary', name: '批量认领', icon: '' },
        { code: 'import', status: 'primary', name: '导入', icon: 'icon icon-daoru1' },
        { code: 'export', status: 'primary', name: '导出', icon: 'icon icon-daochu' }
      ]
      return btns;
    },
    //工具栏按钮事件
    toolbarButtonClickEvent({ btn }, event) {
      const code = btn.code;
      if (code === 'add') {
        let queryData = {
          code: 'bankCollectionMain',
          path: '/bankCollectionMain/list',   // 关闭时回到列表页面
          encode: 'bankCollectionMain',
          myId: '',
          modelName: 'bankCollectionMain',
          formAction: 0,
          title: '银企直连收款-新增',
          appId: 'ES',
          isInterface: true,  //为true不用自己写保存接口
          fullDev: true  // 全开发页面
        }
        this.$router.push({ path: '/noWorkflowForm', query: queryData })
      } else if (code === 'downloadAtt') { //批量认领
        if (this.selectRows.length === 0) { 
          this.$message.error('请至少选择一条数据进行认领');
          return false;
        }
        this.clamiVisible = true;
      } else if (code === 'import') { //导入
        this.importData.visible = true;
      } else if (code === 'export') { //导出
        this.exportData();
      }
    },
    //取消
    onClamiCancel() { 
      this.clamiVisible = false;
    },
    clamiConfirm() {

     },
    //导出
    async exportData() { 
      let data = await exportApi('invoice','invoiceCollectionMain',this.formData);
    },
    //批量认领
    async queryInvoiceClaimInfoData(ids) {
      const params = {
        idList: ids
      }
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
        console.log("parm===:",parm);
        let res = await getInvoiceCollectionList(parm);
        if (res.code === 200) {
          that.tableData = res.data.list;
          that.tablePage.total = res.data.pagination.total;
          that.tablePage.pageCount = res.data.pagination.currentPage;
        } else {
          FUI.Window.showMsg(res.msg);
        }
    },
    //导入成功回调
    importSuccess(dataList) {
      this.tableData = dataList;
      this.importData.visible = false;
      this.dataGridSearch();
    },
    //更新发票信息
    updateSuccess(dataList) {
      console.log("更新发票信息===：", dataList);
      this.updateInvoiceData.visible = false;
      this.dataGridSearch();
     },
    //查询
    searchFormBtnclick(obj) {
      this.formData = obj;
      this.getGridData();
    },
    pageChange(obj) { },
    sortChange() { },
    handleSelectionChange(rows) {
      console.log("选择的数据===：",rows);
    },
    checkboxChange({ row, checked}) {
      if (checked) {
        this.selectRows.push(row)
      } else { 
        this.selectRows = this.selectRows.filter(el => el.id !== row.id);
      }
     },
    checkboxChangeAll(obj) { }
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

  .clamipop{
    padding: 16px;
    width: 400px;
    margin: 0 auto;

    &_num{
      margin: 10px auto;

      &_span{
        font-weight: bold;
      }

      &_text{
        color: #FF3333;
      }
    }

    &_subject_item{
      margin: 16px auto;

      &_span{
        font-weight: bold;
      }
    }

  }
</style>