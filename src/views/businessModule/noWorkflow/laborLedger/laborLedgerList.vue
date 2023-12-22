<template>
  <!--劳务台账-->
  <div class="f2bpm-page-layout costListClass">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div class="search-box">
          <searchFrom ref="form" @expandclick="expandClick" @searchForm-click="searchFormBtnclick"></searchFrom>
        </div>
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
  import {getLaborLedgerList,exportLaborLedgerData} from '@/Api/contract/index';
  import {getDataDictByConfigType} from '@/Api/dataDict.js'
  import searchFrom from './components/searchFrom'
  export default {
    components:{
      workTable,searchFrom
    },
    data () {
      return {
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
          pageSizes: [10, 15, 20, 50, 100, 200, 500],
          layout: 'total, sizes, prev, pager, next, jumper'
        },
        // 列表数据源
        tableData: [],
        // 表头字段配置
        tableColumn: [],
        // 查询条件
        formData: {
          currentPage:1,
          pageSize: 15
        },
        isOpen: false,
        value1: null,
        multipleSelection: [], // 存储列表勾选rows
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
      this.getDataDictByConfigType();
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
          field: "constructArchiveMainCode",
          title: "项目编号",
          align: "center",
          width: 120,
          type: "html",
        },
        {
          field: "constructArchiveMainName",
          title: "项目名称",
          align: "center",
          width: 120,
          type: "html",
        }, {
          field: "contractInAmount",
          title: "建安合同金额(元)",
          align: "center",
          width: 120,
          type: "html",
        },{
          field: "laborSubContractCode",
          title: "劳务分包合同编号",
          align: "center",
          width: 120,
          type: "html",
        },{
          field: "laborSubContractName",
          title: "劳务分包合同名称",
          align: "center",
          width: 120,
          type: "html",
        },{
          field: "customerSupplierArchiveMainName",
          title: "劳务分包商",
          align: "center",
          width: 120,
          type: "html",
        },
        {
          field: "laborSubContractAmount",
          title: "劳务分包合同金额(元)",
          align: "center",
          width: 120,
          type: "html",
        },
        {
          field: "teamContractCode",
          title: "班组合同编号",
          align: "center",
          width: 120,
          type: "html"
        },
        {
          field: "teamContractName",
          title: "班组合同名称",
          align: "center",
          width: 120,
          type: "html"
        }, {
          field: "teamLeader",
          title: "班组长",
          align: "center",
          width: 120,
          type: "html",
        },{
          field: "teamContractAmount",
          title: "班组合同金额(元)",
          align: "center",
          width: 120,
          type: "html",
        },{
          field: "teamContractSettleAmount",
          title: "班组结算金额(元)",
          align: "center",
          width: 120,
          type: "html",
        },{
          field: "cumulativeAuditAmount",
          title: "累计核量(元)",
          align: "center",
          width: 120,
          type: "html",
        },{
          field: "laborSubContractPay",
          title: "劳务分包合同累计已付",
          align: "center",
          width: 120,
          type: "html",
        }, {
          field: "teamContractPay",
          title: "班组合同累计已付",
          align: "center",
          width: 120,
          type: "html",
        },{
          field: "laborSubContractNoPay",
          title: "劳务分包合同剩余应付",
          align: "center",
          width: 120,
          type: "html",
        }, {
          field: "teamContractNoPay",
          title: "班组合同剩余应付",
          align: "center",
          width: 120,
          type: "html"
        }
      ];
      this.dataGridSearch();
    },
    methods: {
      // 重置
      resetForm () {
        this.$refs.form.btnclick('dataGridReSet')
        this.dataGridSearch()
      },
      // 搜索
      searchFn () {
        this.dataGridSearch()
      },
      // 操作列自定义按钮
      myOperationCustomButton (h, value, row, index) {
        var that = this;
        var custBtns = [];
        var item = { title: '示自定义', tip: '提示自定义', class: 'fa fa-trash-o', code: 'custom', click: () => this.operationCustomButtonClick(value, row, index) };
        custBtns.push(item);
        return custBtns;
      },
      // 操作列查看按钮事件
      myOperationViewEvent (value, row, index) {
        this.showDialogEdit('3', row['id']);
      },
      // 操作列编辑按钮事件
      myOperationEditEvent (value, row, index) {
        this.showDialogEdit('2', row['id']);
      },
      // 操作列删除按钮事件
      myOperationDeleteEvent (value, row, index) {
        var that = this;
        FUI.Window.confirm(that, '您确定删除所选记录吗？', null, async function(r) {
          const res = await deleteForm(row.id);
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
        var that = this;
        var time = new Date().getTime();
        let url = '/customerSupplierForm?rowId='+id+'&formAction='+formAction+'&_'+time;
        that.$router.push({ path: url});
      },
      // 工具栏按钮 (在这添加自定义按钮)
      myToolBarCustomButton () {
        var btns = [
          { code: 'excelExport', status: 'primary', name: '导出', icon: 'icon icon-daochu' },
        ];
        return btns;
      },
      // 工具栏按钮事件
      toolbarButtonClickEvent ({btn}, event) {
        const that = this;
        var code = btn.code;
        if (code == 'closeEdit') {
          FUI.Window.closeEdit();
        } else if (code == 'add') {
          let url = '/customerSupplierForm?formAction=0';
          that.$router.push({ path: url});
        } else if (code == 'delete') {
          // 自定义删除事件
          that.handelDelete();
        }else {
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
        this.formData.currentPage = 1;
        this.getGridData();
      },
      // 获取table数据
      async getGridData () {
        const that = this;
        let parm = Object.toClone(that.formData);
        parm.sort = that.tablePage.sort;
        parm.order = that.tablePage.order;
        // 调用请求api
        var res = await getLaborLedgerList(parm);
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
          const res = await deleteForm(arr);
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
        this.tablePage.currentPage = obj.currentPage;
        this.tablePage.pageSize = obj.pageSize;
        this.getGridData();
      },
      // 分页事件
      sortChange(obj){
        console.log('分页事件2：'+JSON.stringify(obj));
        this.tablePage.currentPage = obj.currentPage;
        this.tablePage.pageSize = obj.pageSize;
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
      // 搜索框事件
      expandClick(name){
        console.log(name,'12111')
      },
      // 查询 or 重置事件
      searchFormBtnclick(obj){
        this.formData = obj;
        this.getGridData();
      },
      // 导出
      async excelExport() {
        var obj = this.formData;
        let paramData = {
          ...obj
        };
        this.loading = true;
        await exportLaborLedgerData(paramData);
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
