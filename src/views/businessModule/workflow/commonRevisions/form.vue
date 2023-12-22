<template>
  <!--修订详情页（审批流程）-->
  <div class="revisionRecord">
    <el-table :data="tableData1" style="width: 100%" class="f2bpmui-datagrid-vuetable" size="small">
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="revisionField" label="修订字段"></el-table-column>
      <el-table-column prop="preRevisionContent" label="修订前内容"></el-table-column>
      <el-table-column prop="revisedContent" label="修订后内容"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
    </el-table>
    <div style="text-align: center;padding-top: 20px;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        small
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getReviseMainList, getReviseMainInfo } from '@/Api/workflowBusssion/reviseMain.js'
  export default {
    name: 'commonRevisions',
    data() {
      return {
        tableData: [],
        tableData1: [],
        pageInfo: {
          currentPage: 1,
          pageSize: 10
        },
        total: 0,
        currentIndex: 0
      };
    },
    created() {
      this.queryReviseMainInfo()
    },
    methods: {
      goBeforeTable() {
        this.currentIndex = 0;
        this.pageInfo.currentIndex = 1;
        this.queryReviseMainInfo()
      },
      /**
       * 列表
       */
      async getReviseMainList() {
        const { rowId, encode } = this.$route.query;
        const key = encode.replace(encode[0], encode[0].toUpperCase())
        const res = await getReviseMainList({ params: { ...this.pageInfo, businessKey: rowId, tableName: key }})
        if (res.code === 200) {
          this.tableData = res.data.list;
          this.total = res.data.pagination.total;
        }
      },
      /**
       * 详情列表
       */
      async queryReviseMainInfo() {
        const { rowId,businessKey } = this.$route.query;
        var id = businessKey || rowId
        const res = await getReviseMainInfo(id);
        if (res.code === 200) {
          this.tableData1 = res.data;
        }
      },
      /**
       * 审批操作
       * */
      approveReviseMainInfo(rows){
        var appId = 'EN';
        var reviseCode = 'commonRevisions';
        let code = 'custGrid_BusinessSearch_YuXuanChengBaoShangRuKuXiuDing';
        let encode = 'commonRevisions';
        let modelName = 'market';
        var queryData = {
          formId: rows.formId,
          rowId: rows.businessKey,
          businessKey: rows.id,
          encode: encode,
          modelName: modelName,
          code: code,
          formAction: 3,
          appId:appId,
          wiid: rows.wiid,
          isRevise: true,
          reviseCode: reviseCode,
          isApproved: true
        };
        this.$router.push({path: '/workflowForm', query:queryData});
      }
    }
  };
</script>

<style lang="scss" scoped>
  .revisionRecord {}
</style>
