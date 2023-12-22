<template>
  <div class="f2bpm-page-layout">
    <el-container style="{ height: containerHeight + 'px'}">
      <el-main class="f2bpm-page-right" style="overflow: hidden">
        <f2bpm-gridsearchform class="grid-search-from" :childCol="colNum" :tableform="tableForm" @expandclick="expandClick" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <!-- height="full-95" -->
        <f2bpm-datagrid
          ref="grid"
          grid="grid"
          :grid-height="gridHeight"
          :expand-search="expandSearch"
          :context-menu="{header: {options: headerMenus},className: 'my-menus'}"
          :pager-config="tablePage"
          :data="tableData"
          :columns="tableColumn"
          @checkbox-all="selectAllEvent"
          @checkbox-change="selectChangeEvent"
          @radio-change="selectChangeEvent"
          @header-contextmenu="contextMenuClickEvent"
          @page-change="pageChange"
          @sort-change="sortChange"
        />
      </el-main>
      <el-aside ref="sideRight" class="f2bpm-selector-page-right" width="180px">
        <f2bpm-datagrid ref="gridResult" grid="gridResult" :grid-height="gridRightHeight" :data="resultGridData" :columns="resultGridColumn" />
      </el-aside>
    </el-container>

  </div>
</template>

<script>
  // var code = Object.toQueryString('code')
  // 自定义对话框的定义数据
  var _config = null
  // 右侧结果集属性(返回结果集) fieldData:[{ fieldTitle: "字段1", fieldName: "1", propertyName: "", isKey: 1 }]
  var fieldData = {}// config为数据库整个配置实体对象
  // 参数说明{isMulti:true,customDialog:customDialog, initailData: [] }  initailData:为还原显示的数据
export default {
  props: {
    code: {
      type: String,
      default: ''
    },
    containerHeight: {
      type: Number,
      default: 400
    },
    gridHeight: {
      type: Number,
      default: 545
    },
    gridRightHeight: {
      type: Number,
      default: 680
    },
    isSetHead: {
      type: String,
      default: ''
    },
    parm: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
        expandSearch: '',
        keyName: '',
        // varParams自定义变量参数
        windowparms: { resultFieldKey: '', isMulti: false, data: [], varParams: '', isSetHead: 0 },
        // ======stand:标准区=============
        defaultWhereStr: '',
        getDataUrl: '',
        treeFilterText: '',
        isCollapsed: false,
        colNum: 24,
        // ==data grid====
        config: {},
        dg: {},
        tablePage: Object.toClone(FUI.DataGridProperty.tablePage),
        loading: false,
        treeData: [],
        tableData: [],
        tableForm: Object.toClone(FUI.DataGridProperty.tableForm),
        tableToolbar: Object.toClone(FUI.DataGridProperty.tableToolbar),
        headerMenus: FUI.DataGridProperty.headerMenus,
        tableColumn: [],

        // ===========标准区结束==========
         searchParams: {
        },
        // =======选择结果Grid===========
         resultGridData: [],
         resultGridColumn: [{
          field: '',
          title: '',
          hidden: true,
          align: 'center'
        }, {
          field: '',
          title: '',
          align: 'center'
        }, {
          field: 'action',
          title: '操作',
          width: 50,
          type: 'html',
          slots: {
            // 使用 JSX 渲染函数
            default: ({ row, column }, h) => {
              return [
                h('button', {
                  attrs: { title: '删除' },
                   class: 'btn btn-minier btn-grey mr2 fa fa-trash',
                   on: {
                    click: () => this.delRow(row[this.keyName])
                  }
                }, '')]
            }
          }
        }]
      }
    },
    computed: {
      countGridHeight() {
        return $(document).height() - global_selector_datagridHeightDiff
      },
       rotateIcon() {
        return this.isCollapsed ? 'fa fa-angle-double-right' : 'fa fa-angle-double-left'
      }
  },
  created() {
      this.init();
    },
  mounted() {
      // window.myvm = this;
  },
  methods: {
    init() {
      var that = this;
      that.loadWindowparms();
       that.loadCustomConfig();
       if (!_config) { return false; }
      that.config = _config;
      var dg = FUI.DataGrid.Create(that, that.config.objName, 'none', 'grid', true, false, true);
      dg.ToolBarDefaultButtons.ShowDelete = false;
      dg.DBCode = that.config.dBSource;
      dg.IsSimpleSearch = true;
      dg.ToolBarDefaultButtons.ShowAdd = false;
      dg.SingleSelect = !that.windowparms.isMulti;
      dg.ColManageField = 'ColManageField';
      // 表头定义名
      dg.ConfigTableName = 'CustDialog_' + that.config.code;
      if (that.config.sortName != '') {
        dg.SortName = that.config.sortName;
        dg.SortOrder = that.config.sortOrder;
      }
      dg.IsEnableAuthor = that.config.isEnableAuthor;
      // 默认的条件
      if (that.config.divideSql != '') {
        dg.DefaultWhere = that.config.divideSql;
      }
      dg.OperationAction.ShowView = false;
      dg.OperationAction.ShowEdit = false;
      dg.OperationAction.ShowDelete = false;
      dg.EditWidth = 700;
      dg.EditHeight = 360;
      dg.Bind()
    },
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
       loadWindowparms() {
        const that = this;
        const isSetHead = Number(this.isSetHead) || Object.toQueryString('isSetHead') || 0;
        that.windowparms.isSetHead = isSetHead;
        if (this.parm) this.parm = Object.toQueryString('parms')
        let parms = this.parm;
        if (parms) {
          if (Object.toQueryString('parms')) {
            let parmsStr = this.parm || Object.toQueryString('parms') || {};
            parmsStr = decodeURIComponent(parmsStr);
            parms = eval('(' + parmsStr + ')');
          }
          if (parms.isMulti == true || parms.isMulti == 'true') {
            isMulti = true;
          }
          if (parms.varParams) {
            that.windowparms.varParams = parms.varParams;
          }

          if (parms.data != undefined && parms.data.length > 0) {
            that.windowparms.data = parms.data;
            that.resultGridData = parms.data;
          }
          if (parms.isMulti != undefined) {
            that.windowparms.isMulti = parms.isMulti;
          }
          if (parms.resultFieldKey != undefined) {
            that.windowparms.resultFieldKey = parms.resultFieldKey;
          }
          if (parms.needRoot != undefined) {
            that.windowparms.needRoot = parms.needRoot;
          }
        }
      },
       loadCustomConfig() {
        var that = this
        // 格式：[{key:"",value:""}]
        var varParams = that.windowparms.varParams != '' ? JSON.stringify(that.windowparms.varParams) : '';
        if (!this.code) this.code = Object.toQueryString('code')
        var parm = { 'isSetHead': that.windowparms.isSetHead, 'code': this.code, 'varParams': varParams };
         var res = Object.toAjaxJson(FUI.Handlers.CustomDialogHandler, 'getOpenCustomDialogJson', parm)
         var configModel = res.data;
        fieldData = configModel.resultField && eval('(' + configModel.resultField + ')')
        $.each(fieldData, function(index, item) {
          if (item.isKey == 1) {
            that.keyName = item.fieldName
            that.windowparms.resultFieldKey = that.keyName
          } else {
            that.resultGridColumn[1].field = item.fieldName
            that.resultGridColumn[1].title = item.fieldTitle
          }
        })
        _config = configModel
      },
       pageChange({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage
        this.tablePage.pageSize = pageSize
        this.tablePage.startIndex = (currentPage - 1) * pageSize
        this.getGridData()
      },
       onTreeSelected(data, treeNode, thisObj) {
        var currCategoryCode = treeNode.data.id
        this.dataGridSearch()
      },
      showAll() {
        this.dataGridSearch()
      },
       filterTreeNode(value, data) {
        if (!value) return true
        return data.title.indexOf(value) !== -1
      },
       dataGridReSet() {
        var that = this
        $.each(this.searchParams, function(key, item) {
          that.searchParams[key] = ''
        })
        that.searchParams.historyVersion = 'false'
        // 重置查询
        this.dataGridSearch()
      },
      // 刷新列表
       refreshGrid(parentGridId, parm) {
        var that = this
        that.dataGridSearch()
      },
       dataGridSearch() {
        this.tablePage.currentPage = 1
        this.tablePage.startIndex = 0
        this.getGridData()
      },
       getGridData() {
        const that = this
        let parm = Object.toClone(that.tableForm.data)
        parm.page = that.tablePage.currentPage
        parm.rows = that.tablePage.pageSize
        parm.sort = that.tablePage.sort
        parm.order = that.tablePage.order
        parm = Object.extend(parm, that.searchParams)
        Object.toAjaxJson(that.dg.GetUrl(), null, parm, true, null, function(res) {
          if (res.success) {
            that.tableData = res.rows
            that.tablePage.total = res.total
            that.tablePage.pageCount = res.pageCount
          } else {
            FUI.Window.showMsg(res.msg)
          }
        })
      },
      // stand:选对结果区==================
       selectAllEvent(obj) {
        const that = this
        const rows = obj.selection
        const checked = obj.checked
        var keyId = that.windowparms.resultFieldKey
        $.each(rows, function(i, item) {
          if (checked) {
            that.addSelectRow(item)
          } else {
            that.delRow(item[keyId])
          }
        })
      },
      selectChangeEvent(obj) {
        const that = this
        const keyId = that.windowparms.resultFieldKey
        let checked = obj.checked
        if (checked == undefined) {
          checked = true
        }
        const selectedRow = obj.row
        if (checked) {
          that.addSelectRow(selectedRow)
        } else {
          that.delRow(selectedRow[keyId])
        }
      },
       addSelectRow(row) {
        const that = this
        const keyId = that.windowparms.resultFieldKey
        if (that.windowparms.isMulti == false) {
          const tem = []
          tem.push(row)
          that.resultGridData = tem
        } else {
          let isExist = false
          $.each(that.resultGridData, function(i, item) {
            if (item[keyId] == row[keyId]) {
              isExist = true
            }
          })
          if (isExist === false) {
            that.resultGridData.push(row)
          }
        }
      },
       delRow(delKeyId) {
        const that = this
        const keyId = that.windowparms.resultFieldKey
        var tem = []
        $.each(that.resultGridData, function(i, item) {
          if (item[keyId] != delKeyId) {
            tem.push(item)
          }
        })
        that.resultGridData = tem
      },
      tempRow() {
        this.resultGridData = [];
      },
       getResult() {
        return this.resultGridData
      }
    }
  }
  // window.getResult = function () {
  //   return myvm.getResult()
  // }

</script>
<style scoped>
.grid-search-from{
  margin-bottom:0;
}
.f2bpm-selector-page-right{
  height: 418px;
}
</style>
