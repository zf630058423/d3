<template>
  <div class="f2bpm-page-layout">
    <el-container :style="{ height: containerHeight + 'px' }">
      <el-main class="f2bpm-page-right" style="overflow: hidden">
        <div id="gridSearch" class="grid-search-form">
          <div id="grid-search-form-list" :class="'grid-search-form-list ' + searchFromData.collapsedHeight">
            <ul>
              <li>
                <label class="textClass"> 项目编号：</label>
                <el-input v-model="searchParams.constructArchiveMainCode" size="mini" clearable class="textBoxShort" placeholder="请输入"/>
              </li>
              <li>
                <label class="textClass"> 项目名称：</label>
                <el-input v-model="searchParams.constructArchiveMainName" size="mini" class="textBoxShort" placeholder="请输入"/>
              </li>
              <li>
                <label class="textClass"> 销售方：</label>
                <el-input v-model="searchParams.sellerName" size="mini" class="textBoxShort" placeholder="请输入"/>
              </li>
              <li>
                <label class="textClass"> 支出合同编号：</label>
                <el-input v-model="searchParams.contractOutMainCode" size="mini" class="textBoxShort" placeholder="请输入"/>
              </li>
              <li>
                <label class="textClass"> 支出合同名称：</label>
                <el-input v-model="searchParams.contractOutMainName" size="mini" class="textBoxShort" placeholder="请输入"/>
              </li>
            </ul>
          </div>
          <div class="grid-search-form-searchbtn-toolbar">
            <el-input v-model="searchParams.invoiceNo" size="small" placeholder="请输入发票号码,来查询" clearable
                      style="width: 257px; margin-right: 5px"/>
            <el-divider direction="vertical"/>
            <el-button size="small" class="search-btn" type="primary" @click="dataGridSearch()">
              <i class="fa fa-search"/>{{ $t('search') }}
            </el-button>
            <span class="expans-more" :title="searchFromData.moreTitle" @click="onSearchExpansMore">
              {{searchFromData.moreTitle }}<i :class="searchFromData.moreIcon"/>
            </span>
          </div>
        </div>
        <f2bpm-datagrid
          ref="grid"
          :expand-search="expandSearch"
          grid="grid"
          :style="{height:containerHeight-40+'px'}"
          :pager-config="tablePage"
          :data="tableData"
          :height="gridHeight"
          :columns="tableColumn"
          @checkbox-all="selectAllEvent"
          @checkbox-change="selectChangeEvent"
          @radio-change="selectChangeEvent"
          @page-change="pageChange"
          @sort-change="sortChange"
        />
      </el-main>
      <el-aside ref="sideRight" class="f2bpm-selector-page-right" width="180px">
        <f2bpm-datagrid
          ref="gridResult"
          :grid-height="containerHeight+260"
          grid="gridResult"
          :data="resultGridData"
          :columns="resultGridColumn"
        />
        <div class="p3">
          <span id="clearEmpty2" class="cur red font10" @click="clearAll()"><i class="fa fa-minus-circle"/>清空所选</span>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
  import {getDeductInvoiceControlList} from '@/Api/contract/index'

  export default {
    props: {
      containerHeight: {
        type: Number,
        default: 500
      },
      parms: {
        type: Object,
        default: () => {
        }
      }
    },
    data() {
      return {
        expandSearch: '',
        windowparms: {resultFieldKey: 'id', singleSelect: false, data: []},
        searchFromData: {
          moreIcon: 'fa fa-angle-double-down',
          moreTitle: this.$t('expand'),
          collapsedHeight: 'grid-search-form-list-height'
        },
        // ======stand:标准区=============
        treeFilterText: '',
        isCollapsed: false,
        // ==data grid====
        dg: {},
        tablePage: Object.toClone(FUI.DataGridProperty.tablePage),
        loading: false,
        treeData: [],
        tableData: [],
        tableForm: Object.toClone(FUI.DataGridProperty.tableForm),
        tableToolbar: Object.toClone(FUI.DataGridProperty.tableToolbar),
        headerMenus: Object.toClone(FUI.DataGridProperty.headerMenus),
        tableColumn: [
          {type: this.singleSelect ? 'radio' : 'checkbox', width: 35, align: 'center', fixed: 'left'},
          {field: 'invoiceNo', type: 'html', title: '发票号码', width: 120, align: 'center'},
          {field: 'invoiceCode', type: 'html', title: '发票代码', width: 120, align: 'center'},
          {field: 'invoiceAmountTax', type: 'html', title: '发票金额(含税)', width: 120, align: 'center'},
          {
            field: 'accumulateDeductionAmount',
            type: 'html',
            title: '累计扣除金额',
            width: 120,
            align: 'center'
          },
        ],

        // =======选择结果Grid===========
        resultGridData: [],
        resultGridColumn: [{
          field: 'id',
          title: 'id',
          hidden: true,
          align: 'center'
        }, {
          field: 'invoiceNo',
          title: '发票号码',
          align: 'center'
        }, {
          field: 'action',
          title: '操作',
          width: 50,
          type: 'html',
          slots: {
            // 使用 JSX 渲染函数
            default: ({row, column}, h) => {
              return [
                h('button', {
                  attrs: {title: '删除'},
                  class: 'btn btn-minier btn-grey mr2 fa fa-trash',
                  on: {
                    click: () => this.delRow(row[this.windowparms.resultFieldKey])
                  }
                }, '')]
            }
          }
        }],
        gridHeight: 350,
        // ===========标准区结束==========
        searchParams: {
          "constructArchiveMainCode": "",
          "constructArchiveMainId": "",
          "constructArchiveMainName": "",
          "contractOutMainCode": "",
          "contractOutMainName": "",
          "invoiceNo": "",
          "sellerName": ""
        }
      }
    }, computed: {
      countGridHeight() {
        return $(window).height() - global_selector_datagridHeightDiff
      },
      countGridHeight2() {
        return $(window).height() - 30
      },
      rotateIcon() {
        return this.isCollapsed ? 'fa fa-angle-double-right' : 'fa fa-angle-double-left'
      }
    },
    watch: {
      treeFilterText(val) {
        this.$refs.mytree.filter(val)
      }
    },
    created() {
      var $vm = this
      $vm.loadWindowparms()
      this.getGridData()
    },
    mounted() {
      window.myvm = this
    },

    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed
      },
      onSearchExpansMore() {
        var name = '';
        if (this.searchFromData.moreTitle == this.$t('expand')) {
          this.searchFromData.moreIcon = 'fa fa-angle-double-up';
          this.searchFromData.collapsedHeight = '';
          this.searchFromData.moreTitle = this.$t('packUp');
          name = 'expand2';
        } else {
          this.searchFromData.moreIcon = 'fa fa-angle-double-down';
          this.searchFromData.collapsedHeight = 'grid-search-form-list-height';
          this.searchFromData.moreTitle = this.$t('expand');
          name = 'packup';
        }
        this.expandSearch = name;
      },
      loadWindowparms() {
        const that = this
        var parmsStr = this.parms || Object.toQueryString('parms')
        var parms = {}
        if (parmsStr) {
          if (!this.parms) {
            parmsStr = decodeURIComponent(parmsStr)
            parms = eval('(' + parmsStr + ')')
          } else {
            parms = parmsStr.parm;
          }
          if (parms.data != undefined && parms.data.length > 0) {
            setTimeout(function () {
              that.resultGridData = parms.data
            }, 500)
          }
          if (parms.singleSelect != undefined) {
            that.windowparms.singleSelect = parms.singleSelect
            this.tableColumn[0].type = parms.singleSelect ? 'radio' : 'checkbox'
          }
          if (parms.resultFieldKey != undefined) {
            that.windowparms.resultFieldKey = parms.resultFieldKey
          }
          if (parms.varParams && parms.varParams.length > 0) {
            var varParams = parms.varParams;
            for (let i in varParams) {
              that.searchParams[varParams[i].key] = varParams[i].value;
            }
          }
        }
      },
      sortChange({column, field, order}) {
        this.tablePage.sort = field
        this.tablePage.order = order
        this.tablePage.currentPage = 1
        this.getGridData()
      },
      pageChange({currentPage, pageSize}) {
        this.tablePage.currentPage = currentPage
        this.tablePage.pageSize = pageSize
        this.tablePage.startIndex = (currentPage - 1) * pageSize
        this.getGridData()
      },
      dataGridReSet() {
        var that = this
        $.each(this.searchParams, function (key, item) {
          that.searchParams[key] = ''
        })
        that.searchParams.historyVersion = 'false'
        // 重置查询
        this.dataGridSearch()
      },
      // 刷新列表
      refreshGrid(parentGridId, parm) {
        var that = this;
        that.dataGridSearch()
      },
      dataGridSearch() {
        this.tablePage.currentPage = 1;
        this.tablePage.startIndex = 0;
        this.getGridData()
      },
      async getGridData() {
        const that = this;
        let parm = Object.toClone(that.tableForm.data);
        parm.currentPage = that.tablePage.currentPage;
        parm.pageSize = that.tablePage.pageSize;
        parm.sort = that.tablePage.sort;
        parm.order = that.tablePage.order;
        parm = Object.extend(parm, that.searchParams);
        const res = await getDeductInvoiceControlList(parm);
        if(res.code === 200){
          that.tableData = res.data.list;
          that.tablePage.total = res.data.pagination.total;
          that.tablePage.pageCount = res.data.pagination.pageSize;
        }else{
          FUI.Window.showMsg(that, res.msg)
        }
      },
      // stand:选对结果区==================
      selectAllEvent(obj) {
        const that = this;
        const rows = obj.selection;
        const checked = obj.checked;
        var keyId = that.windowparms.resultFieldKey;
        $.each(rows, function (i, item) {
          if (checked) {
            that.addSelectRow(item)
          } else {
            that.delRow(item[keyId])
          }
        })
      },
      selectChangeEvent(obj) {
        const that = this;
        const keyId = that.windowparms.resultFieldKey;
        let checked = obj.checked;
        if (checked == undefined) {
          checked = true
        }
        const selectedRow = obj.row;
        if (checked) {
          that.addSelectRow(selectedRow)
        } else {
          that.delRow(selectedRow[keyId])
        }
      },
      addSelectRow(row) {
        const that = this
        const keyId = that.windowparms.resultFieldKey
        if (that.windowparms.singleSelect) {
          const tem = []
          tem.push(row)
          that.resultGridData = tem
        } else {
          let isExist = false
          $.each(that.resultGridData, function (i, item) {
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
        $.each(that.resultGridData, function (i, item) {
          if (item[keyId] != delKeyId) {
            tem.push(item)
          }
        })
        that.resultGridData = tem
      },
      clearAll() {
        this.resultGridData = []
        this.$nextTick(() => {
          // 取消选中的行
          this.$refs['grid'].toggleSelection()
        })
      },
      getResult() {
        return this.resultGridData
      }
    }

  }
  window.getResult = function () {
    return myvm.getResult()
  }
</script>
<style scoped>
  .textClass{
    width: 100px;font-size: 12px
  }
</style>
