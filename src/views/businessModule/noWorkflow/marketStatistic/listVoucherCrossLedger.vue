<template>
  <!-- 跨区涉税台账 -->
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div class="search-box" ref="voucherForm">
          <voucherForm @search="searchFn" ref="searchFormRef"></voucherForm>
        </div>
        <div class="search-btns">
          <el-button type="primary" icon="el-icon-edit-outline" size="small" class="fa"
            @click="exportExcel">导出</el-button>
        </div>
        <!--  -->
        <el-table v-loading="loading" ref="gridTable" :border="true" stripe row-key="id" :data="tableData"
          :columns="tableColumn" :height="gridHeight" show-summary style="width: 100%">
          <template v-for="column in tableColumn">
            <el-table-column :prop="column.field" :label="column.title" :width="column.width" :minWidth="column.minWidth"
              :key="column.field" :showOverflowTooltip="column.showOverflowTooltip" :align="column.align"
              :type="column.type" :sortable="column.sortable"></el-table-column>
          </template>
        </el-table>
        <el-pagination background align="center" :layout="tablePage.layout" :total="tablePage.total"
          :current-page="tablePage.currentPage" :page-size="tablePage.pageSize" @size-change="pageSizeChange"
          @current-change="pageChange"></el-pagination>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import voucherForm from './components/voucherForm.vue';
import { getDetailStatistic, exportLedgerData } from '@/Api/voucher.js';
import { getDataDictByConfigType } from '@/Api/dataDict.js'
export default {
  components: { voucherForm },
  data () {
    return {
      tablePage: {
        align: "center",
        currentPage: 1,
        layout: "total, sizes, prev, pager, next, jumper",
        order: "",
        pageCount: 10,
        total: 50,
        pageSize: 20,
        pageSizes: [10, 15, 20, 25, 50, 100, 200, 500]
      },
      // 列表数据源
      tableData: [],
      tableColumn: [
        {
          type: "selection",
          field: "selection",
          align: "center",
          width: 55,
        },
        {
          type: "index",
          field: "index",
          title: "序号",
          align: "center",
          width: 55,
        },
        {
          field: "crossReportState",
          title: "税跨报状态",
          align: "center",
          minWidth: 130,
          showOverflowTooltip: true,
        },
        {
          field: "taxAcross",
          title: "税跨报告",
          align: "center",
          minWidth: 130,
          showOverflowTooltip: true,
        },
        {
          field: "incomeDetailedDeclaration",
          title: "个税是否需要申报",
          align: "center",
          minWidth: 130,
          showOverflowTooltip: true,
        },
        {
          field: "constructCode",
          title: "项目编号",
          align: "center",
          minWidth: 130,
          showOverflowTooltip: true,
        },
        {
          field: "constructName",
          title: "项目名称",
          align: "center",
          minWidth: 130,
          showOverflowTooltip: true,
        },
        {
          field: "projectAddress",
          title: "项目地址",
          align: "center",
          minWidth: 130,
          showOverflowTooltip: true,
        },
        {
          field: "constructionAmountTotalTax",
          title: "施工总金额(含税)",
          align: "center",
          minWidth: 130,
          showOverflowTooltip: true,
          sortable: true,
        },
        {
          field: "constructionAmount",
          title: "本次开证金额(元)",
          align: "center",
          minWidth: 130,
          showOverflowTooltip: true,
          sortable: true,
        },
        {
          field: "createUserName",
          title: "开具申请人",
          align: "center",
          minWidth: 130,
          showOverflowTooltip: true,
        },
        {
          field: "createTime",
          title: "申请日期",
          align: "center",
          minWidth: 130,
          showOverflowTooltip: true,
        },
        {
          field: "handleDate",
          title: "办理日期",
          align: "center",
          minWidth: 130,
          showOverflowTooltip: true,
        },
        {
          field: "releaseDate",
          title: "发证日期",
          align: "center",
          minWidth: 130,
          showOverflowTooltip: true,
        },
        {
          field: "effectiveStartDate",
          title: "有效开始日期",
          align: "center",
          minWidth: 130,
          showOverflowTooltip: true,
        },
        {
          field: "latestExpiryDate",
          title: "最新有效截至日期",
          align: "center",
          minWidth: 130,
          showOverflowTooltip: true,
        },
        {
          field: "inspectionDate",
          title: "报验日期",
          align: "center",
          minWidth: 130,
          showOverflowTooltip: true,
        },
        {
          field: "feedbackDate",
          title: "反馈日期",
          align: "center",
          minWidth: 130,
          showOverflowTooltip: true,
        },
        {
          field: "cancelDate",
          title: "作废日期",
          align: "center",
          minWidth: 130,
          showOverflowTooltip: true,
        },
        {
          field: "taxUnitName",
          title: "纳税单位",
          align: "center",
          minWidth: 130,
          showOverflowTooltip: true,
        },
      ], // 表头字段配置
      pageData: {
        currentPage: 1,
        pageSize: 20,
        isPaging: 1,
      },
      formData: {},
      loading: false,
      crossReportStateOptions: [],
      marketCenterArray: [],  //业务中心合并单元格数组
      marketUnitArray: [],  //业务单元合并单元格数组
      gridHeight: 750,
      mergeObj: {},
      mergeArr: ['marketUnit', 'marketCenter'],
    }
  },
  mounted () {
    // window.myvm指向当前页面vue实例
    window.myvm = this;
    // 自适应计算高度
    this.autoPageHeight();
  },
  created () {
    this.getDataDictByConfigType()
    this.getDataList();
  },
  methods: {
    autoPageHeight () {
      const cHeight = document.body.clientHeight;
      const voucherFormHeight = this.$refs.voucherForm.clientHeight;
      this.gridHeight = (cHeight - voucherFormHeight) + 'px';
    },
    async searchFn (obj) {
      this.pageData.currentPage = 1;
      this.pageData.pageSize = 20;
      this.formData = obj;
      this.getDataList();
    },
    async getDataList () {
      let dataParams = {
        ...this.pageData,
        ...this.formData
      }
      try {
        this.loading = true;
        let { data } = await getDetailStatistic(dataParams);
        let { pagination, list } = data
        this.loading = false;
        console.log(list)
        this.tableData = list.map(item=>{
          item['crossReportState'] = item['crossReportState']?this.crossReportStateOptions[this.crossReportStateOptions.findIndex(it=>it.configValue == item.crossReportState)].configName:''
          item['incomeDetailedDeclaration'] = item['incomeDetailedDeclaration']==='1'?'是':item['incomeDetailedDeclaration']==='0'?'否':''
          return item
        });
        this.tablePage.currentPage = pagination.currentPage;
        this.tablePage.total = pagination.total;
        this.autoPageHeight();
      } catch (error) {
        this.loading = false;
      }
    },
    async exportExcel () {
      let param = this.$refs.searchFormRef.paramsData() || {};
      await exportLedgerData(param);
    },
    pageSizeChange (pageSize) {
      this.pageData.pageSize = pageSize;
      this.getDataList();
    },
    pageChange (page) {
      this.pageData.currentPage = page;
      this.getDataList();
    },
    /**
    * 初始化字典
    */
    async getDataDictByConfigType() {
      const optionType = {
        '税跨报状态': 'crossReportState',
      }
      const res = await getDataDictByConfigType({ params: { configTypes: '税跨报状态' } })
      if (res.success) {
        res.data.forEach(ele => {
          if (optionType[ele.dataDictType]) {
            this[optionType[ele.dataDictType] + 'Options'] = ele.dataDict;
          }
        });

      }
    },
  }
}
</script>
<style scoped lang="scss">
.f2bpm-page-layout {
  .search-btns {
    padding: 0 16px;
    margin-bottom: 8px;
  }
}
</style>