<template>
  <div class="f2bpm-page-layout costListClass">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div class="search-box">
          <!--<workSearchForm ref="form" :tableform="tableForm" @expandclick="expandClick" @searchForm-click="searchFormBtnclick"></workSearchForm>-->
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
  import workSearchForm from '@/components/table/workSearchForm'
  import {getList,deleteForm,exportData} from '@/Api/customerSupplierList/index';
  import {getDataDictByConfigType} from '@/Api/dataDict.js'
  import searchFrom from './components/searchFrom'
  export default {
    components:{
      workTable,workSearchForm,searchFrom
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
          pageSizes: [2, 10, 15, 20, 50, 100, 200, 500],
          layout: 'total, sizes, prev, pager, next, jumper'
        },
        // 列表数据源
        tableData: [],
        // 表头字段配置
        tableColumn: [],
        // 查询条件
        formData: {
          pageIndex:1,
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
          field: "id",
          title: "操作",
          align: "center",
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
                click: () => this.myOperationEditEvent(row.wiid, row, 1),
              };
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
                class: "fa fa-edit",
                code: "default.view",
                click: () => this.myOperationViewEvent(row.wiid, row, 8),
              };

              var firstItem = null;
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
          field: "code",
          title: "客商编号",
          align: "center",
          type: "html",
        },
        {
          field: "customerName",
          title: "客商名称",
          align: "center",
          type: "html",
        },
        {
          field: "taxRegistrationNum",
          title: "统一社会信用代码",
          align: "center",
          type: "html",
        },
        {
          field: "customerCategoryId",
          title: "客商类别",
          align: "center",
          type: "html",
          slots: {
            default: ({ row, column }, h) => {
              return (this.getCustomerStatus(row.customerCategoryId,0))
            },
          }
        },
        {
          field: "customerStatus",
          title: "客商状态",
          align: "center",
          type: "html",
          slots: {
            default: ({ row, column }, h) => {
              return (this.getCustomerStatus(row.customerStatus,1))
            },
          }
        },
        {
          field: "enableStatus",
          title: "启用状态",
          align: "center",
          type: "html",
          slots: {
            default: ({ row, column }, h) => {
              return (this.getCustomerStatus(row.enableStatus,2))
            },
          }
        }, {
          field: "createTime",
          title: "编辑时间",
          align: "center",
          type: "html"
        }, {
          field: "lastModifyTime",
          title: "修订时间",
          align: "center",
          type: "html"
        }
      ];
      this.dataGridSearch();
      this.getDataDictByConfigType();
    },
    methods: {
      // 重置
      resetForm () {
        this.dataGridSearch();
        this.$refs.form.btnclick('dataGridReSet')
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
      // showDialogEdit (formAction, id) {
      //   var that = this;
      //   var time = new Date().getTime();
      //   let url = '/customerSupplierForm?rowId='+id+'&formAction='+formAction+'&_'+time;
      //   that.$router.push({ path: url});
      // },
      // 打开无流程表单页面
      showDialogEdit (formAction, id) {
        var that = this;
        let queryData = {
          code:'customerSupplierArchiveMain',
          path:'customerSupplierArchiveMain/customerSupplierList',
          encode:'customerSupplierArchiveMain',
          myId:id || '',
          modelName:'customer',
          formAction: formAction,
          title:id?'客商档案-详情':'客商档案-新增',
          isInterface: true,
          fullDev: true
        };
        // let url = '/constructArchive/form?rowId='+id+'&formAction='+formAction;
        that.$router.push({ path: '/noWorkflowForm',query:queryData});
      },
      // 工具栏按钮 (在这添加自定义按钮)
      myToolBarCustomButton () {
        var btns = [
          { code: 'add', status: 'primary', name: '新增', icon: 'fa fa-play-circle' },
          { code: 'delete', status: 'danger', name: '删除', icon: 'fa fa-remove' },
          { code: 'excelExport', status: 'primary', name: '导出', icon: 'icon icon-daochu' },
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
        } else if (code == 'add') {
          // let url = '/customerSupplierForm?formAction=0';
          // that.$router.push({ path: url});
          that.showDialogEdit(0,'')
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
        this.formData.startIndex = 0;
        this.getGridData();
      },
      // 获取table数据
      async getGridData () {
        const that = this;
        let parm = Object.toClone(that.formData);
        parm.sort = that.tablePage.sort;
        parm.order = that.tablePage.order;
        // 调用请求api
        var res = await getList(parm);
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
      /**
       * 初始化字典
       */
      async getDataDictByConfigType() {
        const res = await getDataDictByConfigType({ params: { configTypes: '客商性质,客商类别,客商级别,客户状态,启用状态' }});
        if (res.success) {
          res.data.forEach(ele => {
            switch (ele.dataDictType) {
              case '客商性质':
                this.customerPropertyList = ele.dataDict;
                break;
              case '客商类别':
                this.customerCategoryNameList = ele.dataDict;
                break;
              case '客商级别':
                this.customerLevelNameList = ele.dataDict;
                break;
              case '客户状态':
                this.customerStatusList = ele.dataDict;
                break;
              case '启用状态':
                this.enableStateList = ele.dataDict;
                break;
              default:
                break;
            }
          });
        }
      },
      /**
       * 格式化字典返回值
       * */
      getCustomerStatus(status,oIndex) {
        let text;
        if(oIndex == 0){
          if(status && status.indexOf(',') !== -1){
            var statusArr = status.split(',');
            var arrText = [];
            for(var i in statusArr){
              if(statusArr[i] && statusArr[i] !== ''){
                var cont =  statusArr[i] === '0'?'客户':statusArr[i] == 1?'零星供应商':statusArr[i] == 2?'材料供应商':statusArr[i] == 3?'劳务分包商':'';
                arrText.push(cont)
              }
            }
            if(arrText.length>0){
              text = arrText.join();
            }
          }else {
            text = status === '0'?'客户':status == 1?'零星供应商':status == 2?'材料供应商':status == 3?'劳务分包商':'';
          }
        } else if(oIndex == 1){
          text = status === '0'?'正常':status == 1?'关注':status == 2?'预警':status == 3?'禁用':'';
        }else if(oIndex == 2){
          text = status === '1'?'启用':status == 0?'禁用':'';
        }
        return text
      },
      // 导出
      async excelExport() {
        var obj = this.formData;
        let paramData = {
          ...obj
        };
        this.loading = true;
        await exportData(paramData);
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
