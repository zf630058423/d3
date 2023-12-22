<template>
  <!--预缴完税台账-->
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
  import {getVoucherLedgerList,exportVoucherLedger} from '@/Api/contract/index';
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
        customerStatusList:[],
        formSearch:{
          code: "",
          constructArchiveMainCode: "",
          constructArchiveMainName: "",
          constructionUnitName: "",
          createTime: '',
          createUserName: "",
          finishedTime: '',
          prepaidPeriodTime: '',
          taxPaymentVoucherNo: "",
          taxUnitOrgName: ""
        }
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
          field: "code",
          title: "单据编号",
          align: "center",
          width: 120,
          type: "html",
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
          field: "constructionUnitName",
          title: "管理部门",
          align: "center",
          width: 120,
          type: "html",
        },{
          field: "taxAcross",
          title: "税跨报号",
          align: "center",
          width: 120,
          type: "html",
        },{
          field: "paymentTime",
          title: "缴款日期",
          align: "center",
          width: 120,
          type: "html",
        },{
          field: "prepaidPeriodTime",
          title: "缴款所属期间",
          align: "center",
          width: 120,
          type: "html",
          slots: {
            default: ({ row, column }, h) => {
              return (row.prepaidPeriodTime?Object.toJsonDateMonthFormatter(row.prepaidPeriodTime):'')
            },
          }
        },
        {
          field: "advancePaymentWay",
          title: "预缴方式",
          align: "center",
          width: 120,
          type: "html",
          slots: {
            default: ({ row, column }, h) => {
              return (this.getCustomerStatus(row.advancePaymentWay,0))
            },
          }
        },
        {
          field: "isAccountDeduct",
          title: "账扣",
          align: "center",
          width: 120,
          type: "html",
          slots: {
            default: ({ row, column }, h) => {
              return (this.getCustomerStatus(row.isAccountDeduct,1))
            },
          }
        },
        {
          field: "whetherEnjoyExemptionPolicy",
          title: "享受当地减免政策",
          align: "center",
          width: 120,

          type: "html",
          slots: {
            default: ({ row, column }, h) => {
              return (this.getCustomerStatus(row.whetherEnjoyExemptionPolicy,2))
            },
          }
        }, {
          field: "taxRate",
          title: "预征率",
          align: "center",
          width: 120,

          type: "html",
        },{
          field: "taxRate",
          title: "税基（元）",
          align: "center",
          width: 120,

          type: "html",
        },{
          field: "deductAmount",
          title: "扣除金额",
          align: "center",
          width: 120,

          type: "html",
        },{
          field: "taxDueAdvance",
          title: "应预缴税额",
          align: "center",
          width: 120,

          type: "html",
        }, {
          field: "actualAdvanceTax",
          title: "实际预缴增值税",
          align: "center",
          width: 120,

          type: "html",
        }, {
          field: "key20",
          title: "城建税（1%）",
          align: "center",
          width: 120,

          type: "html"
        }, {
          field: "key21",
          title: "城建税（5%）",
          align: "center",
          width: 120,

          type: "html"
        },{
          field: "key24",
          title: "城建税（7%）",
          align: "center",
          width: 120,

          type: "html"
        },{
          field: "key1",
          title: "印花税（0.03%）",
          align: "center",
          width: 120,

          type: "html"
        },{
          field: "key2",
          title: "企业所得税（0.2%）",
          align: "center",
          width: 120,

          type: "html"
        },{
          field: "key3",
          title: "工会经费（0.1%）",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "key19",
          title: "个人所得税（0.4%）",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "key4",
          title: "个人所得税（1%）",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "key5",
          title: "水利建设（0.09%）",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "key17",
          title: "水利建设（0.06%）",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "key14",
          title: "水利建设（0.05%）",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "key10",
          title: "资源税（0%）",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "key11",
          title: "罚款（0%）",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "key12",
          title: "滞纳金（0.05%）",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "key13",
          title: "其他-工伤保险费(0.15%)",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "key13",
          title: "其他-工伤保险费(0.15%)",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "key15",
          title: "城镇垃圾处理费（0%）",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "key16",
          title: "工会经费（0.12%）",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "key18",
          title: "工会经费（1.2%）",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "key22",
          title: "地方教育费附加（2%）",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "key23",
          title: "教育费附加（3%）",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "key3",
          title: "工会经费（0.1%）",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "key6",
          title: "残疾人就业保障金（0%）",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "key7",
          title: "城镇土地使用税（0%）",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "key8",
          title: "房产税（0%）",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "key9",
          title: "环境保护税（0%）",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "taxesTotal",
          title: "合计",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "taxPaymentVoucherNo",
          title: "完税凭证号",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "paymentPeopleUsersName",
          title: "缴款人",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "taxUnitOrgName",
          title: "纳税单位",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "createUserName",
          title: "编制人",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "createTime",
          title: "编制时间",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "processFinishedTime",
          title: "审批通过时间",
          align: "center",
          width: 120,
          type: "html"
        },{
          field: "remark",
          title: "备注",
          align: "center",
          width: 120,
          type: "html"
        },
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
        var res = await getVoucherLedgerList(parm);
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
        this.formSearch = obj;
        this.getGridData();
      },
      /**
       * 格式化字典返回值
       * */
      getCustomerStatus(status,oIndex) {
        let text;
        if(oIndex == 0){
          text = status == 1?'现场预缴':status == 2?'网上预缴':'';
        } else if(oIndex == 1){
          text = status === '0'?'否':status == 1?'是':'';
        }else if(oIndex == 2){
          text = status === '0'?'否':status == 1?'是':'';
        }
        return text
      },
      // 导出
      async excelExport() {
        var obj = this.formSearch;
        let paramData = {
          ...obj
        };
        this.loading = true;
        await exportVoucherLedger(paramData);
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
