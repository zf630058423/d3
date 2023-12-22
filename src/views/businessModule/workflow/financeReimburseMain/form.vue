<template>
  <!-- 项目费用报销表单 -->
  <!-- :disabled="setting.readonly" -->
  <div v-loading="loading" class="start-form">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="170px"
    >
      <row-layout title="报销信息" :cols="3">
        <el-form-item slot="col_1" prop="code" label="单据编号：">
          <el-input v-model="dataForm.code" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
        <el-form-item slot="col_2" prop="constructCode" label="项目编号：">
          <select-dialog :disabled="true" :isLinkBtn="true" :btnDisabled="disabledVal()" :width="900" :height="360" :modelData="projectModel" :value="dataForm.constructCode" @updateValue="projectUpdate" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="constructName" label="项目名称：">
          <el-input v-model="dataForm.constructName" size="small" placeholder="自动带出" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="managerDeptName" label="管理部门：">
          <el-input v-model="dataForm.managerDeptName" size="small" placeholder="自动带出" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" prop="paymentOrgName" label="付款财务组织：">
          <select-dialog :disabled="true" :btnDisabled="disabledVal()" :width="900" :height="360" :modelData="payOutOrgData" 
          :value="dataForm.paymentOrgName" @updateValue="fOrgUpdateValue" dynamic-model="selectOrg"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="paymentAccountNumber" label="付款账号：" :rules="[{required:isMust,trigger:'blur'}]">
          <select-dialog :model-data="baseBankDialog" :value="dataForm.paymentAccountNumber"
            dynamic-model="customDialog" @updateValue="updatePaymentAccountValue" :btnDisabled="disabledVal()"></select-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="收款方情况：" prop="payInSituation">
          <el-radio-group v-model="dataForm.payInSituation" :disabled="disabledVal()">
            <el-radio label="1">公司员工</el-radio>
            <el-radio label="2">非公司员工</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" prop="payInUserName" label="收款方：" v-if="dataForm.payInSituation==='1'">
          <select-dialog :disabled="true" :btnDisabled="disabledVal()" :width="900" :height="360" :modelData="dialogModel" @updateValue="followerUpdate" :value="dataForm.payInUserName || msgTip.SELECT_PLACEHOLDER" dynamicModel="selectUsers"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="payInUserName" label="收款方：" v-else>
          <el-input v-model="dataForm.payInUserName" size="small" placeholder="请输入" :disabled="disabledVal()"/>
        </el-form-item>
        <el-form-item slot="col_3" prop="payeeBankAcc" label="收款账号：" :rules="[{required:isMust,trigger:'blur'}]">
          <el-input v-model="dataForm.payeeBankAcc" size="small" placeholder="请输入" :disabled="disabledVal()"/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="payInBank" label="收款银行：" :rules="[{required:isMust,trigger:'blur'}]">
          <select-dialog :disabled="true" :btnDisabled="disabledVal()" :width="900" :height="360" :modelData="baseBank" 
          :value="dataForm.payInBank" @updateValue="updatePayInBank" dynamic-model="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="paySubBankNumberNo" label="收款银行联行号：">
          <el-input v-model="dataForm.paySubBankNumberNo" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
        </el-form-item>
        <el-form-item slot="col_3" prop="balaType" label="结算方式：">
          <el-select v-model="dataForm.balaType" placeholder="请选择" :disabled="disabledVal()" size="small" style="width:100%">
            <el-option v-for="(item,index) in balaTypeList" :key="index" :label="item.configName" :value="item.configValue"></el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="applyAmount" label="报销金额（元）：">
          <amount-input v-model="dataForm.applyAmount" defaultValue :placeholder="msgTip.SYSTEM_PLACEHOLDER" clearable disabled></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" prop="actuallyAmount" label="实付金额（元）：">
          <amount-input v-model="dataForm.actuallyAmount" defaultValue :placeholder="msgTip.SYSTEM_PLACEHOLDER" clearable disabled></amount-input>
        </el-form-item>
        <el-form-item slot="col_3" prop="loanAmount" label="冲借款总金额（元）：">
          <amount-input v-model="dataForm.loanAmount" defaultValue :placeholder="msgTip.SYSTEM_PLACEHOLDER" clearable disabled></amount-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="关联费用预提：" prop="relatedExpenses">
          <el-radio-group v-model="dataForm.relatedExpenses" :disabled="disabledVal()">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" label="是否收到发票原件：" prop="isOriginalInvoice">
          <el-radio-group v-model="dataForm.isOriginalInvoice" :disabled="disabledVal()">
            <el-radio label="2">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" prop="refundAmount" label="退款金额（元）：">
          <amount-input v-model="dataForm.refundAmount" defaultValue placeholder="系统反写" clearable disabled></amount-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="关联预缴完税凭证：" prop="relatedTaxPaymentVoucher">
          <el-radio-group v-model="dataForm.relatedTaxPaymentVoucher" @change="changeRelatedTax" :disabled="disabledVal()">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="memo" label="备注：">
          <el-input v-model="dataForm.memo" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" :disabled="disabledVal()" />
        </el-form-item>
      </row-layout>
      <div v-show="dataForm.relatedTaxPaymentVoucher==='1'" class="form-text">
        <form-title :title="'关联预缴完税凭证'">
        </form-title>
        <div class="export-text">
          <el-button type="primary" size="small" @click="addVoucherDetail" :disabled="disabledVal()">新增</el-button>
          <!-- <el-button type="primary" size="small" @click="delTableDetail(selectRows, dataForm.voucherDetailList)" :disabled="disabledVal()||dataForm.invoiceStatus==='3'">删除</el-button> -->
          <el-button type="primary" size="small" @click="delTableDetail(selectRows, dataForm.voucherDetailList)" :disabled="disabledVal()">删除</el-button>
          <el-button type="primary" size="small" @click="exportVoucherDetail" v-if="dataForm.id" :disabled="disabledVal()">导出</el-button>
        </div>
        <!-- <el-button type="primary" size="small" class="export-text" @click="exportContractInsure">导出</el-button> -->
      </div>
      <el-table :data="voucherTableData" v-show="dataForm.relatedTaxPaymentVoucher==='1'" class="f2bpmui-datagrid-vuetable" 
        border show-summary :summary-method="getSummaries" 
        @selection-change="handleSelectionChange" :disabled="disabledVal()"
      >
        <el-table-column type="selection" width="55" fixed="left"></el-table-column>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="单据编号" :render-header="addRedStar" width="200">
          <template slot-scope="scope">
            <select-dialog :isLinkBtn="true" :btnDisabled="disabledVal()" :model-data="voucherMode" :value="scope.row.code" dynamic-model="customDialog" @updateValue="updateVoucherCode($event,scope.$index)" class="specialStyle"></select-dialog>
          </template>
        </el-table-column>
        <el-table-column label="项目编号" prop="constructCode">
          <template slot-scope="scope">
            <el-input v-model="scope.row.constructCode" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="项目名称" prop="constructName">
          <template slot-scope="scope">
            <el-input v-model="scope.row.constructName" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="预缴所属期间" prop="prepaidPeriodTime">
          <template slot-scope="scope">
            <el-input v-model="scope.row.prepaidPeriodTime" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="缴纳税金合计" prop="payTaxesAmount">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.payTaxesAmount" defaultValue :placeholder="msgTip.AUTO_PLACEHOLDER" disabled></amount-input>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="delVoucherDetail(scope.$index)" :disabled="disabledVal() || dataForm.invoiceStatus==='3'">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table> 
      <d3Pagination :sourceData="dataForm.voucherDetailList" ref="d3Pagination" v-model="voucherTableData" />
      <div class="form-text">
        <form-title :title="'报销明细'">
        </form-title>
        <div class="export-text">
          <el-button type="primary" size="small" @click="addEmployeeDetail" :disabled="dataForm.relatedTaxPaymentVoucher=='1'">新增</el-button>
          <el-button type="primary" size="small" @click="delTableDetail(selectEmployeeRows, dataForm.employeeDetailList)" :disabled="dataForm.relatedTaxPaymentVoucher=='1'">删除</el-button>
          <!-- <el-button type="primary" size="small" @click="delEmployeeDetail" :disabled="disabledVal()||dataForm.relatedTaxPaymentVoucher=='1'">删除</el-button> -->
          <el-button type="primary" size="small" @click="importEmployeeDetail" :disabled="dataForm.relatedTaxPaymentVoucher=='1'">导入</el-button>
          <el-button type="primary" size="small" @click="exportEmployeeDetail" :disabled="dataForm.relatedTaxPaymentVoucher=='1'" v-if="dataForm.id">导出</el-button>
        </div>
        <!-- <el-button type="primary" size="small" class="export-text" @click="exportContractInsure">导出</el-button> -->
      </div>
      <el-table :data="employeeTableData" class="f2bpmui-datagrid-vuetable" 
        border show-summary :summary-method="getSummaries"
        @selection-change="handleEmployeeChange" :disabled="disabledVal()"
      >
        <el-table-column type="selection" width="55" fixed="left"></el-table-column>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="摘要" prop="abstractRemark" :render-header="addRedStar">
          <template slot-scope="scope">
            <el-input v-model="scope.row.abstractRemark" size="small" placeholder="请输入" class="fontColor" :disabled="disabledVal()||employeeDisabled"/>
          </template>
        </el-table-column>
        <el-table-column label="收支项目" prop="basePayProject" :render-header="addRedStar">
          <template slot-scope="scope">
            <select-dialog :btnDisabled="disabledVal()" :model-data="incomeAndExpendDialog" :value="scope.row.basePayProject" dynamic-model="customDialog" @updateValue="updateincomeAndExpend($event,scope.$index)" class="specialStyle"></select-dialog>
          </template>
        </el-table-column>
        <el-table-column label="报销金额(元)" prop="reimbursementAmount" :render-header="addRedStar">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.reimbursementAmount" defaultValue placeholder="请输入" :disabled="disabledVal()||dataForm.relatedTaxPaymentVoucher=='1'"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="发票情况" prop="invoiceSituation" :render-header="addRedStar">
          <template slot-scope="scope">
            <el-select v-model="scope.row.invoiceSituation" placeholder="请选择" size="small" style="width:100%" @change="changeInvoiceSituation" :disabled="disabledVal()||dataForm.relatedTaxPaymentVoucher=='1'">
              <el-option v-for="(item,index) in invoiceSituationList" :key="index" :label="item.configName" :value="item.configValue"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table> 
      <d3Pagination :sourceData="dataForm.employeeDetailList" ref="d3Pagination" v-model="employeeTableData" />
      <div class="form-text">
        <form-title :title="'关联发票'">
        </form-title>
        <div class="export-text">  
          <el-button type="primary" size="small" @click="addContractInsure" :disabled="invoiceDisabled===true">新增</el-button>
          <el-button type="primary" size="small" @click="delTableDetail(selectInvoiceRows, dataForm.invoiceDetailList)" :disabled="invoiceDisabled===true">删除</el-button>
          <el-button type="primary" size="small" @click="importContractInsure" :disabled="invoiceDisabled===true">导入</el-button>
          <el-button type="primary" size="small" @click="exportContractInsure" :disabled="invoiceDisabled===true" v-if="dataForm.id">导出</el-button>
        </div>
      </div>
      <el-table :data="tableData" class="f2bpmui-datagrid-vuetable" 
        show-summary :summary-method="getSummaries"
        @selection-change="handleInvoiceChange" :disabled="disabledVal()"
      >
        <el-table-column type="selection" width="55" fixed="left"></el-table-column>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="发票号码" prop="invoiceNo" :render-header="addRedStar">
          <template slot-scope="scope">
            <select-dialog :isLinkBtn="true" :btnDisabled="disabledVal()" :model-data="invoiceDialog" :value="scope.row.invoiceNo" dynamic-model="customDialog" @updateValue="updateInvoiceNo($event,scope.$index)" class="specialStyle"></select-dialog>
          </template>
        </el-table-column>
        <el-table-column label="发票代码" prop="invoiceCode" :render-header="addRedStar">
          <template slot-scope="scope">
            <el-input v-model="scope.row.invoiceCode" size="small" placeholder="请输入" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="开票日期" prop="invoiceCreateTime" :render-header="addRedStar">
          <template slot-scope="scope">
            <el-input v-model="scope.row.invoiceCreateTime" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="发票类型" prop="invoiceType" :render-header="addRedStar">
          <template slot-scope="scope">
            <el-select v-model="scope.row.invoiceType" placeholder="请选择" size="small" style="width:100%" disabled>
            <el-option v-for="(item,index) in invoiceTypeList" :key="index" :label="item.configName" :value="item.configValue"></el-option>
          </el-select>
          </template>
        </el-table-column>
        <el-table-column label="销售方名称" prop="sellerName">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sellerName" size="small" placeholder="请输入" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="发票金额(含税)" prop="amountTax">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.amountTax" defaultValue :placeholder="msgTip.AUTO_PLACEHOLDER" disabled></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="税额" prop="tax">
          <template slot-scope="scope">
            <el-input v-model="scope.row.tax" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="发票金额(无税)" prop="amountUntax">
          <template slot-scope="scope">
            <el-input v-model="scope.row.amountUntax" size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="占用发票(元)" prop="occupyInvoiceAmount">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.occupyInvoiceAmount" defaultValue :placeholder="msgTip.AUTO_PLACEHOLDER" disabled></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="发票" prop="fileInfoList">
          <template slot-scope="scope">
            <update-files v-model="scope.row.fileInfoList" :isReadOnly="scope.row.fileInfoList&&scope.row.fileInfoList.length?true:false"></update-files>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="delContractInsure(scope.$index)" :disabled="disabledVal() || dataForm.invoiceStatus==='3'">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table> 
      <d3Pagination :sourceData="dataForm.invoiceDetailList" ref="d3Pagination" v-model="tableData" />
      <div class="form-text">
        <form-title :title="'关联借款单'">
        </form-title>
        <div class="export-text">
          <el-button type="primary" size="small" @click="addLoanDetail" :disabled="disabledVal()||dataForm.invoiceStatus==='3'">新增</el-button>
          <el-button type="primary" size="small" @click="delTableDetail(selectLoanRows, dataForm.loanDetailList)" :disabled="disabledVal()||dataForm.invoiceStatus==='3'">删除</el-button>
        </div>
      </div>
      <el-table :data="loanTableData" class="f2bpmui-datagrid-vuetable" border 
        show-summary :summary-method="getSummaries"
        @selection-change="handleSelectionLoanChange" :disabled="disabledVal()"
      >
        <el-table-column type="selection" width="55" fixed="left"></el-table-column>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="借款单号" prop="code" :render-header="addRedStar">
          <template slot-scope="scope">
            <select-dialog :btnDisabled="disabledVal()" :model-data="loanDialog" :value="scope.row.code" dynamic-model="customDialog" @updateValue="updateLoanNo($event,scope.$index)" class="specialStyle"></select-dialog>
          </template>
        </el-table-column>
        <el-table-column label="借款人" prop="payInAccount">
          <template slot-scope="scope">
            <el-input v-model="scope.row.payInAccount" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="借款类型" prop="loanType">
          <template slot-scope="scope">
            <el-input v-model="scope.row.loanType" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
          </template>
        </el-table-column>  
        <el-table-column label="冲借款金额" prop="loanAmount">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.loanAmount" defaultValue placeholder="请输入" :disabled="disabledVal()"></amount-input>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="delLoanDetail(scope.$index)" :disabled="disabledVal() || dataForm.invoiceStatus==='3'">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table> 
      <d3Pagination :sourceData="dataForm.loanDetailList" ref="d3Pagination" v-model="loanTableData" />
      <div class="form-text" v-show="dataForm.relatedExpenses==='1'">
        <form-title :title="'关联费用预提单'">
        </form-title>
        <div class="export-text">  
          <el-button type="primary" size="small" @click="addExpenseDetail" :disabled="dataForm.invoiceStatus==='3'">新增</el-button>
          <el-button type="primary" size="small" @click="delTableDetail(selectExpenseRows, dataForm.expenseDetailList)" :disabled="disabledVal() || dataForm.invoiceStatus==='3'">删除</el-button>
        </div>
      </div>
      <el-table :data="expenseTableData" class="f2bpmui-datagrid-vuetable" 
        v-show="dataForm.relatedExpenses==='1'" show-summary :summary-method="getSummaries"
        @selection-change="handleSelectionExpenseChange" :disabled="disabledVal()"
      >
        <el-table-column type="selection" width="55" fixed="left"></el-table-column>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="单据编号" prop="code" :render-header="addRedStar"> 
          <template slot-scope="scope">
            <select-dialog :isLinkBtn="true" :btnDisabled="disabledVal()" :model-data="expenseDialog" :value="scope.row.code" dynamic-model="customDialog" @updateValue="updateExpenseNo($event,scope.$index)" class="specialStyle"></select-dialog>
          </template>
        </el-table-column>
        <el-table-column label="预提项目编号" prop="constructCode">
          <template slot-scope="scope">
            <el-input v-model="scope.row.constructCode" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="预提项目名称" prop="constructName">
          <template slot-scope="scope">
            <el-input v-model="scope.row.constructName" :placeholder="msgTip.AUTO_PLACEHOLDER" disabled/>
          </template>
        </el-table-column>  
        <el-table-column label="预提总金额(元)" prop="sumAmount">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.sumAmount" defaultValue :placeholder="msgTip.AUTO_PLACEHOLDER" disabled></amount-input>
          </template>
        </el-table-column>
      </el-table> 
      <d3Pagination v-show="dataForm.relatedExpenses==='1'" :sourceData="dataForm.expenseDetailList" 
      ref="d3Pagination" v-model="expenseTableData" />
      <row-layout :cols="1" :title="'附件'" class="required-tag">
        <el-form-item slot="col_1" prop="fileInfoList" label="附件文件：">
          <update-files v-model="dataForm.fileInfoList"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="createUserName" label="编制人：">
          <label class="label-style">{{dataForm.createUserName}}</label>
        </el-form-item>
        <el-form-item slot="col_2" prop="deptName" label="编制人部门：">
            <label class="label-style">{{dataForm.deptName}}</label>
        </el-form-item>
        <el-form-item slot="col_3" prop="createTime" label="编制时间：">
          <label class="label-style">{{ dataForm.createTime}}</label>
        </el-form-item>
      </row-layout>
    </el-form>
    <uploader-details :visible.sync="importEmployeeData.visible" :keyword="importEmployeeData.key" :importParams="importEmployeeData.importParams"
     :uploaderUrl="importEmployeeData.url" @importSuccess="importEmployeeSuccess"></uploader-details>
    <uploader-details :visible.sync="importInvoiceData.visible" :keyword="importInvoiceData.key" :importParams="importEmployeeData.importParams"
     :uploaderUrl="importInvoiceData.url" @importSuccess="importInvoiceSuccess"></uploader-details>
  </div>
</template>

<script>
import FormTitle from '@/components/basic/formTitle/index.vue';
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
import AmountInput from '@/components/basic/numberInput/amountInput.vue';
import CascSelect from '@/components/basic/cascSelect/index.vue';
import updateFiles from '@/components/basic/uploaderFile/index.vue';   // 上传附件
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import {getDataDictByConfigType} from '@/Api/dataDict.js'
import MyFun from '@/utils/fun';
import moment from 'moment';
import service from "@/utils/services";
import LinkInput from '@/components/basic/elInput/linkInput.vue';
import TextInput from '@/components/basic/elInput/textInput.vue'; //清除空格组件
import d3Pagination from "@/components/basic/pagination/index.vue";
import UploaderDetails from '@/components/basic/importTemplateDialog/uploaderDetails.vue';

import comMixin from '../minix';
import {
    XiangMuDangAnProjectSubmission_MODEL, FuKuanCaiWuZuZhi_MODEL, FOLLOWER_MODEL, XiangMuBaoXianDan_MODEL, 
    VOUCHER_MODE, ShouZhiXiangMu_MODEL, XiangMuJieKuanShenQing_MODEL, Fa_MODEL
  } from '@/views/businessModule/enum/param';

//必填字段 先全部加载
const requiredArray = ['constructCode', 'paymentOrgName', 'balaType', 'payInSituation', 'payInUserName',
  'relatedExpenses', 'fileInfoList'];
const { orgName, orgId, realName, userId } = FUI.Sys.getAuthor();
const currentDate = moment(new Date()).format('YYYY-MM-DD'); 
// var type = Object.toQueryString('type') || '';
export default {
  components: { FormTitle, RowLayout, SelectDialog, AmountInput, CascSelect, updateFiles, LinkInput, TextInput, d3Pagination, UploaderDetails },
  mixins: [comMixin],
  data() {
    return {
      loading: false,
      projectModel: XiangMuDangAnProjectSubmission_MODEL,  // 项目编号 弹窗
      payOutOrgData: FuKuanCaiWuZuZhi_MODEL,   // 付款财务组织 弹窗
      baseBankDialog: { code: 'YinXingDangAn', customDialog: 'YinXingDangAn', isSetHead: 1, isMulti: false, initailData: [] },
      baseBank: { code: 'bank_branch', customDialog: 'bank_branch', isSetHead: 1, isMulti: false, initailData: [] },
      dialogModel: FOLLOWER_MODEL,  // 收款方，待选值为【用户】控件
      insureModel: XiangMuBaoXianDan_MODEL, // 项目保险购买登记-保险单号(项目保险单)
      // voucherMode: VOUCHER_MODE,  // 预缴完税凭证号 弹窗
      voucherMode: {   // 关联预缴完税凭证号 弹窗 视图
        code: 'GuanLianYuJiaoWanShuiPingZheng',
        customDialog: 'GuanLianYuJiaoWanShuiPingZheng',
        isShowLink:true,
        isSetHead: 1,
        isMulti: false,
        initailData: [],
        parm: {varParams:[{key:'constructArchiveMainId',value:''}]}
      },
      invoiceDialog: {   // 关联发票-发票号码 弹框
        code: 'GuanLianFaPiao',
        customDialog: 'GuanLianFaPiao',
        isShowLink:true,
        isSetHead: 1,
        isMulti: false,
        initailData: []
      },
      incomeAndExpendDialog: ShouZhiXiangMu_MODEL, // 收支项目 弹窗
      loanDialog:{   // 借款单号  弹窗
        code: 'GuanLianJieKuan',
        customDialog: 'GuanLianJieKuan',
        isShowLink:true,
        isSetHead: 1,
        isMulti: false,
        initailData: [],
        parm: {varParams:[{key:'constructArchiveMainId',value:''}]}
      },
      // expenseDialog: Fa_MODEL, // 关联费用预提单-单据编号 弹窗
      expenseDialog:{ // 关联费用预提单-单据编号 弹窗
        code: 'expenseDetailView',
        customDialog: 'expenseDetailView',
        isShowLink:true,
        isSetHead: 1,
        isMulti: false,
        initailData: []
      },
      importInvoiceData: {  // 关联发票 导入接口
        visible: false,
        url: '/finance/financeReimburseMain/importInvoiceData',
        key:'importInvoiceDataDetail',
        importParams: {
          payoutMainId: ""
        }
      },
      importEmployeeData: {  // 报销明细 导入接口
        visible: false,
        url: '/finance/financeReimburseMain/importEmployeeData',
        key:'financeReimburseMainDetail',
        importParams: {
          payoutMainId: ""
        }
      },
      voucherTableData: [],
      employeeTableData: [],
      loanTableData: [],
      expenseTableData: [],
      tableData: [],
      dataForm: {
        id:'', 
        code:'',  // 单据编号
        constructArchiveMainId:'',  // 项目编号id 必传
        constructCode:'',  // 项目编号
        constructName:'',  // 项目名称
        // constructId:'',  // 项目id 必传
        managerDeptName:'',  // 管理部门
        // projectManagerName:'',  // 项目负责人
        paymentOrgId:'',  //	付款财务组织id
        paymentOrgName:'',  // 付款财务组织
        paymentAccountNumber:'',  // 付款账号
        payInSituation: '1',  //	收款方情况
        payInUserId:'',  //		收款方(收款方情况为本公司员工) id
        payInUserName:'',  //	收款方
        payeeBankAcc:'',  // 收款账号
        payInBank:'',  //	收款银行
        payeeBank:'',  //	收款银行id
        paySubBankNumberNo:'',  // 收款银行联行号
        balaType:'',  // 结算方式
        applyAmount:'',  // 报销金额（元）
        actuallyAmount:'',  // 实付金额（元）
        loanAmount:'',  // 冲借款总金额（元）
        relatedExpenses: '0',  // 关联费用预提
        isOriginalInvoice:'',  // 是否收到发票原件
        refundAmount:'',  // 退款金额（元）
        relatedTaxPaymentVoucher: '0',  // 关联预缴完税凭证
        voucherDetailList: [], // 关联预缴完税凭证
        employeeDetailList: [], // 报销明细
        invoiceDetailList: [],  // 关联发票
        loanDetailList: [], // 关联借款单
        expenseDetailList: [],  // 关联费用预提单
        invoiceStatus:'',  // 发票情况
        procInstState: '', // 流程状态
        
        policyEndDate:'',  // 保单终止日期
        policyRenewalExpirationDate:'',  // 保单续保到期日
        policyStatus:'',  // 保单状态
        memo: '',  // 备注
        fileInfoList: [],  // 附件文件
        createUserId:'', 
        createUserName:'',  // 编制人
        deptName:'',  // 编制人部门
        createTime:'',  // 编制时间
      },
      msgTip: RuleRequired.tipMsg,
      //必填项字段
      dataRule: RuleRequired.dataRule(requiredArray),
      renew: false,
      isMust: false,
      employeeDisabled: false,
      balaTypeList: [], // 结算方式
      selectRows: [],
      selectEmployeeRows: [],
      selectInvoiceRows: [],
      selectLoanRows: [],
      selectExpenseRows: [],
      invoiceDisabled: true, // 当 发票情况=无票1，不可编辑
      invoiceStatus: false,  // 当 发票情况=有票，必填
      // sumAmountTotal: 0.00, // 预提总金额(元) 合计
      sumObj:{ // 合计字段
        payTaxesAmount: '',
        reimbursementAmount: '',
        amountTax: '',
        occupyInvoiceAmount: '',
        loanAmount: '',
        sumAmount: '',
      },
      voucherDetailList: [], // 报销明细
      employeeDetailList: [], // 报销明细
      // currentMonth: new Date().getMonth()+1,  // 当前月份 
      invoiceSituationList: [], // 发票情况
      invoiceTypeList: [], // 发票类型
      
    }
  },
  computed: {
    policyStatus(){ 
      let formatDate1 = new Date(currentDate);
      let formatDate2 = new Date(this.dataForm.policyEndDate);
      let formatDate3 = new Date(this.dataForm.policyRenewalExpirationDate);
      if(formatDate1 <= formatDate2){
        return '1';
      }else if(formatDate2<formatDate1 && formatDate3<formatDate1){
        return '3';
      }else if(formatDate2<formatDate1 && formatDate1<=formatDate3){
        return '2';
      }
      else{
        return '';
      }
    },
  },
  watch: { // 当结算方式=网银时，编制人必填，可编辑，【银行档案】选择控件，显示账号。否则不必填
    'dataForm.balaType':{   
      handler(newValue){
        this.isMust = (newValue == '1' ? true : false);
        /* 关联借款单: 当结算方式为中装支付时必须为空；
          结算方式为冲借款时必须填写，且冲借款金额之和必须等于报销明细页签的报销金额之和
          其他结算方式可填可不填，但冲借款金额之和必须小于等于报销明细页签的报销金额之和 
          当结算方式选择“冲借款”时，校验实付金额必须为0 实付金额(元) = 报销金额(元) - 冲借款总金额
        */
        // this.dataForm.loanDetailList = (newValue == '中装支付' ? [] : this.dataForm.loanDetailList);
        this.dataForm.actuallyAmount = (newValue == '3' ? '0.00' : this.dataForm.actuallyAmount);
      },
      deep:true,
    }, 
    sumObj:{
      handler(){
        // 默认情况下， 冲借款总金额(元) = 关联借款单页签 冲借款金额 合计数
        this.dataForm.loanAmount = this.sumObj['loanAmount'] || '0.00'; 
        this.dataForm.applyAmount = this.sumObj['reimbursementAmount'] || '0.00';
        if(this.dataForm.balaType == '3'){
          this.dataForm.loanAmount = this.sumObj['reimbursementAmount'] || '0.00';
        }
        // 默认情况下, 实付金额(元) = 报销金额(元) - 冲借款总金额
        this.dataForm.actuallyAmount = parseFloat(this.dataForm.applyAmount) - parseFloat(this.dataForm.loanAmount) + '';
      },
      deep: true
    },
    policyStatus:{
      handler(newValue){
        this.dataForm.policyStatus = newValue;
      },
    },
    'dataForm.employeeDetailList.length':{   
      handler(newValue){
        if(newValue){
          const {employeeDetailList} = this.dataForm;
          let haveNoTicket = employeeDetailList.every(item => {
            return (item.invoiceSituation === '2'||item.invoiceSituation==='无票');
          });
          this.invoiceDisabled = haveNoTicket ? true : false;
          let someHaveTicket = employeeDetailList.some(item => {
            return item.invoiceSituation==='1';
          });
          this.invoiceStatus = someHaveTicket ? true : false;
        }
      }
      // deep:true,
    },
  },
  created(){
    // console.log('currentMonth', this.currentMonth) // 2023-09
  },
  methods: {
    changeInvoiceSituation(){ // 当存在发票情况=有票，必填；当所有的发票情况=无票1，不可编辑(1有票；2无票；3后补票；)
      const {employeeDetailList} = this.dataForm;
      if(employeeDetailList.length){
        let haveNoTicket = employeeDetailList.every(item => {
          return (item.invoiceSituation === '2'||item.invoiceSituation==='无票');
        });
        this.invoiceDisabled = haveNoTicket ? true : false;
        let someHaveTicket = employeeDetailList.some(item => {
          return item.invoiceSituation==='1';
        });
        this.invoiceStatus = someHaveTicket ? true : false;
      }
    },
    changeRelatedTax(val){
      if(val=='1'){   // 关联预缴完税凭证为'是'时，本tab不允许编辑，内容根据选择的关联预缴完税凭证自动填充；
        // this.dataForm.employeeDetailList = 
        this.employeeDisabled = true;
      }else{
        this.employeeDisabled = false;
      }
    },
    handleSelectionChange(rows) {
      this.selectRows = rows;
    },
    handleEmployeeChange(rows) {
      this.selectEmployeeRows = rows;
    },
    handleInvoiceChange(rows) {
      this.selectInvoiceRows = rows;
    },
    handleSelectionLoanChange(rows) {
      this.selectLoanRows = rows;
    },
    handleSelectionExpenseChange(rows) {
      this.selectExpenseRows = rows;
    },
    // 项目编号 update
    projectUpdate(data){
      this.dataForm.constructCode = data[0].code;
      this.dataForm.constructName = data[0].name;
      this.dataForm.constructArchiveMainId = data[0].id;
      this.dataForm.managerDeptName = data[0].constructionunitname || '';
      // this.dataForm.projectManagerName = data[0].projectmanagername || '';
      this.voucherMode.parm.varParams[0].value = data[0].id;
      this.loanDialog.parm.varParams[0].value = data[0].id;
    },
    // 付款财务组织 update
    fOrgUpdateValue(data){ 
      console.log(data, '付款财务组织');
      this.dataForm.paymentOrgName = data[0].text; // 财务组织
      this.dataForm.paymentOrgId = data[0].value;  // 财务组织id
    },
    // 付款账号（更新）
    updatePaymentAccountValue(data) {
      console.log(data, '付款账号');
      if(data && data.length <= 0) return;
      const { id, bank_account_no } = data[0];
      this.dataForm.paymentAccountNumber = bank_account_no;
      this.dataForm.payOutAccountId = id;
    },
    // 收款方【用户】控件 update 
    followerUpdate(data) { 
      this.dataForm.payInUserName = data[0].realName;   //跟进人
      this.dataForm.payInUserId = data[0].userId;  //跟进人Id
    },
    // 收款银行
    updatePayInBank(data) {
      // console.log(data, '收款银行'); 
      this.dataForm.payeeBank = data[0].id;
      this.dataForm.payInBank = data[0].name;
      this.dataForm.paySubBankNumberNo = data[0]["combine_num"];
    },
    // 收支项目 update
    updateincomeAndExpend(data,index){
      // console.log(data, '收支项目');
      if(data && data.length >0){
        const {id, name} = data[0];
        this.$set(this.dataForm.employeeDetailList[index],'basePayProjectId', id);
        this.$set(this.dataForm.employeeDetailList[index],'basePayProject', name);
      }
    },
    // 关联费用预提单 update
    updateExpenseNo(data,index){
      console.log(data, '关联费用预提单');
      if(data && data.length >0){
        const {id, code, constructCode, constructName, sumAmount, constructArchiveMainId} = data[0];
        this.$set(this.dataForm.expenseDetailList[index],'invoiceExtractExpenseMainId', id);
        // this.$set(this.dataForm.expenseDetailList[index],'id', id);
        this.$set(this.dataForm.expenseDetailList[index],'code', code);
        this.$set(this.dataForm.expenseDetailList[index],'constructCode', constructCode);
        this.$set(this.dataForm.expenseDetailList[index],'constructName', constructName);
        this.$set(this.dataForm.expenseDetailList[index],'sumAmount', sumAmount);
      }
    },
    // 给关联发票表头加必填符号*
    addRedStar(h, { column }) {
      return [
        h("span", " " + column.label),
        h("span", { style: "color: red" }, "*")
      ];
    },
    // 导出关联发票表
    async exportContractInsure(){
      const {id, invoiceDetailList} = this.dataForm;
      // let params = {contractInsureMainId: id || (invoiceDetailList[0].invoiceCollectionMainId)};
      let params = {financePayoutMainId: id || (voucherDetailList[0].invoiceCollectionMainId)};
      await this.exportInsureComplete(params);
    },
    // 导出关联发票表
    exportInsureComplete(params){
      return service.download(`/finance/financeReimburseMain/exportInvoiceData`, {
        type: 'post',
        isLoading: true,  //是否有加载提示
        loadingMsg: '导出中', //提示信息
        params,  //传的参数
        "Content-Type":"application/json; charset=utf-8"
      })
    },
    importContractInsure() {  // 导入关联发票 invoice 
      // if(!this.importInvoiceData.importParams.payoutMainId){
      //   FUI.Window.showMsg('暂存后才能导入');
      //   return;
      // }
      this.importInvoiceData.visible = true;
    },
    // 关联发票 导入成功
    importInvoiceSuccess(data) {
      let successInvoiceList = (data.successList && data.successList.length > 0) ? data.successList.map((item,index) => ({
        ...item,
        rowIndex: index + 1
      })) : [];
      successInvoiceList.forEach(item => {
        this.dataForm.invoiceDetailList.push({
          ...item,
        })
      })
      // this.tableData = this.tableData.push(successInvoiceList);
      this.importInvoiceData.visible = false;
    },
    // 关联预缴完税凭证 update
    updateVoucherCode(data,index){
      console.log('关联预缴完税凭证data', data)
      if(data && data.length >0){
        const {id, code,payTaxesAmount,constructcode,constructName,prepaidPeriodTime,wiid} = data[0];
        // this.$set(this.dataForm.voucherDetailList[index],'id', id);
        this.$set(this.dataForm.voucherDetailList[index],'code', code);
        this.$set(this.dataForm.voucherDetailList[index],'constructCode', constructcode);
        this.$set(this.dataForm.voucherDetailList[index],'constructName', constructName);
        this.$set(this.dataForm.voucherDetailList[index],'voucherMainId', id);
        this.$set(this.dataForm.voucherDetailList[index],'payTaxesAmount', payTaxesAmount);
        this.$set(this.dataForm.voucherDetailList[index],'prepaidPeriodTime', prepaidPeriodTime);
        this.$set(this.dataForm.voucherDetailList[index],'wiid', wiid);
        // let abstractRemark = '';
        // let actualPrepaidtax = this.dataForm.voucherDetailList.some(voucherDeta => voucherDeta.payTaxesAmount !== '0.00')
        // if(actualPrepaidtax){
        //   abstractRemark = '预缴增值税';
        // }
        // this.dataForm.employeeDetailList.push({  // 报销明细内容根据选择的关联预缴完税凭证自动填充；
        //   // id: '',  // 主键
        //   abstractRemark: abstractRemark,  // 摘要
        //   basePayProject: abstractRemark,  // 收支项目
        //   basePayProjectId: '',  // 收支项目id
        //   invoiceSituation: '无票',  // 发票情况(1有票；2无票；3后补票；)
        //   reimbursementAmount: '',  // 报销金额(元)
        // })
        this.autoAddEmployeeDetail();
      }
    },
    // 预缴完税凭证自动填充报销明细
    autoAddEmployeeDetail(){
      // {voucherIdList:["1713845002551791617","1713845002551791618"];
      let voucherIdList = [];
      this.dataForm.voucherDetailList.forEach(voucherDetail => {
        let voucherMainId = voucherDetail.financePayoutMainId || voucherDetail.voucherMainId;
        voucherIdList.push(voucherMainId);
      });
      let params = {voucherIdList: voucherIdList};
      service.post(`/finance/financeReimburseMain/autoAddEmployeeDetail`, params).then(res => {
        const {code, data} = res;
        if (code === 200 && data.length > 0) {
          // this.dataForm.employeeDetailList.push({data});
          // this.dataForm.status = this.getStatus(data.status);
          data.forEach(item => {
            // this.dataForm.employeeDetailList.push(...item);
            this.dataForm.employeeDetailList.push({
              // id: item.id,  // 主键
              abstractRemark: item.abstractRemark,  // 摘要
              basePayProject: item.basePayProject,  // 收支项目
              basePayProjectId: item.basePayProjectId,  // 收支项目id
              invoiceSituation: item.invoiceSituation,  // 发票情况(1有票；2无票；3后补票；)
              reimbursementAmount: item.reimbursementAmount,  // 报销金额(元)
            })
          })
        }
      }).catch(err=>{
        FUI.Window.showMsg('请求异常' + err.toString());
      });
    },
    // 导出关联预缴完税凭证
    async exportVoucherDetail(){
      const {id, voucherDetailList} = this.dataForm;
      // console.log(voucherDetailList,this.voucherDetailList,'voucherDetailList')
      if(!voucherDetailList||!voucherDetailList.length){
        FUI.Window.showMsg('表格不能为空');
      }
      if(voucherDetailList.length!==this.voucherDetailList.length){
        FUI.Window.showMsg('暂存后才能导出');
      }
      // 转成JSON字符串对比，表格数据是否发生实质性变化 如果发生变化了，提示用户必须暂存后才能导出

      let params = {financePayoutMainId: id || (voucherDetailList[0].voucherMainId)};
      // let params = {voucherDetailList: this.dataForm.voucherDetailList};
      await this.exportVoucherComplete(params);
    },
    // 关联预缴完税凭证 导出明细表
    exportVoucherComplete(params){
      return service.download(`/finance/financeReimburseMain/exportVoucherData`, {
        type: 'post',
        isLoading: true,  //是否有加载提示
        loadingMsg: '导出中', //提示信息
        params,  //传的参数
        "Content-Type":"application/json; charset=utf-8"
      })
    },
    // 添加关联预缴完税凭证
    addVoucherDetail() {
      if (!this.dataForm.voucherDetailList){
        this.dataForm.voucherDetailList = []; // 兼容接口返回null的情况
      } 
      this.dataForm.voucherDetailList.push({
        // id: '',  // 主键
        code: '',  // 单据编号
        constructCode: '',  // 项目编号
        constructName: '',  // 项目名称
        voucherMainId: '',  // 费用报销的主键
        payTaxesAmount: '',  // 缴纳税金合计
        prepaidPeriodTime: '',  // 预缴所属期间
        wiid: [],  //	流程实例
      })
    },
    // 关联预缴完税凭证 总计
    getSummaries(param) { 
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 2) { //第一列
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        let columArray = ['payTaxesAmount', 'reimbursementAmount', 'amountTax', 'occupyInvoiceAmount', 'loanAmount', 'sumAmount'];
        if (columArray.includes(column.property)) {
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += "";
          } else {
            sums[index] = "";
          }
          this.sumObj[column.property] = sums[index] ? Number(sums[index]) : ''; //比较大小转Number
        } else { 
          sums[index] = "";
        }
      });
      const total = sums.map(n => (n && MyFun.isNumber(n)) ? MyFun.getTofixed(n, 2) : n);
      // console.log("sumObj===:",this.sumObj);
      return total;
    },
    // 导出报销明细
    async exportEmployeeDetail(){
      const {id, employeeDetailList} = this.dataForm;
      if(!employeeDetailList||!employeeDetailList.length){
        FUI.Window.showMsg('表格不能为空');
      }
      if(employeeDetailList.length!==this.employeeDetailList.length){
        FUI.Window.showMsg('暂存后才能导出');
      }
      let url = `/finance/financeReimburseMain/exportEmployeeData`;
      let params = {financePayoutMainId: id || (employeeDetailList[0].basePayProjectId)};
      await this.exportEmployeeComplete(url, params);
    },
    // 报销明细 导出
    exportEmployeeComplete(url, params){
      return service.download(url, {
        type: 'post',
        isLoading: true,  //是否有加载提示
        loadingMsg: '导出中', //提示信息
        params,  //传的参数
        "Content-Type":"application/json; charset=utf-8"
      })
    },
    // 导入报销明细
    importEmployeeDetail(){
      // if(!this.importEmployeeData.importParams.payoutMainId){
      //   FUI.Window.showMsg('暂存后才能导入');
      //   return;
      // }
      this.importEmployeeData.visible = true;
    },
    // 报销明细 导入成功
    importEmployeeSuccess(data) {
      let successEmployeeList = (data.successList && data.successList.length > 0) ? data.successList.map((item,index) => ({
        ...item,
        rowIndex: index + 1
      })) : [];
      successEmployeeList.forEach(item => {
        // this.dataForm.employeeDetailList.push(...item);
        // return this.dataForm.employeeDetailList;
        this.dataForm.employeeDetailList.push({
          // id: item.id,  // 主键
          abstractRemark: item.abstractRemark,  // 摘要
          basePayProject: item.basePayProject,  // 收支项目
          basePayProjectId: item.basePayProjectId,  // 收支项目id
          invoiceSituation: item.invoiceSituation,  // 发票情况(1有票；2无票；3后补票；)
          reimbursementAmount: item.reimbursementAmount,  // 报销金额(元)
        })
      })
      // this.dataForm.employeeDetailList = this.dataForm.employeeDetailList.push(successEmployeeList);
      // this.employeeDetailList =  (data.successList && data.successList.length > 0) ? data.successList.map((item,index) => ({
      //   ...item,
      //   rowIndex: index + 1
      // })) : [];
      this.importEmployeeData.visible = false;
    },
    // 添加报销明细
    addEmployeeDetail() {
      if (!this.dataForm.employeeDetailList){
        this.dataForm.employeeDetailList = [];
      } 
      this.dataForm.employeeDetailList.push({
        // id: '',  // 主键
        abstractRemark: '',  // 摘要
        basePayProject: '',  // 收支项目
        basePayProjectId: '',  // 收支项目id
        invoiceSituation: '无票',  // 发票情况(1有票；2无票；3后补票；)
        reimbursementAmount: '',  // 报销金额(元)
      })
    },
    // 删除表格数据-公共方法
    delTableDetail(selectRows, employeeDetailList) {
      if (selectRows.length === 0) {
        this.$message({
          message: '请选择一条数据',
          type: 'warning'
        });
        return;
      }
      selectRows.forEach(item => {
        employeeDetailList = MyFun.removeByKey(employeeDetailList, 'key', item.key);
      })
      this.$nextTick(() => {
        employeeDetailList = this.regSortList(employeeDetailList);
      })
    },
    
    //重新排序
    regSortList(arr) {
      return arr.length ? arr.map((item, index) => ({
        ...item,
        rowIndex: (index + 1)
      })) : [];
    },
    // 添加关联发票
    addContractInsure() {
      if (!this.dataForm.invoiceDetailList){
        this.dataForm.invoiceDetailList = [];
      } 
      this.dataForm.invoiceDetailList.push({
        financeReimburseMainId: '',  // 报销主表id(报销主表 - finance_reimburse_main)
        id: '',  // 主键
        invoiceCreateTime: '',  // 开票日期
        amountTax: '',  // 发票金额(含税)(元)
        amountUntax: '',  // 发票金额(无税)(元)
        invoiceCode: '',  // 发票代码
        invoiceCollectionMainId: '',  //	发票信息采集主表id
        invoiceNo: '',  // 发票号码
        invoiceType: '',  // 发票类型(数据字典 - 发票类型)
        occupyInvoiceAmount: '',  // 占用发票(元)
        // isDel: '',  // 是否删除（0否;1是）
        sellerName: '',  // 销售方名称
        tax: '',  // 税额
        fileInfoList: [],  //	附件
      })
    },
    // // 删除关联发票
    // delContractInsure(index) {
    //   this.dataForm.invoiceDetailList.splice(index, 1)
    // },
    // 发票号码
    updateInvoiceNo(data,index){
      console.log('发票data', data)
      if(data && data.length >0){
        const {invoiceNo,invoiceCode,invoiceType,id,invoiceCreateTime,sellerName,invoiceamounttax,tax,invoiceamountuntax} = data[0];
        this.$set(this.dataForm.invoiceDetailList[index],'invoiceCode',invoiceCode);
        this.$set(this.dataForm.invoiceDetailList[index],'invoiceNo',invoiceNo);
        this.$set(this.dataForm.invoiceDetailList[index],'invoiceType',invoiceType);
        this.$set(this.dataForm.invoiceDetailList[index],'invoiceCollectionMainId',id);
        this.$set(this.dataForm.invoiceDetailList[index],'invoiceCreateTime',invoiceCreateTime);
        this.$set(this.dataForm.invoiceDetailList[index],'sellerName',sellerName);
        this.$set(this.dataForm.invoiceDetailList[index],'amountTax',invoiceamounttax);
        this.$set(this.dataForm.invoiceDetailList[index],'tax',tax);
        this.$set(this.dataForm.invoiceDetailList[index],'amountUntax',invoiceamountuntax);
        this.$set(this.dataForm.invoiceDetailList[index],'occupyInvoiceAmount',invoiceamounttax);
      }
    },
    // 添加关联借款单
    addLoanDetail() {
      if (!this.dataForm.loanDetailList){
        this.dataForm.loanDetailList = [];
      } 
      this.dataForm.loanDetailList.push({
        financeLoanMainId: '',  // 报销主表id
        id: '',  // 主键
        code: '',  // 借款单号
        loanAmount: '',  // 冲借款金额
        loanType: '',  // 借款类型
        payInAccount: '',  // 借款人
      })
    },
    // 借款单号 update
    updateLoanNo(data,index){
      console.log(data, '借款单号');
      if(data && data.length >0){
        const {id, code, loanAmount, loanType, payInId, payInAccount} = data[0];
        this.$set(this.dataForm.loanDetailList[index],'financeLoanMainId', id);
        // this.$set(this.dataForm.loanDetailList[index],'id', id);
        this.$set(this.dataForm.loanDetailList[index],'code', code);
        this.$set(this.dataForm.loanDetailList[index],'loanAmount', loanAmount);
        this.$set(this.dataForm.loanDetailList[index],'loanType', this.getLoanType(loanType)); // loanType  borrowingCause借款原因
        // this.$set(this.dataForm.loanDetailList[index],'payInId', payInId); 
        this.$set(this.dataForm.loanDetailList[index],'payInAccount', payInAccount);
      }
    },
    // 借款类型
    getLoanType(loanType){
      switch (loanType) {
        case '1':
          return '临时备用金'
          break
        case '2':
          return '税金备用金'
          break
        case '3':
          return '额度备用金'
          break
      }
      return ''
    },
    // 添加关联费用预提单
    addExpenseDetail() {
      if (!this.dataForm.expenseDetailList){
        this.dataForm.expenseDetailList = [];
      } 
      this.dataForm.expenseDetailList.push({
        invoiceExtractExpenseMainId: '',  // 费用预提单id
        id: '',  // 主键
        code: '',  // 单据编号
        constructCode: '',  // 预提项目编号
        constructName: '',  // 预提项目名称
        sumAmount: '',  // 预提总金额(元)
      })
    },
    beforeInit() {
      this.getDataDictByConfigType();
    },
    // 获取详情后的赋值情况
    afterInit() {
      this.voucherDetailList = JSON.parse(JSON.stringify(this.dataForm.voucherDetailList));
      this.employeeDetailList = JSON.parse(JSON.stringify(this.dataForm.employeeDetailList));
      // this.voucherDetailList = this.dataForm.voucherDetailList;

      // 初始化传入付款id（导入模板需要）
      this.importInvoiceData.importParams.payoutMainId = this.dataForm.id;
      this.importEmployeeData.importParams.payoutMainId = this.dataForm.id;
      if(this.dataForm.constructArchiveMainId){  // 获取子表的视图数据
        this.voucherMode.parm.varParams[0].value = this.dataForm.constructArchiveMainId;
        this.loanDialog.parm.varParams[0].value = this.dataForm.constructArchiveMainId;
      } 
    },
    disabledVal(){
      const { id, createUserId, procInstState} = this.dataForm;
      var type = Object.toQueryString('type') || '';
      if(!id){
        return false;
      }else{
        // 审批中2，审批人才可以编辑 
        // 草稿状态时1，创建人能编辑；审批中查看表单，也不能编辑; 提交后被驳回到了提交人环节时，创建人可以;
        return (procInstState!=='3'&&procInstState!=='2'&&userId===createUserId) ? false : true;  // 流程表单(未审批完成时)查看状态可以编辑
      }
    },
    /**
     * 初始化字典
     */
    async getDataDictByConfigType() {
      const res = await getDataDictByConfigType({params: {configTypes: '是或否,付款类型(劳务付款),结算方式,发票类型,发票情况'}});
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            // case '是或否':
            //   this.radioOptions = ele.dataDict;
            //   break;
            case '结算方式':
              this.balaTypeList = ele.dataDict;
              this.balaTypeList = this.balaTypeList.filter(el=>{
                return el.configName!=="甲方代付"; // 去掉甲方代付 ,configValue: "3"重复
              });
              break;
            case '发票类型':
              this.invoiceTypeList = ele.dataDict;
              break;
            case '发票情况':
              this.invoiceSituationList = ele.dataDict;
              break;
            default:
              break;
          }
        });
      }
    },
    validateForm() {
      const _this = this;
      // 关联预缴完税凭证为“是”时，显示关联预缴完税凭证，且至少要有一行数据
      if(this.dataForm.relatedTaxPaymentVoucher==='1'){
        let voucherFlag = this.dataForm.voucherDetailList && this.dataForm.voucherDetailList.length;
        if(!voucherFlag){
          FUI.Window.showMsg('关联预缴完税凭证表格不能为空');
          return;
        }
        for (let key in this.dataForm.voucherDetailList) {
          if(!this.dataForm.voucherDetailList[key].code) {
            FUI.Window.showMsg('单据编号不能为空');
            return;
          }
        };
      }
      // 当发票情况invoiceSituation=有票，关联发票必填；当发票情况=后补票，流程审核通过后可补关联操作；当发票情况=无票，不可编辑
      if(this.dataForm.invoiceStatus){
        let flag = this.dataForm.invoiceDetailList && this.dataForm.invoiceDetailList.length;
        if(!flag){
          FUI.Window.showMsg('关联发票表格不能为空');
          return;
        }
        for (let key in this.dataForm.invoiceDetailList) {
          if(!this.dataForm.invoiceDetailList[key].invoiceNo) {
            FUI.Window.showMsg('发票号码不能为空');
            return;
          }
        };
      }
      /* 关联借款单: 当结算方式为中装支付时必须为空；
        结算方式为冲借款时必须填写，且冲借款金额之和必须等于报销明细页签的报销金额之和
        其他结算方式可填可不填，但冲借款金额之和必须小于等于报销明细页签的报销金额之和 
      */
      if(this.dataForm.balaType == '3'){
        let loanFlag = this.dataForm.loanDetailList && this.dataForm.loanDetailList.length;
        if(!loanFlag){
          FUI.Window.showMsg('关联借款单表格不能为空');
          return;
        }
        for (let key in this.dataForm.loanDetailList) {
          if(!this.dataForm.loanDetailList[key].code) {
            FUI.Window.showMsg('借款单号不能为空');
            return;
          }
        };
      }
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid) {
            _this.dataFromDate();
            return resolve(_this.dataForm);
          } else {
            return resolve(false)
          }
        })
      });
    },
    dataFromDate() { 
      let { createTime } = this.dataForm; 
      this.dataForm.createTime = createTime ? moment(createTime).format('YYYY-MM-DD HH:mm:ss') : '';
      this.dataForm.createUserId = !this.dataForm.id ? userId : this.dataForm.createUserId;
    }
  }
}
</script>

<style scoped lang="scss">
@import url('../../style/form.scss');

.commponent-height{
   height: 32px;
   line-height: 32px;
}

.el-upload__prompt{
    color: #F56C6C;
    font-size: 14px;
    font-weight: normal;
    line-height: 25px;
  }

::v-deep .designPrice {
  .el-input-group__append {
    padding: 0 12px;
  }
}
.other-give-reason{
  width: 350px;
  margin-left: 10px;
}
.required-tag {
  ::v-deep .form-title {
    &::after {
      content: '*';
      color: #F56C6C;
      margin-left: 4px;
      transform: translateY(4px);
      font-size: 18px;
    }
  } 
  ::v-deep .is-required{
    .el-form-item__label{
      &::before{
        display: none;
      }
    }
  } 
}
.form-text{
  position: relative;
}
.export-text{
  position: absolute;
  right: 30px;
  top: 0px;
}
/* 隐藏发票点击上传前面的icon */
.f2bpmui-datagrid-vuetable{  
  ::v-deep .cell .el-upload>span{
    display: none !important;
  }
  ::v-deep .cell .el-upload-list .my-el-upload-list__item-status-label{
    display: none !important;
  }
} 

.f2bpmui-datagrid-vuetable th {
  padding: 1px 0 !important;
  height: 34px;
  line-height: 34px;
  background: #F7F8FA;
  border: 0;
  font-weight: bold;
  border:0;
  color: #0D1126;
}
.f2bpmui-datagrid-vuetable td {
  border-right: 0;
  border-left: 0;
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #56576C;
}
.specialStyle{
  padding-bottom: 7px !important;
}
.fontColor{
  ::v-deeep .el-input__inner{
    color: #333 !important;
  }
}
</style>
