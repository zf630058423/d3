<template>
  <el-table
      id="grid"
      ref="f2bpmuiVuetable"
      :key="tableKey"
      v-loading="loading"
      :show-summary="showSummary"
      :summary-method="getSummaries"
      class="f2bpmui-datagrid-vuetable"
      size="small"
      :height="tableHeight"
      :stripe="stripe"
      :border="border"
      :row-key="rowKey"
      :data="rows"
      element-loading-text="加载中"
      fit
      highlight-current-row
      @select="selectionChange"
    >
      <!--单选-->
      <el-table-column v-if="showCheckbox&&checkBoxType=='radio'" fixed="left" dir="" width="40" align="center" header-align="center">
        <template slot="header">
          <el-checkbox v-if="checkBoxType=='checkbox'" v-model="checkedAll" @change="checkAllChange" />
        </template>
        <template slot-scope="scope">
          <el-radio v-model="radioVal" style="margin-left: 3px" :label="scope.row" name="radio" @change="radioChange"><span /></el-radio>
        </template>
      </el-table-column>
      <!--多选-->
      <el-table-column v-if="showCheckbox&&checkBoxType=='checkbox'" type="selection" fixed="left" align="center" width="45" @click="rowClick" />

      <el-table-column v-if="showSeq" :label="$t('number')" type="index" fixed="left" width="50" align="center" :index="indexMethod" />

      <template v-for="(col, index) in columns">
        <el-table-column v-if="!col.hidden&&col.type!='seq'&&col.type!='radio'&&col.type!='checkbox'" :key="index" :show-overflow-tooltip="true" :label="columnLangTitle(col)" :prop="col.field" header-align="center" :sortable="col.sort ? 'custom' : false" :min-width="col.width" :fixed="col.fixed" :align="col.align">
          <template slot-scope="scope">
            <div v-if="col.formatter != undefined" v-html="filterFormatter(scope.row, col, scope.row[col.field], index) " />
            <!--render 方式-->
            <div v-else-if="col.slots != undefined">
              {{ renderToHtml(col, scope.row, index) }}
              <slot :name="col.field" />
            </div>
            <div v-else v-html="scope.row[col.field]" />
          </template>

        </el-table-column>
      </template>

    </el-table>
</template>
<script>
export default {
  props: {
      // showSummary: { type: Boolean, default: () => { return false; }},
      // 使用full-12的表达式，窗口高度减去指定高度,默认自适应
      height: { default: () => { return false; } },
      // 展开或收起
      expandSearch: {},
      // 展开时高度减去的偏移量,-1为此参数不配置
      expandSubheight: { type: Number, default: () => { return -1; } },
      // 是否加载loading
      loading: { type: Boolean, default: () => { return false; } },
      // 是否带有纵向边框
      border: { type: Boolean, default: () => { return true; } },
      rowKey: { type: String, default: 'Wiid' },
      // 是否为斑马纹 table
      stripe: { type: Boolean, default: () => { return false; } },
      // 主键字段名
      pk: { type: String },
      // 列表id
      grid: { type: String, required: true },
      // 分页配置及总数量 配置,pagination:false不分页
      pagerConfig: { type: Object },
      // 列定义
      columns: { type: Array, required: true },
      // 列表行数据
      data: { type: Array, required: true },
      // 工具格
      toolbar: { type: Object },
      // 表头右键菜单{header: {options: headerMenus},className: 'my-menus'}
      contextMenu: { type: Object, default: () => { return { header: { options: [] }, className: 'my-menus' }; } },
      fieldPowers: {
        type: Object, default: () => { return null; }
      }
      // getSummaries:{type: Array, required: true }
    },
  data() { 
    return {
      language: '',
        currRealName: '',
        currAccount: '',
        // 为了可以让表格重新渲染复选框控件
        tableKey: 'table',
        checkedAll: false,
        // 单选间距的行数据
        radioVal: '',
        // 序号及复选框
        showSeq: false,
        showCheckbox: false,
        checkBoxType: 'checkbox',

        menuVisible: false,
        tableHeight: 300,
        tablePage: {},
        ispager: false,
        // 主键所在操作列
        // primaryCol: {},
        tablePage_demo: {
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
        rows: [],
        multipleSelection: [],
        showSummary: false,
        showSummaryNameS: []
    }
  },
  computed: {
    
      columnLangTitle() {
        return function(item) {
          // console.log("是否要合计1：",item,this.showSummary)
          // 个表头是否要合计
          if (item.isAmountTo == 1) {
              // 如果有一个表头是要合计 那就显示合计行

              if (!this.showSummary) {
                //  console.log("是否要合计：",item)
                this.showSummary = true
              }
          }
          var enTitle = item.alias;
          if (enTitle == '' || enTitle == null) {
            enTitle = item.title;
          }
          var zhTitle = item.title;
          return this.language == 'en-US' ? enTitle : zhTitle;
        };
      },
       buttonIsHaveShowPower() {
        return function(buttonName) {
          var that = this;
          if (that.fieldPowers != null && that.fieldPowers.hasOwnProperty(buttonName)) {
            return that.fieldPowers[buttonName].isShow;
          }
          return true;
        };
      }
  },
  methods: {
    getSummaries(param) {
        const that = this;
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index == 5) { // 第5个不要是悬浮 并且非合计字段
            sums[index] = '总计:';
            return;
          }
           const _isAmountTo = that.showSummaryNameS.includes(column.label);
            if (_isAmountTo) {
              const values = data.map(item => Number(item[column.property]));
              if (!values.every(value => isNaN(value))) {
                sums[index] = values.reduce((prev, curr) => {
                  const value = Number(curr);
                  if (!isNaN(value)) {
                    return prev + curr;
                  } else {
                    return prev;
                  }
                }, 0);
                // sums[index] += ' 元';
                sums[index] = Object.numberFixed(sums[index], 2)
              } else {
                sums[index] = '--';
              }
          } else {
            sums[index] = '';
            return;
          }
        });
        return sums;
      },
    // 格式化
      filterFormatter: function(row, col, value, index) {
        var that = this;
        var fun = col.formatter;
        var result = fun(row, col, value, index, that);
        return result;
    },
      // 执行slots渲染 JSX 渲染函数
      renderToHtml(col, row, index) {
        if (typeof col.slots) {
          this.$slots[col.field] = [
            col.slots.default({ row: row, column: col, index: index }, this.$createElement)
          ];
          return;
        }
        return;
    },
      selectionChange(selection, row) {
        var isChecked = false;
        selection.forEach(function(item, index) {
          item._checked = true;
          if (row._selectedkey == item._selectedkey) {
            isChecked = true;
          }
        });
        row._checked = isChecked;
        var obj = { row: row, checked: isChecked };
        this.$emit('checkbox-change', obj, selection);
      },
  }
}
</script>
<style lang="scss" scoped>
  .el-table__body tr.hover-row>td {
    background-color: #FAFCFF !important;
  }

  .el-table__body tr.current-row>td {
    background-color: #f4f9fe;
  }

  ::v-deep .el-table__footer-wrapper {
    position: relative;
    z-index: 111;
    table{
      tr{
        td{
          div.cell{
            font-size: 12px; font-weight: bold;
          color: #666;
        }
        }
      }
    }
 }
 ::v-deep .el-table__fixed-footer-wrapper .el-table__footer{ display: none;}

 ::v-deep  .el-table_fixed,  ::v-deep .el-table__fixed-right {
height:100% !important;
}
::v-deep .el-table__fixed-body-wrapper {height:100 !important;}
::v-deep .el-table__fixed-body-wrapper .el-table__body {
padding-bottom: 60px; // 滚动条高度
}
</style>