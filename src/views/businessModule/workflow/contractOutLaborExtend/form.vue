<template>
  <!--劳务分包合同-->
  <div v-loading="loading">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" :disabled="setting.readonly" label-width="140px" class="new-data-form-css">
      <row-layout :title="'项目信息'" :cols="3">
        <el-form-item slot="col_1" label="合同编号：">
          <el-input v-model="dataForm.code" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="constructArchiveMainCode" label="项目编号：">
          <selector-dialog :model-data="masterContractDialog" :value="dataForm.constructArchiveMainCode" dynamicModel="customDialog" @updateValue="updateMasterContractValue"></selector-dialog>
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
        <el-form-item slot="col_3" label="施工总金额：">
          <el-input v-model="dataForm.totalConstructionAmount" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="人工费目标成本：">
          <el-input v-model="dataForm.laborCostTargetCost" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" :title="'合同信息'">
        <el-form-item slot="col_1" prop="contractCategory" label="合同类别：">
          <el-radio-group v-model="dataForm.contractCategory" @change="changeContractCategory">
            <el-radio v-for="(item,index) in contractCategoryOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" label="主合同编号：" :prop="dataForm.contractCategory == 1?'':'masterContractCode'">
          <el-input v-model="dataForm.masterContractCode" v-if="dataForm.contractCategory == 1" disabled size="small" placeholder="自动填写" />
          <selector-dialog :model-data="mainContractDialog" v-else :value="dataForm.masterContractCode" dynamic-model="customDialog" @updateValue="updateMainContractValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="主合同名称：">
          <el-input v-model="dataForm.masterContractName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="name" label="合同名称：">
          <el-input v-model="dataForm.name" size="small" placeholder="请输入" maxlength="50" />
        </el-form-item>
        <el-form-item slot="col_2" prop="copies" label="合同份数：">
          <numberInput v-model="dataForm.copies" size="small" placeholder="请输入"></numberInput>
        </el-form-item>
        <el-form-item slot="col_3" :prop="dataForm.contractCategory == 1?'contractPartyAName':''" label="甲方：">
          <el-input v-model="dataForm.contractPartyAName" size="small" placeholder="自动带出" v-if="dataForm.contractCategory == 2" disabled />
          <selector-dialog :width="500" :model-data="orgDialog" v-else :value="dataForm.contractPartyAName" dynamic-model="selectOrg" @updateValue="updateOrgValue"></selector-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" :prop="!isMainContract?'customerSupplierArchiveMainName':''" label="劳务分包商：">
          <el-input v-model="dataForm.customerSupplierArchiveMainName" size="small" placeholder="自动带出" v-if="isMainContract" disabled />
          <selector-dialog v-else :model-data="customerSupplierArchiveDialog" :value="dataForm.customerSupplierArchiveMainName" dynamic-model="customDialog" @updateValue="updateCustomerValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="noAppointSupplier" label="非指定分包商：">
          <el-radio-group v-model="dataForm.noAppointSupplier" :disabled="dataForm.contractCategory != 1">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" prop="signDate" label="合同签订日期：">
          <el-date-picker v-model="dataForm.signDate" type="date" placeholder="请选择" size="small" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </row-layout>

      <row-layout :cols="3">
        <el-form-item slot="col_1" label="税率(%)：" :prop="setRules('taxRate')">
          <percentage-input v-if="dataForm.contractCategory == 2" v-model="dataForm.taxRate" :placeholder="'自动带出'" disabled></percentage-input>
          <select-dialog2 v-else :disabled="true" :modelData="rateModel" :width="900"
                          :height="360" @updateValue="constructionRateUpdate" :value="dataForm.taxRate || '请选择'"
                          dynamic-model="customDialog"></select-dialog2>
        </el-form-item>
        <el-form-item slot="col_2" label="合同金额(含税)(元)：">
          <amount-input v-model="dataForm.contractAmountTax" size="small" placeholder="自动计算" disabled/>
        </el-form-item>
        <el-form-item slot="col_3" prop="effectiveDate" label="合同生效日期：">
          <el-date-picker v-model="dataForm.effectiveDate" type="date" placeholder="请选择" size="small" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="isUsedGmAttendanceMachine" label="工盟考勤机：">
          <el-radio-group v-model="dataForm.isUsedGmAttendanceMachine" :disabled="dataForm.contractCategory != 1">
            <el-radio v-for="(item,index) in isUsedOptions" :key="index" :label="item.label">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" label="其中措施费(元)：">
          <amount-input v-model="dataForm.measureFee" disabled size="small" placeholder="自动计算" ></amount-input>
        </el-form-item>
        <el-form-item slot="col_3" prop="endDate" label="合同结束日期：">
          <el-date-picker v-model="dataForm.endDate" type="date" placeholder="请选择" size="small" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2">
        <el-form-item slot="col_1" label="考勤机编号：">
          <el-input v-model="dataForm.attendanceMachineCode" size="small" placeholder="请输入" :disabled="dataForm.isUsedGmAttendanceMachine == 0" />
        </el-form-item>
        <el-form-item slot="col_2" label="合同是否归档：" v-if="wfContext.WorkflowInstinceState == 3">
          <el-radio-group v-model="dataForm.archivist" :disabled="true">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
          <el-button type="primary" size="small" style="margin: 0 15px" v-if="dataForm.archivist == 0" :disabled="false" @click="handelOpenPage">进行归档</el-button>
          <el-button type="primary" size="small" v-else :disabled="false" @click="handelOpenLink">查看归档</el-button>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" />
        </el-form-item>
      </row-layout>
      <form-title :title="'合同明细信息'"></form-title>
      <div>
        <el-button type="primary" size="small" @click="addDetail">新增</el-button>
        <el-button type="primary" size="small" >导出</el-button>
        <el-button type="primary" size="small" >导入</el-button>
      </div>
      <el-table :data="dataForm.detailList" class="f2bpmui-datagrid-vuetable" border show-summary  :summary-method="getSummaries1">
        <el-table-column label="序号" type="index">
        </el-table-column>
        <el-table-column label="名称">
          <div slot="header"><span style="color: #ed4014">*</span> 名称</div>
          <template slot-scope="scope">
            <el-input v-model="scope.row.fileName" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="说明">
          <template slot-scope="scope">
            <el-input v-model="scope.row.memo" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="单位">
          <div slot="header"><span style="color: #ed4014">*</span> 单位</div>
          <template slot-scope="scope">
            <el-input v-model="scope.row.unit" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="数量">
          <div slot="header"><span style="color: #ed4014">*</span> 数量</div>
          <template slot-scope="scope">
            <amount-input v-model="scope.row.number" :decimalNum="4" @change="changeAmountCount($event,scope.$index)"></amount-input>
          </template>
        </el-table-column>
        <el-table-column label="单价（含税）">
          <div slot="header"><span style="color: #ed4014">*</span> 单价（含税）</div>
          <template slot-scope="scope">
            <amount-input v-model="scope.row.unitPriceTax" size="small" :decimalNum="4" placeholder="请输入" @change="changeAmountCount($event,scope.$index)"/>
          </template>
        </el-table-column>
        <el-table-column label="单价（无税）">
          <template slot-scope="scope">
            <amount-input :decimalNum="4" v-model="scope.row.unitPriceUntax" size="small" disabled placeholder="自动计算" />
          </template>
        </el-table-column>
        <el-table-column label="金额（含税）">
          <div slot="header"><span style="color: #ed4014">*</span> 金额（含税）</div>
          <template slot-scope="scope">
            <amount-input v-model="scope.row.amountTax" size="small" :disabled="scope.row.unitPriceTax?true:false" :placeholder="scope.row.unitPriceTax?'自动计算':'请输入'" />
          </template>
        </el-table-column>
        <el-table-column label="税额">
          <div slot="header"><span style="color: #ed4014">*</span> 税额</div>
          <template slot-scope="scope">
            <amount-input v-model="scope.row.taxAmount" size="small" disabled placeholder="自动计算" />
          </template>
        </el-table-column>
        <el-table-column label="金额（无税）">
          <div slot="header"><span style="color: #ed4014">*</span> 金额（无税）</div>
          <template slot-scope="scope">
            <amount-input v-model="scope.row.amountUntax" size="small" placeholder="自动计算，可修改" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
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
  </div>
</template>

<script>

  import comMixin from '../minix';
  import FormTitle from '@/components/basic/formTitle/index.vue';
  import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
  import SelectDialog2 from '@/components/workflow/selector/selectorDialog2.vue';
  import { getDataDictByConfigType } from '@/Api/dataDict.js'
  import { getRealTimeData } from '@/Api/workflowBusssion/construct.js'
  import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
  import amountInput from '@/components/basic/numberInput/amountInput.vue';
  import multipleDecimalsInput from '@/components/basic/numberInput/multipleDecimalsInput.vue'
  import cascSelect from '@/components/basic/cascSelect/index.vue'
  import updateFiles from '@/components/basic/uploaderFile/index.vue';
  import RuleRequired from '@/views/businessModule/enum/requiredMsg';
  import numberInput from '@/components/basic/numberInput/index.vue';
  import percentageInput from '@/components/basic/numberInput/percentageInput.vue';
  import {ISUSEDOPTIONS_GROUP,CUSTOMER2_MODEL} from '@/views/businessModule/enum/param';
  import moment from 'moment'
  const requiredArray = ['fileInfoList','constructArchiveMainCode','masterContractCode','taxRate','contractCategory', 'name', 'copies', 'contractPartyAName', 'customerSupplierArchiveMainName', 'contractPartyCName', 'isUsedGmAttendanceMachine'];
  export default {
    components: { FormTitle, selectorDialog, RowLayout, amountInput,numberInput,percentageInput, cascSelect, updateFiles,SelectDialog2,multipleDecimalsInput },
    mixins: [comMixin],
    data() {
      return {
        loading: false,
        formVisible: false,
        isReadOnly: false,
        isUsedOptions: ISUSEDOPTIONS_GROUP, //是否使用
        dataForm: {
          archivist: '0',
          attendanceMachineCode: '',
          baseTaxRateArchiveId: '',
          code: '',
          constructArchiveMainCode: '',
          constructArchiveMainId: '',
          constructArchiveMainName: '',
          constructionUnitName: '',
          contractAmountTax: '',
          contractAmountTaxFree: '',
          contractCategory: '',
          contractOutMainId: '',
          contractPartyAId: '',
          contractPartyAName: '',
          contractPartyBId: '',
          contractPartyBName: '',
          contractPartyCId: '',
          contractPartyCName: '',
          contractVersion: '',
          copies: '',
          createTime: '',
          createUserId: '',
          createUserName: '',
          customerSupplierArchiveMainId: '',
          customerSupplierArchiveMainName: '',
          deptId: '',
          deptName: '',
          detailList: [],
          effectiveDate: '',
          electronContractStatus: '',
          endDate: '',
          fileInfoList: [],
          id: '',
          isUsedGmAttendanceMachine: '',
          masterContractCode: '',
          masterContractId: '',
          masterContractName: '',
          measureFee: '',
          name: '',
          noAppointSupplier: '',
          prepaymentDeductionMethod: '',
          progress: '',
          projectManagerName: '',
          remark: '',
          settleTypeId: '',
          signDate: '',
          taxRate: '',
          totalConstructionAmount: '',
          laborCostTargetCost: '',
          wiid:'',
          constructionUnitId:'',
          projectManagerId:''
        },
        purchaseTypeOptions: [],
        contractCategoryOptions: [],
        contractVersionOptions: [],
        purchaseMaterialsTypeOptions: [],
        stampModeOptions: [],
        stampSortOptions: [],
        paymentMethodOptions: [],
        radioOptions: [],
        prepaymentDeductionMethodOptions: [],
        wfContext: null,
        rateModel: {  //税率
          code: 'base_tax_rate_archive',
          parm: {
            isEnableAuthor: 0,
            data: [],
            isMulti: false,
            varParams: [
              {
                key: 'tax_attribute',
                value: 6
              }
            ]
          }
        },
        customerSupplierArchiveDialog: {
          code: 'v_customer_supplier_archive_main_construct_main', customDialog: 'v_customer_supplier_archive_main_construct_main', isSetHead: 1, isMulti: false, initailData: []
        },
        masterContractDialog: { code: 'XiangMuDangAnLaoWuFenBaoHeTong', customDialog: 'XiangMuDangAnLaoWuFenBaoHeTong', isSetHead: 1, isMulti: false, initailData: [] },
        mainContractDialog: { code: 'ZhuHeTongLaoWuFenBaoHeTong', customDialog: 'ZhuHeTongLaoWuFenBaoHeTong', isSetHead: 1, isMulti: false, initailData: [], parm: {varParams:[{key:'constructArchiveMainId',value:''}]} },
        orgDialog: { resultFieldKey: 'groupId', code: 'selectOrg', customDialog: 'selectOrg', isSetHead: 1, isMulti: false, initailData: [], parm: { singleSelect: true }},
        taxRateDialog: { code: 'base_tax_rate_archive', customDialog: 'base_tax_rate_archive', isSetHead: 1, isMulti: false, initailData: [] },
        dataRule: RuleRequired.dataRule(requiredArray)
      };
    },
    watch:{
      'dataForm.contractAmountTax':{
        handler(n, o) {
          console.log(n,o,'new value');
          if(n){
            let val = Number(n)*0.05;
            this.dataForm.measureFee = Object.tofixed(val,2); // 其中措施费
          }else {
            this.dataForm.measureFee = 0;
          }
        }
      }
    },
    computed: {
      /**
       * 合同类别=增补合同，根据主合同带出，不可修改
       * 非指定分包商,是可以编辑，否不可编辑
       */
      isMainContract() {
        var val1 = this.dataForm.noAppointSupplier; // 非指定分包商
        var val2 = this.dataForm.contractCategory; //合同类别
        if(val1 == 1 && val2 == 1){
          return false
        }else{
          return true
        }

      }
    },
    mounted() {
      this.wfContext = window.WFContext; // 流程信息
    },
    methods: {
      setRules(code) {
        if (this.dataForm.contractCategory == 1) {
          return code
        }else{
          return ''
        }
      },
      /**
       * 税率
       * */
      constructionRateUpdate(data) {
        const {taxRate, id} = data[0];
        this.dataForm.taxRate = taxRate;
        this.dataForm.baseTaxRateArchiveId = id;
        var list = this.dataForm.detailList;
        if(list && list.length>0){
          for(let i=0;i<list.length;i++){
              this.changeAmountCount('',i)
          }
        }
      },
      /**
       * 获取采购合同实时数据
       */
      async getRealTimeData() {
        const res = await getRealTimeData({id: this.dataForm.id,projectId: this.dataForm.constructArchiveMainId})
        if(res.code == 200) {
          const {accumulatedMaterialsPurchased,cumulativeProportionMaterialsPurchased,currentContractAmount,totalConstructionCost} = res.data;
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
        if(data && data.length <= 0) return;
        const { constructarchivemainid,constructionUnitId,projectManagerId, constructarchivemaincode, constructarchivemainname, projectmanagername, customersupplierarchivemainname,customersupplierarchivemainid,constructionunitname} = data[0];
        this.dataForm.constructArchiveMainCode = constructarchivemaincode;
        this.dataForm.constructArchiveMainName = constructarchivemainname;
        this.dataForm.name = constructarchivemainname;
        this.dataForm.constructionUnitName = constructionunitname;
        this.dataForm.projectManagerName = projectmanagername;
        this.dataForm.constructArchiveMainId = constructarchivemainid;
        this.mainContractDialog.parm.varParams[0].value = constructarchivemainid;
        this.dataForm.customerSupplierArchiveMainId = customersupplierarchivemainid;
        this.dataForm.customerSupplierArchiveMainName = customersupplierarchivemainname;
        this.dataForm.constructionUnitId = constructionUnitId;
        this.dataForm.projectManagerId = projectManagerId;
      },
      /**
       * 主合同名称(控件)
       */
      updateMainContractValue(data) {
        if(data && data.length <= 0) return;
        const { mastercontractid, mastercontractcode, mastercontractname, taxrate, basetaxratearchiveid,contractpartyaname,attendancemachinecode,
          contractpartyaid,isusedgmattendancemachine,customersupplierarchivemainname,customersupplierarchivemainid,noappointsupplier} = data[0];
        this.dataForm.masterContractId = mastercontractid;
        this.dataForm.masterContractCode = mastercontractcode;
        this.dataForm.masterContractName = mastercontractname;
        this.dataForm.taxRate = taxrate;
        this.dataForm.baseTaxRateArchiveId = basetaxratearchiveid;
        this.dataForm.contractPartyAName = contractpartyaname;
        this.dataForm.contractPartyAId = contractpartyaid;
        this.dataForm.isUsedGmAttendanceMachine = isusedgmattendancemachine.toString();
        this.dataForm.noAppointSupplier = noappointsupplier.toString();
        this.dataForm.attendanceMachineCode = attendancemachinecode;
        this.dataForm.customerSupplierArchiveMainName = customersupplierarchivemainname;
        this.dataForm.customerSupplierArchiveMainId = customersupplierarchivemainid;
        this.$forceUpdate()
      },
      /**
       *  合同类别
       * */
      changeContractCategory(){
        var val = this.dataForm.contractCategory;
       this.dataForm.masterContractCode = '';
       this.dataForm.masterContractId = '';
       this.dataForm.masterContractName = '';
       this.dataForm.taxRate = '';
        this.dataForm.baseTaxRateArchiveId = '';
       if(val == 1){
         this.dataForm.noAppointSupplier = '0'
       }
        this.$forceUpdate();
      },
      /**
       * 甲方
       * */
      updateOrgValue(data){
        var that = this;
        if(data){
          const {text,value} = data[0];
          that.dataForm.contractPartyAName = text;
          that.dataForm.contractPartyAId = value;
        }
      },
      /**
       * 劳务分包商
       * */
      updateCustomerValue(data){
        if(data.length > 0){
          const {customerName,id} = data[0];
          this.dataForm.customerSupplierArchiveMainName = customerName;
          this.dataForm.customerSupplierArchiveMainId = id;
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
        var tableData = this.dataForm.detailList;
        if(val1){
          that.dataForm.noAppointSupplier = val1;
        }
        if(val2){
          that.dataForm.isUsedGmAttendanceMachine = val2;
        }
        if(tableData){
          that.dataForm.detailList = tableData
        }


      },
      /**
       * 获取表单数据
       */
      getDataForm() {
        const dataForm = JSON.parse(JSON.stringify(this.dataForm));
        if (this.dataForm.businessTime && this.dataForm.businessTime.length > 0) {
          dataForm.businessStartTime = moment(this.dataForm.businessTime[0]).format('YYYY-MM-DD')
          dataForm.businessEndTime = moment(this.dataForm.businessTime[1]).format('YYYY-MM-DD')
        }
        return dataForm;
      },
      /**
       * 表单校验
       */
      validateForm() {
        const _this = this;
        var state = WFContext.WorkflowInstinceState; // 流程状态
        if(state < 2){
          // 校验子表数据完整性
          if(_this.vaildTableList() === false){
            return false
          }
          // 校验子表数据唯一性
          if(_this.vaildOnlyTableData() === false){
            return false
          }
          // 校验甲方名称
          var name = _this.dataForm.contractPartyAName;
          if(name && (name === '深圳市中装智链供应链有限公司' || name === '惠州市中装新材料有限公司')){
            FUI.Window.showMsg(myvm, '深圳市中装智链供应链有限公司、惠州市中装新材料有限公司不能提交此流程！');
            return false;
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
        const res = await getDataDictByConfigType({ params: { configTypes: '合同类别,是或否,预付款扣除方式' }})
        if (res.success) {
          res.data.forEach(ele => {
            switch (ele.dataDictType) {
              case '合同类别':
                this.contractCategoryOptions = ele.dataDict;
                break;
              case '是或否':
                this.radioOptions = ele.dataDict;
                break;
              case '预付款扣除方式':
                this.prepaymentDeductionMethodOptions = ele.dataDict;
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
      addDetail(){
        if (!this.dataForm.detailList) this.dataForm.detailList = [];
        this.dataForm.detailList.push({
          amountTax: '',
          amountUntax: '',
          brand: '',
          contractOutMainId: '',
          fileName: '',
          id: '',
          isDel: '',
          memo: '',
          number: '',
          specification: '',
          taxAmount: '',
          unit: '',
          unitPriceTax: '',
          unitPriceUntax: ''
        });
        this.dataForm.contractAmountTax = this.sumTableData();

      },
      /**
       * 删除信息
       */
      delCustomer(index){
        this.dataForm.detailList.splice(index, 1);
        this.dataForm.contractAmountTax = this.sumTableData();
      },
      /**
       * 自动计算 子表--单价(无税)
       *          子表--金额(含税)
       *          金额（无税）
       *          税额
       * */
      changeAmountCount(e,index){
        console.log(e,index);
        var that = this;
        var num = that.dataForm.detailList[index]['number']; // 数量
        var price = that.dataForm.detailList[index]['unitPriceTax']; // 单价(含税)
        var rate = that.dataForm.taxRate; // 税率
          // 单价(无税)
          var amount = Number(price)/(1+Number(rate)); // 单价(含税)/(1+税率)
          amount = Object.numFixed(amount,4);
          that.$set(that.dataForm.detailList[index], 'unitPriceUntax', amount);
          // 金额(含税)
          var amount2 = Number(price) * Number(num); // 单价(含税)*数量
         amount2 = Object.numFixed(amount2,2);

        that.$set(that.dataForm.detailList[index], 'amountTax', amount2);
          // 金额（无税）
          var amountTax = that.dataForm.detailList[index]['amountTax'];  // 金额(含税)
          var amount3 = Number(amountTax)/(1+Number(rate)); //金额(含税)/(1+税率)
          amount3 = Object.numFixed(amount3,2);
          that.$set(that.dataForm.detailList[index], 'amountUntax', amount3);
          // 税额
        var amountUntax = that.dataForm.detailList[index]['amountUntax'];  // 金额(无税)
        var amount4 = Number(amountTax)-Number(amountUntax); // 金额(含税)- 金额(无税)
        amount4 = Object.numFixed(amount4,2);
        that.$set(that.dataForm.detailList[index], 'taxAmount', amount4);
        that.dataForm.contractAmountTax = that.sumTableData();
      },
      // 校验 同一表单内 根据 名称+说明+单位+单价(含税)  校验唯一性，不允许重复
      vaildOnlyTableData(){
        var that = this;
        var arr = that.dataForm.detailList;
        // 判断是否唯一性
        if (arr) {
          var a2 = [];
          for (var j = 0; j <arr.length; j++) {
            if (arr[j]) {
              var FileName = arr[j].fileName; // 名称
              var Unit = arr[j].unit; // 单位
              var Memo = arr[j].memo; // 说明
              var TaxUnitPrice = arr[j].unitPriceTax; // 单价（含税）
              var obj = FileName + '-' + Unit + '-'+'-'+Memo + TaxUnitPrice;
              a2.push(obj);

            }
          }
          var states = Object.isRepeat(a2); // 校验是否相同
          console.log(states, '23');
          if ( states === true) {
            FUI.Window.showMsg('合同明细信息中， 名称+说明+单位+单价(含税)存在不唯一，请检查重复数据');
            return false;
          }
        }
      },
      // 合计
      getSummaries1(param){
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item['amountTax'])); //  金额(含税)
          const values2 = data.map(item => Number(item['amountUntax'])); //  金额(无税)
          if (!values.every(value => isNaN(value))) {
            sums[7] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[7] = Object.numberFixed(sums[7],2);
          } else {
            sums[7] = '';
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
            sums[9] = Object.numberFixed(sums[9],2);
          } else {
            sums[9] = '';
          }
        });

        return sums;
      },
      // 校验子表信息完整
      vaildTableList(){
        var isOk = false;
        // 判断table内输入框必填
        var arr = this.dataForm.detailList;
        if (arr.length > 0) {
          for (var j = 0; j < arr.length; j++) {
            if (arr[j]) {
              var fileName = (arr[j].fileName).toString(); //名称
              var unit = (arr[j].unit).toString(); //单位
              var number = (arr[j].number).toString(); // 数量
              var unitPriceTax = (arr[j].unitPriceTax).toString(); // 	单价（含税）
              var amountTax = (arr[j].amountTax).toString(); // 	金额（含税）
              var taxAmount = (arr[j].taxAmount).toString(); // 	税额
              var amountUntax = (arr[j].amountUntax).toString(); // 金额(无税)

              if (fileName && unit && number && unitPriceTax && amountTax && taxAmount && amountUntax) {
                return !isOk;
              } else {
                var msg = '';
                var oIndex = j+1; // 行号
                if(!fileName) msg = '合同明细信息中，第'+oIndex+'行的名称不能为空';
                if(!unit) msg = '合同明细信息中，第'+oIndex+'行的名称不能为空';
                if(!number) msg = '合同明细信息中，第'+oIndex+'行的数量不能为空';
                if(!unitPriceTax) msg = '合同明细信息中，第'+oIndex+'行的单价（含税）不能为空';
                if(!amountTax) msg = '合同明细信息中，第'+oIndex+'行的金额（含税）不能为空';
                if(!taxAmount) msg = '合同明细信息中，第'+oIndex+'行的税额不能为空';
                if(!amountUntax) msg = '合同明细信息中，第'+oIndex+'行的金额(无税)不能为空';

                FUI.Window.showMsg2(msg);
                return isOk
              }
            }
          }

        }else{
          FUI.Window.showMsg2('合同明细至少要有一条数据');
          return isOk
        }
      },
      // 取合同明细信息的金额（含税）总和
      sumTableData(){
        var arr = this.dataForm.detailList; //明细表
        var sumAmount = 0;
        if(arr && arr.length > 0){
          for(let i in arr){
            sumAmount+= Number(arr[i].amountTax);
          }
        }
        return sumAmount
      },
      // 进行归档方法
      handelOpenPage(){
        let that = this;
        let url = '/workflowForm?appId=DU&encode=contractProjectDataMain&formAction=0&code=custGrid_BusinessSearch_XiangMuZiLiao&modelName=contract';
        that.$router.push({ path: url});
      },
      // 查看归纳
      handelOpenLink(){
        let that = this;
        let url = '/businessModule/tableDataGrid?code=custGrid_BusinessSearch_XiangMuZiLiao&keyWord=contract_contractProjectDataMain&refresh=true';
        that.$router.push({ path: url});
      }
    }
  };
</script>

<style scoped lang="scss">
  ::v-deep .designPrice {
    .el-input-group__append {
      padding: 0 12px;
    }
  }
</style>
