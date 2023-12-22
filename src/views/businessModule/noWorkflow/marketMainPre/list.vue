<template>
  <div class="f2bpm-page-layout costListClass">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div class="search-box">
          <workSearchForm ref="form" :tableform="tableForm" @searchForm-click="searchFormBtnclick"></workSearchForm>
        </div>
        <workTable
          ref="grid"
          grid="grid"
          :context-menu="{header: {options: headerMenus},className: 'my-menus'}"
          :pager-config="tablePage"
          :table-data="tableData"
          :columns="tableColumn"
          @page-change="pageChange"
          @sort-change="sortChange"
        />
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import workTable from '@/components/table/workTable'
  import workSearchForm from '@/components/table/workSearchForm'
  import { getMarketMainPreList } from '@/Api/workflowBusssion/marketMainPre.js';
  export default {
    components: {
      workTable,
      workSearchForm
    },
    data() {
      return {
        // 表单查询的一些默认条件
        tableForm: {
          titleWidth: 100,
          titleAlign: 'right',
          props: { searchPlaceholder: '' },
          data: {
            'customerName': '',
            'name': '',
            'address': '',
            'projectType': '',
            'finishedTime': ''
          },
          // // 查询控件
          items: [
            {
              'fieldName': 'customerName',
              'fieldTitle': '客户',
              'fieldAlias': null,
              'span': 4,
              'itemRender': {
                'name': '$input',
                'props': {
                  'clearable': true
                },
                'attrs': {
                  'class': 'aaa'
                }
              }
            },
            {
              'fieldName': 'name',
              'fieldTitle': '立项名称',
              'fieldAlias': null,
              'span': 4,
              'itemRender': {
                'name': '$input',
                'props': {
                  'clearable': true
                },
                'attrs': {
                  'class': 'aaa'
                }
              }
            },
            {
              'fieldName': 'projectType',
              'fieldTitle': '立项类型/入库类型',
              'fieldAlias': null,
              'span': 4,
              'itemRender': {
                'name': '$select',
                'type': 'dicList',
                'configTypes': '立项类型,入库类别',
                'props': {
                  'clearable': true,
                  'textName': 'configName',
                  'valueName': 'configName'
                },
                'attrs': {
                  'class': 'aaa'
                }
              }
            },
            {
              'fieldName': 'address',
              'fieldTitle': '项目地址(省-市)/入库片区范围',
              'fieldAlias': null,
              'span': 4,
              'itemRender': {
                'name': '$input',
                'props': {
                  'clearable': true
                },
                'attrs': {
                  'class': 'aaa'
                }
              }
            },
            {
              'fieldName': 'finishedTime',
              'fieldTitle': '审核通过时间',
              'fieldAlias': null,
              'span': 4,
              'itemRender': {
                'name': '$datetime',
                'props': {
                  'type': 'daterange',
                  'clearable': true
                }
              }
            },
            {
              'span': 24,
              'isSimpleSearch': false,
              'align': 'center',
              'collapseNode': true,
              'itemRender': {
                'name': '$buttons',
                'children': [
                  {
                    'props': {
                      'icon': 'fa fa-search',
                      'type': 'submit',
                      'content': '查询',
                      'status': 'default'
                    }
                  },
                  {
                    'props': {
                      'icon': 'fa  fa-undo',
                      'type': 'reset',
                      'content': '重置'
                    }
                  }
                ]
              }
            }
          ]
        },
        headerMenus: [{ code: 'configHead', name: '配置表头', prefixIcon: 'fa fa-cog' }],
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
        optionList: [],
        // 查询条件
        formData: {
          pageIndex: 1,
          pageSize: 15
        },
        tableColumn: [
          {
            field: 'code',
            title: '立项编号/入库编号',
            align: 'center',
            type: 'html'
          },
          {
            field: 'name',
            title: '立项名称',
            align: 'center',
            type: 'html'
          },
          {
            field: 'projectType',
            title: '立项类型/入库类别',
            align: 'center',
            type: 'html'
          },
          {
            field: 'customerName',
            title: '客户',
            align: 'center',
            type: 'html'
          },
          {
            field: 'address',
            title: '项目地址(省-市)/入库片区范围',
            align: 'center',
            type: 'html'
          },
          {
            field: 'detailAddress',
            title: '详细地址/入库片区',
            align: 'center',
            type: 'html'
          }, {
            field: 'finishedTime',
            title: '审批通过时间',
            align: 'center',
            type: 'html'
          }
        ]
      }
    },
    mounted() {
      // window.myvm指向当前页面vue实例
      window.myvm = this;
      // 自适应计算高度
      window.autoPageHeight();
      this.getGridData();
    },
    beforeDestroy() {
    },
    created() {
    },
    methods: {
      /**
       * 查询 or 重置事件
       */
      searchFormBtnclick(obj) {
        this.formData = obj;
        this.getGridData();
      },
      /**
       * 获取table数据
       */
      async getGridData() {
        const that = this;
        const parm = Object.toClone(that.formData);
        parm.currentPage = that.tablePage.currentPage;
        parm.pageSize = that.tablePage.pageSize;
        parm.sort = that.tablePage.sort;
        parm.order = that.tablePage.order;
        // 调用请求api
        for (const key in parm) { if (parm[key]) parm[key] = parm[key].toString() }
        var res = await getMarketMainPreList(parm);
        if (res.code === 200) {
          that.tableData = res.data.list;
          that.tablePage.total = res.data.pagination.total;
          that.tablePage.pageCount = res.data.pagination.currentPage;
        } else {
          FUI.Window.showMsg(res.msg);
        }
      },
      /**
       * 分页事件
       * @param {*} obj
       */
      pageChange(obj) {
        this.formData.pageIndex = obj.currentPage;
        this.formData.pageSize = obj.pageSize;
        this.getGridData();
      },
      /**
       * 分页事件
       * @param {*} obj
       */
      sortChange(obj) {
        this.formData.pageIndex = obj.currentPage;
        this.formData.pageSize = obj.pageSize;
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
