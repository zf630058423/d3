<template>
  <!-- 产值填报完成情况表 -->
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
  // import workSearchForm from '@/components/table/workSearchForm'
  import searchFrom from './components/searchFrom.vue';
  import { getOutputlist, deleteOutputValue, exportOutputValue } from '@/Api/supplier/index';
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
            "name": "",
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
        // 表格查询条件
        formData: {
          // code: '', // 供应商编号 
          currentPeriod: '',  // 所属月份
          constructUnitName: '',  // 管理部门 
        },
        isOpen: false,
        multipleSelection: [], // 存储列表勾选rows
      }
    },
    mounted () {
      // window.myvm指向当前页面vue实例
      window.myvm = this;
      // 自适应计算高度
      window.autoPageHeight();

    },
    beforeDestroy(){
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
              // const item1 = {
              //   index: 1,
              //   title: "编辑",
              //   class: "fa fa-edit",
              //   code: "default.edit",
              //   click: () => this.myOperationEditEvent(row.wiid, row, 1,'edit'),
              // };
              const item2 = {
                index: 2,
                title: "删除",
                class: "fa fa-remove",
                code: "default.remove",
                click: () => this.myOperationDeleteEvent(row.wiid, row, 2),
              };
              const item5 = {
                index: 8,
                title: "查看",
                class: "fa fa-search",
                code: "default.view",
                click: () => this.myOperationViewEvent(row.wiid, row, 8,'detail'),
              };

              var firstItem = null;
              allbtns.push(item5);
              // allbtns.push(item1);
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
          field: "constructUnitName",
          title: "管理部门",
          align: "center",
          type: "html",
        },
        {
          field: "currentPeriod",
          title: "所属月份",
          align: "center",
          type: "html",
        },
       
        {
          field: "totalProjectNum",
          title: "项目总数",
          align: "center",
          type: "html",
        },
        {
          field: "requireReportProjectNum",
          title: "需报产值项目数",
          align: "center",
          type: "html",
          slots: {
            default: ({ row, column }, h) => {
              return (this.getCategory(row.customerCategory))
            },
          }
        },
        {
          field: "reportedProjectNum",
          title: "已报产值项目数",
          align: "center",
          type: "html",
        },
        {
          field: "reportRate", 
          title: "产值填报率",
          align: "center",
          type: "html",
          slots: {
            default: ({ row, column }, h) => {
              return (this.getEnableState(row.enableState))
            },
          }
        },
        {
          field: "reportInNum",
          title: "填报中项目数",
          align: "center",
          type: "html",
        },
        {
          field: "unreportedProjectNum",
          title: "未报产值项目数",
          align: "center",
          type: "html",
        },
      ];
      this.dataGridSearch();
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
        FUI.Window.confirm(that, '您确定删除所选记录吗？', null, async function(r) {
          const res = await deleteOutputValue(row.id);
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
        // debugger
        var that = this;
        let queryData = {
          code:'contractOutputValueCompleteMain',
          path:'/contractOutputValueCompleteMain/outputvalueList',  // contract/contractOutputValueCompleteMain/list
          encode:'contractOutputValueCompleteMain',
          myId: id || '',
          modelName:'contract',
          formAction: formAction,
          title: '产值填报完成情况表-详情',
          fullDev: true  // 全开发页面
        }
        this.$router.push({ path: '/noWorkflowForm', query: queryData })
      },
      // 工具栏按钮 (添加自定义按钮)
      myToolBarCustomButton () {
        var btns = [
          { code: 'search', status: 'primary', name: '查询', icon: 'fa fa-search' },
          { code: 'reset', status: 'primary', name: '重置', icon: '' },
          // { code: 'add', status: 'primary', name: '新增', icon: 'fa fa-play-circle' },
          // { code: 'delete', status: 'danger', name: '删除', icon: 'fa fa-remove' },
          { code: 'Export', status: 'primary', name: '导出', alias: 'Export', icon: 'icon icon-daochu' }
        ];
        // btns.push({ code: 'closeEdit', status: 'default', name: '关闭', icon: 'fa fa-close' });
        return btns;
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
          // 自定义重置事件
          // this.$refs.businessFormRef.btnclick('dataGridReSet');
          // this.searchFormBtnclick(this.formData)
          this.formData = {};
          that.dataGridSearch();
        }
        // else if (code == 'add') {
        //   let queryData = {
        //     code:'contractOutputValueCompleteMain',
        //     path:'/contractOutputValueCompleteMain/outputvalueList',   // 关闭时回到列表页面
        //     encode:'contractOutputValueCompleteMain',
        //     myId: '',
        //     formAction: 'add',
        //     title: '产值填报完成情况表-新增',
        //     fullDev: true  // 全开发页面
        //   }
        //   this.$router.push({ path: '/noWorkflowForm', query: queryData })
        // } 
        else if (code == 'delete') {
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
        var res = await getOutputlist(parm);
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
        console.log(arr,'myId集合');
        FUI.Window.confirm(that, '您确定删除所选记录吗？', null, async function(r) {
          const res = await deleteOutputValue(arr);
          if (res.code == 200) {
            FUI.Window.showMsg2('删除成功', null, 1);
            that.resetForm()
          } else {
            FUI.Window.showMsg(that, res.data.msg);
          }
        });
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
      // 转换供应商类别
      getCategory(status) {
        switch (status) {
          case '0':
            return '一般客户'
            break
          case '1':
            return '重大客户'
            break
          case '2':
            return '合格'
            break
          case '3':
            return '集采/战略'
            break
        }
        return ''
      },
      // 转换黑名单状态
      getblackStatus(status) {
        return status=="1"?'黑名单':'白名单';
      },
      // 启用状态
      getEnableState(status) {
        return status=='1'?'启用':'禁用'
      },
      // 导出
      async exportExcel(obj) { 
        let paramData = {
          ...obj
        }
        this.loading = true;
        await exportOutputValue(paramData);
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
