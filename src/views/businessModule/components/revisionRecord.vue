<template>
  <div class="revisionRecord">
    <el-button v-show="currentIndex==1" icon="el-icon-back" type="text" size="small" style="margin-bottom: 10px;" @click="goBeforeTable">返回</el-button>
    <el-table v-show="currentIndex==0" :data="tableData" style="width: 100%" class="f2bpmui-datagrid-vuetable" size="small">
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="code" label="修订编号"></el-table-column>
      <el-table-column prop="createUserName" label="修订人"></el-table-column>
      <el-table-column prop="createTime" label="修订时间"></el-table-column>
      <!-- v-if="Object.toQueryString('encode') === 'marketContractorExtend'"  去掉了这个判断 -->
      <el-table-column prop="procInstState" label="流程状态" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px" v-html="Object.getWorkflowStatus(scope.row.procInstState)"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="queryReviseMainInfo(scope.row.id)">详情</el-button>
          <el-button type="text" size="small" @click="approveReviseMainInfo(scope.row)" v-if="scope.row.procInstState == 2">审批</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table v-show="currentIndex==1" :data="tableData1" style="width: 100%" class="f2bpmui-datagrid-vuetable" size="small">
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
  name: 'RevisionRecord',
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
    this.getReviseMainList()
  },
  methods: {
    goBeforeTable() {
      this.currentIndex = 0;
      this.pageInfo.currentIndex = 1;
      this.getReviseMainList()
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
    async queryReviseMainInfo(rowId) {
      this.currentIndex = 1;
      const res = await getReviseMainInfo(rowId)
      if (res.code === 200) {
        this.tableData1 = res.data;
      }
    },
    /**
     * 审批操作
     * */
    // approveReviseMainInfo(rows){
    //   var appId = 'EN';
    //   var reviseCode = 'marketContractorExtend_revise';
    //   let code = Object.toQueryString('code');
    //   let encode = Object.toQueryString('encode');
    //   let modelName = Object.toQueryString('modelName');
    //   var queryData = {
    //     formId: rows.formId,
    //     rowId: rows.businessKey,
    //     businessKey: rows.id,
    //     encode: encode,
    //     modelName: modelName,
    //     code: code,
    //     formAction: 3,
    //     appId:appId,
    //     wiid: rows.wiid,
    //     isRevise: true,
    //     reviseCode: reviseCode,
    //     isApproved: true
    //   };
    //   this.$router.push({path: '/workflowForm', query:queryData});
    // }
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
        isApproved: true,
        title:'预选承包商入库修订-表单'
      };
      this.$router.push({path: '/workflowForm', query:queryData});
    }
  }
};
</script>

<style lang="scss" scoped>
.revisionRecord {}
</style>
