<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed ? '20px' : '200px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box"   size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div  class="f2bpm-left-search-button-div">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="icon icon-shuaxin  cur mr10 font12  " @click="loadTree()"></i>
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>
        <div v-if="!isCollapsed" class="f2bpm-page-left-content">
          <span class="fa fa-home cur ml10 font12 " @click="showAll()">{{$t('all')}}</span>
          <el-tree ref="mytree" style="font-size: 12px" :data="treeData" :filter-node-method="filterTreeNode" :expand-on-click-node="false" default-expand-all @node-click="onTreeSelected" />
        </div>
      </el-aside>
      <el-main class="f2bpm-page-right">
        <div>
          <div id="gridSearch" class="grid-search-form">
            <div id="grid-search-form-list" :class="'grid-search-form-list ' + searchFromData.collapsedHeight">
              <ul>
                <li>
                  <label>{{$t('wfgrid.sheetId')}}：</label>
                  <el-input id="SheetId" v-model="searchParams.SheetId" size="mini" clearable class="textBoxShort" name="SheetId" />
                </li>
                <li>
                  <label>{{$t('title')}}：</label>
                  <el-input id="WorkflowTitle" v-model="searchParams.WorkflowTitle" size="mini" clearable class="textBoxShort" name="WorkflowTitle" />
                </li>
                <li>
                  <label>单据编号：</label>
                  <el-input id="FormDatakey" v-model="searchParams.FormDatakey" size="mini" clearable class="textBoxShort" name="FormDatakey" />
                </li>
                <li>
                  <label>{{$t('wfInfo.procName')}}：</label>
                  <el-input id="AppName" v-model="searchParams.AppName" size="mini" clearable class="textBoxShort" name="AppName" />
                </li>
                <li> <label>{{$t('wfInfo.appId')}}：</label>
                  <el-input v-model="searchParams.AppId" size="mini" class="textBoxShort" />
                </li>
                <li>
                  <label>{{$t('wfgrid.creatorRealName')}}：</label>
                  <el-input id="CreatorRealName" v-model="searchParams.CreatorRealName" size="mini" clearable class="textBoxShort" name="CreatorRealName" />
                </li>
                <li>
                  <label>{{$t('wfgrid.workflowInstanceState')}}：</label>
                  <el-select id="WorkflowInstanceState" v-model="searchParams.WorkflowInstanceState" size="mini" class="textBoxShort" name="WorkflowInstanceState">
                    <el-option label="全部" value="" />
                    <el-option label="审批中" value="2" />
                    <el-option label="已完成" value="3" />
                    <el-option label="已挂起" value="4" />
                    <el-option label="退回提单" value="5" />
                  </el-select>
                </li>
                <li>
                  <label>{{$t('wfgrid.startTime')}}：</label>
                  <el-date-picker v-model="searchParams.StartTime" size="mini" clearable type="date" class="textBoxShort" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
                </li>
                <li>
                  <label>&nbsp;&nbsp;&nbsp;&nbsp;{{$t('toz')}}：</label>
                  <el-date-picker v-model="searchParams.EndTime" size="mini" clearable type="date" class="textBoxShort" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
                </li>
              </ul>
            </div>
            <div class="grid-search-form-searchbtn-toolbar">
              <el-input v-model="searchParams.searchtext" size="small" :placeholder="$t('searchTip.taskSearchTip')" clearable style="width: 347px; margin-right: 5px" :searchfields="searchParams.searchfields" />
              <el-divider direction="vertical" />
              <el-button size="small" class="search-btn" type="primary" @click="dataGridSearch()"><i class="fa fa-search" />{{$t('search')}}
              </el-button>
              <span v-if="expansMore" class="expans-more" :title="searchFromData.moreTitle" @click="onSearchExpansMore">{{ searchFromData.moreTitle }}<i :class="searchFromData.moreIcon" /></span>
            </div>
          </div>
          <div id="grid-toolbar" class="grid-toolbar">
            <el-button-group>
              <el-button size="small" type="default" @click="handleOpen">
                <i class="fa fa-edit" /> {{$t('pageInfo.markread')}}
              </el-button>
              <!-- 导出 -->
              <el-button  size="small" type="default" @click="excelExportClick">
                 {{$t('workstation.button.excelExport')}}
              </el-button>
            </el-button-group>
          </div>
          <div>
            <f2bpm-datagrid :expand-search="expandSearch" ref="grid" :show-checkbox="true" :show-seq="true" height="full-190" grid="grid" pk="taskId" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @page-change="pageChange" @sort-change="sortChange" />
          </div>
        </div>
      </el-main>
    </el-container>
    <el-dialog
      title="标记已阅"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="30%">
      <div style="font-size: 14px;padding: 5px;margin-bottom: 5px;">请填写批注内容</div>
      <el-input
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 6}"
        placeholder="请输入内容"
        v-model="AnnotationContent">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearForm" size="small">取 消</el-button>
        <el-button type="primary" @click="setDoneCirculated" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { getDetailData } from '@/Api/workflowBusssion/index.js'
  export default {
    name: 'TodoList',
    data() {
      return {
        expandSearch: "",
        language: "",
        // ======stand:标准区=============
        currCategoryCode: '',
        treeFilterText: '',
        expansMore: true,
        isCollapsed: false,
        searchFromData: {
          moreIcon: 'fa fa-angle-double-down',
          moreTitle: this.$t('expand'),
          collapsedHeight: 'grid-search-form-list-height'
        },
        searchParams: {
          WorkflowTitle: '',
          AppName: '',
          AppId: '',
          InCategoryCode: '',
          Urgency: '',
          CurrentActivityName: '',
          SheetId: '',
          CreatorRealName: '',
          WorkflowInstanceState: '',
          StartTime: '',
          EndTime: '',
          FormDatakey: '',
          searchtext: '',
          searchfields: 'SheetId,WorkflowTitle,FormDatakey'
        },
        tablePage: {
          pageCount: 0,
          sort: 'createdTime',
          order: 'desc',
          startIndex: 0,
          total: 0,
          currentPage: 1,
          pageSize: 20,
          align: 'center',
          pageSizes: [2, 10, 20, 50, 100, 200, 500],
          layout: 'total, sizes, prev, pager, next, jumper'
        },
        loading: false,
        dialogVisible: false,
        AnnotationContent:'', // 批准内容
        treeData: [],
        tableData: [],
        tableColumn: [
          { type: 'seq', title: '序号', align: 'center', fixed: 'left' },
          { type: 'checkbox', align: 'center', fixed: 'left' },
          {
            field: 'sheetId',
            title: this.$t('wfgrid.sheetId'),
            width: 220,
            fixed: 'left',
            sort: true,
            align: 'left',
            type: 'html',
            slots: {
              default: ({ row, column }, h) => {
                const that = this;
                return [
                  h(
                    'span',
                    {
                      style: {
                        cursor: 'pointer',
                        color: '#409eff'
                      },
                      on: {
                        click: () =>
                          that.openWorkflowfromView(row.appId, 4, row.workflowInstanceId, row.taskId, row.workflowTitle)
                      }
                    },
                    row.sheetId
                  )
                ];
              }
            }
          },
          {
            field: 'formDatakey',
            title: '单据编号',
            width: 180,
            align: 'center'
          },
          {
            field: 'workflowTitle',
            title: this.$t('title'),
            width: 480,
            align: 'center',
            type: 'html',
            slots: {
              // 使用 JSX 渲染函数
              default: ({ row, column }, h) => {
                return [
                  h(
                    'span',
                    {
                      style: {
                        cursor: 'pointer'
                      },
                      on: {
                        click: () =>
                          this.openWorkflowfromView(row.appId, 4, row.workflowInstanceId, row.taskId, row.workflowTitle)
                      }
                    },
                    row.workflowTitle
                  )
                ];
              }
            }
          },
          {
            field: 'fromCreator',
            title: this.$t('wfgrid.circulator'),
            width: 100,
            align: 'center'
          },
          {
            field: 'realName',
            title: this.$t('wfgrid.cirToUser'),
            width: 100,
            align: 'center'
          },
          {
            field: 'activityName',
            title: this.$t('wfgrid.cirNode'),
            width: 100,
            align: 'center'
          },
          {
            field: 'createdTime',
            title: '接收时间',
            width: 180,
            sort: true,
            align: 'center',
            formatter: this.dateFormatter
          },
          {
            field: 'taskState',
            title: '任务状态',
            type: 'html',
            sort: true,
            width: 100,
            align: 'center',
            formatter: function (row, column, value, index) {
              return row.taskState == 0 ? '<em>未阅</em>' : '已阅';
            }
          },

          {
            field: 'appName',
            title: this.$t('wfInfo.procName'),
            width: 180,
            align: 'center'
          },
          {
            field: 'workflowInstanceState',
            title: this.$t('wfgrid.workflowInstanceState'),
            type: 'html',
            width: 100,
            sort: true,
            align: 'center',
            formatter: function (row, column, value, index) {
              var text = getWorkflowStatusFormatter(row);
              return text;
            }
          },
          {
            field: 'creatorRealName',
            title: this.$t('wfgrid.creatorRealName'),
            width: 120,
            align: 'center'
          },
          {
            field: 'startedTime',
            title: this.$t('wfgrid.wfstartTime'),
            width: 180,
            align: 'center'
          },
          {
            field: 'extStr',
            title: this.$t('wfgrid.runingtime'),
            width: 200,
            align: 'center',
            formatter: function (rec, column, value, index) {
              var value = rec.startedTime;
              var finishedTime = rec.finishedTime;
              var text = '';
              if (!finishedTime) {
                var now = new Date();
                var endTime = now.toDateFormat('yyyy-MM-dd HH:mm:ss');
                var start = Object.toJsonDateTimeFormatter(value);
                var subN = Object.toGetDateDiff(start, endTime, 'zw');
                text = subN;
              } else {
                var endTime = Object.toJsonDateTimeFormatter(finishedTime);
                var start = Object.toJsonDateTimeFormatter(value);
                var subN = Object.toGetDateDiff(start, endTime, 'zw');
                text = subN;
              }
              return text;
            }
          }
        ]
      };
    },
    computed: {
      rotateIcon() {
        return this.isCollapsed
          ? 'fa fa-angle-double-right cur   font13'
          : 'fa fa-angle-double-left cur   font13';
      }
    },
    watch: {
      treeFilterText(val) {
        this.$refs.mytree.filter(val);
      }
    },
    created() {
      var that = this;
      that.language = that.$store.state.app.language;
      this.loadTree();
      this.getGridData();
    },
    mounted() {
      window.myvm=this;
      window.autoPageHeight();
    },
    methods: {
      dateFormatter(rec, column, value, index) {
        if (value == '' || value == null) {
          return '';
        }
        var text = Object.toJsonDateTimeFormatter(value);
        return text;
      },
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      onTreeSelected(data, treeNode, thisObj) {
        var ids = [];
        var childs = treeNode.childNodes;
        ids.push(treeNode.data.id);
        $.each(childs, function (index, item) {
          ids.push(item.data.id);
          if (item.childNodes) {
            var childs2 = item.childNodes;
            $.each(childs2, function (index2, item2) {
              ids.push(item2.data.id);
            });
          }
        });
        this.searchParams.InCategoryCode = ids.toString();
        this.dataGridSearch();
      },
      showAll() {
        this.searchParams.InCategoryCode = '';
        this.dataGridSearch();
      },
      filterTreeNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=WorkflowGroup';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            var msg = res.msg;
          } else {
            FUI.Window.showMsg(that, res.msg);
          }
        });
      },
      refreshGrid() {
        this.dataGridSearch();
      },
      dataGridReSet() {
        const that = this;
        this.dataGridSearch();
      },
      dataGridSearch() {
        if (this.searchParams.EndTime && this.searchParams.StartTime) {
          var start = this.searchParams.StartTime;
          var endTime = this.searchParams.EndTime;
          const n = Object.toGetDateDiff(start, endTime, 'second');
          if (n < 0) {
            FUI.Window.showMsg2(this, '发起“截止时间”不能小于“开始时间”');
            return;
          }
        }
        this.tablePage.currentPage = 1;
        this.tablePage.startIndex = 0;
        this.getGridData();
      },
      getGridData() {
        var that = this;
        var parm = that.searchParams;
        parm.page = that.tablePage.currentPage;
        parm.rows = that.tablePage.pageSize;
        parm.sort = that.tablePage.sort;
        parm.order = that.tablePage.order;
        var res = Object.toAjaxJson('/workflow/workflowBusiness/', 'getTodoCirculatedListJson', parm, true, null, function (res) {
          if (res.success) {
            that.tableData = res.rows;
            that.tablePage.total = res.total;
            that.tablePage.pageCount = res.pageCount;
          } else {
            FUI.Window.showMsg(res.msg);
          }
        }
        );
      },
      sortChange({ column, field, order }) {
        this.tablePage.sort = field;
        this.tablePage.order = order;
        this.tablePage.currentPage = 1;
        this.getGridData();
      },
      pageChange({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage;
        this.tablePage.pageSize = pageSize;
        this.getGridData();
      },

      onSearchExpansMore() {
        var name = "";
        if (this.searchFromData.moreTitle == this.$t('expand')) {
          this.searchFromData.moreIcon = 'fa fa-angle-double-up';
          this.searchFromData.collapsedHeight = '';
          this.searchFromData.moreTitle = this.$t('packUp');
          name = "expand2";
        } else {
          this.searchFromData.moreIcon = 'fa fa-angle-double-down';
          this.searchFromData.collapsedHeight = 'grid-search-form-list-height';
          this.searchFromData.moreTitle = this.$t('expand');
          name = "packup";
        }
        this.expandSearch = name;
      }
      , setDoneCirculated() {
        var that = this;
        // FUI.Window.confirm(that, '确定要标记为已阅吗？', '温馨提示', function (index) {
        //   try {
        //     var dataJsonParm = {};
        //     dataJsonParm.taskId = taskIds;
        //     dataJsonParm.AnnotationContent = that.AnnotationContent;
        //     var mssg = Object.toAjaxJson("/workflow/workflowformSender/", 'setDoneCirculated', dataJsonParm);
        //     if (mssg === false) return false;
        //     if (mssg.success) {
        //       that.refreshGrid();
        //     } else {
        //       FUI.Window.showMsg(mssg.msg, null, 1);
        //     }
        //     return false;
        //   } catch (err) {
        //     FUI.Window.showMsg(err);
        //     return false;
        //   }
        // });
        // return false;
        var taskIds = FUI.Grid.getGridChecked(that, 'grid', 'taskId');
        var dataJsonParm = {};
        dataJsonParm.taskId = taskIds;
        dataJsonParm.opinion = that.AnnotationContent;
        var mssg = Object.toAjaxJson("/workflow/workflowformSender/", 'setDoneCirculated', dataJsonParm);
        if (mssg === false) return false;
        if (mssg.success) {
          that.refreshGrid();
          that.clearForm();
        } else {
          FUI.Window.showMsg(mssg.msg, null, 1);
        }
        return false;
      },
      async openWorkflowfromView(appId, formAction, wiid, taskId, title) {
        const res = await getDetailData({appId: appId, wiid: wiid})
        if(res.code == 200) {
          if(res.data.enCode && res.data.modelName) {
            const url = '/workflowForm?formAction=4&appId=' + appId + '&wiid=' + wiid + '&taskId=' + taskId + '&encode=' + res.data.enCode 
              + '&rowId=' + res.data.rowId + '&modelName=' + res.data.modelName + '&code='
              + res.data.code+'&toDone=true&toPath=workflow/workflowBusiness/todoCirculatedList';
            this.$router.push(url);
          } else {
            var url = __webpath + '/workflow/workflowform/index/?formAction=4&taskId=' + taskId;
            FUI.Window.open(url, '_blank');
          }
        }
      },
      // 打开意见弹窗
      handleOpen(){
        var that = this;
        var taskIds = FUI.Grid.getGridChecked(that, 'grid', 'taskId');
        if (taskIds == "") {
          FUI.Window.showMsg("请选择需要标记的记录");
          return false;
        }
        that.AnnotationContent = '';
        that.dialogVisible = true;
      },
      //导出
      excelExportClick() { 
        var parm = this.searchParams;
        parm.page = this.tablePage.currentPage;
        parm.rows = this.tablePage.pageSize;
        parm.sort = this.tablePage.sort;
        parm.order = this.tablePage.order;
        Object.toAjaxDownloadFile('/workflow/workflowExport/', 'exportTodoCirculated', parm);
      },
      clearForm(){
        this.dialogVisible = false;
        this.AnnotationContent = '';
      }
    }
  }
</script>
