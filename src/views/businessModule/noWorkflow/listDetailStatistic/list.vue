<template>
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
  import { getOutputDetaillist, exportOutputDetail } from '@/Api/supplier/index';
  import moment from 'moment';
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
          constructCode: '', // 项目编号
          constructName: '',  // 项目名称
          totalConfirmLow: '',    // 累计申报施工产值形象(%) - 最低
          totalConfirmHigh: '',   // 累计申报施工产值形象(%) - 最高
          totalReportLow: '',    // 甲方/监理累计申报施工产值形象(%) - 最低
          totalReportHigh: '',   // 甲方/监理累计申报施工产值形象(%) - 最高
          constructionUnitName: '',   // 管理部门
          contractInEndDate: '',   // 合同竣工日期
          periodOfValidityStart: '', // 合同竣工日期 - 开始时间
          periodOfvalidityEnd: '',  // 合同竣工日期 - 结束时间
          totalConfirmImageProgress: '', // 累计确认产值形象进度(%)
          totalReportImageProgress: '',   // 甲方/监理累计申报施工产值形象(%)：
          projectManagerName: '',   // 项目负责人
          projectStatus: '',   // 项目状态
        },
        isOpen: false,
        value1: null,
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
          field: "constructCode",
          title: "项目编号",
          align: "center",
          type: "html",
        },
        {
          field: "constructName",
          title: "项目名称",
          align: "center",
          type: "html",
        },
        {
          field: "projectStatus",
          title: "项目状态",
          align: "center",
          type: "html",
          slots: {
            default: ({ row, column }, h) => {
              return (this.getStatus(row.projectStatus))
            },
          }
        },
        {
          field: "customerName",
          title: "客户",
          align: "center",
          type: "html",
        },
        {
          field: "contractInStartDate",
          title: "合同开工日期",
          align: "center",
          type: "html",
        },
        {
          field: "contractInEndDate", 
          title: "合同竣工日期",
          align: "center",
          type: "html",
        },
        {
          field: "totalConstructionAmount",
          title: "施工合同总金额(含税)(元)",
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
          field: "projectDepartmentName",
          title: "项目部",
          align: "center",
          type: "html",
        },
        {
          field: "projectManagerName",
          title: "项目负责人",
          align: "center",
          type: "html",
        },
        {
          field: "totalReportAmount",
          title: "累计申报施工产值(元)",
          align: "center",
          type: "html",
        },
        {
          field: "totalConfirmAmount",
          title: "累计确认产值(元)",
          align: "center",
          type: "html",
        },
        {
          field: "totalOpenInvoiceAmount",
          title: "累计开票(含税)(元)",
          align: "center",
          type: "html",
        },
        {
          field: "totalPayInAmount",
          title: "累计收款(含税)(元)",
          align: "center",
          type: "html",
        },
        {
          field: "totalReportImageProgress",
          title: "累计申报施工产值形象进度(%)",
          align: "center",
          type: "html",
        },
        {
          field: "totalConfirmImageProgress",
          title: "确认产值形象进度(%)",
          align: "center",
          type: "html",
        },
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
          // 自定义搜索事件
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
      removeExcess(parm){  // 去掉多余的参数
        delete parm["totalConfirmLow"];
        delete parm["totalConfirmHigh"];
        delete parm["totalReportLow"];
        delete parm["totalReportHigh"];
        delete parm["periodOfValidityStart"];
        delete parm["periodOfvalidityEnd"];
      },
      // 获取table数据  
      async getGridData () {
        const that = this;
        let {contractInEndDate, totalConfirmImageProgress, totalReportImageProgres} = that.formData;
        if(contractInEndDate&&contractInEndDate.length){
          that.formData.periodOfvalidityStart = moment(contractInEndDate[0]).format("YY-MM-DD") || '';
          that.formData.periodOfvalidityEnd = moment(contractInEndDate[1]).format("YY-MM-DD") || '';
        }
        let parm = Object.toClone(that.formData);
        parm.contractInEndDate = contractInEndDate&&contractInEndDate.length?[that.formData.periodOfvalidityStart, that.formData.periodOfvalidityEnd].join(','):'';
        parm.totalConfirmImageProgress = parm.totalConfirmLow&&parm.totalConfirmHigh?`${Number(parm.totalConfirmLow)/100},${Number(parm.totalConfirmHigh)/100}`:'';
        parm.totalReportImageProgress = parm.totalReportLow&&parm.totalReportHigh?`${Number(parm.totalReportLow)/100},${Number(parm.totalReportHigh)/100}`:'';
        parm.currentPage = that.tablePage.currentPage;
        parm.pageSize = that.tablePage.pageSize;
        parm.sort = that.tablePage.sort;
        that.removeExcess(parm);
        // parm.order = that.tablePage.order; 
       
        // 调用请求api
        var res = await getOutputDetaillist(parm);
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
      // 转换状态
      getStatus(status) {
        switch (status) {
          case '1':
            return '未开工'
            break
          case '2':
            return '在建中'
            break
          case '3':
            return '停工中'
            break
          case '4':
            return '施工终止'
            break
          case '5':
            return '合格'
            break
          case '6':
            return '已完工'
            break
          case '7':
            return '已竣工'
            break
          case '8':
            return '已审定'
            break
          case '9':
            return '已关闭'
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
        await exportOutputDetail(paramData);
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
