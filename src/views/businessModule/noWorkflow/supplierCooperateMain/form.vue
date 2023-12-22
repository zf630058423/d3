<template>
  <div class="f3bpm-page-dialog-layout custBg">
    <div class="no-workflow-cont mt10">
      <!--保存按钮-->
      <div>
        <el-button type="primary" size="small" @click="toPath('contractDeliverBillMain')">去送货</el-button>
        <el-button type="primary" size="small" @click="toPath()">去对账</el-button>
      </div>
      <breadcrumb-nav type="fullDevelopment" @close="reBack"></breadcrumb-nav>
    </div>
    <!--表单内容-->
    <el-scrollbar class="container-scroll-bar workflow-form-content-height">
      <div id="WorkflowContentDiv" class="workflow-form-detail-container">
        <!--表单信息-->
        <div class="wf-box-section-title cur mt10">
          <div v-loading="loading">
            <el-form
              ref="dataForm"
              :model="dataForm"
              :rules="dataRule"
              label-width="200px"
              class="new-data-form-css"
            >
              <row-layout :title="'基础信息'" :cols="3">
                <el-form-item slot="col_1" label="单据编号：">
                  <el-input v-model="dataForm.code" disabled size="small" placeholder="自动填写" />
                </el-form-item>
                <el-form-item slot="col_2" label="项目编号：">
                  <el-input v-model="dataForm.constructArchiveMainCode" disabled size="small" placeholder="自动填写" />
                </el-form-item>
                <el-form-item slot="col_3" label="项目名称：">
                  <el-input v-model="dataForm.constructArchiveMainName" disabled size="small" placeholder="自动填写" />
                </el-form-item>
              </row-layout>
              <row-layout :cols="3">
                <el-form-item slot="col_1" label="管理部门：">
                  <el-input v-model="dataForm.constructionUnitName" disabled size="small" placeholder="自动填写" />
                </el-form-item>
                <el-form-item slot="col_2" label="项目负责人：">
                  <el-input v-model="dataForm.projectManagerName" disabled size="small" placeholder="自动填写" />
                </el-form-item>
              </row-layout>
              <row-layout :title="'合同信息'" :cols="3">
                <el-form-item slot="col_1" label="主合同编号：">
                  <el-input v-model="dataForm.contractOutMainCode" disabled size="small" placeholder="自动填写" />
                </el-form-item>
                <el-form-item slot="col_2" label="主合同名称：">
                  <el-input v-model="dataForm.contractOutMainName" disabled size="small" placeholder="自动填写" />
                </el-form-item>
                <el-form-item slot="col_3" label="乙方：">
                  <el-input v-model="dataForm.contractPartyBName" disabled size="small" placeholder="自动填写" />
                </el-form-item>
              </row-layout>
              <row-layout :cols="3">
                <el-form-item slot="col_1" label="甲方：">
                  <el-input v-model="dataForm.contractPartyAName" disabled size="small" placeholder="自动填写" />
                </el-form-item>
                <el-form-item slot="col_2" label="合同总金额(含税)(元)：">
                  <el-input v-model="dataForm.currentContractAmount" disabled size="small" placeholder="自动填写" />
                </el-form-item>
                <el-form-item slot="col_3" label="合同金额(含税)(元)：">
                  <el-input v-model="dataForm.contractAmount" disabled size="small" placeholder="自动填写" />
                </el-form-item>
              </row-layout>
              <row-layout :cols="3">
                <el-form-item slot="col_1" label="增补合同金额(含税)(元)：">
                  <el-input v-model="dataForm.supplementContractAmount" disabled size="small" placeholder="自动填写" />
                </el-form-item>
              </row-layout>
              <form-title :title="'物料信息'"></form-title>
              <el-table :data="dataForm.supplierCooperateDetail" class="f2bpmui-datagrid-vuetable" border>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="brand" label="品牌"></el-table-column>
                <el-table-column prop="specification" label="规格/型号"></el-table-column>
                <el-table-column prop="unit" label="单位"></el-table-column>
                <el-table-column prop="quantity" label="合同数量"></el-table-column>
                <el-table-column prop="quantityDelivered" label="已送货数量"></el-table-column>
                <el-table-column prop="unitPriceTax" label="合同单价(含税)"></el-table-column>
                <el-table-column prop="taxRate" label="税率(%)"></el-table-column>
                <el-table-column prop="unitPriceTaxFree" label="合同单价(无税)"></el-table-column>
              </el-table>
              <row-layout :cols="3">
                <el-form-item slot="col_1" label="编制人：">
                  <span>{{ dataForm.createUserName }}</span>
                </el-form-item>
                <el-form-item slot="col_2" label="编制人部门：">
                  <span>{{ dataForm.deptName }}</span>
                </el-form-item>
                <el-form-item slot="col_3" label="编制时间：">
                  <span>{{ dataForm.createTime }}</span>
                </el-form-item>
              </row-layout>
            </el-form>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
  
</template>

<script>
import FormTitle from '@/components/basic/formTitle/index.vue';
import { getSupplierCooperateMainById } from '@/Api/supplier/index';
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import breadcrumbNav from '@/views/businessModule/components/breadcrumbNav.vue';
import tools from '@/utils/fun.js';
export default {
  components: { FormTitle, RowLayout, breadcrumbNav },
  data() {
    return {
      loading: false,
      formVisible: false,
      dialogVisible: false,
      dataForm: {
        code: "",
        contractAmount: "",
        supplementContractAmount: "",
      },
      dataRule: {},
    };
  },
  computed: {
    totalContractAmount() {
      return tools.getNumAdd(this.dataForm.contractAmount,this.dataForm.supplementContractAmount)
    },
  },
  mounted() {
    const { rowId } = this.$route.query;
    this.dataForm.id = rowId;
    this.getSupplierCooperateMainById(); 
  },
  methods: {
    toPath(type) {
      if(type == 'contractDeliverBillMain') { // 送货单
        this.$router.push('/workflowForm?appId=DF&encode=contractDeliverBillMain&formAction=0&code=custGrid_BusinessSearch_SongHuoDan&modelName=contract&supplierId='+this.dataForm.id);
      } else { // 对账单
        this.$router.push('/workflowForm?appId=DG&encode=contractReconcileBillMain&formAction=0&code=custGrid_BusinessSearch_DuiZhangDan&modelName=contract&supplierId='+this.dataForm.id);
      }
    },
    reBack() {
      this.$router.push('/supplierCooperate/supplierCooperateList');
    },
    async getSupplierCooperateMainById() {
      this.loading = true;
      const res = await getSupplierCooperateMainById(this.dataForm.id)
      if(res.code == 200){
        this.dataForm = res.data;
      }
      this.loading = false;
    },
    async saveForm() {
    },
  }
};
</script>

<style scoped lang="scss">
@import "~@/resources/css/workflowform.css";
  @import "/static/f2bpmUI/onlineForm/onlinedisginer.css";

  $WhiteBg: #fff;

  .custBg{
    background: #F7FAFC;

    .no-workflow-cont{
      background: $WhiteBg;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      line-height: 40px;
      padding: 0 16px;
    }

    .cust-content{
      border: 1px solid;
      margin: 16px;
    }
  }
  .pageTitle {
    text-align: center;
    font-size: 26px;
    color: rgb(0, 140, 255);
    height: 48px;
    background: #FFFFFF;
    margin-bottom: 10px;
    line-height: 48px;
    margin-top: 10px;
  }

  .wf-box-section-title{
    padding: 10px;
  }

  .workflow-form-detail-container{
    margin: 0 auto;
  }

  ::v-deep .el-form-item__label{
    font-size: 14px;
    font-weight: 500;
  }

  ::v-deep .el-input-group{
    vertical-align: middle;
  }

  ::v-deep .el-input__inner{
    height: 32px;
    line-height: 32px;
  }
</style>
