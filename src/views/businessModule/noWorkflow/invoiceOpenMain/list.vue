<template>
  <div class="f2bpm-page-layout costListClass">
    <el-container>
      <el-main class="f2bpm-page-right">
        <searchFrom ref="marketFormRef" :formData='formData' :dataDictArray="dataDictArray" @search="searchFormBtnclick" @exportExcel="exportExcel"></searchFrom>

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
    <update-uploader-file :visible.sync="updateData.visible" :fileId="fileId" :uploaderUrl="updateData.url" @updateFileSuccess="updateFileSuccess"></update-uploader-file>
  </div>
</template>

<script>
  import workTable from '@/components/table/workTable'
  import searchFrom from './components/searchFrom.vue';
  import UpdateUploaderFile from '@/components/basic/importTemplateDialog/updateUploaderFile.vue';
  import { getDataDictByConfigType } from '@/Api/dataDict.js';
  import { getInvoiceList, exportInvoice, downloadFile } from '@/Api/invoice/invoiceApi';
  
  import MyFun from '@/utils/fun';

  export default {
    components:{
      workTable,searchFrom,UpdateUploaderFile
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
        updateData: {
          visible: false,
          url:'/invoice/invoiceOpenMain/update'
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
        dataDictArray:[],
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
        fileId:'',  //文件的id
        isOpen: false,
        multipleSelection: [], // 存储列表勾选rows
        enableStateList: [],
        invoiceStatusArray:[],  //开票状态
      }
    },
    mounted () {
      // window.myvm指向当前页面vue实例
      window.myvm = this;
      // 自适应计算高度
      window.autoPageHeight();
    },
    created () {
      // 流程表单ID 找到对应流程应用id(在流程应用关联流程的时候会有) 直接写死 很重要
      let that = this;
      that.appId = '';
      that.getDataDictByConfigType();
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
              // const item1 = {
              //   index: 1,
              //   title: "编辑",
              //   class: "fa fa-edit",
              //   code: "default.edit",
              //   click: () => this.myOperationEditEvent(row.id, row, 1,'edit'),
              // };
              // const item2 = {
              //   index: 2,
              //   title: "删除",
              //   class: "fa fa-remove",
              //   code: "default.remove",
              //   click: () => this.myOperationDeleteEvent(row.id, row, 2),
              // };
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
          field: "constructArchiveMainCode",
          title: "项目编号",
          align: "center",
          type: "html",
        },
        {
          field: "constructArchiveMainName",
          title: "项目名称",
          align: "center",
          type: "html",
        },
        {
          field: "constructionUnitName",
          title: "管理部门",
          align: "center",
          type: "html",
        },
        {
          field: "contractInMainCode",
          title: "收入合同编号",
          width: MyFun.fnTiteWidth(false,'收入合同编号'),
          align: "center",
          type: "html"
        },
        {
          field: "contractInMainName",
          title: "收入合同编号",
          width: MyFun.fnTiteWidth(false,'收入合同名称'),
          align: "center",
          type: "html",
        },
        {
          field: "sellerName",
          title: "销售方",
          width: MyFun.fnTiteWidth(false,'销售方',90),
          align: "center",
          type: "html"
        },
        {
          field: "buyerName",
          title: "购方",
          align: "center",
          type: "html"
        },
        {
          field: "invoiceCreateTime",
          title: "开票日期",
          width: MyFun.fnTiteWidth(false,'开票日期',90),
          align: "center",
          type: "html"
        },
        {
          field: "invoiceAmountTax",
          title: "开票金额(含税)(元)",
          width: MyFun.fnTiteWidth(false,'开票金额(含税)(元)',50),
          align: "center",
          isAmountTo: 1,
          type: "html"
        },
        {
          field: "tax",
          title: "税额",
          align: "center",
          isAmountTo: 1,
          type: "html"
        },
        {
          field: "invoiceStatus", //1-已开票；2-部分开票；3-未开票
          title: "开票状态",
          align: "center",
          type: "html",
          slots: {
            default: ({ row, column }, h) => {
              let text = that.invoiceStatusArray.find(item => item.configValue === row.invoiceStatus)?.configName || ''; 
              return (<span>{ text }</span>)
            },
          },
        },
        {
          field: "createUserName", 
          title: "编制人",
          width: MyFun.fnTiteWidth(false,'编制人',60),
          align: "center",
          type: "html"
        },
        {
          field: "createTime", 
          title: "编制时间",
          width: MyFun.fnTiteWidth(false,'编制时间',90),
          align: "center",
          type: "html"
        },
        {
          field: "submitUserName", 
          title: "开票人",
          align: "center",
          type: "html"
        }
      ];
      this.dataGridSearch();
  },
  methods: {
    //获取数据字典的信息
    async getDataDictByConfigType() {
        const configTypes = '发票类型,开票状态,开票分类,对接状态,优惠政策,是否红票';
        const { data, success } = await getDataDictByConfigType({ params: { configTypes: configTypes } });
        if (success) {
          this.dataDictArray = data;
          //开票状态
          this.invoiceStatusArray = data.find(item => item.dataDictType === '开票状态')?.dataDict || [];
        }
    },
      // 重置
      resetForm () {
        this.$refs.businessFormRef.btnclick('dataGridReSet');
        this.dataGridSearch()
      },
      // 操作列自定义按钮
      myOperationCustomButton (h, value, row, index) {
        var custBtns = [];
        var item = { title: '示自定义', tip: '提示自定义', class: 'fa fa-trash-o', code: 'custom', click: () => this.operationCustomButtonClick(value, row, index) };
        custBtns.push(item);
        return custBtns;
      },
      // 操作列查看按钮事件
      myOperationViewEvent (value, row, index,type) {
        this.showDialogEdit(type, row['id']);
      },
      // 操作列编辑按钮事件
      myOperationEditEvent (value, row, index,type) {
        this.showDialogEdit(type, row['id']);
      },
      // 操作列删除按钮事件
      myOperationDeleteEvent (value, row, index) {
        var that = this;
        FUI.Window.confirm(that, '您确定删除所选记录吗？', null, async function(r) {
          const res = await deleteTeam(row.id);
          if (res.code == 200) {
            FUI.Window.showMsg2('删除成功', null, 1);
            that.resetForm()
          } else {
            FUI.Window.showMsg(that, res.data.msg);
          }
        });
      },
      // 打开无流程表单页面
      showDialogEdit (formAction, id) {
        const queryData = {
          code:'invoiceOpenMain',
          path:'/invoiceOpenMain/list',  //
          encode:'invoiceOpenMain',
          myId: id || '',
          rowId: id || '',
          modelName:'invoice',
          formAction: formAction,
          title: '开票-详情',
          isInterface:true,  //为true不用自己写保存接口
          fullDev: true  // 全开发页面
        }
        this.$router.push({ path: '/noWorkflowForm', query: queryData })
      },
      // 工具栏按钮 (添加自定义按钮)
      myToolBarCustomButton () {
        const btns = [
          // { code: 'search', status: 'primary', name: '查询', icon: 'fa fa-search' },
          // { code: 'reset', status: 'primary', name: '重置', icon: '' },
          { code: 'add', status: 'primary', name: '新增', icon: 'fa fa-play-circle' },
          // { code: 'delete', status: 'danger', name: '删除', icon: 'fa fa-remove' },
          { code: 'updateAtt', status: 'primary', name: '更新附件', icon: '' },
          { code: 'downloadAtt', status: 'primary', name: '下载附件', icon: '' },
          { code: 'export', status: 'primary', name: '导出', alias: 'export', icon: 'icon icon-daochu' }
        ]
        return btns;
      },
      // 工具栏按钮事件
      toolbarButtonClickEvent ({btn}, event) {
        const code = btn.code;
        if (code == 'closeEdit') {
          FUI.Window.closeEdit();
        } 
        else if (code == 'search') {
          // 自定义搜索事件
          this.searchFormBtnclick(this.formData);
        }
        else if (code == 'reset') {
          // 自定义重置事件
          this.formData = {};
          this.dataGridSearch();
        }
        else if (code == 'add') {
          let queryData = {
            code:'invoiceOpenMain',  
            path:'/invoiceOpenMain/list',   // 关闭时回到列表页面
            encode:'invoiceOpenMain',
            myId: '',
            modelName:'invoice',
            formAction: 'add',
            title: '开票新增',
            isInterface:true,  //为true不用自己写保存接口
            fullDev: true  // 全开发页面
          }
          this.$router.push({ path: '/noWorkflowForm', query: queryData })
        } else if (code == 'delete') {
          // 自定义删除事件
          this.handelDelete();
        } else if (code == 'export') {
          // 导出事件
          this.exportExcel(this.formData);
        } else if (code === 'updateAtt') {   //更新附件
          this.updateAttMethods();
        } else if (code === 'downloadAtt') { //下载附件
          this.downloadAttMethods();
        }
        else {
          let fn = this[code];
          fn(code);
        }
    },
    //更新附件
    updateAttMethods() { 
      if (this.multipleSelection.length === 0) {
        this.$alert('请选择需要的数据！', '提示', {
          confirmButtonText: '确定',
          callback: action => {
          }
        });
      } else if (this.multipleSelection.length > 1) { 
        this.$alert('开票数据仅可选择一条进行更新附件操作！', '提示', {
          confirmButtonText: '确定',
          callback: action => {
          }
        });
      } else { 
        this.fileId = this.multipleSelection[0].id;
        this.updateData.visible = true;
      }
    },
    updateFileSuccess(res) { 
      console.log("更新附件成功===:",res);
    },
    //下载附件
   async downloadAttMethods() { 
      if (this.multipleSelection.length === 0) {
        this.$alert('请选择需要下载附件的数据！', '提示', {
          confirmButtonText: '确定',
          callback: action => {
          }
        });
      } else { 
        const ids = this.multipleSelection.map(item => item.id);
        const dataParams = { ids };
        await downloadFile(dataParams)
      }
    },
      // 刷新列表
      refreshGrid (parentGridId, parm) {
        this.dataGridSearch();
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
        let res = await getInvoiceList(parm);
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
      // 删除方法
      handelDelete(){
        let that = this;
        let rows= that.multipleSelection; // 获取选中行数据
        if(rows.length === 0){
          FUI.Window.showMsg('请先选择要删除的数据');
          return false
        }
        console.log(rows);
        let arr = [];
        for(let i in rows){
          arr.push(rows[i]['id']);
        }
        FUI.Window.confirm(that, '您确定删除所选记录吗？', null, async function(r) {
          const res = await deleteTeam(arr);
          if (res.code == 200) {
            FUI.Window.showMsg2('删除成功', null, 1);
            that.resetForm()
          } else {
            FUI.Window.showMsg(that, res.data.msg);
          }
        });
      },
      // 分页事件
    pageChange(obj) {
      this.formData.pageIndex = obj.currentPage;
      this.formData.pageSize = obj.pageSize;
      this.tablePage.pageSize = obj.pageSize;
      this.tablePage.pageIndex = obj.pageIndex;
      this.tablePage.currentPage = obj.currentPage;
      this.getGridData();
    },
      // 分页事件
    sortChange(obj) {
        this.formData.pageIndex = obj.currentPage;
        this.formData.pageSize = obj.pageSize;
        this.tablePage.pageSize = obj.pageSize;
        this.tablePage.pageIndex = obj.pageIndex;
        this.tablePage.currentPage = obj.currentPage;
        this.getGridData();
      },
      // 列表复选框事件(单选)
      checkboxChange(obj, selection){
        console.log(obj,selection);
        this.multipleSelection = selection;
        console.log('multipleSelection===:', this.multipleSelection);
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
      // 导出
      async exportExcel(obj) {
        try {
          let paramData = { ...obj };
          this.loading = true;
          await exportInvoice(paramData);
          this.loading = false;
        } catch (error) {
          this.$message.error(error);
          this.loading = false;
        } 
        
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
