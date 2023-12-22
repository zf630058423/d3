<!--劳务付款-->
<template>
  <div v-loading="loading">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" :disabled="setting.readonly" label-width="140px"
             class="new-data-form-css">
      <row-layout :title="'项目信息'" :cols="3">
        <el-form-item slot="col_1" label="单据编号：">
          <el-input v-model="dataForm.code" disabled size="small" placeholder="自动填写"/>
        </el-form-item>
        <el-form-item slot="col_2" prop="constructArchiveMainCode" label="项目编号：">
          <selector-dialog :model-data="masterContractDialog" :value="dataForm.constructArchiveMainCode"
                           dynamicModel="customDialog" @updateValue="updateMasterContractValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="项目名称：">
          <el-input v-model="dataForm.constructArchiveMainName" disabled size="small" placeholder="自动填写"/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="管理部门：">
          <el-input v-model="dataForm.constructionUnitName" disabled size="small" placeholder="自动填写"/>
        </el-form-item>
        <el-form-item slot="col_2" label="项目负责人：">
          <el-input v-model="dataForm.projectManagerName" disabled size="small" placeholder="自动填写"/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" :title="'付款信息'">
        <el-form-item slot="col_1" label="支出合同编号：" prop="contractOutMainCode">
          <selector-dialog :model-data="mainContractDialog" :value="dataForm.contractOutMainCode"
                           dynamic-model="customDialog" @updateValue="updateMainContractValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="支出合同名称：">
          <el-input v-model="dataForm.contractOutMainName" disabled size="small" placeholder="自动填写"/>
        </el-form-item>
        <el-form-item slot="col_3" label="付款类型：" prop="paymentType">
          <el-radio-group v-model="dataForm.paymentType" @change="changePaymentType">
            <el-radio v-for="(item,index) in paymentTypeOptions" :key="index" :label="item.configValue">{{item.configName }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="班组工资确认单：" :prop="dataForm.paymentType == 1?'contractTeamPayrollCheckMainCode':''">
          <el-col :span="12" style="padding: 0">
            <selector-dialog v-if="dataForm.paymentType == 1" :model-data="contractTeamPayrollCheckMainNoDialog"
                             :value="dataForm.contractTeamPayrollCheckMainCode" dynamic-model="customDialog"
                             @updateValue="updateContractTeamPayrollCheckMainNo"></selector-dialog>
            <el-input v-else v-model="dataForm.contractTeamPayrollCheckMainCode" disabled size="small"
                      placeholder="自动填写"/>
          </el-col>
          <el-col :span="12">
            <el-link type="primary" icon="el-icon-link" style="line-height: 20px;"> 超链接</el-link>
            <el-link type="primary" icon="el-icon-link" style="line-height: 20px;margin-left: 15px" @click="handelLaborLedgerList"> 劳务台账</el-link>
          </el-col>
        </el-form-item>
        <el-form-item slot="col_2" label="本次申请金额(元)：" prop="applyAmount">
          <el-input v-model="dataForm.applyAmount" :disabled="dataForm.paymentType == 1?true:false" size="small"
                    :placeholder="dataForm.paymentType == 1?'自动带出':'请输入'"/>
        </el-form-item>
        <el-form-item slot="col_3" label="应付金额(元)：">
          <el-input v-model="dataForm.amountPayable" disabled size="small" placeholder="自动计算"/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="结算方式：" prop="balaType">
          <el-select v-model="dataForm.balaType" placeholder="请选择" size="small">
            <el-option v-for="(item,index) in balaTypeOptions" :key="index" :label="item.configName"
                       :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" label="付款财务组织：" prop="paymentOrgName">
          <selector-dialog :width="500" :model-data="paymentOrgDialog" :value="dataForm.paymentOrgName"
                           :btnDisabled="setting.readonly"
                           dynamic-model="selectOrg"
                           @updateValue="updateOrgValue($event,'paymentOrgName','paymentOrgId')"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="付款账号：" prop="paymentAccountNumber">
          <selector-dialog :model-data="baseBankDialog" :value="dataForm.paymentAccountNumber"
                           dynamic-model="customDialog"
                           :btnDisabled="setting.readonly"
                           @updateValue="updatePaymentAccountNumber"></selector-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="invoiceSituation" label="发票情况：">
          <el-select v-model="dataForm.invoiceSituation" placeholder="请选择" size="small">
            <el-option v-for="(item,index) in invoiceSituationOptions" :key="index" :label="item.configName"
                       :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" label="票据号：" :prop="setRules('checkNo')"
                      v-if="['10','13','9','21','14'].indexOf(dataForm.balaType) != -1?false:true">
          <el-input v-model="dataForm.checkNo" size="small" placeholder="自动带出"
                    :disabled="setRules('checkNo')?false:true"/>
        </el-form-item>
        <el-form-item slot="col_3" label="劳务分包商：">
          <el-input v-model="dataForm.supplierName" size="small" placeholder="自动带出" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="收款账号：" :prop="dataForm.balaType == 1?'payeeBankAcc':''">
          <selector-dialog :model-data="payeeBankAccDialog" :value="dataForm.payeeBankAcc"
                           dynamic-model="customDialog" @updateValue="updatePayeeBankAccValue"
                           :btnDisabled="setting.readonly"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="收款银行：">
          <el-input v-model="dataForm.payeeBank" size="small" placeholder="自动带出" disabled/>
        </el-form-item>
        <el-form-item slot="col_3" label="收款银行联行号：">
          <el-input v-model="dataForm.interBankNo" size="small" placeholder="自动带出" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="isPaymentByPartyA" label="是否甲方代付：">
          <el-radio-group v-model="dataForm.isPaymentByPartyA">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">
              {{ item.configName }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" label="退款金额(元)：">
          <amount-input v-model="dataForm.refundAmount" size="small" placeholder="系统反写" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入"
                    maxlength="250"/>
        </el-form-item>
      </row-layout>
      <form-title :title="'关联发票'"></form-title>
      <div>
        <el-button type="primary" size="small" @click="addDetail">新增</el-button>
        <el-button type="primary" size="small" @click="handelImportData">导入</el-button>
        <el-button type="primary" size="small" @click="handelExportData">导出</el-button>
      </div>
      <el-table :data="dataForm.invoiceCollectionPaymentDetail" fit class="f2bpmui-datagrid-vuetable" border
                show-summary :summary-method="getSummaries1" width="100%">
        <el-table-column label="序号" type="index" width="65px">
        </el-table-column>
        <el-table-column label="发票号码">
          <template slot-scope="scope">
            <selector-dialog :model-data="invoiceDialog" :value="scope.row.invoiceNo" :title="'付款关联发票选择'"
                             dynamic-model="selectPayoutInvoice" @updateValue="updateInvoiceNo($event,scope.$index)"
                             :btnDisabled="setting.readonly"></selector-dialog>
          </template>
        </el-table-column>
        <el-table-column label="发票代码">
          <template slot-scope="scope">
            <el-input v-model="scope.row.invoiceCode" size="small" placeholder="自动带出" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="开票日期">
          <template slot-scope="scope">
            <el-date-picker v-model="scope.row.billingDate" type="date" placeholder="自动带出" disabled value-format="yyyy-MM-dd"
                            size="small">
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="发票类型">
          <template slot-scope="scope">
            <el-select v-model="scope.row.invoiceType" placeholder="自动带出" size="small" disabled>
              <el-option v-for="(item,index) in invoiceTypeOptions" :key="index" :label="item.configName"
                         :value="item.configValue">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="销售方名称">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.sellerName" size="small" placeholder="自动带出" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="发票金额(含税)">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.invoiceAmountTax" size="small" disabled placeholder="自动带出"/>
          </template>
        </el-table-column>
        <el-table-column label="税额(元)">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.tax" size="small" disabled placeholder="自动带出"/>
          </template>
        </el-table-column>
        <el-table-column label="发票金额(无税)">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.invoiceAmountUntax" size="small" disabled placeholder="自动带出"/>
          </template>
        </el-table-column>
        <el-table-column label="占用发票(元)">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.invoiceOccupancyAmount" size="small" disabled placeholder="自动带出"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160px" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-link" @click="handelLink(scope.row)">超链接</el-button>
            <el-button type="text" @click="delCustomer(scope.$index)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

      <form-title :title="'附件'"></form-title>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="fileInfoList" label="附件文件：">
          <update-files v-model="dataForm.fileInfoList"></update-files>
        </el-form-item>
      </row-layout>
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
    <!-- 导入弹框 -->
    <importTemplateDialog :visible.sync="commonImportData.visible" :table-name="commonImportData.tableName" :keyword="keyWord" :model-name="modelName" @importSuccess="importSuccess"/>

  </div>
</template>

<script>
  import comMixin from '../minix';
  import FormTitle from '@/components/basic/formTitle/index.vue';
  import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
  import SelectDialog2 from '@/components/workflow/selector/selectorDialog2.vue';
  import {getDataDictByConfigType} from '@/Api/dataDict.js'
  import {getPayoutLaborAmount} from '@/Api/contract/index.js'
  import {getRealTimeData} from '@/Api/workflowBusssion/construct.js'
  import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
  import amountInput from '@/components/basic/numberInput/amountInput.vue';
  import multipleDecimalsInput from '@/components/basic/numberInput/multipleDecimalsInput.vue'
  import cascSelect from '@/components/basic/cascSelect/index.vue'
  import updateFiles from '@/components/basic/uploaderFile/index.vue';
  import RuleRequired from '@/views/businessModule/enum/requiredMsg';
  import numberInput from '@/components/basic/numberInput/index.vue';
  import percentageInput from '@/components/basic/numberInput/percentageInput.vue';
  import {ISUSEDOPTIONS_GROUP, CUSTOMER2_MODEL, PAYEEBANK_MODEL} from '@/views/businessModule/enum/param';
  import importTemplateDialog from '@/components/basic/importTemplateDialog';
  import {exportDataDetails,importData,downloadTemplateFile} from '@/Api/workflowBusssion/index.js'
  import moment from 'moment'

  const requiredArray = ['fileInfoList', 'checkNo', 'payeeBankAcc', 'paymentOrgName', 'constructArchiveMainCode', 'isPaymentByPartyA', 'contractOutMainCode', 'applyAmount', 'paymentType', 'balaType', 'paymentAccountNumber', 'invoiceSituation', 'contractTeamPayrollCheckMainCode'];
  export default {
    components: {
      FormTitle,
      selectorDialog,
      RowLayout,
      amountInput,
      numberInput,
      percentageInput,
      cascSelect,
      updateFiles,
      SelectDialog2,
      multipleDecimalsInput,
      importTemplateDialog
    },
    mixins: [comMixin],
    data() {
      return {
        loading: false,
        formVisible: false,
        isReadOnly: false,
        isUsedOptions: ISUSEDOPTIONS_GROUP, //是否使用
        commonImportData: {
          title: '数据导入',
          visible: false,
          cancelText: '取消',
          type: '',
          tableName: ''
        },
        dataForm: {
          amountPayable: '',
          applyAmount: '',
          balaType: '',
          baseLaborTeamMainId: '',
          checkNo: '',
          code: '',
          invoiceCollectionPaymentDetail: [],
          constructArchiveMainCode: '',
          constructArchiveMainId: '',
          constructArchiveMainName: '',
          constructionUnitName: '',
          contractOutMainCode: '',
          contractOutMainId: '',
          contractOutMainName: '',
          contractTeamPayrollCheckMainId: '',
          contractTeamPayrollCheckMainCode: '',
          createTime: '',
          createUserId: '',
          createUserName: '',
          cumulativeAuditAmountTax: '',
          deptId: '',
          deptName: '',
          dsCode: '',
          fileInfoList: [],
          financePayoutMainId: '',
          finishedTime: '',
          id: '',
          interBankNo: '',
          invoiceSituation: '',
          isDel: '',
          isPaymentByPartyA: '',
          jsonData: '',
          lastModifyDeptId: '',
          lastModifyDeptName: '',
          lastModifyTime: '',
          lastModifyUserId: '',
          lastModifyUserName: '',
          limitAccept: '',
          naturePayment: '',
          payeeBank: '',
          payeeBankAcc: '',
          paymentAccountNumber: '',
          paymentOrgId: '',
          paymentOrgName: '',
          paymentStatus: '',
          paymentType: '',
          prepay: '',
          procInstState: '',
          projectManagerName: '',
          refundAmount: '',
          remark: '',
          settlementAmount: '',
          supplierId: '',
          supplierName: '',
          totalContractAmount: '',
          wiid: '',
          constructionUnitId:'',
          projectManagerId:''
        },
        paymentMethodOptions: [],
        radioOptions: [],
        paymentStatusOptions: [], // 付款状态
        paymentTypeOptions: [], // 付款类型
        balaTypeOptions: [], // 结算方式
        invoiceTypeOptions: [], // 发票类型
        invoiceSituationOptions: [], // 发票情况
        wfContext: null,

        baseBankDialog: {
          code: 'YinXingDangAn',
          customDialog: 'YinXingDangAn',
          isSetHead: 1,
          isMulti: false,
          initailData: []
        },
        customerSupplierArchiveDialog: CUSTOMER2_MODEL,
        paymentOrgDialog: {resultFieldKey: 'groupId', isSetHead: 1, isMulti: false, initailData: []},
        masterContractDialog: {
          code: 'XiangMuDangAnLaoWuFenBaoHeTong',
          customDialog: 'XiangMuDangAnLaoWuFenBaoHeTong',
          isSetHead: 1,
          isMulti: false,
          initailData: []
        },
        mainContractDialog: {
          code: 'ZhuHeTongLaoWuFenBaoHeTong',
          customDialog: 'ZhuHeTongLaoWuFenBaoHeTong',
          isSetHead: 1,
          isMulti: false,
          initailData: [],
          parm: {varParams: [{key: 'constructArchiveMainId', value: ''}]}
        },
        contractTeamPayrollCheckMainNoDialog: {
          code: 'BanZuGongZiQueRenDan',
          customDialog: 'BanZuGongZiQueRenDan',
          isSetHead: 1,
          isMulti: false,
          initailData: []
        },
        payeeBankAccDialog: {
          code: 'ShouKuanZhangHaoYeWuDanYuan',
          customDialog: 'ShouKuanZhangHaoYeWuDanYuan',
          isSetHead: 1,
          isMulti: false,
          initailData: []
        },
        invoiceDialog: {
          code: '',
          customDialog: '',
          isSetHead: 1,
          isMulti: false,
          initailData: [],
          parm: {varParams: [{key: 'constructArchiveMainId', value: ''},{key: 'contractOutMainId', value: ''}],singleSelect:true,moduleType:'1'} //moduleType： 1-劳务付款；2-专业分包付款；3-材料付款；4-租赁付款；5-其他付款；6-项目费用报销；7-员工费用报销；8-集采付款；
        },
        dataRule: RuleRequired.dataRule(requiredArray)
      };
    },
    watch: {
      'dataForm.contractAmountTax': {
        handler(n, o) {
          console.log(n, o, 'new value');
          if (n) {
            let val = Number(n) * 0.05;
            this.dataForm.measureFee = Object.numberFixed(val, 2); // 其中措施费
          } else {
            this.dataForm.measureFee = 0;
          }
        }
      }
    },
    computed: {},
    mounted() {
      this.wfContext = window.WFContext; // 流程信息
    },
    methods: {
      setRules(code) {
        var arr = ['10', '13', '9', '21', '14'];
        var balaType = this.dataForm.balaType; // 结算方式
        var currentActivityName = this.wfContext.CurrentActivityName; // 节点名称
        if (arr.indexOf(balaType) !== -1 && currentActivityName.includes('出纳') === true) {
          return code
        } else {
          return ''
        }
      },

      /**
       * 获取采购合同实时数据
       */
      async getRealTimeData() {
        const res = await getRealTimeData({id: this.dataForm.id, projectId: this.dataForm.constructArchiveMainId})
        if (res.code == 200) {
          const {accumulatedMaterialsPurchased, cumulativeProportionMaterialsPurchased, currentContractAmount, totalConstructionCost} = res.data;
          this.dataForm.accumulatedMaterialsPurchased = accumulatedMaterialsPurchased;
          this.dataForm.cumulativeProportionMaterialsPurchased = cumulativeProportionMaterialsPurchased;
          this.dataForm.currentContractAmount = currentContractAmount;
          this.dataForm.totalConstructionCost = totalConstructionCost;
        }
      },
      /**
       * 项目编号
       */
      updateMasterContractValue(data) {
        if (data && data.length <= 0) return;
        const {constructarchivemainid, constructarchivemaincode, constructarchivemainname, projectmanagername, constructionunitname,constructionUnitId,projectManagerId} = data[0];
        this.dataForm.constructArchiveMainCode = constructarchivemaincode;
        this.dataForm.constructArchiveMainName = constructarchivemainname;
        this.dataForm.constructionUnitName = constructionunitname;
        this.dataForm.projectManagerName = projectmanagername;
        this.dataForm.constructArchiveMainId = constructarchivemainid;
        this.dataForm.constructionUnitId = constructionUnitId;
        this.dataForm.projectManagerId = projectManagerId;
        this.mainContractDialog.parm.varParams[0].value = constructarchivemainid;
        this.invoiceDialog.parm.varParams[0].value = constructarchivemainid;
      },
      /**
       * 主合同名称(控件)
       */
      updateMainContractValue(data) {
        if (data && data.length <= 0) return;
        const {mastercontractid, mastercontractcode, mastercontractname, customersupplierarchivemainname, customersupplierarchivemainid} = data[0];
        this.dataForm.contractOutMainId = mastercontractid;
        this.dataForm.contractOutMainCode = mastercontractcode;
        this.dataForm.contractOutMainName = mastercontractname;
        this.dataForm.supplierName = customersupplierarchivemainname;
        this.dataForm.supplierId = customersupplierarchivemainid;
        this.invoiceDialog.parm.varParams[1].value = mastercontractid;
        this.getPayoutLaborAmountFn();
        this.$forceUpdate()
      },
      /**
       * 付款财务组织
       */
      updateOrgValue(data, filedName, filedValue) {
        if (data && data.length <= 0) return;
        const {value, text} = data[0]
        this.dataForm[filedName] = text;
        this.dataForm[filedValue] = value;
      },
      /**
       * 付款账号
       * */
      updatePaymentAccountNumber(data) {
        if (data && data.length <= 0) return;
        this.dataForm.paymentAccountNumber = data[0].bank_account_no;
      },
      /**
       * 收款账号
       */
      updatePayeeBankAccValue(data) {
        if (data && data.length <= 0) return;
        const {accountName,accountNo,bankName,bankbranchid,bankarchivemainid} = data[0];
        this.dataForm.payeeBankAcc = accountNo;
        this.dataForm.payeeBank = bankName;
        this.dataForm.payeeBankAccId = bankarchivemainid;
      },
      /**
       * 班组确认单
       * */
      updateContractTeamPayrollCheckMainNo(data) {

        if(data && data.length >0){
          const {code,id,confirmedAmount} = data[0];
          this.dataForm.contractTeamPayrollCheckMainCode = code;
          this.dataForm.contractTeamPayrollCheckMainId = id;
          this.dataForm.applyAmount = confirmedAmount;
          this.dataForm.amountPayable = confirmedAmount;
        }
      },
      /**
       * 付款类型
       * */
      changePaymentType(){
        this.dataForm.contractTeamPayrollCheckMainCode = '';
        this.dataForm.contractTeamPayrollCheckMainId = '';
        this.dataForm.applyAmount = '';
        this.dataForm.amountPayable = '';
        this.getPayoutLaborAmountFn();
      },
      /**
       * 发票号码
       * */
      updateInvoiceNo(data,index){
        if(data && data.length >0){
          const {invoiceNo,invoiceCode,invoiceType,id,invoiceCreateTime,sellerName,invoiceAmountTax,tax,invoiceAmountUntax} = data[0];
          this.$set(this.dataForm.invoiceCollectionPaymentDetail[index],'invoiceCode',invoiceCode);
          this.$set(this.dataForm.invoiceCollectionPaymentDetail[index],'invoiceNo',invoiceNo);
          this.$set(this.dataForm.invoiceCollectionPaymentDetail[index],'invoiceType',invoiceType);
          this.$set(this.dataForm.invoiceCollectionPaymentDetail[index],'invoiceCollectionMainId',id);
          this.$set(this.dataForm.invoiceCollectionPaymentDetail[index],'billingDate',invoiceCreateTime);
          this.$set(this.dataForm.invoiceCollectionPaymentDetail[index],'sellerName',sellerName);
          this.$set(this.dataForm.invoiceCollectionPaymentDetail[index],'invoiceAmountTax',invoiceAmountTax);
          this.$set(this.dataForm.invoiceCollectionPaymentDetail[index],'tax',tax);
          this.$set(this.dataForm.invoiceCollectionPaymentDetail[index],'invoiceAmountUntax',invoiceAmountUntax);

        }
      },
      beforeInit() {
        this.getDataDictByConfigType()
        // if(this.dataForm.constructArchiveMainId) this.getRealTimeData()
      },
      afterInit() {
        var that = this;
        var val1 = (that.dataForm.noAppointSupplier).toString();
        var val2 = (that.dataForm.isUsedGmAttendanceMachine).toString();
        if (val1) {
          that.dataForm.noAppointSupplier = val1;
        }
        if (val2) {
          that.dataForm.isUsedGmAttendanceMachine = val2;
        }


      },
      /**
       * 获取表单数据
       */
      getDataForm() {
        const dataForm = JSON.parse(JSON.stringify(this.dataForm));
        return dataForm;
      },
      /**
       * 表单校验
       */
      validateForm() {
        const _this = this;
        var state = WFContext.WorkflowInstinceState; // 流程状态
        if (state < 2) {
          // 根据发票情况判断关联发票信息
          if (_this.vaildInvoiceBySituation() === false) {
            return false
          }
          // 校验子表数据完整性
          if (_this.vaildTableList() === false) {
            return false
          }
          // 校验金额
          if(_this.vaildAmount() === false){
            return false
          }

        }
        return new Promise(resolve => {
          _this.$refs['dataForm'].validate(valid => {
            if (valid) {
              return resolve(_this.getDataForm());
            } else {
              return resolve(false)
            }
          })
        });
      },
      /**
       * 初始化字典
       */
      async getDataDictByConfigType() {
        const res = await getDataDictByConfigType({params: {configTypes: '是或否,付款类型(劳务付款),结算方式,发票类型,发票情况'}});
        if (res.success) {
          res.data.forEach(ele => {
            switch (ele.dataDictType) {
              case '是或否':
                this.radioOptions = ele.dataDict;
                break;
              case '付款类型(劳务付款)':
                this.paymentTypeOptions = ele.dataDict;
                break;
              case '结算方式':
                this.balaTypeOptions = ele.dataDict;
                break;
              case '发票类型':
                this.invoiceTypeOptions = ele.dataDict;
                break;
              case '发票情况':
                this.invoiceSituationOptions = ele.dataDict;
                break;
              default:
                break;
            }
          });
        }
      },
      /**
       * 添加合同明细信息
       */
      addDetail() {
        if (!this.dataForm.invoiceCollectionPaymentDetail) this.dataForm.invoiceCollectionPaymentDetail = [];
        this.dataForm.invoiceCollectionPaymentDetail.push({
          "billingDate": "",
          "id": "",
          "invoiceAmountTax": '',
          "invoiceAmountUntax": '',
          "invoiceCode": "",
          "invoiceCollectionMainId": "",
          "invoiceNo": "",
          "invoiceOccupancyAmount": '',
          "invoiceType": "",
          "sellerName": "",
          "tax": ''
        });
      },
      /**
       * 删除信息
       */
      delCustomer(index) {
        this.dataForm.invoiceCollectionPaymentDetail.splice(index, 1);
        this.dataForm.contractAmountTax = this.sumTableData();
      },
      // 校验 根据发票情况判断关联发票信息
      vaildInvoiceBySituation() {
        var that = this;
        var arr = that.dataForm.invoiceCollectionPaymentDetail;
        var type = this.dataForm.invoiceSituation; // 发票情况
        // 判断是否唯一性
        if (type == 1 && arr.length === 0) {
          FUI.Window.showMsg2('当发票情况为 有票 时，关联发票信息至少要有一条');
          return false;
        } else if (type == 2 && arr.length > 0) {
          FUI.Window.showMsg2('当发票情况为 无票 时，关联发票信息需要为空');
          return false;
        }
      },
      // 合计
      getSummaries1(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item['amountTax'])); //  金额(含税)
          const values2 = data.map(item => Number(item['invoiceOccupancyAmount'])); // 占用金额
          if (!values.every(value => isNaN(value))) {
            sums[6] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[6] = Object.numberFixed(sums[6], 2);
          } else {
            sums[6] = '';
          }
          if (!values2.every(value => isNaN(value))) {
            sums[9] = values2.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[9] = Object.numberFixed(sums[9], 2);
          } else {
            sums[9] = '';
          }
        });

        return sums;
      },
      // 校验子表信息完整
      vaildTableList() {
        var isOk = false;
        // 判断table内输入框必填
        var arr = this.dataForm.invoiceCollectionPaymentDetail;
        var type = this.dataForm.invoiceSituation; // 发票情况
        if (type == 1 && arr.length > 0) {
          for (var j = 0; j < arr.length; j++) {
            if (arr[j]) {
              var invoiceNo = (arr[j].invoiceNo).toString(); //发票号码
              if (invoiceNo) {
                return !isOk;
              } else {
                var msg = '';
                var oIndex = j + 1; // 行号
                if (!fileName) msg = '关联发票信息中，第' + oIndex + '行的发票号码不能为空';
                FUI.Window.showMsg2(msg);
                return isOk
              }
            }
          }

        }
      },
      vaildAmount() {
        var isOk = false;
        var val_1 = this.dataForm.applyAmount; // 本次申请金额
        var val_2 = this.dataForm.amountPayable; // 应付金额
        if (Number(val_1) > Number(val_2)) {
          FUI.Window.showMsg('本次申请金额不能大于应付金额，请确认！');
          return isOk
        }
      },
      // 发票超链接
      handelLink(){

      },
      // 获取应付金额
      async getPayoutLaborAmountFn(){
        var that = this;
        var parms = {
          "contractOutMainId": that.dataForm.contractOutMainId,
          "financePayoutMainId": that.dataForm.id,
          "paymentType": that.dataForm.paymentType
        };
        const res = await getPayoutLaborAmount(parms);
        if(res.code === 200){
          var amount = res.data.amountPayable;
          that.dataForm.amountPayable = amount?amount:'';
        }
      },
      // 子表数据导入
      handelImportData(){
        this.commonImportData.visible = true;
        this.commonImportData.tableName = 'financePayoutRelateInvoiceDetail';
        this.keyWord = 'financePayoutRelateInvoiceDetail';
        this.modelName = 'finance'
      },
      // 子表数据导出
      async handelExportData(){
        let isOk = false;
        let url = '/finance/financePayoutRelateInvoiceDetail/exportDataInvoiceRelevancePayment';
        let id = this.dataForm.id;
        if(id){
          let param = {
            mainId: id
          };
          await exportDataDetails(url, param)
        }else {
          FUI.Window.showMsg('请暂存或提交表单后，再进行导出操作！');
          return isOk
        }

      },
      // 导入返回
      importSuccess(tableName,rows){
        if(rows && rows.length >0){
          if(tableName === 'financePayoutRelateInvoiceDetail'){
            console.log(rows,'123');
            const list = this.dataForm.invoiceCollectionPaymentDetail;
            if (rows && rows.length > 0) {
              $.each(rows, function (index, row) {
                row.id = '';
              });
            }
            this.dataForm.invoiceCollectionPaymentDetail = [...rows];
          }
        }
        this.commonImportData.visible = false;
        this.keyWord = '';
        this.modelName = ''
      },
      // 劳务台账跳转链接
      handelLaborLedgerList(){
        this.$router.push({ path: '/laborLedger/laborLedgerList'});
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep .designPrice {
    .el-input-group__append {
      padding: 0 12px;
    }
  }
</style>
