<template>
  <!-- 营销投标台账明细表 -->
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div class="search-box">
          <detail-form ref="marketFormRef" @search="searchFn"></detail-form>
        </div>
        <div class="search-btns">
          <el-button type="primary" icon="el-icon-edit-outline" size="small" class="fa" @click="exportExcel">导出</el-button>
        </div>
        <f2bpm-datagrid 
          v-loading="loading"
          ref="grid"
          grid="grid"
          :pager-config="tablePage"
          :data="tableData"
          :columns="tableColumn"
           @page-change="pageChange"/>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { detailColumn } from './detailColumn';
import DetailForm from './components/detailForm.vue';
import { getListDetail, exportDetailData } from '@/Api/marketBid.js';

export default {
  components: { DetailForm },
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
        pageSize: 20,
        isPaging: 1,
      },
      formData: {},
      loading: false,
      dataShowJson: {}
    }
  },
  created() { 
    this.tableColumn = detailColumn;
    this.getDataList();
  },
  methods: {
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
          let { data } = await getListDetail(dataParams);
          this.loading = false;
          this.tableData = data.marketDetailStatisticVOList;
          this.tablePage.currentPage = data.currentPage;
          this.tablePage.total = data.total;
          this.tablePage.pageCount = data.pageTotal;
          this.dataShowJson = data.dataShowJson ? JSON.parse(data.dataShowJson) : "";
          this.filterColumns(this.dataShowJson);
        } catch (error) {
          this.loading = false;
        }
    },
    pageChange(e) {
      this.pageData.currentPage = e.currentPage;
      this.pageData.pageSize = e.pageSize;
      this.getDataList();
    },
    async exportExcel() { 
     let param = this.$refs.marketFormRef.paramsData() || {};
     await exportDetailData(param);
    },
    filterColumns(dataShowJson) { 
      let dataShowArray = [];
          if (dataShowJson) { 
            for (let i in dataShowJson) { 
              if (dataShowJson[i]) { 
                dataShowArray.push(i);
              }
              this.tableColumn = detailColumn.filter(item => dataShowArray.includes(item.field));
            }
          }
    }
  }
}
</script>
<style scoped lang="scss">
.f2bpm-page-layout{
  // .search-box{
  //   padding:10px 10px 0;margin: 0 20px
  // }
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

::v-deep .default-label .el-form-item__label{
  text-align: right;
  text-justify: distribute-all-lines;
}
</style>