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
    
    <!-- 批量认领弹框 -->
    <invoice-clami-pop :visible.sync="clamiVisible" @clamiSuccess="clamiSuccess"></invoice-clami-pop>

    <!-- 异常已交罚款 弹框 -->
    <fui-dialog :visible.sync="visibleBox" title="提醒" cancelText="取消" confirmText="确定" @on-cancel="onCancel" @on-confirm="abnormalConfirm">
      <div class="abnormal-fine-paid">
        <p>异常已交罚款？</p>
        <el-radio-group class="abnormal-fine-paid_radio" v-model="abnormalFinePaidStatus">
          <el-radio :label="1">已交</el-radio>
          <el-radio :label="2">未交</el-radio>
        </el-radio-group>
      </div>
    </fui-dialog>

    <!-- 收到发票原件 弹框 -->
    <fui-dialog :visible.sync="visibleInvoice" title="提醒" cancelText="取消" confirmText="确定" @on-cancel="onInvoiceCancel" @on-confirm="invoiceConfirm">
      <div class="abnormal-fine-paid">
        <p>是否收到发票原件？</p>
        <el-radio-group class="abnormal-fine-paid_radio" v-model="invoiceFineStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </div>
    </fui-dialog>

    <!-- 更新发票信息 -->
    <uploader-details title="更新发票信息" confirmText="确定更新" successText="更新发票信息成功" :visible.sync="updateInvoiceData.visible" :keyword="updateInvoiceData.key" :uploaderUrl="updateInvoiceData.url" @importSuccess="updateSuccess"></uploader-details>

    <!-- 导入弹框 -->
    <uploader-details :visible.sync="importData.visible" :keyword="importData.key" :uploaderUrl="importData.url" @importSuccess="importSuccess"></uploader-details>
  </div>
</template>
<script>
/**
 * 发票信息采集 列表
 */
import workTable from '@/components/table/workTable'
import searchFrom from './components/searchFrom.vue';
import InvoiceClamiPop from './components/invoiceClaimPop.vue'; //发票信息采集批量认领 弹框
import UpdateUploaderFile from '@/components/basic/importTemplateDialog/updateUploaderFile.vue';
import { getDataDictByConfigType } from '@/Api/dataDict.js';
import { getInvoiceCollectionList } from "@/Api/invoice/invoiceCollectionApi";
// import MessageBox from '@/components/basic/messageBox/index.vue';
import FuiDialog from '@/components/basic/FuiDialog/index.vue';
import UploaderDetails from '@/components/basic/importTemplateDialog/uploaderDetails.vue';
import {
  invoiceCollectionDelete,
  queryInvoiceClaimInfoApi,  //批量认领
  pushExpenseHoldingApi,
  exportApi,
  batchUpdateReviewApi,
  oneClickReviewApi,
  batchUpdateAbnormalFinePaidApi,
  batchUpdateReceivedOriginalInvoiceApi,
  postTicketReplenishmentApi,  //付款、后补票
  importDataUpdateInvoiceCollectionApi  //更新发票信息
} from '@/Api/invoice/invoiceApplyApi';
import MyFun from '@/utils/fun';
  
export default {
  components: {
    workTable, searchFrom, UpdateUploaderFile, InvoiceClamiPop, FuiDialog, UploaderDetails
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
      invoiceTypeArray: [],  //发票类型
      haveReceivedOriginalInvoiceArray:[],  //是否收到发票原件
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
      updateData: {
        visible: false,
        url: '/invoice/invoiceOpenMain/update'
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
      selectRows:[], //选择的
      fileId: '',  //文件的id
      isOpen: false,
      multipleSelection: [], // 存储列表勾选rows
      enableStateList: [],
      invoiceStatusArray: [],  //开票状态
      sourceInvoiceArray: [],  //发票来源
      visibleBox: false,
      abnormalFinePaidStatus: '',  //异常已交罚款(1-已交；2-未交；)	
      invoiceFineStatus:'',  //是否收到发票原件(0-否；1-是；)	
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
              const item1 = {
                index: 1,
                title: "编辑",
                class: "fa fa-edit",
                code: "default.edit",
                click: () => this.myOperationEditEvent(row.id, row, 1,'edit'),
              };
              const item2 = {
                index: 2,
                title: "删除",
                class: "fa fa-remove",
                code: "default.remove",
                click: () => this.myOperationDeleteEvent(row.id, row, 2, 'del'),
              };
              const item5 = {
                index: 8,
                title: "查看",
                class: "fa fa-edit",
                code: "default.view",
                click: () => this.myOperationViewEvent(row.id, row, 8,'detail'),
              };

              let firstItem = null;
              allbtns.push(item5);
              allbtns.push(item1);
              allbtns.push(item2);
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
        field: "invoiceNo",
        title: "发票号码",
        align: "center",
        width: MyFun.fnTiteWidth(false,'发票号码', 100),
        type: "html",
      },
      {
        field: "invoiceCode",
        title: "发票代码",
        align: "center",
        width: MyFun.fnTiteWidth(false,'发票代码', 100),
        type: "html",
      },
      {
        field: "nameGoodsTaxableService",
        title: "货物或应税劳务、服务名称",
        align: "center",
        width: MyFun.fnTiteWidth(false,'货物或应税劳务、服务名称', 100),
        type: "html",
      },
      {
        field: "invoiceCreateTime",
        title: "开票日期",
        align: "center",
        width: MyFun.fnTiteWidth(false,'开票日期', 100),
        type: "html",
      },
      {
        field: "invoiceType",
        title: "发票类型",
        align: "center",
        width: MyFun.fnTiteWidth(false,'开票日期', 100),
        type: "html",
        slots: {
          default: ({ row, column }, h) => {
            const text = this.invoiceTypeArray.find(item => item.configValue === row.invoiceType)?.configName || '';
            return (
              <span>{ text }</span>
             )
           }
        }
      },
      {
        field: "invoiceAmountUntax",
        title: "开票金额(无税)(元)",
        align: "center",
        width: MyFun.fnTiteWidth(false,'开票金额(无税)(元)', 100),
        type: "html",
      },
      {
        field: "tax",
        title: "税额",
        align: "center",
        width: MyFun.fnTiteWidth(false,'税额', 100),
        type: "html",
      },
      {
        field: "invoiceAmountTax",
        title: "开票金额(含税)(元)",
        align: "center",
        width: MyFun.fnTiteWidth(false,'开票金额(含税)(元)', 100),
        type: "html",
      },
      {
        field: "sellerName",
        title: "销售方",
        align: "center",
        width: MyFun.fnTiteWidth(false,'销售方', 100),
        type: "html",
      },
      {
        field: "buyerName",
        title: "购方",
        align: "center",
        width: MyFun.fnTiteWidth(false,'购方', 100),
        type: "html",
      },
      {
        field: "haveReceivedOriginalInvoice",
        title: "是否收到发票原件",
        align: "center",
        width: MyFun.fnTiteWidth(false,'是否收到发票原件', 100),
        type: "html",
        slots: {
          default: ({ row, column }, h) => { 
            const text = this.haveReceivedOriginalInvoiceArray.find(item => item.configValue === row.haveReceivedOriginalInvoice)?.configName || '';
            return (
              <span>{ text }</span>
            )
          }
        }
      },
      {
        field: "constructArchiveMainCode",
        title: "项目编号",
        align: "center",
        width: MyFun.fnTiteWidth(false,'项目编号', 100),
        type: "html",
      },
      {
        field: "constructArchiveMainName",
        title: "项目名称",
        align: "center",
        width: MyFun.fnTiteWidth(false,'项目名称', 100),
        type: "html",
      },
      {
        field: "invoiceStatus",
        title: "发票状态",
        align: "center",
        width: MyFun.fnTiteWidth(false,'发票状态', 100),
        type: "html",
        slots: {
          default: ({ row, column }, h) => { 
            const text = this.invoiceStatusArray.find(item => item.configValue === row.invoiceStatus)?.configName || '';
            return (<span>{ text }</span>)
          }
        }
      },
      {
        field: "invoiceClaimantUserName",
        title: "认领人",
        align: "center",
        width: MyFun.fnTiteWidth(false,'认领人', 100),
        type: "html",
      },
      {
        field: "claimAmountTax",
        title: "认领金额(含税)",
        align: "center",
        width: MyFun.fnTiteWidth(false,'认领金额(含税)', 100),
        type: "html",
      },
      {
        field: "claimTaxAmount",
        title: "认领税额",
        align: "center",
        width: MyFun.fnTiteWidth(false,'认领税额', 100),
        type: "html",
      },
      {
        field: "residueApproveClaimAmountTax",
        title: "剩余可认领金额(含税)",
        align: "center",
        width: MyFun.fnTiteWidth(false,'剩余可认领金额(含税)', 100),
        type: "html",
      },
      {
        field: "residueApprovePaymentAmountTax",
        title: "剩余可付款金额(含税)",
        align: "center",
        width: MyFun.fnTiteWidth(false,'剩余可付款金额(含税)', 100),
        type: "html",
      },
      {
        field: "checkWhether",
        title: "是否勾选",
        align: "center",
        width: MyFun.fnTiteWidth(false,'是否勾选', 100),
        type: "html",
        slots: {
          default: ({ row, column }, h) => { 
            let textData = {
              '0': '否',
              '1': '是',
              '2': '不勾选'
            }
            const text = textData[row.checkWhether] || '';
            return (<span>{ text }</span>)
          }
        }
      },
      {
        field: "sourceInvoice",
        title: "发票来源",
        align: "center",
        width: MyFun.fnTiteWidth(false,'发票来源', 100),
        type: "html",
        slots: {
          default: ({ row, column }, h) => { 
            const text = this.sourceInvoiceArray.find(item => item.configValue === row.sourceInvoice)?.configName || '';
            return (<span>{ text }</span>)
          }
        }
      },
      {
        field: "accrualExpenseStatus",
        title: "是否推费用预提单",
        align: "center",
        width: MyFun.fnTiteWidth(false,'是否推费用预提单', 100),
        type: "html",
      },
      {
        field: "applicationRedInformation",
        title: "已申请红字信息表",
        align: "center",
        width: MyFun.fnTiteWidth(false,'已申请红字信息表', 100),
        type: "html",
      },
      {
        field: "invoiceRemark",
        title: "发票备注",
        align: "center",
        width: MyFun.fnTiteWidth(false,'发票备注', 100),
        type: "html",
      },
      {
        field: "remark",
        title: "备注",
        align: "center",
        width: MyFun.fnTiteWidth(false,'备注', 100),
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
    //操作列删除
    async myOperationDeleteEvent(id, row, index, type) {
      this.invoiceCollDeleteApi(id);
    },
    //操作列编辑
    myOperationEditEvent(id, row, index, type) {
      this.showDialogEdit(type, id);
    },
    async invoiceCollDeleteApi(ids) {
      let { code } = await invoiceCollectionDelete(ids);
      if (code === 200) {
        this.$message.success("删除成功");
        this.dataGridSearch();
      }
    },
    // 打开无流程表单页面
    showDialogEdit(formAction, id) {
      const queryData = {
        code: 'invoiceCollectionMain',
        path: '/invoiceCollectionMain/list',
        encode: 'invoiceCollectionMain',
        myId: id || '',
        rowId: id || '',
        modelName: 'invoice',
        formAction: formAction,
        title: '开票-详情',
        isInterface: true,  //为true不用自己写保存接口
        fullDev: true  // 全开发页面
      }
      this.$router.push({ path: '/noWorkflowForm', query: queryData })
    },
    async getDataDictByConfigType() {
      const configTypes = '发票状态,发票类型,发票错误类型,发票有错误类型,是否收到发票原件,认领状态,复核状态,发票业务类型,是否红票,已申请红字信息表,发票来源';
      let { data, success } = await getDataDictByConfigType({ params: { configTypes: configTypes } });
      if (success) {
        this.dataDictArray = data;
        //发票类型
        this.invoiceTypeArray = data.find(item => item.dataDictType === '发票类型')?.dataDict || [];
        //haveReceivedOriginalInvoiceArray 是否收到发票原件
        this.haveReceivedOriginalInvoiceArray = data.find(item => item.dataDictType === '是否收到发票原件')?.dataDict || [];
        // 发票状态
        this.invoiceStatusArray = data.find(item => item.dataDictType === '发票状态')?.dataDict || [];
        //发票来源
        this.sourceInvoiceArray = data.find(item => item.dataDictType === '发票来源')?.dataDict || [];
      }
    },
    // 工具栏按钮 (添加自定义按钮)
    myToolBarCustomButton() {
      const btns = [
        { code: 'add', status: 'primary', name: '新增', icon: 'fa fa-play-circle' },
        { code: 'delete', status: 'danger', name: '删除', icon: 'fa fa-remove' },
        { code: 'downloadAtt', status: 'primary', name: '批量认领', icon: '' },
        { code: 'pushOrder', status: 'primary', name: '推费用预提单', icon: 'icon' },
        { code: 'reCheck', status: 'primary', name: '复核', icon: '' },
        { code: 'clickReview', status: 'primary', name: '一键复核', icon: '' },
        { code: 'cancelReview', status: 'primary', name: '取消复核', icon: '' },
        { code: 'updateInvoice', status: 'primary', name: '更新发票信息', icon: 'fa' },
        { code: 'receiptInvoice', status: 'primary', name: '收到发票原件', icon: '' },
        { code: 'abnormalFine', status: 'primary', name: '异常已交罚款', icon: '' },
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
          code: 'invoiceCollectionMain',
          path: '/invoiceCollectionMain/list',   // 关闭时回到列表页面
          encode: 'invoiceCollectionMain',
          myId: '',
          modelName: 'invoice',
          formAction: 0,
          title: '发票信息采集-新增',
          appId: 'ES',
          isInterface: true,  //为true不用自己写保存接口
          fullDev: true  // 全开发页面
        }
        this.$router.push({ path: '/noWorkflowForm', query: queryData })
      } else if (code === 'delete') { //批量删除
        const ids = this.selectRows.length > 0 ? this.selectRows.map(item => item.id).join(',') : '';
        this.invoiceCollDeleteApi(ids);
      } else if (code === 'downloadAtt') { //批量认领
        this.clamiVisible = true;
      } else if (code === 'pushOrder') { //推费用预提单
        if (this.selectRows.length === 0) {
          this.$message.error("请至少选择一条数据");
          return false;
        }
        const idArray = this.selectRows.length > 0 ? this.selectRows.map(item => item.id) : '';
        this.pushOrderApi(idArray);
      } else if (code === 'reCheck') {  //复核
        if (this.selectRows.length === 0) {
          this.$message.error("请至少选择一条数据进行发票复核");
          return false;
        }
        this.$confirm('请确认是否复核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const idArray = this.selectRows.length > 0 ? this.selectRows.map(item => item.id) : '';
          this.batchUpdateReviewData(idArray, '1');
        })
      } else if (code === 'cancelReview') { //取消复核
        if (this.selectRows.length === 0) {
          this.$message.error("请至少选择一条数据进行取消发票复核");
          return false;
        }
        this.$confirm('请确认是否取消复核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const idArray = this.selectRows.length > 0 ? this.selectRows.map(item => item.id) : '';
          this.batchUpdateReviewData(idArray, '0');
        })
      } else if (code === 'clickReview') { //一键复核
        const currUser = FUI.Sys.getAuthor();
        // const currUserId = currUser.userId;
        const currUserRealName = decodeURI(currUser.realName);
        this.$confirm('请确认是一键复核？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const idArray = this.selectRows.length > 0 ? this.selectRows.map(item => item.id) : '';
          this.oneClickReviewData();
        })
      } else if (code === 'updateInvoice') { //更新发票信息
        this.updateInvoiceData.visible = true;
      } else if (code === 'receiptInvoice') { //收到发票原件
        if (this.selectRows.length === 0) {
          this.$message.error("请至少选择一条数据");
          return false;
        }
        this.visibleInvoice = true;
      } else if (code === 'abnormalFine') { //异常已交罚款
        if (this.selectRows.length === 0) {
          this.$message.error("请至少选择一条数据");
          return false;
        }
        this.visibleBox = true;
      } else if (code === 'import') { //导入
        this.importData.visible = true;
      } else if (code === 'export') { //导出
        this.exportData();
      }
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
    //批量认领成功
    clamiSuccess() { 
      this.clamiVisible = false;
      this.dataGridSearch();
    },
    //复核、取消复核
    async batchUpdateReviewData(ids, status) {
      let dataParams = {
        idList: ids,
        reviewStatus: status  //0-取消复核；1-复核
      }
      let { code } = await batchUpdateReviewApi(dataParams);
      if (code === 200) {
        let msg = (status === '1') ? '复核成功' : (status === '0' ? '取消复核成功' : '');
        this.$message.success(msg);
      }
    },
    //一键复核
    async oneClickReviewData() {
      let { code } = await oneClickReviewApi(this.formData);
      if (code === 200) {
        this.$message.success('一键复核成功');
        this.getGridData();
       }
    },
    //取消
    onInvoiceCancel() { 
      this.invoiceFineStatus = '';
    },
    //取消
    onCancel() { 
      this.abnormalFinePaidStatus = '';
    },
    abnormalConfirm() {
      if (this.abnormalFinePaidStatus === '') { 
        this.$message.error("请选择异常已交罚款选项");
        return false;
      }
      const idArray = this.selectRows.length > 0 ? this.selectRows.map(item => item.id) : '';
      this.batchUpdateAbnormalFinePaidData(idArray,this.abnormalFinePaidStatus);   //1-已交 0-未交
    },
    invoiceConfirm() { 
      if (this.invoiceFineStatus === '') { 
        this.$message.error("请选择收到发票原件");
        return false;
      }
      const idArray = this.selectRows.length > 0 ? this.selectRows.map(item => item.id) : '';
      this.batchUpdateReceivedOriginalInvoiceData(idArray, this.invoiceFineStatus);
    },
    //异常已交罚款
    async batchUpdateAbnormalFinePaidData(ids, abnormalFinePaid) { 
      let dataParams = {
        idList: ids,
        abnormalFinePaid:abnormalFinePaid
      }
      let { code } = await batchUpdateAbnormalFinePaidApi(dataParams);
      if (code === 200) {
        let msg = (Number(abnormalFinePaid) === 1) ? '已交罚款成功' : (Number(abnormalFinePaid) === 2 ? '未交罚款' : '');
        this.$message.success(msg);
        this.visibleBox = false;
        this.abnormalFinePaidStatus = '';
      }
    },
    //是否收到发票原件
    async batchUpdateReceivedOriginalInvoiceData(ids,status) {
      let dataParams = {
        haveReceivedOriginalInvoice: status,
        idList:ids
      }
      let { code } = await batchUpdateReceivedOriginalInvoiceApi(dataParams);
      if (code === 200) { 
        let msg = (Number(status) === 1) ? '收到发票原件' : (Number(status) === 0 ? '未收到发票原件' : '');
        this.$message.success(msg);
        this.visibleInvoice = false;
        this.invoiceFineStatus = '';
      }
    },
    //退费用预提单
    async pushOrderApi(ids) { 
      await pushExpenseHoldingApi(ids);
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