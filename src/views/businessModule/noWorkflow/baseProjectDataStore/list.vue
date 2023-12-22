<template>
  <div class="f2bpm-page-layout costListClass">
    <el-container>
      <el-main class="f2bpm-page-right">
        <searchFrom ref="businessFormRef" :formData='formData' @search="searchFormBtnclick" @exportExcel="exportExcel"></searchFrom>
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
  import searchFrom from './components/searchFrom.vue';
  import { getBaseProjectDataStoreList } from '@/Api/workflowBusssion/construct';
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
            "constructArchiveMainCode": "",
            "constructArchiveMainName": "",
            "constructionUnitName": "",
            "projectManagerName": "",
            "createUserName": "",
            "createTime": ""
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
          constructArchiveMainCode: '', // 项目编号
          constructArchiveMainName: '',  // 项目名称
          constructionUnitName: '',  // 管理部门
          projectManagerName: '',  //	项项目负责人
          createUserName: '',   // 最近上传人
          createTime: '',   // 最近上传日期
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
          field: "id",
          title: "操作",
          align: "center",
          type: "html",
          slots: {
            default: ({ row, column }, h) => {
              const hbtns = [];
              const allbtns = [];
              const item5 = {
                index: 8,
                title: "查看",
                class: "fa fa-search",
                code: "default.view",
                click: () => this.myOperationViewEvent(row.wiid, row, 8,'detail'),
              };
              var firstItem = null;
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
        }, {
          field: "constructArchiveMainCode",
          title: "项目编号",
          align: "center",
          type: "html",
        }, {
          field: "constructArchiveMainName",
          title: "项目名称",
          align: "center",
          type: "html",
        }, {
          field: "constructionUnitName",
          title: "管理部门",
          align: "center",
          type: "html",
        }, {
          field: "projectManagerName",
          title: "项目负责人",
          align: "center",
          type: "html",
        }, {
          field: "createUserName",
          title: "最近上传人",
          align: "center",
          type: "html",
        }, {
          field: "createTime",
          title: "最近上传日期",
          align: "center",
          type: "html",
        }
      ];
      this.dataGridSearch();
      // this.getDataDictByConfigType();
    },
    methods: {
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
      },
      // 打开无流程表单页面
      showDialogEdit (formAction, id) {
        this.$router.push({ path: '/baseProjectDataStore/baseProjectDataStoreForm', query: {rowId: id} })
      },
      // 工具栏按钮事件
      toolbarButtonClickEvent ({btn}, event) {
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
            code:'supplierMain',
            path:'/supplierMain/sporadicList',   // 关闭时回到列表页面
            encode:'supplierMain',
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
      refreshGrid (parentGridId, parm) {
        var that = this;
        that.dataGridSearch();
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
        var res = await getBaseProjectDataStoreList(parm);
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
        var that = this;
        var rows= that.multipleSelection; // 获取选中行数据
        if(rows.length === 0){
          FUI.Window.showMsg('请先选择要删除的数据');
          return false
        }
        console.log(rows);
        var arr = [];
        for(let i in rows){
          arr.push(rows[i]['id']);
        }
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
