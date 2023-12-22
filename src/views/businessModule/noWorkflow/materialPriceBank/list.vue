<template>
<!-- 材料价格库 -->
  <div class="f2bpm-page-layout costListClass">
    <el-container>
      <el-main class="f2bpm-page-right">
        <!-- <div class="search-box">
          <workSearchForm ref="form" :tableform="tableForm" @expandclick="expandClick" @searchForm-click="searchFormBtnclick"></workSearchForm>
        </div> -->
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
  import { getMaterpriList, exportMaterpriData } from '@/Api/supplier/index';
  import moment from 'moment'
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
            "enableStatus": "",  // 启用状态
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
          contractPartyBName: '', // 供应商
          name: '', // 材料名称
          constructionUnitName: '',   // 管理部门
          specification: '',   // 规格/型号
          brand: '',   // 品牌
          createTime: '',   // 采购日期
          periodpurchaStart: '',  // 未报产值月份 - 开始时间
          periodpurchaEnd: '',   // 未报产值月份 - 结束时间
          constructArchiveMainCode: '',   // 项目编号
          constructArchiveMainName: '',   // 项目名称
          code: '',   // 合同编号
        },
        isOpen: false,
        multipleSelection: [], // 存储列表勾选rows
      }
    },
    // watch: {
    //   'tablePage':{
    //     handler(val){
    //       debugger
    //     },
    //     deep: true
    //   }
    // },
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
          field: "contractPartyBName",
          title: "供应商",
          align: "center",
          type: "html",
        },
        {
          field: "createTime",
          title: "采购日期",
          align: "center",
          type: "html",
        },
        {
          field: "name",
          title: "材料名称",
          align: "center",
          type: "html",
        },
        {
          field: "brand",
          title: "品牌",
          align: "center",
          type: "html",
        },
        {
          field: "specification",
          title: "规格/型号",
          align: "center",
          type: "html",
        },
        {
          field: "taxRate",
          title: "税率(%)",
          align: "center",
          type: "html",
        },
        {
          field: "unit",
          title: "单位",
          align: "center",
          type: "html",
        },
        {
          field: "quantity",
          title: "数量",
          align: "center",
          type: "html",
        },
        {
          field: "unitPriceTax",
          title: "单价(含税)",
          align: "center",
          type: "html",
        },
        {
          field: "amountTax",
          title: "总金额(含税)",
          align: "center",
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
          field: "code",
          title: "合同编号",
          align: "center",
          type: "html",
        },
        // {
        //   field: "currentYearAmount",
        //   title: "本年累计",
        //   align: "center",
        //   type: "html",
        // },
      ];
      this.dataGridSearch();
    },
    methods: {
      // 重置
      resetForm () {
        this.$refs.searchForm.btnclick('dataGridReSet');
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
          { code: 'search', status: 'primary', name: '查询', icon: 'fa fa-search' },
          { code: 'reset', status: 'primary', name: '重置', icon: '' },
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
          // 自定义搜索事件 年份必填
          that.searchFormBtnclick(this.formData);
        }
        else if (code == 'reset') {
          // 自定义重置事件
          this.formData = {};
          that.dataGridSearch();
        }
        else if (code == 'Export') {
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
        let {createTime} = that.formData;
        if(createTime&&createTime.length){
          that.formData.periodpurchaStart = moment(createTime[0]).format("YY-MM-DD") || '';
          that.formData.periodpurchaEnd = moment(createTime[1]).format("YY-MM-DD") || '';
        }
        let parm = Object.toClone(that.formData);
        parm.createTime = createTime&&createTime.length ? [that.formData.periodpurchaStart,that.formData.periodpurchaEnd].join(',') : '';
        parm.currentPage = that.tablePage.currentPage;
        parm.pageSize = that.tablePage.pageSize;
        parm.sort = that.tablePage.sort;
        delete parm["periodpurchaStart"];
        delete parm["periodpurchaEnd"];
        // parm.order = that.tablePage.order; 
       
        // 调用请求api
        var res = await getMaterpriList(parm);
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
      // 查询 or 重置事件
      searchFormBtnclick(obj){
        this.formData = obj;
        this.getGridData();
      },
      // 导出
      async exportExcel(obj) { 
        let paramData = {
          ...obj
        }
        this.loading = true;
        await exportMaterpriData(paramData);
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
