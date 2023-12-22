<template>
  <div class="f2bpm-page-layout costListClass">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div class="search-box" style="padding:10px 10px 0;margin: 0 20px">
        <workSearchForm :tableform="tableForm" @expandclick="expandClick" @searchForm-click="searchFormBtnclick"></workSearchForm>
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
  import demoApi from '@/Api/demo/index';
  export default {
    components:{
      workTable,workSearchForm
    },
    data () {
      return {
        // 表单查询的一些默认条件
        tableForm: {
          titleWidth: 100,
          titleAlign: 'right',
          props: { searchPlaceholder: "请输入  单据编号  ,  主合同编号  来搜索" },
          data: {
            "searchtext": "",
            "searchfields": "BillNo,MastercontNo",
            "BillNo": "",
            "MastercontNo": "",
            "ProjectNo": "",
            "ProjectName": "",
            "Supplier": "",
            "ConstructionUnit": "",
            "ProcInstState": "",
            "CreateName": "",
            "CreateTime": ""
          },
          // 查询控件
          items: [
            {
              "fieldName": "BillNo",
              "fieldTitle": "  单据编号  ",
              "fieldAlias": null,
              "span": 4,
              "itemRender": {
                "name": "$input",
                "props": {
                  "clearable": true
                },
                "attrs": {
                  "class": "aaa"
                }
              }
            },
            {
              "fieldName": "MastercontNo",
              "fieldTitle": "  主合同编号  ",
              "fieldAlias": null,
              "span": 4,
              "itemRender": {
                "name": "$input",
                "props": {
                  "clearable": true
                },
                "attrs": {
                  "class": "aaa"
                }
              }
            },
            {
              "fieldName": "ProjectNo",
              "fieldTitle": "  项目编号  ",
              "fieldAlias": null,
              "span": 4,
              "itemRender": {
                "name": "$input",
                "props": {
                  "clearable": true
                },
                "attrs": {
                  "class": "aaa"
                }
              }
            },
            {
              "fieldName": "ProjectName",
              "fieldTitle": "  项目名称  ",
              "fieldAlias": null,
              "span": 4,
              "itemRender": {
                "name": "$input",
                "props": {
                  "clearable": true
                },
                "attrs": {
                  "class": "aaa"
                }
              }
            },
            {
              "fieldName": "Supplier",
              "fieldTitle": "  班组长  ",
              "fieldAlias": null,
              "span": 4,
              "itemRender": {
                "name": "$input",
                "props": {
                  "clearable": true
                },
                "attrs": {
                  "class": "aaa"
                }
              }
            },
            {
              "fieldName": "ConstructionUnit",
              "fieldTitle": "  施工单位  ",
              "fieldAlias": null,
              "span": 4,
              "itemRender": {
                "name": "$input",
                "props": {
                  "clearable": true
                },
                "attrs": {
                  "class": "aaa"
                }
              }
            },
            {
              "fieldName": "ProcInstState",
              "fieldTitle": "  单据状态  ",
              "span": 4,
              "itemRender": {
                "props": {
                  "clearable": true,
                  "textName": "text"
                },
                "name": "$select",
                "options": [
                  {
                    "value": "1",
                    "text": "草稿"
                  },
                  {
                    "value": "2",
                    "text": "审批中"
                  },
                  {
                    "value": "3",
                    "text": "已完成"
                  },
                  {
                    "value": "5",
                    "text": "驳回发起人"
                  },
                  {
                    "value": "99",
                    "text": "已作废"
                  }
                ]
              },
              "fieldAlias": null
            },
            {
              "fieldName": "CreateName",
              "fieldTitle": "  编制人  ",
              "fieldAlias": null,
              "span": 4,
              "itemRender": {
                "name": "$input",
                "props": {
                  "clearable": true
                },
                "attrs": {
                  "class": "aaa"
                }
              }
            },
            {
              "fieldName": "CreateTime",
              "fieldTitle": "  编制时间  ",
              "fieldAlias": null,
              "span": 4,
              "itemRender": {
                "name": "$datetime",
                "props": {
                  "clearable": true,
                  "type": "datetimerange",
                  "dateformat": ""
                }
              }
            },
            {
              "span": 24,
              "isSimpleSearch": false,
              "align": "center",
              "collapseNode": true,
              "itemRender": {
                "name": "$buttons",
                "children": [
                  {
                    "props": {
                      "icon": "fa fa-search",
                      "type": "submit",
                      "content": "查询",
                      "status": "default"
                    }
                  },
                  {
                    "props": {
                      "icon": "fa  fa-undo",
                      "type": "reset",
                      "content": "重置"
                    }
                  }
                ]
              }
            }
          ]
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
        // 查询条件
        formData: {
          pageIndex:1,
          pageSize: 15
        },
        isOpen: false,
        value1: null,
        multipleSelection: [] // 存储列表勾选rows
      }
    },
    mounted () {
      // window.myvm指向当前页面vue实例
      window.myvm = this;
      // 自适应计算高度
      window.autoPageHeight();
    },
    created () {
      var that = this;
      // 流程表单ID 找到对应流程应用id(在流程应用关联流程的时候会有) 直接写死 很重要
      that.appId = 'EK';
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
          title: "单据编号",
          align: "center",
          type: "html",
        },
        {
          field: "inputDecimal",
          title: "项目编号",
          align: "center",
          type: "html",
        },
        {
          field: "inputDict",
          title: "项目名称",
          align: "center",
          type: "html",
        },
        {
          field: "inputDictMore",
          title: "施工单位",
          align: "center",
          type: "html",
        },
        {
          field: "projectManager",
          title: "项目经理",
          align: "center",
          type: "html",
        },
        {
          field: "inputString",
          title: "目标成本(元)",
          align: "center",
          type: "html",
        },
        {
          field: "jsonData",
          title: "编制人",
          align: "center",
          type: "html",
        },
        {
          field: "createTime",
          title: "编制时间",
          align: "center",
          type: "html",
        }, {
          field: "procInstState",
          title: "单据状态",
          align: "center",
          type: "html",
          formatter: function (row, column, value, index) {
            var text = getWorkflowStatus(Number(value));
            return text;
          }
        },
      ];
      this.dataGridSearch()
    },
    methods: {
      // 重置
      resetForm () {
        this.$refs.form.resetFields()
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
        this.showDialogEdit('3', row['wiid']);
      },
      // 操作列编辑按钮事件
      myOperationEditEvent (value, row, index) {
        this.showDialogEdit('3', row['wiid']);
      },
      // 操作列删除按钮事件
      myOperationDeleteEvent (value, row, index) {
        var that = this;
        this.$confirm('此操作将删除该所选数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //删除接口
          if(row.id){
            var res = demoApi.deleteData(row.id);
            if (res.code === 200) {
              that.$message({
                message: "删除成功! ",
                type: "success",
              });
              that.getGridData();
            } else {
              // FUI.Window.showMsg(res.msg);
              that.$message.error(res.msg);
            }
          }
        }).catch(() => {
          console.log('取消删除')
        });
      },


      // 打开流程表单页面
      showDialogEdit (formAction, wiid) {
        // var that = this;
        // var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : formAction == FUI.FormAction.Edit ? '编辑' + that.dg.EditTitle : '查看' + that.dg.EditTitle;
        // FUI.Window.openEdit(that.dg.EditUrl, title, formAction, that.dg.GridId, 700, 550, null, that.dg.MainTable, keyId, true);
        this.startWorkflow(formAction, wiid)
      },
      // 工具栏按钮 (在这添加自定义按钮)
      myToolBarCustomButton () {
        var btns = [
          { code: 'add', status: 'default', name: '新增', icon: 'fa fa-play-circle' },
          { code: 'delete', status: 'default', name: '删除', icon: 'fa fa-remove' },
          { code: 'test', status: 'default', name: '测试', icon: 'fa fa-close' }
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
          // that.showDialogEdit(FUI.FormAction.Add, '');
          var fn = that['startWorkflow'];
          fn('0');
        } else if (code == 'delete') {
          // 自定义删除事件
          that.handelDelete();
        } else if(code === 'test') {
          alert('测试按钮');
        }else {
          var fn = that[code];
          fn(code);
        }
      },
      // 跳转流程表单页面
      startWorkflow (formAction, wiid) {
        let that = this;
        let url = '';
        if (that.appId) {
          if (formAction === '0') {
             // url = '/workflowForm?encode=bidAudit&appId=' + that.appId + '&formAction=' + formAction;
              url = '/workflowForm?encode=forwardSelectionContractor&appId=' + that.appId + '&formAction=' + formAction;
          } else {
             // url = '/workflowForm?encode=bidAudit&appId=' + that.appId + '&formAction=' + formAction + '&wiid=' + wiid;
             url = '/workflowForm?encode=bidAudit&appId=' + that.appId + '&formAction=' + formAction + '&wiid=' + wiid;
          }
          that.$router.push({ path: url});
        } else {
          FUI.Window.showMsg('无流程的表单应用不可发起流程！');
        }
      },
      // 刷新列表
      refreshGrid (parentGridId, parm) {
        var that = this;
        that.dataGridSearch();
      },
      // 刷新查询方法
      dataGridSearch () {
        this.tablePage.currentPage = 1;
        this.tablePage.startIndex = 0;
        this.getGridData();
      },
      // 获取table数据
      async getGridData () {
        const that = this;
        let parm = Object.toClone(that.formData);
        // 调用请求api
        var res = await demoApi.getTableData(parm);
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
      // 打开单据选择
      handelOpenBillNo(){
        var that=myvm;
        var customDialog = eval(CustomDialog);
        customDialog(that, {customDialog:"WorkflowSheetIdSelect",callBack:function(data){
            console.log(data);
          }});
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
          arr.push(rows[i]['myId']);
        }
        console.log(arr,'myId集合');
        FUI.Window.confirm('是否删除所选数据？', null, function (r) {
          //删除接口
          if(rows.length>0){
            var res = demoApi.deleteData();
            if (res.code === 200) {
              that.$message({
                message: "删除成功! ",
                type: "success",
              });
              that.getGridData();
            } else {
              FUI.Window.showMsg(res.msg);
            }
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
      // 搜索框事件
      expandClick(name){
        console.log(name,'12111')
      },
      // 查询 or 重置事件
      searchFormBtnclick(name,obj){
        this.formData = obj;
        this.getGridData();
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
