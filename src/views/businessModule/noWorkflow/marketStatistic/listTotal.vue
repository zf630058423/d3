<template>
  <!-- 营销投标台账总表 -->
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div class="search-box" ref="marketForm">
          <MarketForm @search="searchFn" ref="marketFormRef"></MarketForm>
        </div>
        <div class="search-btns">
          <el-button type="primary" icon="el-icon-edit-outline" size="small" class="fa" @click="exportExcel">导出</el-button>
        </div>
        <!--  -->
        <el-table
          class="total-table"
          v-loading="loading"
          ref="gridTable"
          :border="true"
          stripe
          row-key="id"
          :data="tableData"	
          :height="gridHeight"
          :span-method="objectSpanMethod"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          style="width: 100%">
          <el-table-column
            prop="marketCenter"
            label="区域"
            header-align="center"
            width="200">
            <template slot-scope="{row}">
              <el-tooltip :content="row.marketCenter" placement="bottom">
                <span>{{ row.marketCenter }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="marketUnit" label="业务单元" width="200">
            <template slot-scope="{row}">
              <el-tooltip :content="row.marketUnit" placement="bottom">
                <span>{{ row.marketUnit }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="follower" label="跟进人"></el-table-column>
          <el-table-column label="营销立项" header-align="center">
            <el-table-column prop="marketCount" label="营销立项数" width="120"></el-table-column>
            <el-table-column prop="marketCost" label="工程造价(万元)" width="130"></el-table-column>
            <el-table-column prop="marketCountYear" label="本年累计营销立项数" width="150"></el-table-column>
            <el-table-column prop="marketCostYear" label="本年累计工程造价(万元)" width="180"></el-table-column>
            <el-table-column prop="marketCountGovOpen" label="政府公开"></el-table-column>
            <el-table-column prop="marketCountOtherOpen" label="其他公开"></el-table-column>
            <el-table-column prop="marketCountNoOpen" label="非公开"></el-table-column>
          </el-table-column>
          <el-table-column label="投标" header-align="center">
            <el-table-column prop="bidCount" label="投标数量"></el-table-column>
            <el-table-column prop="bidAmount" label="投标金额(万元)" width="120"></el-table-column>
            <el-table-column prop="bidAmountSingle" label="当期单体投标量(万元)" width="170"></el-table-column>
            <el-table-column prop="marketCostYear" label="本年累计工程造价(万元)" width="180"></el-table-column>
            <el-table-column prop="bidCountYear" label="本年投标数量" width="120"></el-table-column>
            <el-table-column prop="bidAmountYear" label="本年投标金额(万元)" width="170"></el-table-column>
            <el-table-column prop="bidAmountYearSingle" label="本年单体投标量(万元)" width="170"></el-table-column>
            <el-table-column prop="bidCountGovOpen" label="政府公开(投标)" width="120"></el-table-column>
            <el-table-column prop="bidCountOtherOpen" label="其他公开(投标)" width="120"></el-table-column>
            <el-table-column prop="bidCountNoOpen" label="非公开(投标)" width="120"></el-table-column>
          </el-table-column>
          <el-table-column label="中标" header-align="center">
            <el-table-column prop="bidResultCount" label="中标数量"></el-table-column>
            <el-table-column prop="bidResultAount" label="中标金额(万元)" width="120"></el-table-column>
            <el-table-column prop="bidResultCountSingle" label="当期单体中标量(万元)" width="170"></el-table-column>
            <el-table-column prop="bidResultAountYear" label="本年中标金额" width="120"></el-table-column>
            <el-table-column prop="bidResultAountYearSingle" label="本年单体中标量(万元)" width="170"></el-table-column>
            <el-table-column prop="bidResultCountGovOpen" label="政府公开(中标)" width="120"></el-table-column>
            <el-table-column prop="bidResultCountOtherOpen" label="其他公开(中标)" width="120"></el-table-column>
            <el-table-column prop="bidResultCountNoOpen" label="非公开(中标)" width="120"></el-table-column>
          </el-table-column>
          <el-table-column label="转化率" header-align="center">
            <el-table-column prop="bidCountConvertYear" label="投标转化率(数量)" width="140"></el-table-column>
            <el-table-column prop="bidAmountConvertYear" label="投标转化率(金额)" width="140"></el-table-column>
            <el-table-column prop="bidResultCountConvertYear" label="中标转化率(数量)" width="130"></el-table-column>
            <el-table-column prop="bidResultAmountConvertYear" label="中标转化率(金额)" width="130"></el-table-column>
          </el-table-column>
          <el-table-column label="已立项未投" header-align="center">
            <el-table-column prop="marketCountOne" label="已立项未投标数量" width="160"></el-table-column>
            <el-table-column prop="marketAmountOne" label="已立项未投标预估金额(万元)" width="200"></el-table-column>
          </el-table-column>
          <el-table-column label="在投数量" prop="marketCountTwo"></el-table-column>
          <el-table-column label="预估投标金额(万元)" prop="marketAmountTwo" width="160"></el-table-column>
          <el-table-column label="已投待定数量" prop="marketCountThree" width="120"></el-table-column>
          <el-table-column label="已投待定金额(万元)" prop="marketAmountThree" width="160"></el-table-column>
          <el-table-column label="放弃跟进数" prop="marketCountFour" width="110"></el-table-column>
          <el-table-column label="放弃跟进金额(万元)" prop="marketAmountFour" width="160"></el-table-column>
          <el-table-column label="项目立项个数" prop="constructCount" width="120"></el-table-column>
          <el-table-column label="合同" header-align="center">
            <el-table-column label="已签合同个数" prop="contractCount" width="110"></el-table-column>
            <el-table-column label="已签合同金额" prop="contractAmount" width="113"></el-table-column>
          </el-table-column>
        </el-table>
        <!-- <el-pagination background align="center" :layout="tablePage.layout" :total="tablePage.total" :current-page="tablePage.currentPage" :page-size="tablePage.pageSize"></el-pagination> -->
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { totalColumn } from './totalColumn';
import MarketForm from './components/totalForm.vue';
import { getListTotal, exportTotalData } from '@/Api/marketBid.js';

export default {
  components: { MarketForm },
  data() { 
    return {
      tablePage: {
        align: "center",
        currentPage: 1,
        layout: "total, sizes, prev, pager, next, jumper",
        order: "",
        pageCount: 10,
        total:50,
        pageSize: 20,
        pageSizes:[10,15,20,25,50,100,200,500]
      },
      // 列表数据源
      tableData: [],
      tableColumn: [], // 表头字段配置
      pageData: {
        currentPage: 1,
        pageSize: 1,
        isPaging: 1,
      },
      formData: {},
      loading: false,
      marketCenterArray: [],  //业务中心合并单元格数组
      marketUnitArray: [],  //业务单元合并单元格数组
      gridHeight: 700,
      mergeObj: {},
      mergeArr: ['marketUnit', 'marketCenter'],
    }
  },
  mounted() { 
    // window.myvm指向当前页面vue实例
    window.myvm = this;
    // 自适应计算高度
    this.autoPageHeight();
  },
  created() { 
    this.tableColumn = totalColumn;
    this.getDataList();
  },
  methods: {
    autoPageHeight() { 
      const cHeight = document.body.clientHeight;
      const marketFormHeight = this.$refs.marketForm.clientHeight;
      this.gridHeight = (cHeight - marketFormHeight) + 'px';
    },
    toggleRowExpansion(row) {
      row.isExpand = row.isExpand ? false : true;
      const item = this.tableData.find(i => {
        return i.marketCenter === row.marketCenter;
      })
      if (this.$refs.gridTable) {
        this.$refs.gridTable.toggleRowExpansion(item, row.isExpand)
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 判断列的属性
      if (this.mergeArr.indexOf(column.property) !== -1) {
        // 判断其值是不是为0 
        if (this.mergeObj[column.property][rowIndex]) {
          console.log("合并单元格===:",[this.mergeObj[column.property][rowIndex], 1]);
          return [this.mergeObj[column.property][rowIndex], 1]
        } else {
          // 如果为0则为需要合并的行
          return [0, 0];
        }
      }
    },
     // getSpanArr方法
    getSpanArr(data) {
        this.mergeArr.forEach((key, index1) => {
            let count = 0; // 用来记录需要合并行的起始位置
            this.mergeObj[key] = []; // 记录每一列的合并信息
            data.forEach((item, index) => {
                // index == 0表示数据为第一行，直接 push 一个 1
                if(index === 0) {
                    this.mergeObj[key].push(1); 
                } else {
                    // 判断当前行是否与上一行其值相等 如果相等 在 count 记录的位置其值 +1 表示当前行需要合并 并push 一个 0 作为占位
                    if(item[key] === data[index - 1][key]) { 
                        this.mergeObj[key][count] += 1;
                        this.mergeObj[key].push(0);
                    } else {
                        // 如果当前行和上一行其值不相等 
                        count = index; // 记录当前位置 
                        this.mergeObj[key].push(1); // 重新push 一个 1
                    }
                }
            })
        })
    },
    async searchFn(obj) {
      this.pageData.currentPage = 1;
      this.pageData.pageSize = 20;
      this.formData = obj;
      this.getDataList();
    },
    async getDataList() { 
      let dataParams = {
        ...this.pageData,
        ...this.formData
      }
        try {
          this.loading = true;
          let { data } = await getListTotal(dataParams);
          this.loading = false;
          this.tableData = data.marketTotalStatisticVOList;
          this.tablePage.currentPage = data.currentPage;
          this.tablePage.total = data.total;
          this.tablePage.pageCount = data.pageTotal;
          this.dataShowJson = data.dataShowJson ? JSON.parse(data.dataShowJson) : "";
          // this.filterColumns(this.dataShowJson);
          this.getSpanArr(this.tableData);
          // this.getSpanArr(this.tableData);
          // this.getSpanArr2(this.tableData);
          this.autoPageHeight();
        } catch (error) {
          this.loading = false;
        }
    },
    filterColumns(dataShowJson) { 
      let dataShowArray = [];
          if (dataShowJson) { 
            for (let i in dataShowJson) { 
              if (dataShowJson[i]) { 
                dataShowArray.push(i);
              }
              this.tableColumn = totalColumn.filter(item => dataShowArray.includes(item.field));
            }
          }
    },
    async exportExcel() { 
      let param = this.$refs.marketFormRef.paramsData() || {};
      await exportTotalData(param);
    },
    pageChange(e) {
      this.pageData.currentPage = e.currentPage;
      this.pageData.pageSize = e.pageSize;
      this.getDataList();
     },
  }
}
</script>
<style scoped lang="scss">
.f2bpm-page-layout{

  .search-btns{
    padding: 0 16px;
    margin-bottom: 8px;
  }
}

::v-deep .el-form-item{
  margin-bottom:2px;
}

::v-deep .fold-label .el-form-item__label {
      white-space: pre-wrap;
      text-align: right;
      margin-top: 4px;
      line-height: 16px !important;/*设置行高为label高度的一半（有n行就是label高度的1/n）*/
      text-justify: distribute-all-lines;
  }

  ::v-deep .el-table--border .el-table__cell, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
    border-right: 1px solid #EBEEF5;
  }

::v-deep .default-label .el-form-item__label{
  text-align: right;
  text-justify: distribute-all-lines;
}

.total-table{
  margin-bottom: 16px;
}
</style>